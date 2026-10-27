// Wires the Mining/Farming/Combat Effects pack into the game; loaded after survival-integration.js.
(() => {
	const survival = typeof FernfallSurvival === "undefined" ? null : FernfallSurvival;
	const PACK_ROOT = new URL("Video_Game_PNGs/Fernfall_Mining_Farming_Combat_Effects_Game_Ready/Fernfall_Missing_Textures_Effects_Game_Ready/", document.baseURI).href;
	const CROP_REGROW_MS = 30000;
	const PLOT_GROW_MS = 25000;
	const PLOT_KEY = "fernfall-plots-v1";
	const plantable = ["carrot", "potato", "grain", "herb"];
	const sleepFrames = { down: 1, up: 2, left: 3, right: 4 };
	const oreKinds = ["iron", "coal", "gold", "crystal", "rock"];
	const cropKinds = { carrot: "carrot", potato: "potato", grain: "grain", herb: "herbs" };
	// Source sheets left text labels in the frames; crop them out.
	const ORE_CROP = { sy: 0, sh: 0.68 };
	const ROCK_CROP = { sy: 0, sh: 0.85 };
	const CROP_CROP = { sy: 0.42, sh: 0.58 };
	const effects = [];
	const enemyShots = [];
	const shotCooldown = new WeakMap();
	let fx = null;
	let slowUntil = 0;
	let sleep = null;
	let poison = null;
	let lastSplash = 0;

	loadFernfallEffects(PACK_ROOT).then((art) => { fx = art; });

	function frame(group, prefix, index) {
		return fx?.[group]?.[`${prefix}_${String(index).padStart(2, "0")}`];
	}

	function drawSprite(img, x, y, size, { crop, bottom = false } = {}) {
		if (!img?.complete || !img.naturalWidth) return false;
		const sy = (crop?.sy ?? 0) * img.naturalHeight;
		const sh = (crop?.sh ?? 1) * img.naturalHeight;
		const scale = size / Math.max(img.naturalWidth, sh);
		const w = img.naturalWidth * scale;
		const h = sh * scale;
		ctx.save();
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(img, 0, sy, img.naturalWidth, sh, Math.round(x - w / 2), Math.round(bottom ? y - h : y - h / 2), Math.round(w), Math.round(h));
		ctx.restore();
		return true;
	}

	function spawn(group, prefix, count, x, y, size = 48, duration = 500) {
		effects.push({ group, prefix, count, x, y, size, duration, start: performance.now() });
	}

	function drawEffects() {
		const now = performance.now();
		for (let index = effects.length - 1; index >= 0; index -= 1) {
			const effect = effects[index];
			const progress = (now - effect.start) / effect.duration;
			if (progress >= 1) {
				effects.splice(index, 1);
				continue;
			}
			drawSprite(frame(effect.group, effect.prefix, Math.floor(progress * effect.count) + 1), effect.x, effect.y, effect.size);
		}
	}

	function loopFrame(group, prefix, count, period) {
		return frame(group, prefix, Math.floor(performance.now() / period) % count + 1);
	}

	function damagePlayer(amount, message) {
		player.health = Math.max(0, player.health - amount);
		player.hurt = 14;
		showToast(message);
		if (player.health === 0) {
			player.health = MAX_HEALTH;
			player.x = 478;
			player.y = 322;
			showToast("A friendly nap. Back to the trail!");
		}
		updateHud();
	}

	function oreKind(resource) {
		return oreKinds[Math.abs(Math.floor(resource.x * 7 + resource.y * 13)) % oreKinds.length];
	}

	function resourceSprite(resource) {
		if (!fx) return null;
		if (resource.type === "stone") {
			const kind = oreKind(resource);
			const near = Math.hypot(player.x - resource.x, player.y - resource.y) < 70;
			if (kind === "rock") {
				const key = !resource.available ? "depleted" : near ? "cracked_1" : "normal";
				return { img: fx.rocks[key], options: { crop: ROCK_CROP, bottom: true }, size: 42 };
			}
			const key = !resource.available ? "depleted" : near ? "cracked" : "full";
			return { img: fx.ores[`${kind}_${key}`], options: { crop: ORE_CROP, bottom: true }, size: 44 };
		}
		const crop = cropKinds[resource.type];
		if (!crop) return null;
		let stage = 4;
		if (!resource.available) {
			const started = (resource.respawnAt || 0) - CROP_REGROW_MS;
			const progress = Math.min(0.999, Math.max(0, (Date.now() - started) / CROP_REGROW_MS));
			stage = Math.floor(progress * 3) + 1;
		}
		return { img: fx.crops[`${crop}_stage_${stage}`], options: { crop: CROP_CROP, bottom: true }, size: 40 };
	}

	// Farmland: hoe makes dirt then tilled, an acorn plants, a water bucket starts growth.
	let plots = [];
	try { plots = JSON.parse(localStorage.getItem(PLOT_KEY) || "[]"); } catch { plots = []; }

	function savePlots() {
		try { localStorage.setItem(PLOT_KEY, JSON.stringify(plots)); } catch { /* storage unavailable */ }
	}

	function selectedId() {
		return window.FernfallInventory?.getSelected?.()?.id || "";
	}

	function facingPoint() {
		const step = { up: [0, -40], down: [0, 40], left: [-40, 0], right: [40, 0] }[player.direction] || [0, 40];
		return { x: player.x + step[0], y: player.y + step[1] };
	}

	function farmAction() {
		if (!fx) return false;
		const id = selectedId();
		const target = facingPoint();
		const plot = plots.find((entry) => Math.hypot(entry.x - target.x, entry.y - target.y) < 34);
		if (/_hoe$/.test(id)) {
			if (plot) {
				if (plot.state !== "dirt") return false;
				plot.state = "tilled";
				window.FernfallGameInventory?.animate("till");
				showToast("The soil is tilled. Select an acorn and press E to plant.");
			} else {
				const blocked = resources.some((item) => item.available && Math.hypot(player.x - item.x, player.y - item.y) < 48) ||
					pickups.some((pickup) => Math.hypot(player.x - pickup.x, player.y - pickup.y) < 55) ||
					(survival?.ponds || []).some((pond) => Math.hypot(pond.x - target.x, pond.y - target.y) < 50);
				if (blocked) return false;
				plots.push({ x: Math.round(target.x), y: Math.round(target.y), state: "dirt", crop: Math.floor(Math.random() * plantable.length) });
				window.FernfallGameInventory?.animate("dig");
				showToast("You broke the ground. Use the hoe again to till it.");
			}
			spawn("mining", "rock_dust", 6, target.x, target.y, 48, 500);
			savePlots();
			return true;
		}
		if (!plot) return false;
		if (id === "seed" && plot.state === "tilled") {
			if (!player.inventory.seed) return false;
			player.inventory.seed -= 1;
			plot.state = "planted";
			updateHud();
			showToast("Planted. Water it with a bucket of water.");
			savePlots();
			return true;
		}
		if (/bucket_water|water_bucket/.test(id) && plot.state === "planted") {
			if (!player.inventory.bucket_water) return false;
			player.inventory.bucket_water -= 1;
			player.inventory.bucket_empty = (player.inventory.bucket_empty || 0) + 1;
			plot.state = "watered";
			plot.wateredAt = Date.now();
			updateHud();
			spawn("ui_effects", "water_splash", 3, plot.x, plot.y - 6, 52, 500);
			showToast("Watered. The crop will grow soon.");
			savePlots();
			return true;
		}
		return false;
	}

	function growPlots() {
		for (let index = plots.length - 1; index >= 0; index -= 1) {
			const plot = plots[index];
			if (plot.state !== "watered" || Date.now() - plot.wateredAt < PLOT_GROW_MS) continue;
			plots.splice(index, 1);
			resources.push({ x: plot.x, y: plot.y, type: plantable[plot.crop % plantable.length], available: true });
			showToast("A crop has grown. Press E to harvest it.");
			savePlots();
		}
	}

	function drawPlots() {
		if (!fx) return;
		ctx.save();
		ctx.translate(-camera.x, -camera.y);
		for (const plot of plots) {
			drawSprite(fx.farmland[plot.state], plot.x, plot.y, 52);
			if (plot.state !== "watered") continue;
			const stage = Math.min(3, Math.floor((Date.now() - plot.wateredAt) / PLOT_GROW_MS * 3) + 1);
			drawSprite(fx.crops[`${cropKinds[plantable[plot.crop % plantable.length]]}_stage_${stage}`], plot.x, plot.y + 10, 34, { crop: CROP_CROP, bottom: true });
		}
		ctx.restore();
	}

	// Enemy ranged attacks: skeleton bones, spider webs (slow + poison), witch poison.
	function fireShot(mob, kind, speed) {
		const dx = player.x - mob.x;
		const dy = player.y - mob.y;
		const distance = Math.hypot(dx, dy) || 1;
		enemyShots.push({ kind, x: mob.x, y: mob.y - 10, vx: dx / distance * speed, vy: dy / distance * speed, expiresAt: performance.now() + 2200 });
	}

	function updateEnemyShots(now) {
		for (const mob of mobs) {
			if (!mob.alive || (mob.type !== "skeleton" && mob.type !== "spider")) continue;
			const bone = mob.type === "skeleton";
			const distance = Math.hypot(player.x - mob.x, player.y - mob.y);
			if (distance < (bone ? 90 : 80) || distance > (bone ? 280 : 240) || now - (shotCooldown.get(mob) || 0) < (bone ? 2800 : 3600)) continue;
			shotCooldown.set(mob, now);
			fireShot(mob, bone ? "bone" : "web", bone ? 3.4 : 3);
		}
		for (let index = enemyShots.length - 1; index >= 0; index -= 1) {
			const shot = enemyShots[index];
			shot.x += shot.vx;
			shot.y += shot.vy;
			if (Math.hypot(shot.x - player.x, shot.y - player.y) < 20) {
				enemyShots.splice(index, 1);
				if (shot.kind === "bone") {
					spawn("skeleton", "bone_impact", 4, shot.x, shot.y, 44, 420);
					damagePlayer(1, "A skeleton's bone struck you!");
				} else {
					spawn("spider", "web_trap", 3, player.x, player.y, 52, 2400);
					slowUntil = now + 2400;
					poison = { source: "spider", ticks: 1, next: now + 1200 };
					showToast("Caught in a spider's web!");
				}
			} else if (shot.expiresAt <= now) enemyShots.splice(index, 1);
		}
	}

	const seenSpells = new Set();
	function trackWitchSpells(now) {
		if (!survival) return;
		const active = new Set(survival.hostileProjectiles);
		for (const spell of seenSpells) {
			if (active.has(spell)) continue;
			seenSpells.delete(spell);
			spawn("witch", "impact", 6, spell.x, spell.y, 56, 520);
			if (Math.hypot(spell.x - player.x, spell.y - player.y) < 30) poison = { source: "witch", ticks: 2, next: now + 1500 };
		}
		for (const spell of active) seenSpells.add(spell);
	}

	function updatePoison(now) {
		if (!poison || now < poison.next) return;
		if (player.health > 1) damagePlayer(1, "Poison stings!");
		poison.ticks -= 1;
		poison.next = now + 1500;
		if (poison.ticks <= 0) poison = null;
	}

	// Sleeping: a knocked-out respawn naps, and R rests to heal when no enemy is near.
	function startSleep(duration, heal = 0) {
		sleep = { until: performance.now() + duration, x: player.x, y: player.y, heal };
	}

	document.addEventListener("keydown", (event) => {
		if (event.key.toLowerCase() !== "r" || event.repeat || event.ctrlKey || event.metaKey || sleep) return;
		if (event.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)) return;
		if (mobs.some((mob) => mob.alive && Math.hypot(mob.x - player.x, mob.y - player.y) < 220)) return showToast("Too dangerous to rest with enemies nearby.");
		startSleep(2400, 2);
		showToast("Resting...");
	});

	if (survival) {
		const baseDrawResource = survival.drawResource;
		survival.drawResource = function (resource) {
			const sprite = resourceSprite(resource);
			if (sprite?.img?.complete && sprite.img.naturalWidth) {
				ctx.fillStyle = "#49674655";
				ctx.beginPath();
				ctx.ellipse(resource.x, resource.y + 9, 14, 5, 0, 0, Math.PI * 2);
				ctx.fill();
				drawSprite(sprite.img, resource.x, resource.y + 12, sprite.size, sprite.options);
				return true;
			}
			return baseDrawResource(resource);
		};

		survival.drawProjectiles = function () {
			const orbFrame = Math.floor(performance.now() / 90) % 6 + 1;
			for (const projectile of survival.hostileProjectiles) {
				if (drawSprite(frame("witch", "magic_orb", orbFrame), projectile.x, projectile.y, 34)) continue;
				ctx.fillStyle = "#8d62c9";
				ctx.beginPath();
				ctx.arc(projectile.x, projectile.y, 7, 0, Math.PI * 2);
				ctx.fill();
			}
		};
	}

	const baseUpdate = update;
	update = function () {
		const before = { x: player.x, y: player.y };
		baseUpdate();
		const now = performance.now();
		if (sleep) {
			player.x = sleep.x;
			player.y = sleep.y;
			if (now >= sleep.until) {
				if (sleep.heal) {
					player.health = Math.min(MAX_HEALTH, player.health + sleep.heal);
					updateHud();
				}
				sleep = null;
			}
		} else if (now < slowUntil) {
			player.x = before.x + (player.x - before.x) * 0.4;
			player.y = before.y + (player.y - before.y) * 0.4;
		}
		updateEnemyShots(now);
		trackWitchSpells(now);
		updatePoison(now);
		growPlots();
		for (const pond of survival?.ponds || []) {
			const inside = ((player.x - pond.x) / 45) ** 2 + ((player.y - pond.y) / 28) ** 2 < 1;
			if (inside && moving() && now - lastSplash > 280) {
				lastSplash = now;
				spawn("ui_effects", "water_splash", 3, player.x, player.y + 8, 40, 420);
			}
		}
	};

	const baseToast = showToast;
	showToast = function (message, ...rest) {
		baseToast(message, ...rest);
		if (typeof message !== "string") return;
		if (/^Missing ingredients|^Place a .* first/.test(message)) spawn("ui_effects", "craft_fail", 3, player.x, player.y - 36, 52, 600);
		else if (/friendly nap/.test(message)) startSleep(2400);
		else if (/filled the bucket with water/.test(message)) spawn("ui_effects", "water_splash", 3, player.x, player.y + 4, 52, 500);
	};

	const baseDrawPlayer = drawPlayer;
	drawPlayer = function () {
		if (sleep && drawSprite(frame("sleep", "resting", sleepFrames[player.direction] || 1), player.x, player.y, 64)) return;
		baseDrawPlayer();
	};

	const baseDrawGround = drawGround;
	drawGround = function () {
		baseDrawGround();
		drawPlots();
	};

	const baseAttack = attack;
	attack = function () {
		const mobBefore = mobs.map((mob) => ({ mob, hp: mob.hp, alive: mob.alive, hit: mob.hit || 0 }));
		const animalBefore = animals.map((animal) => ({ animal, hp: animal.hp, hit: animal.hit || 0 }));
		baseAttack();
		for (const entry of mobBefore) {
			const { mob } = entry;
			if (!entry.alive) continue;
			if (!mob.alive) {
				const set = mob.type === "witch" ? "witch" : mob.type === "slime" || !mob.type ? "slime" : "skeleton";
				spawn("combat", "critical_hit", 4, mob.x, mob.y - 8, 52, 360);
				spawn("defeat", set, 6, mob.x, mob.y, 60, 700);
			} else if (mob.hp < entry.hp || (mob.hit || 0) > entry.hit) {
				spawn("combat", "sword_hit", 4, mob.x, mob.y - 8, 48, 320);
			}
		}
		for (const entry of animalBefore) {
			const { animal } = entry;
			if ((animal.hit || 0) > entry.hit || animal.hp < entry.hp) spawn("combat", "sword_hit", 4, animal.x, animal.y - 8, 44, 320);
		}
	};

	const baseGather = gather;
	gather = function () {
		if (farmAction()) return;
		const resourceBefore = resources.map((resource) => ({ resource, available: resource.available }));
		const treeBefore = obstacles.map((tree) => ({ tree, hits: tree.woodHits || 0 }));
		const pickupBefore = pickups.map((pickup) => ({ x: pickup.x, y: pickup.y }));
		const pickupCount = pickups.length;
		baseGather();
		for (const entry of resourceBefore) {
			const { resource } = entry;
			if (!entry.available || resource.available) continue;
			if (resource.type === "stone") {
				spawn("mining", "rock_dust", 6, resource.x, resource.y, 52, 560);
				spawn("mining", "ore_chips", 6, resource.x, resource.y - 6, 52, 560);
			} else spawn("ui_effects", "pickup", 3, resource.x, resource.y - 10, 44, 420);
		}
		for (const entry of treeBefore) {
			if ((entry.tree.woodHits || 0) <= entry.hits) continue;
			spawn("chopping", "wood_chips", 5, entry.tree.x, entry.tree.y - 10, 56, 520);
			spawn("chopping", "leaf_particles", 5, entry.tree.x, entry.tree.y - 40, 64, 620);
		}
		if (pickups.length < pickupCount) {
			const gone = pickupBefore.find((spot) => !pickups.some((pickup) => pickup.x === spot.x && pickup.y === spot.y));
			if (gone) spawn("ui_effects", "pickup", 3, gone.x, gone.y, 44, 420);
		}
	};

	window.addEventListener("fernfall:item-crafted", () => spawn("ui_effects", "craft_success", 3, player.x, player.y - 36, 52, 600));

	const baseRender = render;
	let knownFires = survival ? survival.campfires.length : 0;
	render = function () {
		baseRender();
		if (!fx) return;
		if (survival) {
			if (survival.campfires.length > knownFires) {
				const fire = survival.campfires[survival.campfires.length - 1];
				spawn("spawn", "activation", 2, fire.x, fire.y, 80, 900);
			}
			knownFires = survival.campfires.length;
		}
		ctx.save();
		ctx.translate(-camera.x, -camera.y);
		for (const fire of survival?.campfires || []) {
			if (!fire.cooking) continue;
			if (fire.kind === "furnace") {
				drawSprite(loopFrame("cooking", "steam", 3, 260), fire.x, fire.y - 56, 40);
				continue;
			}
			const progress = Math.min(0.999, (Date.now() - fire.cooking.startedAt) / fire.cooking.duration);
			drawSprite(frame("cooking", "meat_cooking", Math.floor(progress * 4) + 1), fire.x, fire.y - 46, 30);
			drawSprite(loopFrame("cooking", "smoke", 3, 260), fire.x, fire.y - 70, 40);
		}
		for (const shot of enemyShots) {
			const img = shot.kind === "bone" ? loopFrame("skeleton", "bone_flight", 4, 80) : loopFrame("spider", "web_projectile", 3, 100);
			drawSprite(img, shot.x, shot.y, 30);
		}
		if (poison && player.health > 0) {
			drawSprite(loopFrame(poison.source, "poison", poison.source === "witch" ? 6 : 4, 120), player.x, player.y - 10, 48);
		}
		drawEffects();
		ctx.restore();
	};
})();

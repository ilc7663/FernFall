// Wires the Mining/Farming/Combat Effects pack into the game; loaded after survival-integration.js.
(() => {
	const survival = typeof FernfallSurvival === "undefined" ? null : FernfallSurvival;
	const PACK_ROOT = new URL("Video_Game_PNGs/Fernfall_Mining_Farming_Combat_Effects_Game_Ready/Fernfall_Missing_Textures_Effects_Game_Ready/", document.baseURI).href;
	const CROP_REGROW_MS = 30000;
	const oreKinds = ["iron", "coal", "gold", "crystal", "rock"];
	const cropKinds = { carrot: "carrot", potato: "potato", grain: "grain", herb: "herbs" };
	// Source sheets left text labels in the frames; crop them out.
	const ORE_CROP = { sy: 0, sh: 0.68 };
	const ROCK_CROP = { sy: 0, sh: 0.85 };
	const CROP_CROP = { sy: 0.42, sh: 0.58 };
	const effects = [];
	const cleanedPickupSprites = new WeakMap();
	let fx = null;

	loadFernfallEffects(PACK_ROOT).then((art) => { fx = art; }).catch(() => {});

	function frame(group, prefix, index) {
		return fx?.[group]?.[`${prefix}_${String(index).padStart(2, "0")}`];
	}

	function pickupSpriteWithoutWhite(img) {
		if (!img?.complete || !img.naturalWidth) return null;
		if (cleanedPickupSprites.has(img)) return cleanedPickupSprites.get(img);
		const canvas = document.createElement("canvas");
		canvas.width = img.naturalWidth;
		canvas.height = img.naturalHeight;
		const context = canvas.getContext("2d", { willReadFrequently: true });
		context.drawImage(img, 0, 0);
		const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		const pixels = imageData.data;
		for (let offset = 0; offset < pixels.length; offset += 4) {
			if (!pixels[offset + 3]) continue;
			const min = Math.min(pixels[offset], pixels[offset + 1], pixels[offset + 2]);
			const max = Math.max(pixels[offset], pixels[offset + 1], pixels[offset + 2]);
			if (min >= 210 && max - min <= 55) pixels[offset + 3] = 0;
		}
		context.putImageData(imageData, 0, 0);
		cleanedPickupSprites.set(img, canvas);
		return canvas;
	}

	function drawSprite(img, x, y, size, { crop, bottom = false } = {}) {
		const imageWidth = img?.naturalWidth || img?.width;
		const imageHeight = img?.naturalHeight || img?.height;
		if (!imageWidth || !imageHeight) return false;
		const sy = (crop?.sy ?? 0) * imageHeight;
		const sh = (crop?.sh ?? 1) * imageHeight;
		const scale = size / Math.max(imageWidth, sh);
		const w = imageWidth * scale;
		const h = sh * scale;
		ctx.save();
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(img, 0, sy, imageWidth, sh, Math.round(x - w / 2), Math.round(bottom ? y - h : y - h / 2), Math.round(w), Math.round(h));
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
			const image = frame(effect.group, effect.prefix, Math.floor(progress * effect.count) + 1);
			const sprite = effect.group === "ui_effects" && effect.prefix === "pickup"
				? pickupSpriteWithoutWhite(image)
				: image;
			drawSprite(sprite, effect.x, effect.y, effect.size);
		}
	}

	function oreKind(resource) {
		return survival?.oreKindOf?.(resource) ?? oreKinds[Math.abs(Math.floor(resource.x * 7 + resource.y * 13)) % oreKinds.length];
	}

	window.fernfallGatherFx = (kind, target, done) => {
		if (!fx) return;
		if (kind === "stone") {
			spawn("mining", "rock_dust", 6, target.x, target.y, 52, 560);
			if (!done) spawn("mining", "ore_chips", 6, target.x, target.y - 6, 52, 560);
		} else if (kind === "wood") {
			spawn("chopping", "wood_chips", 5, target.x, target.y - 10, 56, 520);
			if (done) spawn("chopping", "leaf_particles", 5, target.x, target.y - 40, 64, 620);
		} else if (done) {
			spawn("ui_effects", "pickup", 3, target.x, target.y - 10, 44, 420);
		}
	};

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

		const seenProjectiles = new Set();
		survival.drawProjectiles = function () {
			const active = new Set(survival.hostileProjectiles || []);
			for (const projectile of seenProjectiles) {
				if (active.has(projectile)) continue;
				seenProjectiles.delete(projectile);
				spawn("witch", "impact", 6, projectile.x, projectile.y, 56, 520);
			}
			const orbFrame = Math.floor(performance.now() / 90) % 6 + 1;
			for (const projectile of active) {
				seenProjectiles.add(projectile);
				if (drawSprite(frame("witch", "magic_orb", orbFrame), projectile.x, projectile.y, 34)) continue;
				ctx.fillStyle = "#8d62c9";
				ctx.beginPath();
				ctx.arc(projectile.x, projectile.y, 7, 0, Math.PI * 2);
				ctx.fill();
			}
		};
	}

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
				spawn("defeat", set, 6, mob.x, mob.y, 60, 700);
			}
		}
	};

	const baseGather = gather;
	gather = function () {
		const resourceBefore = resources.map((resource) => ({ resource, available: resource.available }));
		const treeBefore = obstacles.map((tree) => ({ tree, hits: tree.woodHits || 0 }));
		const pickupBefore = pickups.map((pickup) => ({ x: pickup.x, y: pickup.y }));
		const pickupCount = pickups.length;
		const handled = baseGather();
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
		return handled;
	};

	window.addEventListener("fernfall:item-crafted", () => spawn("ui_effects", "craft_success", 3, player.x, player.y - 36, 52, 600));

	const baseRender = render;
	const fires = () => survival?.campfires || [];
	let knownFires = fires().length;
	render = function () {
		baseRender();
		if (!fx) return;
		if (fires().length > knownFires) {
			const fire = fires()[fires().length - 1];
			spawn("spawn", "activation", 2, fire.x, fire.y, 80, 900);
		}
		knownFires = fires().length;
		ctx.save();
		ctx.translate(-camera.x, -camera.y);
		for (const fire of fires()) {
			if (!fire.cooking) continue;
			const group = fire.kind === "furnace" ? "steam" : "smoke";
			drawSprite(frame("cooking", group, Math.floor(performance.now() / 260) % 3 + 1), fire.x, fire.y - 56, 40);
		}
		drawEffects();
		ctx.restore();
	};
})();

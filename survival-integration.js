const survivalModule = typeof FernfallSurvival === "undefined" ? null : FernfallSurvival;
const hostileAssetRoot = new URL("Video_Game_PNGs/Fernfall_Passive_Mobs_Game_Ready/recropped assets/Fernfall_Assets_ReCropped_Game_Ready/assets/Fernfall_Hostile_Mobs_Game_Ready/", document.baseURI).href;
loadFernfallHostileAssets(hostileAssetRoot);
const settlementAssetRoot = new URL("Video_Game_PNGs/Fernfall_Passive_Mobs_Game_Ready/recropped assets/Fernfall_Assets_ReCropped_Game_Ready/assets/Fernfall_Settlement_and_Crafting_Game_Ready/", document.baseURI).href;
const settlementAssetsReady = loadFernfallSettlementAssets(settlementAssetRoot).catch(() => null);
const survivalAssetRoot = new URL("Video_Game_PNGs/Fernfall_Passive_Mobs_Game_Ready/recropped assets/Fernfall_Assets_ReCropped_Game_Ready/assets/Fernfall_Survival_Expansion_Game_Ready/", document.baseURI).href;
const survivalAssetsReady = loadFernfallSurvivalAssets(survivalAssetRoot).catch(() => null);
const hostileMotion = new WeakMap();
const hostileTypes = ["skeleton", "witch", "spider", "bat", "zombie"];

const cleanedZombieFrames = new WeakMap();

// Some zombie frames hold two figures side by side plus stray specks; keep one whole zombie, centred.
function singleZombieFrame(image) {
	if (cleanedZombieFrames.has(image)) return cleanedZombieFrames.get(image);
	const width = image.naturalWidth;
	const height = image.naturalHeight;
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const context = canvas.getContext("2d", { willReadFrequently: true });
	context.drawImage(image, 0, 0);
	const data = context.getImageData(0, 0, width, height);
	const pixels = data.data;
	const label = new Int32Array(width * height);
	const components = [];
	for (let start = 0; start < width * height; start += 1) {
		if (label[start] || pixels[start * 4 + 3] < 20) continue;
		const id = components.length + 1;
		const members = [start];
		label[start] = id;
		let minX = width, maxX = 0;
		for (let head = 0; head < members.length; head += 1) {
			const index = members[head];
			const x = index % width;
			const y = Math.floor(index / width);
			if (x < minX) minX = x;
			if (x > maxX) maxX = x;
			for (let offsetY = -2; offsetY <= 2; offsetY += 1) {
				for (let offsetX = -2; offsetX <= 2; offsetX += 1) {
					const nextX = x + offsetX;
					const nextY = y + offsetY;
					if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) continue;
					const next = nextY * width + nextX;
					if (label[next] || pixels[next * 4 + 3] < 20) continue;
					label[next] = id;
					members.push(next);
				}
			}
		}
		components.push({ id, size: members.length, minX, maxX });
	}
	components.sort((a, b) => b.size - a.size);
	const main = components[0];
	if (!main) {
		cleanedZombieFrames.set(image, image);
		return image;
	}
	const hasTwin = components[1] && components[1].size > main.size * 0.3;
	for (let index = 0; index < width * height; index += 1) {
		if (label[index] !== main.id) pixels[index * 4 + 3] = 0;
	}
	const shift = hasTwin ? Math.round(width / 2 - (main.minX + main.maxX) / 2) : 0;
	const cleaned = document.createElement("canvas");
	cleaned.width = width;
	cleaned.height = height;
	context.putImageData(data, 0, 0);
	cleaned.getContext("2d").drawImage(canvas, shift, 0);
	cleanedZombieFrames.set(image, cleaned);
	return cleaned;
}

function zombieFrame(direction, frame) {
	const image = window.FernfallSprites?.get("zombie", null, direction, frame);
	return image?.complete && image.naturalWidth ? singleZombieFrame(image) : null;
}

function directionToward(from, to) {
	const dx = to.x - from.x;
	const dy = to.y - from.y;
	return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : dy < 0 ? "up" : "down";
}

// Frames are 352px with feet at ~92% of the height, so the feet land near the shadow.
function drawZombieFrame(sprite, x, y, alpha = 1) {
	ctx.fillStyle = "#30483b55";
	ctx.beginPath();
	ctx.ellipse(x, y + 13, 17, 6, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.save();
	ctx.globalAlpha = alpha;
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = "high";
	ctx.drawImage(sprite, Math.round(x - 32), Math.round(y - 46), 64, 64);
	ctx.restore();
}

const zombiesSeenAlive = new WeakSet();
const ZOMBIE_DEATH_MS = 900;

function drawZombieDeaths() {
	const now = performance.now();
	for (const mob of mobs) {
		if (mob.type !== "zombie") continue;
		if (mob.alive) {
			zombiesSeenAlive.add(mob);
			mob.lastFacing = directionToward(mob, player);
			continue;
		}
		if (!zombiesSeenAlive.has(mob)) continue;
		mob.diedAt ??= now;
		const age = now - mob.diedAt;
		const onScreen = mob.x > camera.x - 96 && mob.x < camera.x + WIDTH + 96 && mob.y > camera.y - 96 && mob.y < camera.y + HEIGHT + 96;
		if (age > ZOMBIE_DEATH_MS || !onScreen) continue;
		const sprite = zombieFrame(mob.lastFacing || "down", "death");
		if (sprite) drawZombieFrame(sprite, mob.x, mob.y, Math.min(1, (ZOMBIE_DEATH_MS - age) / 300));
	}
}

function drawHostileSprite(mob, x, y) {
	const frames = fernfallHostileArt[mob.type];
	if (!frames && mob.type !== "zombie") return false;
	const previous = hostileMotion.get(mob);
	const moving = previous && Math.hypot(mob.x - previous.x, mob.y - previous.y) > 0.25;
	hostileMotion.set(mob, { x: mob.x, y: mob.y });
	const dx = player.x - mob.x;
	const dy = player.y - mob.y;
	const direction = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : dy < 0 ? "up" : "down";
	const walkFrame = Math.floor(performance.now() / 170 + mob.phase) % 2 + 1;
	if (mob.type === "zombie") {
		const striking = mob.hit > 0 || Math.hypot(dx, dy) < 40;
		const frame = striking ? `attack_${Math.floor(performance.now() / 200 + mob.phase) % 2 + 1}` : moving ? `walk_${walkFrame}` : "idle";
		const zombieSprite = zombieFrame(direction, frame) || zombieFrame(direction, "idle");
		if (zombieSprite) {
			ctx.save();
			if (mob.hit > 0) ctx.filter = "brightness(1.7)";
			drawZombieFrame(zombieSprite, x, y);
			ctx.restore();
			if (mob.hp < mob.maxHp) drawMobHealth(mob, x, y);
			return true;
		}
	}
	if (!frames) return false;
	const action = mob.type === "witch" && performance.now() - (mob.lastSpell || 0) < 650
		? "cast"
		: mob.hit > 0 ? "attack"
			: moving ? (mob.type === "bat" ? `fly${walkFrame}` : `walk${walkFrame}`)
				: mob.type === "bat" ? `fly${walkFrame}` : "idle";
	const sprite = frames[`${direction}_${action}`] || frames[`${direction}_idle`];
	if (!sprite?.complete || !sprite.naturalWidth) return false;
	ctx.save();
	if (mob.hit > 0) ctx.filter = "brightness(1.7)";
	const size = mob.type === "bat" ? 46 : mob.type === "spider" ? 52 : 56;
	const drawn = drawArt(ctx, sprite, x, y, size, size);
	ctx.restore();
	if (mob.hp < mob.maxHp) drawMobHealth(mob, x, y);
	return drawn;
}

const originalGather = gather;
gather = function () {
	if (survivalModule?.interact()) return true;
	const untamedWolves = animals.filter((animal) => animal.type === "wolf" && !animal.tamed);
	const inventoryBefore = { ...player.inventory };
	const gathered = originalGather();
	for (const [type, amount] of Object.entries(player.inventory)) {
		const gained = amount - (inventoryBefore[type] || 0);
		if (gained <= 0) continue;
		survivalModule?.recordQuest("gathered", gained);
		survivalModule?.recordVillagerQuestProgress(type, gained);
	}
	if (survivalModule && untamedWolves.some((animal) => animal.tamed)) survivalModule.recordQuest("wolf");
	if (gathered) return true;
	if (window.FernfallGameInventory?.eatSelectedFood()) return true;
	showToast("Nothing to gather nearby. Walk up to a plant, rock, tree or item and press E.");
	return false;
};

const originalAttack = attack;
attack = function () {
	if (performance.now() - lastAttack < 360) return;
	if (survivalModule?.attackAnimal()) {
		lastAttack = performance.now();
		player.swing = 1;
		updateHud();
		saveGame();
		return;
	}
	const hostileMobs = mobs.filter((mob) => mob.alive && hostileTypes.includes(mob.type));
	originalAttack();
	for (const enemy of hostileMobs) {
		if (enemy.alive) continue;
		const gelDrop = pickups.findIndex((pickup) => pickup.type === "gel" && Math.hypot(pickup.x - enemy.x, pickup.y - enemy.y) < 2);
		if (gelDrop >= 0) pickups.splice(gelDrop, 1);
		showToast(`${enemy.type[0].toUpperCase()}${enemy.type.slice(1)} defeated. +1 coin.`);
	}
};

const originalUpdate = update;
update = function () {
	originalUpdate();
	survivalModule?.update();
};

const originalCollides = collides;
collides = function (x, y, animalType) {
	return originalCollides(x, y) || Boolean(survivalModule?.blocks(x, y, animalType));
};

const originalCheckQuest = checkQuest;
checkQuest = function () {
	const hostiles = mobs.filter((mob) => hostileTypes.includes(mob.type));
	for (const hostile of hostiles) mobs.splice(mobs.indexOf(hostile), 1);
	originalCheckQuest();
	mobs.push(...hostiles);
	saveGame();
};

const originalUpdateHud = updateHud;
updateHud = function () {
	const hostiles = mobs.filter((mob) => hostileTypes.includes(mob.type));
	for (const hostile of hostiles) mobs.splice(mobs.indexOf(hostile), 1);
	originalUpdateHud();
	mobs.push(...hostiles);
	survivalModule?.refreshInventory();
};

const originalDrawGround = drawGround;
drawGround = function () {
	originalDrawGround();
	survivalModule?.drawCraftingTablesBehindTrees();
	survivalModule?.drawPonds();
};

const originalDrawResource = drawResource;
drawResource = function (resource) {
	if (!survivalModule?.drawResource(resource)) originalDrawResource(resource);
};

const originalDrawTree = drawTree;
drawTree = function (tree) {
	if (tree.chopped && drawArt(ctx, art.forest.tree_stump, tree.x, tree.y + 11, 60, 66)) return;
	originalDrawTree(tree);
};

const originalDrawAnimal = drawAnimal;
drawAnimal = function (animal) {
	if (animal.hit <= 0) return originalDrawAnimal(animal);
	ctx.save();
	ctx.filter = "brightness(1.8)";
	originalDrawAnimal(animal);
	ctx.restore();
};

const originalRender = render;
render = function () {
	originalRender();
	ctx.save();
	ctx.translate(-camera.x, -camera.y);
	try {
		survivalModule?.drawStations();
		survivalModule?.drawProjectiles();
		drawZombieDeaths();
		drawPlayerHead();
	} catch (error) {
		console.error(error);
	} finally {
		ctx.restore();
	}
	survivalModule?.drawNightOverlay();
};

const originalDrawMob = drawMob;
drawMob = function (mob) {
	if (!hostileTypes.includes(mob.type)) return originalDrawMob(mob);
	const x = mob.x;
	const y = mob.y + Math.sin(performance.now() / 170 + mob.phase) * 1.5;
	if (drawHostileSprite(mob, x, y)) return;
	ctx.fillStyle = "#30483b55";
	ctx.beginPath();
	ctx.ellipse(x, y + 13, 17, 6, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.save();
	ctx.fillStyle = mob.hit > 0 ? "#ffffff" : mob.type === "witch" ? "#593c78" : mob.type === "zombie" ? "#5d8862" : mob.type === "spider" ? "#292f34" : "#d8d1b8";
	if (mob.type === "skeleton") {
		ctx.fillRect(x - 9, y - 10, 18, 22);
		ctx.fillRect(x - 8, y + 10, 5, 12);
		ctx.fillRect(x + 3, y + 10, 5, 12);
		ctx.fillRect(x - 15, y - 8, 5, 16);
		ctx.fillRect(x + 10, y - 8, 5, 16);
		ctx.beginPath();
		ctx.arc(x, y - 17, 10, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = "#613f38";
		ctx.fillRect(x - 6, y - 20, 3, 4);
		ctx.fillRect(x + 3, y - 20, 3, 4);
		ctx.strokeStyle = "#b59b6a";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(x + 15, y - 7);
		ctx.lineTo(x + 25, y + 9);
		ctx.stroke();
	} else if (mob.type === "witch") {
		ctx.beginPath();
		ctx.moveTo(x - 14, y + 16);
		ctx.lineTo(x - 10, y - 12);
		ctx.lineTo(x, y - 20);
		ctx.lineTo(x + 10, y - 12);
		ctx.lineTo(x + 15, y + 16);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = "#edc0a3";
		ctx.beginPath();
		ctx.arc(x, y - 17, 8, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = "#42314c";
		ctx.beginPath();
		ctx.moveTo(x - 12, y - 22);
		ctx.lineTo(x, y - 40);
		ctx.lineTo(x + 12, y - 22);
		ctx.closePath();
		ctx.fill();
	} else if (mob.type === "zombie") {
		ctx.fillRect(x - 9, y - 10, 18, 22);
		ctx.fillRect(x - 8, y + 10, 6, 12);
		ctx.fillRect(x + 2, y + 10, 6, 12);
		ctx.fillStyle = "#b3c18d";
		ctx.fillRect(x - 8, y - 22, 16, 13);
		ctx.fillStyle = "#253a2d";
		ctx.fillRect(x - 5, y - 17, 3, 3);
		ctx.fillRect(x + 3, y - 17, 3, 3);
	} else {
		ctx.fillStyle = "#292f34";
		for (const side of [-1, 1]) {
			for (const offset of [-12, -4, 4, 12]) {
				ctx.beginPath();
				ctx.moveTo(x + side * 6, y + offset * 0.4);
				ctx.lineTo(x + side * 19, y + offset);
				ctx.lineTo(x + side * 21, y + offset + 3);
				ctx.lineTo(x + side * 7, y + offset + 2);
				ctx.fill();
			}
		}
		ctx.beginPath();
		ctx.ellipse(x, y, 10, 13, 0, 0, Math.PI * 2);
		ctx.ellipse(x, y - 12, 8, 8, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = "#d65c4f";
		ctx.fillRect(x - 4, y - 14, 2, 2);
		ctx.fillRect(x + 2, y - 14, 2, 2);
	}
	ctx.restore();
	drawMobHealth(mob, x, y);
};

if (survivalModule) {
	survivalModule.setup(saved);
	updateHud();
	survivalAssetsReady.then(() => survivalModule.refreshInventory());
}

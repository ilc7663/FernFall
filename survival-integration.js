const survivalModule = typeof FernfallSurvival === "undefined" ? null : FernfallSurvival;
const hostileAssetRoot = new URL("Video_Game_PNGs/Fernfall_Passive_Mobs_Game_Ready/recropped assets/Fernfall_Assets_ReCropped_Game_Ready/assets/Fernfall_Hostile_Mobs_Game_Ready/", document.baseURI).href;
loadFernfallHostileAssets(hostileAssetRoot);
const settlementAssetRoot = new URL("Video_Game_PNGs/Fernfall_Passive_Mobs_Game_Ready/recropped assets/Fernfall_Assets_ReCropped_Game_Ready/assets/Fernfall_Settlement_and_Crafting_Game_Ready/", document.baseURI).href;
const settlementAssetsReady = loadFernfallSettlementAssets(settlementAssetRoot).catch(() => null);
const hostileMotion = new WeakMap();
const hostileTypes = ["skeleton", "witch", "spider", "bat", "zombie"];

function drawHostileSprite(mob, x, y) {
	const frames = fernfallHostileArt[mob.type];
	if (!frames) return false;
	const previous = hostileMotion.get(mob);
	const moving = previous && Math.hypot(mob.x - previous.x, mob.y - previous.y) > 0.25;
	hostileMotion.set(mob, { x: mob.x, y: mob.y });
	const dx = player.x - mob.x;
	const dy = player.y - mob.y;
	const direction = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : dy < 0 ? "up" : "down";
	const walkFrame = Math.floor(performance.now() / 170 + mob.phase) % 2 + 1;
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
	if (survivalModule?.interact()) return;
	const untamedWolves = animals.filter((animal) => animal.type === "wolf" && !animal.tamed);
	originalGather();
	if (survivalModule && untamedWolves.some((animal) => animal.tamed)) survivalModule.recordQuest("wolf");
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
collides = function (x, y) {
	return originalCollides(x, y) || Boolean(survivalModule?.blocks(x, y));
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
	survivalModule?.drawPonds();
};

const originalDrawResource = drawResource;
drawResource = function (resource) {
	if (!survivalModule?.drawResource(resource)) originalDrawResource(resource);
};

const originalDrawTree = drawTree;
drawTree = function (tree) {
	if (tree.chopped && drawArt(ctx, art.forest.tree_stump, tree.x, tree.y - 16, 108, 120)) return;
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
	survivalModule?.drawStations();
	survivalModule?.drawProjectiles();
	for (const pickup of pickups) {
		FernfallCooking.draw(ctx, itemInfo[pickup.type]?.art || pickup.type, pickup.x - 14, pickup.y - 14, 28, 28);
	}
	ctx.restore();
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
}

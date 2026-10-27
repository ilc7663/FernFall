const originalGather = gather;
gather = function () {
	if (!FernfallSurvival.interact()) originalGather();
};

const originalAttack = attack;
attack = function () {
	if (performance.now() - lastAttack < 360) return;
	if (FernfallSurvival.attackAnimal()) {
		lastAttack = performance.now();
		player.swing = 1;
		updateHud();
		saveGame();
		return;
	}
	originalAttack();
};

const originalUpdate = update;
update = function () {
	originalUpdate();
	FernfallSurvival.update();
};

const originalUpdateHud = updateHud;
updateHud = function () {
	originalUpdateHud();
	FernfallSurvival.refreshInventory();
};

const originalDrawGround = drawGround;
drawGround = function () {
	originalDrawGround();
	FernfallSurvival.drawPonds();
};

const originalDrawResource = drawResource;
drawResource = function (resource) {
	if (!FernfallSurvival.drawResource(resource)) originalDrawResource(resource);
};

const originalDrawTree = drawTree;
drawTree = function (tree) {
	if (tree.chopped && drawArt(ctx, art.forest.tree_stump, tree.x, tree.y - 16, 108, 120)) return;
	originalDrawTree(tree);
};

const originalRender = render;
render = function () {
	originalRender();
	ctx.save();
	ctx.translate(-camera.x, -camera.y);
	FernfallSurvival.drawStations();
	for (const pickup of pickups) {
		FernfallCooking.draw(ctx, itemInfo[pickup.type]?.art || pickup.type, pickup.x - 14, pickup.y - 14, 28, 28);
	}
	ctx.restore();
};

FernfallSurvival.setup(saved);
updateHud();

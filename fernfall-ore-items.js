// Must load after fernfall-pack-assets.js and before inventory.js, which builds its item catalog at load.
(() => {
	const root = new URL("Video_Game_PNGs/Fernfall_Resources_Ore_Ingots/assets/", document.baseURI);
	const items = {
		coal: ["coal_chunk.png", "Coal"],
		iron_ore: ["iron_chunk.png", "Iron Ore"],
		iron: ["iron_ingot.png", "Iron Ingot"],
		gold_ore: ["gold_chunk.png", "Gold Ore"],
		gold: ["gold_ingot.png", "Gold Ingot"],
		crystal_ore: ["crystal_chunk.png", "Crystal Ore"],
		crystal: ["crystal_ingot.png", "Crystal Ingot"],
	};
	window.FERNFALL_ITEM_IMAGES ||= {};
	window.FERNFALL_ITEM_LABELS ||= {};
	window.FERNFALL_ITEM_CATEGORIES ||= {};
	for (const [id, [file, name]] of Object.entries(items)) {
		window.FERNFALL_ITEM_IMAGES[id] = new URL(file, root).href;
		window.FERNFALL_ITEM_LABELS[id] = name;
		window.FERNFALL_ITEM_CATEGORIES[id] = "materials";
	}
	window.FERNFALL_ITEM_CATEGORIES.torch = "placeables";
})();

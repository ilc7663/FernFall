const FERNFALL_PACK_ROOT = new URL("Video_Game_PNGs/Fernfall_Complete_Inventory_Crafting_Animations_VSCode/", document.baseURI);

for (const [itemId, path] of Object.entries(window.FERNFALL_ITEM_IMAGES || {})) {
	window.FERNFALL_ITEM_IMAGES[itemId] = new URL(path, FERNFALL_PACK_ROOT).href;
}

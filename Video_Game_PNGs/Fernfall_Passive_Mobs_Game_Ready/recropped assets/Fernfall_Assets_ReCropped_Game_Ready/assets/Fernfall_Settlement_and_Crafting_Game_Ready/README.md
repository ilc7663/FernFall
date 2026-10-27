# Fernfall Settlement Expansion — Game Ready Pack

This pack includes four asset groups for Fernfall:
- villagers
- camp objects
- village buildings and props
- enemy loot drops

## Included villagers
- shopkeeper
- blacksmith
- farmer
- innkeeper
- healer
- mayor

Each villager includes `down`, `left`, `right`, and `up` facing sprites.

## Folder layout
- `assets/villagers/...`
- `assets/camp_objects/...`
- `assets/village_assets/...`
- `assets/enemy_loot/...`
- `assets_tight/...` → tightly cropped versions
- `source_sheets/` → original generated sheets
- `settlement-assets.js` → image loader
- `manifest.json`

## Quick setup
Add this before your main game script in `site.html`:

```html
<script src="settlement-assets.js"></script>
<script src="script.js"></script>
```

Then load the pack:

```js
loadFernfallSettlementAssets().then(() => {
  // villager example
  ctx.drawImage(fernfallSettlementArt.villagers.shopkeeper.down, x, y, 48, 48);

  // camp object example
  ctx.drawImage(fernfallSettlementArt.camp_objects.campfire_lit, x, y, 96, 96);

  // village building example
  ctx.drawImage(fernfallSettlementArt.village_assets.general_store, x, y, 180, 150);

  // loot example
  ctx.drawImage(fernfallSettlementArt.enemy_loot.coin_single, x, y, 24, 24);
});
```

## Suggested uses
- Villagers: dialogue, quest givers, shopkeepers
- Camp objects: cooking area, spawn point, storage, camp setup
- Village assets: build the Fernfall village hub
- Enemy loot: drops for skeletons, witches, spiders, bats, and slimes


## NEW: Placeable crafting table and furnace

The `assets/placeables/` directory adds:
- `crafting_table.png` — opens crafting menu
- `furnace_unlit.png` — furnace with no active flame
- `furnace_lit.png` — burning furnace
- `forge_lit.png` — larger forge/workshop option

Each image has a transparent background. `placeables.json` contains suggested properties. The asset pack DOES NOT add game logic by itself; placement, fuel, smelting/cooking, collision, inventory and interaction logic need to be implemented in `script.js`.

To load it, keep the following order in `site.html`:

```html
<script src="settlement-assets.js"></script>
<script src="script.js"></script>
```

Then, inside your game initialization:

```js
loadFernfallSettlementAssets().then(art => {
  // Example: draw crafting table at its world coordinate
  ctx.drawImage(art.placeables.crafting_table, 100, 100, 80, 80);
  ctx.drawImage(art.placeables.furnace_unlit, 220, 100, 80, 80);
});
```

`loadFernfallSettlementAssets()` resolves when the sprite images are ready. Use `art.placeables.furnace_lit` when the furnace has fuel and is active.

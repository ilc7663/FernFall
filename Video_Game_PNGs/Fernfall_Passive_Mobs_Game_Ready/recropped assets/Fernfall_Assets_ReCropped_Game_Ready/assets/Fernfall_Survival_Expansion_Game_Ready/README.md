# Fernfall Survival Expansion — Game Ready

This contains **transparent PNG sprites**, not preprogrammed mechanics.

## Install
1. Extract ZIP at your project root, merging the `assets` folder.
2. Add `<script src="survival-assets.js"></script>` immediately before `script.js` in `site.html`.
3. Once, during startup, call `loadFernfallSurvivalAssets().then(() => { /* redraw game */ });`.
4. Example: `drawSurvivalSprite(ctx, 'gathered_carrot', x, y, 32, 32);`; or `drawSurvivalSprite(ctx, 'world_potato_plant', x, y, 48, 48);`.
5. `manifest.json` gives exact paths and sizes. `recipes.json` is copied from the earlier cooking pack.

## Contents
- `assets/gathered`: vegetables, berries, mushroom, herbs, grain, wood, stick, stone, wool, hide, bone, milk, bucket milk, extra cooking ingredients.
- `assets/world`: harvestable plants.
- `assets/ui`: generic interaction icons.
- `assets/food`, `assets/bucket`, `assets/campfire`, `assets/cookware`: earlier cooking artwork, consolidated.
- `assets/inventory_64`: 64-pixel item icons, including new gathered resources.
- `assets/passive`: passive animal sprite copies when available.
- `assets/existing_world`: selected previous Fernfall scenery and pickup art.

## Still to code
World spawn and collisions, gather button logic, animal drops, recipe checks, campfire timers, bucket filling, tameable wolf behavior, Jimothy one-time event, inventories and saving.

All generated resource icons have actual transparent backgrounds and are independent PNG files.

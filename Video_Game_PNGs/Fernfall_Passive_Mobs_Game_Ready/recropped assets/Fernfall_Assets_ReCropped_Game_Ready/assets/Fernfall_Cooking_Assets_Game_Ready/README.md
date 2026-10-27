# Fernfall Cooking Assets — game-ready add-on

Designed for the existing **Fernfall** top-down canvas game (`site.html` + `script.js`).

## What is in the ZIP

- **43 cleaned transparent RGBA PNG sprites**, grouped into `assets/food/raw`, `assets/food/cooked`, `assets/food/recipes`, `assets/campfire`, `assets/cookware`, and `assets/bucket`.
- A second set of matching **64×64 transparent inventory icons** in `assets/inventory_64`.
- An **empty wooden bucket** (`bucket_empty.png`) and matching filled bucket (`bucket_water.png`).
- Campfire animation frames `campfire_0.png` (unlit), `campfire_1.png`–`campfire_6.png` (lit).
- Pots, frying pans, pot lid, bowls, cooked foods and recipe dishes.
- `cooking-assets.js` (image preloader and drawing helpers), `recipes.json` (example recipes and drops), `manifest.json` (every file path), `preview.png`, and original reference sheet.

## Install

1. Unzip the pack. Copy the whole `assets` folder into the root of your GitHub game project, merging with any existing assets folder.
2. Place `cooking-assets.js` next to `script.js` and `site.html`.
3. In `site.html`, load this **before** `script.js`:

```html
<script src="cooking-assets.js"></script>
<script src="script.js"></script>
```

4. In the existing game's render function, use the image loader:

```javascript
// Top-left coordinates are used in the drawing helpers.
FernfallCooking.draw(ctx, 'bucket_empty', 400, 200, 46);
FernfallCooking.draw(ctx, 'cooking_pot_empty', 450, 200, 54);
FernfallCooking.drawCampfire(ctx, 480, 320, performance.now(), 78);
FernfallCooking.draw(ctx, 'beef_cooked', 320, 240, 32);
```

`FernfallCooking.ready` resolves once image loading has finished. Drawing helpers simply return false if an image is not ready and do not crash.

## Game data / examples

`FernfallCooking.recipes` contains example ingredients and cooked-food outcomes. For instance:

```javascript
let inventory = { beef_raw: 2, carrot: 1, potato: 1 };
if (FernfallCooking.canCook('steak_veggies', inventory)) {
  FernfallCooking.cook('steak_veggies', inventory);
}
```

This optional `cook()` helper consumes ingredients and creates the outcome immediately. It does **not** check nearby campfires, enforce station choice, animate cooking timers, modify the main game's inventory, or implement interactions. Wire it into your own existing item and input systems. The recipe list includes illustrative times and healing values; change them for balance.

Raw food drops are mapped to cow, pig, sheep, and rabbit; **wolves drop no food**. Jimothy has a special optional berry pie entry, not meat. Example ingredient identifiers `carrot`, `potato`, `herb` are placeholders for items already in or planned for your game; their artwork is not supplied here.

## Notes on the art

Artwork was isolated from the original generated reference atlas. These are true transparent PNGs (no checkerboard or words on the image). Because the source atlas is illustrative rather than a production sprite sheet, some subtle edges may differ between related images. 64×64 copies are uniformly centered and suitable for inventory UI, while original-sized crops are suited for game-world rendering.

This adds **asset files and optional utility JS** to the repository, not a modified playable game or a GitHub commit.

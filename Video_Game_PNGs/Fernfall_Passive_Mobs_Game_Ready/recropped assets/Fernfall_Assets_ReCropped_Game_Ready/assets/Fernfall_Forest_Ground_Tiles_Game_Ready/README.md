# Fernfall — top-down ground tile pack

Designed to replace the simple colored floor underneath all game objects.

## Contents
- `assets/ground/`: sixteen 128×128 pixel PNG floor textures (opaque, NOT character sprites)
- `ground-tiles.js`: ready-to-use Canvas 2D renderer
- `fernfall_ground_preview.png`: example 960×600 background
- `tile_catalog.png`: contact sheet with tile names
- `manifest.json`: asset names and paths

## Install into your Fernfall project
1. Put the `assets/ground` folder in your existing `assets` folder (do not replace other sprites).
2. Put `ground-tiles.js` beside `script.js`.
3. In `site.html`, put `<script src="ground-tiles.js"></script>` immediately **before** `<script src="script.js"></script>`.
4. In `script.js`, replace the *entire* existing `drawGround()` function with:

```js
function drawGround() {
  drawFernfallGround(ctx, WIDTH, HEIGHT);
}
```

Keep `render()` unchanged — it already calls `drawGround()` before drawing items, trees, animals, enemies and the player.

### Notes
- Tiles are square, opaque PNGs; they can tile across a canvas, but generated artwork may still show subtle repeat lines / transitions between different tile types.
- The JS example uses 64px display tiles (source PNGs are 128px).
- Terrain is decorative only and does not change collisions, movement or spawning.
- The default path is a blocky, tile-based rendition of the old curved path; adjust `pathY` and its distance threshold to change its position and width.
- Use the `tile_catalog.png` to choose different filenames.

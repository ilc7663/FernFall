# Fernfall Nature & Pond Asset Pack

Includes a corrected **empty bed** in eight angles, pickable berries, berry bushes, mushroom variants, nine fallen logs, standalone pond water and shoreline tiles, and transparent pond decorations.

## Install in VS Code
1. Merge `assets/` into the project folder containing your existing assets.
2. Copy `fernfall-nature-assets.js` beside `site.html`.
3. Load the helper before `script.js` in `site.html`:
```html
<script src="fernfall-nature-assets.js"></script>
<script src="script.js"></script>
```
4. In your game's async setup call `await loadFernfallNatureAssets()` before rendering; or use `window.fernfallNatureArt` after the returned promise resolves.

Example:
```js
const art = await loadFernfallNatureAssets();
ctx.drawImage(art.beds.bed_down, x, y, 64, 88);
ctx.drawImage(art.berries.berry_bush_red, x, y, 48, 48);
ctx.drawImage(art.pond_tiles.pond_corner_nw, x, y, 64, 64);
```

## Pond tile order
```
pond_corner_nw   pond_edge_n    pond_corner_ne
pond_edge_w      pond_center    pond_edge_e
pond_corner_sw   pond_edge_s    pond_corner_se
```
Each tile is 64×64. Tiles are designed for a simple **3×3 pond**; for larger ponds repeat `pond_center`, edges, and corners. Some more complex shapes require additional transition tiles. Grass and pond-water fills are seamless; bank edges are geometric rather than hand-painted.

## Notes
- Bed and forest sprites were carefully cropped into their own regions and separated from sheet labels.
- Source art includes checkerboard pixels; background removal is approximate, so inspect transparent edges on your target game background.
- Pond textures are generated cleanly without neighboring objects and have predictable tile alignment.
- This pack contains artwork, not programmed sleeping, gathering, pond collision, or water-collection mechanics.

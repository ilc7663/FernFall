# Fernfall Hostile Mobs — Game Ready Pack

This pack includes four hostile enemies for Fernfall:
- skeleton
- witch
- spider
- bat

## Folder layout
- `assets/hostile/<enemy>/...png` → fixed-size transparent animation frames
- `assets_tight/hostile/<enemy>/...png` → tightly cropped versions
- `hostile-assets.js` → simple image loader
- `manifest.json` → paths to all frames
- `source_sheets/` → original 4×4 sprite sheets

## Frame naming
Each enemy includes 16 frames in this order:
- `down_idle`, `down_walk1`, `down_walk2`, `down_attack`
- `left_idle`, `left_walk1`, `left_walk2`, `left_attack`
- `right_idle`, `right_walk1`, `right_walk2`, `right_attack`
- `up_idle`, `up_walk1`, `up_walk2`, `up_attack`

For the bat, the `walk` frames act like flap / fly frames.
For the witch, the `attack` frames are named `*_cast`.

## Quick use
Add this before your main script in `site.html`:

```html
<script src="hostile-assets.js"></script>
<script src="script.js"></script>
```

Then load them:

```js
loadFernfallHostileAssets().then(() => {
  // example: draw the skeleton
  ctx.drawImage(fernfallHostileArt.skeleton.down_idle, x, y, 48, 48);
});
```

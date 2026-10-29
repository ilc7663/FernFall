# Fernfall — Rebuilt Ranger and Zombie Sprites

**New export, not the old faulty ZIP.**

## Includes

- Ranger with **empty hands, pickaxe, axe, shovel, hoe, shears, bucket**.
- Each ranger action has **down/front, up/back, left, right** directions.
- Each direction has **idle, walk_1, walk_2, use** frames.
- Zombie has idle, walk, attack, and death images for the four directions.
- 136 transparent 352×352 PNG frames with a clear border around the complete artwork, uniform canvas size and common ground anchor.
- Four-frame horizontal strips for each ranger action and direction.
- `manifest.json`, `sprite-loader.js` and a contact sheet preview.

## Folder structure

`assets/ranger/pickaxe/left/use.png` and `assets/zombie/left/attack_1.png`.

## Add to your GitHub Pages project

1. Extract into your repo so `Fernfall_Characters_Complete_Rebuild` is a folder beside `site.html`.
2. Add `<script src="Fernfall_Characters_Complete_Rebuild/sprite-loader.js"></script>` before your main script in `site.html`.
3. After loading the page, call `await FernfallSprites.init()` once.
4. In your game render loop:

```js
const img = FernfallSprites.get('ranger', 'pickaxe', 'left', 'use');
if (img && img.complete && img.naturalWidth) {
  ctx.drawImage(img, x, y, 64, 64);
}
```

For zombie: `FernfallSprites.get('zombie', null, 'left', 'attack_1')`.

**Important:** The loader makes files available, but you still need to connect it to tool selection and animation state in your game. The left/right frames were adapted from source art and the right-facing ones are mirrored; some zombie special-action directions are substituted poses. No heads or feet touch the edges of the exported frame canvases.

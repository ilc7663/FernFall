# Fernfall — Passive Mobs Art Pack

Six game-ready transparent PNG sprite sets: sheep, cow, pig, wolf, rabbit, and **Jimothy** (the famous round raccoon). All images use a common 256×256 transparent canvas with centered sprites, suitable for direct HTML Canvas rendering.

## Install

1. Extract this ZIP. Copy the `assets/passive/` directory into your project under the same path (beside your existing `assets/`).
2. Copy `passive-assets.js` beside your existing `script.js` and `site.html`.
3. Add `<script src="passive-assets.js"></script>` **before** your existing `<script src="script.js"></script>` tag.
4. In your game's drawing code, draw sprites like this:

```js
if (passiveArt.jimothy.down_idle.complete) {
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(passiveArt.jimothy.down_idle, 100, 100, 48, 48);
}
// Other examples:
ctx.drawImage(passiveArt.rabbit.left_walk1, 180, 100, 40, 40);
ctx.drawImage(passiveArt.sheep.down_idle, 230, 100, 48, 48);
```

The asset keys follow `passiveArt.creature.direction_action`, including:
`down_idle`, `down_walk1`, `down_walk2`, `down_happy`, `left_idle`, `left_walk1`, `left_walk2`, `left_rest`, `right_idle`, `right_walk1`, `right_walk2`, `right_rest`, `up_idle`, `up_walk1`, `up_walk2`, `up_happy`.

`passiveArt.wolf_tamed` is a visual alias for the wild wolf sheet. The game must add taming behavior and a collar or name badge; these are not automatically implemented by an art pack. The graphics by themselves do not spawn creatures or add animations/AI.

To make simple walking animation choose `walk1` or `walk2` based on elapsed time. These are illustrated poses rather than mathematically registered frame-by-frame animations; slight movement between frames is expected.

See `passive-assets.json` for exact PNG paths. The original source sheets are included in `source_sheets/`.

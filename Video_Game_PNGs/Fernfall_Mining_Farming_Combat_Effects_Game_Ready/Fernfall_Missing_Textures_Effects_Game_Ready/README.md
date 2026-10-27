# Fernfall — Missing Textures & Effects Pack

Includes transparent PNG frames in `assets/` and `manifest.json` for:
- Ore deposits (iron, coal, gold, crystal), cracked/depleted rocks
- Crops (carrots, potatoes, grain, herbs) in four growth stages
- Dirt, tilled, planted, and watered farmland
- Witch, spider, skeleton projectiles and effects
- Sword hits, critical hits, enemy defeat effects
- Mining dust, wood chips, smoke, steam, cooking, spawn, sleep and UI effects

## Install
Copy `assets/`, `manifest.json`, and `effects-loader.js` into the directory containing `site.html` (merge `assets` rather than deleting your existing assets). Load `effects-loader.js` before `script.js`:

```html
<script src="effects-loader.js"></script>
<script src="script.js"></script>
```

During game initialization, run:

```js
loadFernfallEffects().then(art => {
  // example: draw the first iron deposit
  ctx.drawImage(art.ores.iron_full, 140, 160, 48, 48);
});
```

For animations choose sequential frames by time, for example `art.mining.rock_dust_01`, `rock_dust_02`, etc. Effects must be invoked by your gameplay logic; this pack does not modify existing game code or implement animations automatically.

**Art note:** The PNG frames were extracted from a generated multi-asset reference sheet. Some may have residual labels, edge artifacts, checkerboard pixels, or incomplete shapes and may need manual touch-ups for production quality. The farmland textures are not mathematically seamless tiles. Inspect previews in VS Code and verify sizes and alignment before using.

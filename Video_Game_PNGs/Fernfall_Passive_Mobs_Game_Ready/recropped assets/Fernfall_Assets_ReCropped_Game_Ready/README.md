# Fernfall — fully re-cropped base asset pack

This replaces the previous **Fernfall Game-Ready Assets** pack (ranger, slimes, forest, ground and pickup items). It does not replace the separate passive-mob add-on.

## Which PNGs should I use?

- **`assets/`**: cleaned frames with the same filenames and original canvas sizes. **Drop-in replacement** for existing `assets/` files. This prevents animation jitter from per-frame width/height changes.
- **`assets_tight/`**: each image trimmed to its nontransparent bounding box with no large blank margins. Use these for menus, inventory icons, UI and custom sprite renderers. Different frames may have different dimensions, so anchor them consistently.
- `assets.js`: original sprite loader, still compatible with `assets/`.
- `manifest.json`: records each sprite's original dimensions, trim rectangle and tight dimensions.
- `style_reference.png`: a visual reference, **not** a tile or sprite.

## Installation

1. Back up your existing `assets/` folder.
2. Copy the included `assets/` folder into your Fernfall project, allowing it to overwrite existing PNGs.
3. Keep `assets.js` or replace it with the included copy. Your existing calls such as `art.ranger.down_idle` will keep working.
4. For smaller, naturally cropped icons, use files from `assets_tight/`.

## Notes about cleanup

Reprocessed individual PNGs to remove disconnected pixels and neighboring-frame artifacts where identifiable; retained intentional detached effects such as slime bubbles and attack projectiles. The original source sheets contain some sprites whose large shapes nearly touch the cell boundary, so **source-image truncation cannot always be reconstructed by cropping alone**. Sprites are not promised as seamless tiles; the ground images are decorative patches. There are no changes to game code or saved game data.

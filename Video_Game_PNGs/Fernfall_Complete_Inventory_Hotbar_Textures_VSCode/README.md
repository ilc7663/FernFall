# Fernfall – Complete Inventory, Crafting, Hotbar + Wood Textures

This merges the working inventory/crafting UI and tool-animation pack with the repeatable forest UI textures.

## Open in VS Code / test
1. Extract the ZIP to a folder.
2. Open the folder in VS Code.
3. Open `demo.html` with Live Server or from your browser to try the inventory/crafting/hotbar interface.
4. To use in the existing Fernfall project, copy the folders/files into the folder containing `site.html` (merge `assets`).

## Add to `site.html`
Inside `<head>` in this order:
```html
<link rel="stylesheet" href="inventory.css">
<link rel="stylesheet" href="crafting.css">
<link rel="stylesheet" href="fernfall-texture-theme.css">
```
Add near the end of `<body>`:
```html
<script src="item-catalog.js"></script>
<script src="inventory.js"></script>
<script src="crafting.js"></script>
<script src="tool-animations.js"></script>
```
Ensure these scripts run after the DOM has loaded (e.g., place them near `</body>`).

## Controls
- `I`: inventory
- `C`: crafting
- `1`–`9`: hotbar
- Left-click: pick up/swap/combine stacks
- Right-click: split/place one

## Included
- 36-slot inventory and nine-slot hotbar
- 3×3 crafting UI, item catalog, JSON recipes
- 200+ item icons, tool-use frames for mining/chopping/digging/tilling/attacking/shooting/fishing/shearing
- Repeating wood, parchment, stone, cloth, leaf textures; buttons, slots and hotbar image elements
- Texture-themed CSS already linked in the demo

## Connect with the live game
This pack is a runnable standalone UI module, not a replacement for your existing `script.js` logic. Wire collecting, crafting, equipping, cooking and saving to `FernfallInventory` and the corresponding APIs. Avoid maintaining two independent inventory saves: migrate or replace existing inventory logic carefully.

The texture files are repeated via CSS, while nine interactive hotbar buttons are rendered by JavaScript. Each image has its own texture and the `assets/ui_elements/hotbar_9slot.png` is an optional decorative alternative.

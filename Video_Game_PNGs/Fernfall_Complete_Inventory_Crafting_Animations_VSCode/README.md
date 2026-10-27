# Fernfall Complete Inventory, Crafting & Tool Animation Pack

## Install in VS Code
1. Unzip into the same folder as `site.html` and `script.js`; merge the `assets` folder.
2. Add styles in `<head>`: `<link rel="stylesheet" href="inventory.css"><link rel="stylesheet" href="crafting.css">`
3. Add scripts at end of `<body>` in this order, after the game script or before it if needed: `<script src="item-catalog.js"></script><script src="inventory.js"></script><script src="crafting.js"></script><script src="tool-animations.js"></script>`.
4. Open `demo.html` in a browser to test without touching the game.

**Controls:** I inventory, C crafting, 1–9 hotbar, left/right mouse buttons move/split stacks. You can also call `FernfallCrafting.open()` from your game's Craft button.

**Existing game integration:** This is a working standalone UI/inventory, not an automatic replacement for Fernfall's existing save and item system. To avoid duplicate inventories, connect game pickups and crafting to `FernfallInventory.add(id,quantity)`, `remove(id,quantity)`, `count(id)`, and `getSelected()`; migrate any old saved items intentionally. A dedicated game-integration pass is still needed for placing items, cooking, combat hit detection, tool durability, and sprites.

**Animations:** `FernfallToolAnimations.draw(ctx,'mine','down',x,y,64,performance.now())` draws a looped tool animation. Supported actions: mine,chop,dig,till,attack,shoot,fish,shear; directions: down,left,right,up. These are pixel-art composite visual effects and need wiring to actual interaction events.

**Files:** `assets/icons` contains icons for 200+ items and tool types; `assets/animations` has tool-use PNG sequences; `item-catalog.js` maps item IDs to icons; `crafting.js` provides a craftable recipe panel; `inventory.js` provides 36 slots and 9-slot hotbar; `recipes.json` and `animations.json` document content. Future items use `unknown_item.png` until assigned custom art.

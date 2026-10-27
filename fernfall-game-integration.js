(() => {
	const gameToPack = {
		berry: "berries",
		gel: "slime_gel",
		tonic: "item_potion",
		wooden_stick: "stick",
		campfire_kit: "campfire",
		cooking_pot: "cooking_pot_empty",
		frying_pan: "frying_pan_empty",
		bowl: "bowl_empty",
	};
	const packToGame = Object.fromEntries(Object.entries(gameToPack).map(([gameId, packId]) => [packId, gameId]));
	let syncingPack = false;
	let syncingGame = false;

	function packIdFor(gameId) {
		return gameToPack[gameId] || gameId;
	}

	function gameIdFor(packId) {
		return packToGame[packId] || packId;
	}

	function ensurePackItem(packId, gameId) {
		if (window.FERNFALL_ITEM_IMAGES?.[packId]) return;
		const definition = itemInfo[gameId];
		window.FernfallInventory.register(
			packId,
			window.FERNFALL_ITEM_LABELS?.[packId] || definition?.name || packId.replaceAll("_", " "),
			definition?.icon || "📦",
			window.FERNFALL_ITEM_CATEGORIES?.[packId] || definition?.category || "materials",
		);
	}

	function gameInventoryAsPackCounts() {
		const counts = {};
		for (const [gameId, count] of Object.entries(player.inventory)) {
			const packId = packIdFor(gameId);
			ensurePackItem(packId, gameId);
			counts[packId] = (counts[packId] || 0) + Math.max(0, Math.floor(count || 0));
		}
		return counts;
	}

	function syncPackFromGame(replace = false) {
		if (syncingPack || syncingGame || !window.FernfallInventory || window.FernfallInventory.hasCursor()) return;
		const counts = gameInventoryAsPackCounts();
		syncingPack = true;
		if (replace) {
			window.FernfallInventory.replace(counts);
		} else {
			const current = window.FernfallInventory.getSlots().filter(Boolean).map((slot) => slot.id);
			for (const id of new Set([...Object.keys(counts), ...current])) {
				ensurePackItem(id, gameIdFor(id));
				if (!window.FernfallInventory.setCount(id, counts[id] || 0)) {
					showToast(`The pack is full; ${window.FERNFALL_ITEM_LABELS?.[id] || id} could not be moved into it.`);
				}
			}
		}
		syncingPack = false;
	}

	function syncGameFromPack() {
		if (syncingPack || syncingGame || window.FernfallInventory.hasCursor()) return;
		syncingGame = true;
		const counts = {};
		for (const slot of window.FernfallInventory.getSlots()) {
			if (!slot) continue;
			const gameId = gameIdFor(slot.id);
			counts[gameId] = (counts[gameId] || 0) + slot.count;
		}
		const gameIds = new Set([...Object.keys(player.inventory), ...Object.keys(packToGame).map(gameIdFor), ...Object.keys(counts)]);
		for (const gameId of gameIds) player.inventory[gameId] = counts[gameId] || 0;
		syncingGame = false;
		updateHud();
		saveGame();
	}

	function toolActionForSelected(fallback) {
		const id = window.FernfallInventory.getSelected()?.id || "";
		if (id.includes("pickaxe")) return "mine";
		if (id.includes("axe")) return "chop";
		if (id.includes("shovel")) return "dig";
		if (id.includes("hoe")) return "till";
		if (id.includes("sword")) return "attack";
		if (id.includes("bow")) return "shoot";
		if (id.includes("fishing_rod")) return "fish";
		if (id.includes("shears")) return "shear";
		return fallback;
	}

	window.FernfallGameInventory = {
		syncFromGame: () => syncPackFromGame(),
		animate(fallback) {
			const id = window.FernfallInventory.getSelected()?.id || "";
			if (!/_(pickaxe|axe|shovel|hoe|sword|bow|fishing_rod|shears)$/.test(id)) return false;
			player.toolAction = toolActionForSelected(fallback);
			player.toolActionUntil = performance.now() + 480;
			return true;
		},
	};
	window.FernfallInventory.setPortrait((context, width, height) => {
		const sprite = art.ranger[`${player.direction}_idle`] || art.ranger.down_idle;
		if (!sprite?.complete || !sprite.naturalWidth) return;
		const size = Math.min(width - 12, height - 12);
		context.imageSmoothingEnabled = false;
		context.drawImage(sprite, Math.round((width - size) / 2), Math.round(height - size - 4), size, size);
	});

	syncPackFromGame();
	window.addEventListener("fernfall:inventory-change", () => {
		if (!syncingPack) syncGameFromPack();
	});
	window.addEventListener("fernfall:item-crafted", syncGameFromPack);
	window.addEventListener("fernfall:item-use", (event) => {
		const packId = event.detail?.id;
		const gameId = gameIdFor(packId);
		if (/_(pickaxe|axe|shovel|hoe|sword|bow|fishing_rod|shears)$/.test(packId || "")) {
			window.FernfallGameInventory.animate("attack");
			showToast(`${window.FERNFALL_ITEM_LABELS?.[packId] || packId.replaceAll("_", " ")} ready.`);
			return;
		}
		if (!survivalModule?.useItem(gameId)) showToast("That item can't be used here.");
	});
	document.querySelector("#inventory-open-button")?.addEventListener("click", () => window.FernfallInventory.open());

	const originalUpdateHud = updateHud;
	updateHud = function (...args) {
		const result = originalUpdateHud(...args);
		syncPackFromGame();
		return result;
	};
	const originalSaveGame = saveGame;
	saveGame = function (...args) {
		syncPackFromGame();
		return originalSaveGame(...args);
	};

	const temporaryBase = document.createElement("base");
	temporaryBase.href = FERNFALL_PACK_ROOT.href;
	document.head.append(temporaryBase);
	const animationScript = document.createElement("script");
	animationScript.src = new URL("tool-animations.js", FERNFALL_PACK_ROOT).href;
	animationScript.onload = () => temporaryBase.remove();
	animationScript.onerror = () => {
		temporaryBase.remove();
		console.error("Fernfall tool animations could not be loaded.");
	};
	document.body.append(animationScript);
})();

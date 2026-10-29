(() => {
	const gameToPack = {
		berry: "berries",
		herb: "herbs",
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
		placeSelectedItem() {
			if (window.FernfallInventory.hasCursor()) return false;
			const selected = window.FernfallInventory.getSelected();
			if (!selected) return false;
			const gameId = gameIdFor(selected.id);
			if (!["campfire_kit", "furnace", "crafting_table", "cooking_pot", "frying_pan"].includes(gameId)) return false;
			if (!(player.inventory[gameId] > 0)) return false;
			return Boolean(survivalModule?.useItem(gameId));
		},
		eatSelectedFood() {
			if (window.FernfallInventory.hasCursor()) return false;
			const selected = window.FernfallInventory.getSelected();
			if (!selected) return false;
			const gameId = gameIdFor(selected.id);
			if (itemInfo[gameId]?.category !== "food" || !(player.inventory[gameId] > 0)) return false;
			return Boolean(survivalModule?.useItem(gameId));
		},
		animate(fallback) {
			const id = window.FernfallInventory.getSelected()?.id || "";
			if (!/_(pickaxe|axe|shovel|hoe|sword|bow|fishing_rod|shears)$/.test(id)) return false;
			player.toolAction = fallback && fallback !== "attack" ? fallback : toolActionForSelected(fallback);
			player.toolActionStarted = performance.now();
			player.toolActionUntil = player.toolActionStarted + 540;
			return true;
		},
	};
	window.FernfallInventory.setPortrait((context, width, height) => {
		const sprite = art.ranger[`${player.direction}_idle`] || art.ranger.down_idle;
		if (!sprite?.complete || !sprite.naturalWidth) return;
		const size = Math.min(width, height) * 1.12;
		context.imageSmoothingEnabled = false;
		context.drawImage(sprite, Math.round((width - size) / 2), Math.round(height - size - 4), size, size);
		const canvas = context.canvas;
		const panel = canvas.parentElement;
		if (panel && !panel.querySelector(".fernfall-inventory-controls")) {
			const hint = document.createElement("p");
			hint.className = "fernfall-inventory-controls";
			hint.textContent = "Click: pick up / place · Shift+click: move stack · Right-click: split / place one · 1–9: select hotbar · I: inventory";
			canvas.insertAdjacentElement("afterend", hint);
		}
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

	const natureSurvival = typeof FernfallSurvival === "undefined" ? null : FernfallSurvival;
	const natureRoot = new URL("Video_Game_PNGs/Fernfall_Beds_Berries_Mushrooms_Logs_Ponds_Game_Ready/", window.location.href);
	const natureSpriteCache = new WeakMap();
	let natureArt = null;
	if (window.loadFernfallNatureAssets) { 
		window.loadFernfallNatureAssets(new URL("assets", natureRoot).href)
			.then((loaded) => {
				natureArt = loaded;
				window.fernfallNatureArt = loaded;
				for (const [itemId, group, name] of [
					["berries", "berries", "berries_red"],
					["blueberries", "berries", "berries_blue"],
					["mushroom", "mushrooms", "mushroom_brown"],
					["wood", "logs", "log_plain"],
				]) {
					const sprite = natureSprite(loaded[group]?.[name]);
					if (!sprite?.toDataURL || !window.FERNFALL_ITEM_IMAGES) continue;
					window.FERNFALL_ITEM_IMAGES[itemId] = sprite.toDataURL("image/png");
					if (typeof packItemIconCache !== "undefined") packItemIconCache.delete(itemId);
				}
			})
			.catch(() => console.warn("Fernfall nature assets could not be loaded."));
	}

	function natureSprite(image, removeBackdrop = true) {
		if (!image?.complete || !image.naturalWidth) return null;
		if (!removeBackdrop) return image;
		if (natureSpriteCache.has(image)) return natureSpriteCache.get(image);
		const canvas = document.createElement("canvas");
		canvas.width = image.naturalWidth;
		canvas.height = image.naturalHeight;
		const context = canvas.getContext("2d", { willReadFrequently: true });
		context.drawImage(image, 0, 0);
		const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		const pixels = imageData.data;
		const width = canvas.width;
		const height = canvas.height;
		const visited = new Uint8Array(width * height);
		const queue = new Int32Array(width * height);
		let tail = 0;
		const isBackdrop = (index) => {
			const offset = index * 4;
			const red = pixels[offset];
			const green = pixels[offset + 1];
			const blue = pixels[offset + 2];
			return pixels[offset + 3] > 0 && Math.max(red, green, blue) - Math.min(red, green, blue) <= 18 && (red + green + blue) / 3 >= 165;
		};
		const enqueue = (index) => {
			if (visited[index] || !isBackdrop(index)) return;
			visited[index] = 1;
			queue[tail] = index;
			tail += 1;
		};
		for (let x = 0; x < width; x += 1) {
			enqueue(x);
			enqueue((height - 1) * width + x);
		}
		for (let y = 0; y < height; y += 1) {
			enqueue(y * width);
			enqueue(y * width + width - 1);
		}
		for (let head = 0; head < tail; head += 1) {
			const index = queue[head];
			const x = index % width;
			const y = Math.floor(index / width);
			if (x > 0) enqueue(index - 1);
			if (x + 1 < width) enqueue(index + 1);
			if (y > 0) enqueue(index - width);
			if (y + 1 < height) enqueue(index + width);
		}
		for (let index = 0; index < tail; index += 1) pixels[queue[index] * 4 + 3] = 0;
		context.putImageData(imageData, 0, 0);
		natureSpriteCache.set(image, canvas);
		return canvas;
	}

	function drawNatureSprite(group, name, x, y, width, height, removeBackdrop = true) {
		const image = (natureArt || window.fernfallNatureArt)?.[group]?.[name];
		const sprite = natureSprite(image, removeBackdrop);
		if (!sprite) return false;
		ctx.save();
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(sprite, Math.round(x - width / 2), Math.round(y - height / 2), width, height);
		ctx.restore();
		return true;
	}

	if (natureSurvival) {
		const originalNatureResource = natureSurvival.drawResource;
		natureSurvival.drawResource = function (resource) {
			const variant = Math.abs(Math.floor(resource.x * 17 + resource.y * 31));
			if (resource.type === "berry") {
				ctx.fillStyle = "#30483b55";
				ctx.beginPath();
				ctx.ellipse(resource.x, resource.y + 13, 19, 6, 0, 0, Math.PI * 2);
				ctx.fill();
				const berries = ["berry_bush_red", "berry_bush_blue", "berry_bush_black"];
				const sprite = resource.available ? berries[variant % berries.length] : "berry_bush_empty";
				if (drawNatureSprite("berries", sprite, resource.x, resource.y - 5, 58, 58)) return true;
			}
			if (resource.type === "wood") {
				ctx.fillStyle = "#30483b55";
				ctx.beginPath();
				ctx.ellipse(resource.x, resource.y + 10, 23, 6, 0, 0, Math.PI * 2);
				ctx.fill();
				const logs = ["log_small", "log_branch", "log_mossy"];
				const sprite = resource.available ? logs[variant % logs.length] : "log_plain";
				if (drawNatureSprite("logs", sprite, resource.x, resource.y, 64, 42)) return true;
			}
			if (resource.type === "mushroom") {
				const mushrooms = ["brown", "red", "orange", "purple"];
				const color = mushrooms[variant % mushrooms.length];
				const sprite = `mushroom_${color}${resource.available ? "" : "_small"}`;
				if (drawNatureSprite("mushrooms", sprite, resource.x, resource.y, 38, 42)) return true;
			}
			return originalNatureResource(resource);
		};

		const originalNaturePonds = natureSurvival.drawPonds;
		let pondSnapshot = [];
		let pondSnapshotAt = 0;
		const pondTiles = [
			["pond_corner_nw", "pond_corner_ne", "pond_corner_se", "pond_corner_sw"],
		];
		natureSurvival.drawPonds = function (...args) {
			originalNaturePonds?.apply(this, args);
			natureArt ||= window.fernfallNatureArt || null;
			if (!natureArt) return;
			if (performance.now() >= pondSnapshotAt) {
				pondSnapshot = natureSurvival.save?.().ponds || [];
				pondSnapshotAt = performance.now() + 1000;
			}
			for (const pond of pondSnapshot) {
				const width = pond.width || 120;
				const height = pond.height || 84;
				if (pond.x < camera.x - width || pond.x > camera.x + WIDTH + width || pond.y < camera.y - height || pond.y > camera.y + HEIGHT + height) continue;
				const columns = Math.max(3, Math.round(width / 64));
				const rows = Math.max(2, Math.round(height / 64));
				const cellWidth = width / columns;
				const cellHeight = height / rows;
				const seed = Math.abs(Math.floor(pond.x * 17 + pond.y * 31));
				const cells = [];
				for (let row = 0; row < rows; row += 1) {
					for (let col = 0; col < columns; col += 1) {
						const nx = ((col + 0.5) / columns) * 2 - 1;
						const ny = ((row + 0.5) / rows) * 2 - 1;
						const jitter = ((((seed + col * 19 + row * 31) % 7) - 3) * 0.045);
						const shape = seed % 3;
						const round = nx * nx + ny * ny <= 1 + jitter;
						const kidney = ((nx + 0.2) ** 2 + ny * ny * 1.1 <= 1.15 + jitter || (nx - 0.42) ** 2 * 1.4 + ny * ny * 1.2 <= 0.62 + jitter) && !(nx > 0.08 && nx < 0.43 && ny > -0.08 && ny < 0.5);
						const angular = Math.abs(nx) ** 1.35 + Math.abs(ny) ** 1.35 + 0.12 * nx * ny <= 1.18 + jitter;
						if (!(shape === 0 ? round : shape === 1 ? kidney : angular)) continue;
						const top = ny < -0.62;
						const bottom = ny > 0.62;
						const left = nx < -0.62;
						const right = nx > 0.62;
						let tile = "pond_center";
						if (top && left) tile = "pond_corner_nw";
					else if (top && right) tile = "pond_corner_ne";
					else if (bottom && right) tile = "pond_corner_se";
					else if (bottom && left) tile = "pond_corner_sw";
					else if (top) tile = "pond_edge_n";
					else if (bottom) tile = "pond_edge_s";
				else if (left) tile = "pond_edge_w";
				else if (right) tile = "pond_edge_e";
					else if (pond.depth > 0.68) tile = "pond_water_deep";
					cells.push({ row, col, tile });
					}
				}
				const occupied = new Set(cells.map(({ row, col }) => `${row},${col}`));
				for (let row = 0; row < rows; row += 1) {
					for (let col = 0; col < columns; col += 1) {
						const x = pond.x - camera.x - width / 2 + col * cellWidth + cellWidth / 2;
						const y = pond.y - camera.y - height / 2 + row * cellHeight + cellHeight / 2;
						drawNatureSprite("pond_tiles", "grass", x, y, cellWidth, cellHeight, false);
						if (occupied.has(`${row},${col}`)) continue;
					}
				}
				for (const { row, col, tile } of cells) {
					const x = pond.x - camera.x - width / 2 + col * cellWidth + cellWidth / 2;
					const y = pond.y - camera.y - height / 2 + row * cellHeight + cellHeight / 2;
					drawNatureSprite("pond_tiles", tile, x, y, cellWidth, cellHeight, false);
				}
				const decor = window.fernfallNatureArt?.pond_decor;
				for (const [image, x, y, spriteWidth, spriteHeight] of [
					[decor?.reeds, pond.x - camera.x - width * 0.36, pond.y - camera.y - height * 0.35, 24, 34],
					[pond.depth < 0.8 ? decor?.lilypad : null, pond.x - camera.x + width * 0.17, pond.y - camera.y + height * 0.12, 24, 17],
					[decor?.ripples, pond.x - camera.x - width * 0.04, pond.y - camera.y + height * 0.28, 28, 17],
					[decor?.pond_rock, pond.x - camera.x + width * 0.42, pond.y - camera.y + height * 0.4, 18, 19],
				]) {
					if (!image?.complete || !image.naturalWidth) continue;
					ctx.save();
					ctx.imageSmoothingEnabled = false;
					ctx.drawImage(image, Math.round(x - spriteWidth / 2), Math.round(y - spriteHeight / 2), spriteWidth, spriteHeight);
					ctx.restore();
					}
				}
			}
		};

		const originalNatureGround = drawGround;
		const props = [
			{ group: "beds", name: "bed_down", x: 650, y: 210, width: 58, height: 66 },
			{ group: "mushrooms", name: "mushroom_brown_small", x: 82, y: 275, width: 24, height: 28 },
			{ group: "mushrooms", name: "mushroom_orange_small", x: 100, y: 285, width: 22, height: 25 },
			{ group: "mushrooms", name: "mushroom_purple_small", x: 888, y: 322, width: 26, height: 28 },
		];
		drawGround = function (...args) {
			originalNatureGround(...args);
			for (const prop of props) {
				if (prop.x < camera.x - 80 || prop.x > camera.x + WIDTH + 80 || prop.y < camera.y - 80 || prop.y > camera.y + HEIGHT + 80) continue;
				drawNatureSprite(prop.group, prop.name, prop.x - camera.x, prop.y - camera.y, prop.width, prop.height);
			}
		};
	}
})();

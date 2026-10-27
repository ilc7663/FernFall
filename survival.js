const FernfallSurvival = (() => {
	const itemDefinitions = {
		berry: { name: "Wild berry", category: "food", icon: "●", heal: 1 },
		wood: { name: "Softwood", category: "materials", icon: "▰" },
		gel: { name: "Slime gel", category: "other", icon: "●" },
		tonic: { name: "Berry tonic", category: "food", icon: "♧", heal: 2 },
		seed: { name: "Acorn", category: "materials", icon: "✿" },
		stone: { name: "Stone", category: "materials", icon: "S" }, carrot: { name: "Carrot", category: "food", icon: "C", heal: 1 },
		potato: { name: "Potato", category: "food", icon: "P", heal: 1 }, mushroom: { name: "Forest mushroom", category: "food", icon: "M", heal: 1 },
		grain: { name: "Grain", category: "materials", icon: "G" }, herb: { name: "Forest herbs", category: "food", icon: "H", heal: 1 },
		beef_raw: { name: "Raw beef", category: "food", icon: "B", raw: true, art: "beef_raw" },
		pork_raw: { name: "Raw pork", category: "food", icon: "P", raw: true, art: "pork_raw" },
		mutton_raw: { name: "Raw mutton", category: "food", icon: "M", raw: true, art: "mutton_raw" },
		rabbit_raw: { name: "Raw rabbit", category: "food", icon: "R", raw: true, art: "rabbit_raw" },
		wool: { name: "Wool", category: "materials", icon: "W" }, wooden_stick: { name: "Wooden stick", category: "materials", icon: "|" },
		beef_cooked: { name: "Cooked beef", category: "food", icon: "B", heal: 2, art: "beef_cooked" },
		pork_cooked: { name: "Cooked pork", category: "food", icon: "P", heal: 2, art: "pork_cooked" },
		mutton_cooked: { name: "Cooked mutton", category: "food", icon: "M", heal: 2, art: "mutton_cooked" },
		rabbit_cooked: { name: "Cooked rabbit", category: "food", icon: "R", heal: 2, art: "rabbit_cooked" },
		cooked_steak: { name: "Grilled steak", category: "food", icon: "S", heal: 3, art: "cooked_steak" },
		steak_veggies: { name: "Steak and vegetables", category: "food", icon: "V", heal: 5, art: "steak_veggies" },
		pork_chop: { name: "Pan-seared pork chop", category: "food", icon: "P", heal: 3, art: "pork_chop" },
		roasted_pork: { name: "Herb-roasted pork", category: "food", icon: "H", heal: 4, art: "roasted_pork" },
		lamb_stew: { name: "Lamb stew", category: "food", icon: "L", heal: 5, art: "lamb_stew" },
		meat_stew: { name: "Hearty meat stew", category: "food", icon: "T", heal: 5, art: "meat_stew" },
		meat_skewers: { name: "Meat skewers", category: "food", icon: "K", heal: 3 },
		meat_pie: { name: "Meat pie", category: "food", icon: "P", heal: 5 },
		rabbit_stew: { name: "Rabbit stew", category: "food", icon: "R", heal: 4, art: "rabbit_stew" },
		berry_hand_pie: { name: "Berry hand pie", category: "food", icon: "B", heal: 3, art: "berry_hand_pie" },
		campfire_kit: { name: "Campfire kit", category: "equipment", icon: "F" },
		crafting_table: { name: "Crafting table", category: "equipment", icon: "T" },
		bucket_empty: { name: "Empty bucket", category: "equipment", icon: "U", art: "bucket_empty" },
		bucket_milk: { name: "Milk bucket", category: "food", icon: "M", heal: 2 },
		bucket_water: { name: "Water bucket", category: "equipment", icon: "W", art: "bucket_water" },
		cooking_pot: { name: "Cooking pot", category: "equipment", icon: "O", art: "cooking_pot_empty" },
		frying_pan: { name: "Frying pan", category: "equipment", icon: "A", art: "frying_pan_empty" },
		bowl: { name: "Wooden bowl", category: "equipment", icon: "D", art: "bowl_empty" },
	};
	const craftingRecipes = [
		{ id: "crafting_table", name: "Crafting table", ingredients: { wood: 5, stone: 2 } },
		{ id: "campfire_kit", name: "Campfire kit", ingredients: { wood: 3, stone: 2 } },
		{ id: "bucket_empty", name: "Empty bucket", ingredients: { wood: 3, stone: 1 } },
		{ id: "cooking_pot", name: "Cooking pot", ingredients: { stone: 3, wood: 1 } },
		{ id: "frying_pan", name: "Frying pan", ingredients: { stone: 2, wood: 2 } },
		{ id: "bowl", name: "Wooden bowl", ingredients: { wood: 1 } },
		{ id: "wooden_stick", name: "Three wooden sticks", ingredients: { wood: 1 }, amount: 3 },
	];
	const recipes = [
		{ id: "beef_cooked", name: "Cooked beef", ingredients: { beef_raw: 1 }, station: "open_fire_or_pan", seconds: 4 },
		{ id: "pork_cooked", name: "Cooked pork", ingredients: { pork_raw: 1 }, station: "open_fire_or_pan", seconds: 4 },
		{ id: "mutton_cooked", name: "Cooked mutton", ingredients: { mutton_raw: 1 }, station: "open_fire_or_pan", seconds: 4 },
		{ id: "rabbit_cooked", name: "Cooked rabbit", ingredients: { rabbit_raw: 1 }, station: "open_fire_or_pan", seconds: 4 },
		{ id: "cooked_steak", name: "Grilled steak", ingredients: { beef_raw: 1 }, station: "pan", seconds: 6 },
		{ id: "pork_chop", name: "Pork chop", ingredients: { pork_raw: 1 }, station: "pan", seconds: 6 },
		{ id: "steak_veggies", name: "Steak and vegetables", ingredients: { beef_raw: 1, carrot: 1, potato: 1 }, station: "pan", seconds: 8 },
		{ id: "roasted_pork", name: "Herb-roasted pork", ingredients: { pork_raw: 1, herb: 1 }, station: "pan", seconds: 8 },
		{ id: "lamb_stew", name: "Lamb stew", ingredients: { mutton_raw: 1, carrot: 1, potato: 1 }, station: "pot", seconds: 10, waterOptional: true },
		{ id: "meat_stew", name: "Meat stew", ingredients: { carrot: 1, potato: 1 }, anyMeat: 1, station: "pot", seconds: 10, waterOptional: true },
		{ id: "meat_skewers", name: "Meat skewers", ingredients: { wooden_stick: 1 }, anyMeat: 1, station: "fire", seconds: 6 },
		{ id: "meat_pie", name: "Meat pie", ingredients: { grain: 1, potato: 1 }, anyMeat: 1, station: "either", seconds: 12 },
		{ id: "rabbit_stew", name: "Rabbit stew", ingredients: { rabbit_raw: 1, carrot: 1, potato: 1 }, station: "pot", seconds: 9, waterOptional: true },
	];
	const meatTypes = ["beef_raw", "pork_raw", "mutton_raw", "rabbit_raw"];
	const hostileTypes = ["skeleton", "witch", "spider", "bat", "zombie"];
	const categories = ["food", "materials", "equipment", "other"];
	const campfires = [];
	const villages = [];
	const villagers = [];
	const craftingTables = [];
	const ponds = [];
	const hostileProjectiles = [];
	const resourceChunks = new Set();
	const villageChunks = new Set();
	const discoveredRecipes = new Set();
	const questProgress = { gathered: 0, campfire: 0, meal: 0, milk: 0, wolf: 0, jimothy: 0 };
	const completedSurvivalQuests = new Set();
	const craftingSlots = Array(16).fill("");
	const NIGHT_CYCLE_MS = 60000;
	const hostileChunks = new Set();
	let selectedCategory = "food";
	let selectedItem = "";
	let activeMode = "craft";
	let activeFireId = null;
	let lastRefresh = 0;
	let sickUntil = 0;
	let nextSicknessDamage = 0;
	let worldEpoch = 0;
	let currentNightIndex = -1;

	function label(id) {
		return itemInfo[id]?.name || id.replaceAll("_", " ");
	}

	function show(message) {
		showToast(message);
	}

	function updateWorldClock(now) {
		if (!worldEpoch) worldEpoch = now;
		const elapsed = Math.max(0, now - worldEpoch);
		const phase = (elapsed % NIGHT_CYCLE_MS) / NIGHT_CYCLE_MS;
		const isNight = phase >= 0.68 || phase < 0.16;
		const timeLabel = document.querySelector("#time-label");
		if (timeLabel) timeLabel.textContent = isNight ? "Night" : phase < 0.24 ? "Dawn" : phase < 0.5 ? "Morning" : phase < 0.68 ? "Evening" : "Night";
		const dayLabel = document.querySelector("#day-count");
		if (dayLabel) dayLabel.textContent = String(Math.floor(elapsed / NIGHT_CYCLE_MS) + 1);
		return { isNight, nightIndex: Math.floor(elapsed / NIGHT_CYCLE_MS) };
	}

	function recordQuest(id, amount = 1) {
		const goals = { gathered: 5, campfire: 1, meal: 1, milk: 1, wolf: 1, jimothy: 1 };
		if (!(id in goals) || completedSurvivalQuests.has(id)) return;
		questProgress[id] += amount;
		if (questProgress[id] >= goals[id]) {
			completedSurvivalQuests.add(id);
			player.coins += 1;
			show(`Survival task complete: ${questTitle(id)}. +1 coin.`);
			updateHud();
			saveGame();
		}
		refreshQuests();
	}

	function questTitle(id) {
		return { gathered: "Gather supplies", campfire: "Craft a campfire", meal: "Cook a meal", milk: "Milk a cow", wolf: "Tame a wolf", jimothy: "Meet Jimothy" }[id];
	}

	function refreshQuests() {
		const list = document.querySelector("#survival-quests");
		if (!list) return;
		list.innerHTML = Object.keys(questProgress).map((id) => {
			const goal = { gathered: 5, campfire: 1, meal: 1, milk: 1, wolf: 1, jimothy: 1 }[id];
			const completed = completedSurvivalQuests.has(id);
			return `<p class="survival-quest${completed ? " complete" : ""}"><span>${completed ? "✓" : "○"}</span><span>${questTitle(id)}</span><strong>${Math.min(questProgress[id], goal)}/${goal}</strong></p>`;
		}).join("");
	}

	function near(a, b, distance) {
		return Math.hypot(a.x - b.x, a.y - b.y) <= distance;
	}

	function meatCount(inventory = player.inventory) {
		return meatTypes.reduce((sum, id) => sum + (inventory[id] || 0), 0);
	}

	function missingIngredients(recipe) {
		const missing = [];
		for (const [id, count] of Object.entries(recipe.ingredients)) {
			const amount = player.inventory[id] || 0;
			if (amount < count) missing.push(`${label(id)} x${count - amount}`);
		}
		if (recipe.anyMeat && meatCount() < recipe.anyMeat) missing.push(`Any raw meat x${recipe.anyMeat - meatCount()}`);
		return missing;
	}

	function craftingGridCounts() {
		return craftingSlots.reduce((counts, id) => {
			if (id) counts[id] = (counts[id] || 0) + 1;
			return counts;
		}, {});
	}

	function craftingGridMatches(recipe) {
		const counts = craftingGridCounts();
		const required = recipe.ingredients;
		return Object.keys(counts).length === Object.keys(required).length &&
			Object.entries(required).every(([id, amount]) => counts[id] === amount);
	}

	function missingCraftIngredients(recipe) {
		const counts = craftingGridCounts();
		return Object.entries(recipe.ingredients)
			.filter(([id, amount]) => counts[id] !== amount)
			.map(([id, amount]) => `${label(id)} ${counts[id] || 0}/${amount}`);
	}

	function stationReady(recipe, fire) {
		if (recipe.station === "fire") return true;
		if (recipe.station === "open_fire_or_pan") return !fire.cookware || fire.cookware === "frying_pan";
		if (recipe.station === "pan") return fire.cookware === "frying_pan";
		if (recipe.station === "pot") return fire.cookware === "cooking_pot";
		return fire.cookware === "frying_pan" || fire.cookware === "cooking_pot";
	}

	function consumeRecipe(recipe) {
		for (const [id, count] of Object.entries(recipe.ingredients)) player.inventory[id] -= count;
		if (recipe.anyMeat) {
			const meat = meatTypes.find((id) => player.inventory[id] > 0);
			if (meat) player.inventory[meat] -= recipe.anyMeat;
		}
	}

	function addDrop(x, y, type, amount = 1) {
		pickups.push({ x, y, type, amount });
	}

	function startCook(recipeId, fire) {
		const recipe = recipes.find((entry) => entry.id === recipeId);
		if (!recipe || !fire || fire.cooking) return;
		if (missingIngredients(recipe).length) return show(`Missing ingredients: ${missingIngredients(recipe).join(", ")}.`);
		if (!stationReady(recipe, fire)) return show(`Place a ${recipe.station === "pan" ? "frying pan" : "cooking pot"} on this campfire first.`);
		consumeRecipe(recipe);
		if (recipe.waterOptional && player.inventory.bucket_water > 0) {
			player.inventory.bucket_water -= 1;
			player.inventory.bucket_empty = (player.inventory.bucket_empty || 0) + 1;
		}
		fire.cooking = { recipeId, startedAt: Date.now(), duration: recipe.seconds * 1000, ready: false, notified: false };
		discoveredRecipes.add(recipeId);
		updateHud();
		saveGame();
		refreshPanel();
	}

	function currentFire() {
		return campfires.find((fire) => fire.id === activeFireId);
	}

	function openPanel(mode, fire = null) {
		activeMode = mode;
		activeFireId = fire?.id ?? null;
		const dialog = document.querySelector("#survival-dialog");
		document.querySelector("#survival-title").textContent = mode === "cook" ? "Campfire cooking" : "Crafting bench";
		if (!dialog.open) dialog.showModal();
		refreshPanel();
	}

	function recipeRow(recipe, fire) {
		const isCrafting = activeMode === "craft";
		const counts = craftingGridCounts();
		const missing = isCrafting ? missingCraftIngredients(recipe) : missingIngredients(recipe);
		const stationOk = activeMode !== "cook" || stationReady(recipe, fire);
		const requirements = Object.entries(recipe.ingredients).map(([id, count]) => `${label(id)} ${isCrafting ? counts[id] || 0 : player.inventory[id] || 0}/${count}`);
		if (recipe.anyMeat) requirements.push(`Any raw meat ${meatCount()}/${recipe.anyMeat}`);
		if (recipe.waterOptional) requirements.push(`Water ${player.inventory.bucket_water || 0}/1 (optional)`);
		const unavailable = isCrafting ? !craftingGridMatches(recipe) : missing.length > 0 || !stationOk || Boolean(fire?.cooking);
		const action = activeMode === "cook" ? "cook" : "craft";
		return `<article class="recipe-row"><div><strong>${recipe.name}</strong><p>${requirements.join(" · ")}</p><small>${activeMode === "cook" ? `${recipe.seconds}s · ${recipe.station === "either" ? "Pot or pan" : recipe.station === "open_fire_or_pan" ? "Open fire or frying pan" : recipe.station === "fire" ? "Campfire" : recipe.station === "pan" ? "Frying pan" : "Cooking pot"}` : "Craft equipment"}</small>${missing.length ? `<small class="missing-items">Missing: ${missing.join(", ")}</small>` : ""}</div><button type="button" class="recipe-action" data-survival-action="${action}" data-recipe="${recipe.id}" ${unavailable ? "disabled" : ""}>${activeMode === "cook" ? "Start" : "Craft"}</button></article>`;
	}

	function renderCraftingWorkspace() {
		const workspace = document.querySelector("#crafting-workspace");
		workspace.hidden = activeMode !== "craft";
		if (workspace.hidden) return;
		const grid = document.querySelector("#crafting-grid");
		grid.innerHTML = craftingSlots.map((id, index) => {
			const icon = id && itemInfo[id]?.art && FernfallCooking.images[itemInfo[id].art]?.src
				? `<img class="item-texture" src="${FernfallCooking.images[itemInfo[id].art].src}" alt="">`
				: id ? `<span class="item-icon">${itemInfo[id]?.icon || id[0].toUpperCase()}</span>` : "";
			return `<button type="button" class="crafting-slot${id ? " filled" : ""}" data-craft-slot="${index}" aria-label="${id ? `Remove ${label(id)}` : `Empty slot ${index + 1}`}">${icon}</button>`;
		}).join("");
		const ingredients = new Set(craftingRecipes.flatMap((recipe) => Object.keys(recipe.ingredients)));
		const inventory = document.querySelector("#crafting-inventory");
		inventory.innerHTML = Object.entries(player.inventory).filter(([id, amount]) => amount > 0 && ingredients.has(id)).map(([id, amount]) => {
			const placed = craftingGridCounts()[id] || 0;
			const icon = itemInfo[id]?.art && FernfallCooking.images[itemInfo[id].art]?.src
				? `<img class="item-texture" src="${FernfallCooking.images[itemInfo[id].art].src}" alt="">`
				: `<span class="item-icon">${itemInfo[id]?.icon || id[0].toUpperCase()}</span>`;
			return `<button type="button" class="crafting-material" data-craft-item="${id}" ${placed >= amount ? "disabled" : ""}>${icon}<span>${label(id)}</span><span class="crafting-material-count">${amount - placed}</span></button>`;
		}).join("") || `<p class="inventory-empty">Gather wood and stone to craft.</p>`;
		const matched = craftingRecipes.find(craftingGridMatches);
		const output = document.querySelector("#crafting-output");
		const outputIcon = matched && itemInfo[matched.id]?.art && FernfallCooking.images[itemInfo[matched.id].art]?.src
			? `<img class="item-texture" src="${FernfallCooking.images[itemInfo[matched.id].art].src}" alt="">`
			: matched ? `<span class="item-icon">${itemInfo[matched.id]?.icon || matched.id[0].toUpperCase()}</span>` : "";
		output.innerHTML = `${outputIcon}${matched ? `<small>${label(matched.id)}</small>` : ""}`;
		output.disabled = !matched || Object.entries(matched.ingredients).some(([id, count]) => (player.inventory[id] || 0) < count);
		document.querySelector("#crafting-grid-status").textContent = matched ? `Ready to craft: ${matched.name}` : "Place the exact recipe ingredients in the grid.";
	}

	function refreshPanel() {
		const list = document.querySelector("#survival-list");
		if (!list) return;
		const fire = currentFire();
		if (activeMode === "craft") {
			renderCraftingWorkspace();
			list.innerHTML = `<p class="menu-intro">Fill the 4×4 grid with the exact recipe ingredients, then craft.</p>${craftingRecipes.map((recipe) => recipeRow(recipe, null)).join("")}`;
			return;
		}
		renderCraftingWorkspace();
		if (!fire) {
			list.innerHTML = "<p class=menu-intro>That campfire is no longer nearby.</p>";
			return;
		}
		let progress = "";
		if (fire.cooking) {
			const recipe = recipes.find((entry) => entry.id === fire.cooking.recipeId);
			const elapsed = Date.now() - fire.cooking.startedAt;
			const percent = Math.min(100, elapsed / fire.cooking.duration * 100);
			progress = `<section class="cooking-progress"><strong>${fire.cooking.ready ? `${label(fire.cooking.recipeId)} is ready` : `Cooking ${label(fire.cooking.recipeId)}`}</strong><div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div><small>${fire.cooking.ready ? "Press E beside the fire to collect." : `${Math.max(1, Math.ceil((fire.cooking.duration - elapsed) / 1000))} seconds remaining`}</small></section>`;
		}
		const cookwareText = fire.cookware ? `Equipped: ${label(fire.cookware)}` : "No pot or pan placed";
		const cookwareAction = fire.cookware && !fire.cooking ? `<button type="button" class="recipe-action" data-survival-action="remove-cookware">Remove ${label(fire.cookware)}</button>` : "";
		list.innerHTML = `<p class="menu-intro">${cookwareText}. Craft cookware and use it beside this fire to place it.</p>${cookwareAction}${progress}${recipes.map((recipe) => recipeRow(recipe, fire)).join("")}`;
	}

	function addCraftedItem(recipe) {
		if (!recipe || !craftingGridMatches(recipe)) return show("Place the exact recipe ingredients in the grid first.");
		if (Object.entries(recipe.ingredients).some(([id, count]) => (player.inventory[id] || 0) < count)) return show("You do not have enough materials.");
		for (const [id, count] of Object.entries(recipe.ingredients)) player.inventory[id] -= count;
		craftingSlots.fill("");
		player.inventory[recipe.id] = (player.inventory[recipe.id] || 0) + (recipe.amount || 1);
		if (recipe.id === "campfire_kit") recordQuest("campfire");
		show(`Crafted ${recipe.name}.`);
		updateHud();
		saveGame();
		refreshPanel();
		renderCraftingWorkspace();
	}

	function placeCampfire() {
		const distance = 52;
		const direction = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[player.direction];
		const x = player.x + direction[0] * distance;
		const y = player.y + direction[1] * distance;
		if (collides(x, y) || campfires.some((fire) => near(fire, { x, y }, 74))) return show("There is not enough clear space to build here.");
		campfires.push({ id: `fire-${Date.now()}-${campfires.length}`, x, y, cookware: "", cooking: null });
		player.inventory.campfire_kit -= 1;
		show("Campfire placed. Press E nearby to cook.");
		updateHud();
		saveGame();
	}

	function placeCraftingTable() {
		const offset = { up: [0, -48], down: [0, 48], left: [-48, 0], right: [48, 0] }[player.direction];
		const table = { x: player.x + offset[0], y: player.y + offset[1], village: false, id: `table-${Date.now()}-${craftingTables.length}` };
		if (collides(table.x, table.y) || craftingTables.some((entry) => near(entry, table, 42)) || campfires.some((fire) => near(fire, table, 50))) return show("There is no clear space for a crafting table.");
		craftingTables.push(table);
		player.inventory.crafting_table -= 1;
		show("Crafting table placed. Press E nearby to craft.");
		updateHud();
		saveGame();
	}

	function blocks(x, y) {
		for (const village of villages) {
			for (const house of village.houses) {
				const inside = Math.abs(x - house.x) < house.width / 2 + 5 && Math.abs(y - house.y) < house.height / 2 + 5;
				const doorway = Math.abs(x - house.x) < 11 && y > house.y + house.height / 2 - 18;
				if (inside && !doorway) return true;
			}
		}
		return craftingTables.some((table) => Math.abs(x - table.x) < 22 && Math.abs(y - table.y) < 17);
	}

	function useSelected() {
		const item = itemInfo[selectedItem];
		if (!item || !(player.inventory[selectedItem] > 0)) return;
		if (item.category === "food" || selectedItem === "bucket_milk" || selectedItem === "bucket_water") {
			const bucketItem = selectedItem === "bucket_milk" || selectedItem === "bucket_water";
			if (player.health >= MAX_HEALTH && !bucketItem) return show("You are already at full health.");
			if (item.raw && Math.random() < 0.25) {
				sickUntil = Date.now() + 7000;
				nextSicknessDamage = Date.now() + 2200;
			}
			const heal = item.raw ? 1 : item.heal || (selectedItem === "bucket_water" ? 1 : 2);
			player.health = Math.min(MAX_HEALTH, player.health + heal);
			player.inventory[selectedItem] -= 1;
			if (selectedItem === "bucket_milk" || selectedItem === "bucket_water") player.inventory.bucket_empty = (player.inventory.bucket_empty || 0) + 1;
			show(item.raw && sickUntil > Date.now() ? "Raw food helped a little, but you feel unwell." : `Ate ${item.name.toLowerCase()}.`);
		} else if (selectedItem === "campfire_kit") {
			placeCampfire();
			return;
		} else if (selectedItem === "crafting_table") {
			placeCraftingTable();
			return;
		} else if (selectedItem === "cooking_pot" || selectedItem === "frying_pan") {
			const fire = campfires.find((entry) => near(entry, player, 74));
			if (!fire) return show("Stand beside a campfire to place cookware.");
			if (fire.cooking) return show("Collect the cooking food before changing equipment.");
			fire.cookware = selectedItem;
			player.inventory[selectedItem] -= 1;
			show(`${item.name} placed on the campfire.`);
		} else if (selectedItem === "bucket_empty") {
			show("Empty bucket equipped. Press E beside a cow or pond.");
		}
		updateHud();
		saveGame();
	}

	function collectFire(fire) {
		if (!fire.cooking?.ready) return false;
		const recipeId = fire.cooking.recipeId;
		player.inventory[recipeId] = (player.inventory[recipeId] || 0) + 1;
		recordQuest("meal");
		fire.cooking = null;
		show(`${label(recipeId)} added to your pack.`);
		updateHud();
		saveGame();
		return true;
	}

	function interact() {
		const fire = campfires.find((entry) => near(entry, player, 68));
		if (fire) {
			if (collectFire(fire)) return true;
			openPanel("cook", fire);
			return true;
		}
		if (craftingTables.some((table) => near(table, player, 62))) {
			openPanel("craft");
			return true;
		}
		const villager = villagers.find((resident) => near(resident, player, 58));
		if (villager) {
			const dialogue = {
				mayor: "Welcome to our little forest village. Keep an eye out for nightfall.",
				shopkeeper: "Gather berries and herbs. They are always useful on the trail.",
				blacksmith: "Stone and wood make sturdy tools. Try the crafting table.",
				farmer: "Carrots, potatoes, and grain grow well near the village.",
				innkeeper: "A warm meal and a quiet night can restore your spirits.",
				healer: "Cooked meals are safer and more nourishing than raw food.",
			};
			show(dialogue[villager.role] || "Welcome to the village!");
			return true;
		}
		const jimothy = animals.find((animal) => animal.type === "jimothy" && near(animal, player, 58));
		if (jimothy) {
			jimothyMet = true;
			recordQuest("jimothy");
			animals.splice(animals.indexOf(jimothy), 1);
			if (player.inventory.berry > 0) {
				player.inventory.berry -= 1;
				addDrop(jimothy.x, jimothy.y, "berry_hand_pie");
				show("Jimothy shares a berry hand pie, then slips back into the woods.");
			} else show("Jimothy gives you a friendly wave and slips back into the woods. You met him only once.");
			saveGame();
			return true;
		}
		if (selectedItem === "bucket_empty" && player.inventory.bucket_empty > 0) {
			const cow = animals.find((animal) => animal.type === "cow" && near(animal, player, 58));
			if (cow) {
				if (cow.milkedUntil > Date.now()) show("This cow needs time before it can be milked again.");
				else {
					cow.milkedUntil = Date.now() + 45000;
					player.inventory.bucket_empty -= 1;
					player.inventory.bucket_milk = (player.inventory.bucket_milk || 0) + 1;
					recordQuest("milk");
					show("You filled the bucket with fresh milk.");
					updateHud();
					saveGame();
				}
				return true;
			}
			const pond = ponds.find((entry) => near(entry, player, 70));
			if (pond) {
				player.inventory.bucket_empty -= 1;
				player.inventory.bucket_water = (player.inventory.bucket_water || 0) + 1;
				show("You filled the bucket with water.");
				updateHud();
				saveGame();
				return true;
			}
		}
		const pickup = pickups.find((entry) => near(entry, player, 56));
		if (pickup) {
			pickups.splice(pickups.indexOf(pickup), 1);
			player.inventory[pickup.type] = (player.inventory[pickup.type] || 0) + (pickup.amount || 1);
			show(`Collected ${label(pickup.type)} x${pickup.amount || 1}.`);
			updateHud();
			saveGame();
			return true;
		}
		const resource = resources.find((entry) => entry.available && ["stone", "carrot", "potato", "mushroom", "grain", "herb"].includes(entry.type) && near(entry, player, 50));
		if (resource) {
			resource.available = false;
			resource.respawnAt = Date.now() + 30000;
			player.inventory[resource.type] = (player.inventory[resource.type] || 0) + 1;
			recordQuest("gathered");
			show(`Gathered ${label(resource.type)}.`);
			updateHud();
			saveGame();
			return true;
		}
		const tree = obstacles.find((entry) => !entry.chopped && near(entry, player, 56));
		if (tree) {
			tree.woodHits = (tree.woodHits || 0) + 1;
			player.inventory.wood = (player.inventory.wood || 0) + 1;
			recordQuest("gathered");
			if (tree.woodHits >= 3) tree.chopped = true;
			show(tree.chopped ? "Gathered wood. The tree is now a stump." : "Gathered wood from the tree.");
			updateHud();
			saveGame();
			return true;
		}
		return false;
	}

	function attackAnimal() {
		const animal = animals.find((entry) => entry.hp > 0 && !(entry.type === "wolf" && entry.tamed) && near(entry, player, 62) && (() => {
			const dx = entry.x - player.x;
			const dy = entry.y - player.y;
			return (player.direction === "up" ? -dy : player.direction === "down" ? dy : player.direction === "left" ? -dx : dx) > 2;
		})());
		if (!animal) return false;
		if (animal.type === "jimothy") {
			animal.happyUntil = performance.now() + 1800;
			show("Jimothy dodges away unharmed.");
			return true;
		}
		player.swing = 1;
		animal.hp -= 1;
		animal.hit = 10;
		animal.roamAngle = Math.atan2(animal.y - player.y, animal.x - player.x);
		if (animal.hp <= 0) {
			const drops = {
				cow: { beef_raw: 2 }, pig: { pork_raw: 2 }, sheep: { mutton_raw: 2, wool: 2 }, rabbit: { rabbit_raw: 1 },
			};
			for (const [type, amount] of Object.entries(drops[animal.type] || {})) addDrop(animal.x, animal.y, type, amount);
			animals.splice(animals.indexOf(animal), 1);
			show(animal.type === "wolf" ? "The wolf ran off. Wolves leave no food." : `${labelAnimal(animal.type)} left supplies behind.`);
		} else show(`${labelAnimal(animal.type)} is startled and runs away!`);
		updateHud();
		saveGame();
		return true;
	}

	function labelAnimal(type) {
		return type[0].toUpperCase() + type.slice(1);
	}

	function drawResource(resource) {
		if (resource.type === "stone") {
			const sprite = art.forest.rock_moss || art.forest.rock_small;
			if (drawArt(ctx, sprite, resource.x, resource.y, 36, 36)) return true;
			ctx.fillStyle = "#777e73";
			ctx.beginPath();
			ctx.ellipse(resource.x, resource.y, 13, 10, 0, 0, Math.PI * 2);
			ctx.fill();
			return true;
		}
		const colors = { carrot: "#df8b42", potato: "#b59a68", mushroom: "#bd6653", grain: "#d6b652", herb: "#62865b" };
		if (!colors[resource.type]) return false;
		ctx.fillStyle = "#49674655";
		ctx.beginPath();
		ctx.ellipse(resource.x, resource.y + 9, 12, 4, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = colors[resource.type];
		ctx.beginPath();
		ctx.ellipse(resource.x, resource.y, resource.type === "potato" ? 9 : 7, 9, -0.3, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = "#62865b";
		ctx.fillRect(resource.x - 1, resource.y - 14, 2, 8);
		if (resource.type === "carrot" || resource.type === "grain") {
			ctx.fillRect(resource.x - 5, resource.y - 12, 5, 2);
			ctx.fillRect(resource.x + 1, resource.y - 10, 5, 2);
		}
		return true;
	}

	function drawPonds() {
		for (const pond of ponds) {
			ctx.fillStyle = "#536d52";
			ctx.beginPath();
			ctx.ellipse(pond.x - camera.x, pond.y - camera.y, 45, 28, -0.2, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "#6eaaa1";
			ctx.beginPath();
			ctx.ellipse(pond.x - camera.x, pond.y - camera.y - 2, 39, 22, -0.2, 0, Math.PI * 2);
			ctx.fill();
		}
		drawVillages();
	}

	function drawVillages() {
		const settlementArt = window.fernfallSettlementArt;
		for (const village of villages) {
			for (const house of village.houses) {
				const x = house.x - camera.x;
				const y = house.y - camera.y;
				const image = settlementArt?.village_assets?.[house.asset];
				if (!drawArt(ctx, image, x, y, 132, 112)) {
					const left = x - house.width / 2;
					const top = y - house.height / 2;
					ctx.fillStyle = "#d5bd8a";
					ctx.fillRect(left, top + 8, house.width, house.height - 8);
					ctx.fillStyle = "#77544a";
					ctx.beginPath();
					ctx.moveTo(left - 6, top + 10);
					ctx.lineTo(x, top - 13);
					ctx.lineTo(left + house.width + 6, top + 10);
					ctx.closePath();
					ctx.fill();
				}
			}
		}
		for (const villager of villagers) {
			const image = settlementArt?.villagers?.[villager.role]?.[villager.direction];
			const y = villager.y - camera.y + Math.sin(performance.now() / 360 + villager.phase) * 1.5;
			if (!drawArt(ctx, image, villager.x - camera.x, y, 42, 48)) {
				ctx.fillStyle = "#49674655";
				ctx.beginPath();
				ctx.ellipse(villager.x - camera.x, y + 12, 12, 4, 0, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = "#7860a1";
				ctx.fillRect(villager.x - camera.x - 7, y - 9, 14, 18);
				ctx.fillStyle = "#edc0a3";
				ctx.beginPath();
				ctx.arc(villager.x - camera.x, y - 14, 7, 0, Math.PI * 2);
				ctx.fill();
			}
		}
	}

	function drawStations() {
		for (const fire of campfires) {
			const x = fire.x - 39;
			const y = fire.y - 39;
			if (!FernfallCooking.drawCampfire(ctx, x, y, performance.now(), 78, true)) {
				ctx.fillStyle = "#875938";
				ctx.fillRect(fire.x - 17, fire.y - 6, 34, 12);
				ctx.fillStyle = "#ef9b4b";
				ctx.beginPath();
				ctx.arc(fire.x, fire.y - 5, 9 + Math.sin(performance.now() / 120) * 2, 0, Math.PI * 2);
				ctx.fill();
			}
			if (fire.cookware) FernfallCooking.draw(ctx, fire.cooking ? `${fire.cookware}_food` : `${fire.cookware}_empty`, fire.x - 18, fire.y - 43, 36, 30);
			if (fire.cooking) {
				const progress = Math.min(1, (Date.now() - fire.cooking.startedAt) / fire.cooking.duration);
				ctx.fillStyle = "#30483b";
				ctx.fillRect(fire.x - 20, fire.y - 52, 40, 5);
				ctx.fillStyle = fire.cooking.ready ? "#92bd66" : "#e4bc57";
				ctx.fillRect(fire.x - 20, fire.y - 52, 40 * progress, 5);
			}
		}
		for (const table of craftingTables) {
			const tableImage = window.fernfallSettlementArt?.placeables?.crafting_table;
			if (drawArt(ctx, tableImage, table.x, table.y, 52, 48)) continue;
			const x = table.x - 20;
			const y = table.y - 12;
			ctx.fillStyle = "#62472f";
			ctx.fillRect(x + 4, y + 10, 5, 15);
			ctx.fillRect(x + 31, y + 10, 5, 15);
			ctx.fillStyle = "#9a7448";
			ctx.fillRect(x, y, 40, 13);
			ctx.strokeStyle = "#57402e";
			ctx.lineWidth = 2;
			ctx.strokeRect(x, y, 40, 13);
			ctx.strokeStyle = "#c2a16b";
			ctx.beginPath();
			ctx.moveTo(x + 13, y + 1);
			ctx.lineTo(x + 13, y + 11);
			ctx.moveTo(x + 26, y + 1);
			ctx.lineTo(x + 26, y + 11);
			ctx.stroke();
		}
	}

	function drawProjectiles() {
		for (const projectile of hostileProjectiles) {
			ctx.fillStyle = "#8d62c9";
			ctx.beginPath();
			ctx.arc(projectile.x, projectile.y, 7, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = "#d8b8ff";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(projectile.x, projectile.y, 10, 0, Math.PI * 2);
			ctx.stroke();
		}
	}

	function drawPickup(pickup) {
		const artKey = itemInfo[pickup.type]?.art || pickup.type;
		return FernfallCooking.draw(ctx, artKey, pickup.x - 14, pickup.y - 14, 28, 28);
	}

	function refreshInventory() {
		const tabs = document.querySelector("#inventory-tabs");
		if (!tabs) return;
		tabs.querySelectorAll("[data-inventory-category]").forEach((button) => {
			button.setAttribute("aria-pressed", String(button.dataset.inventoryCategory === selectedCategory));
		});
		const grid = document.querySelector("#inventory-grid");
		const entries = Object.entries(player.inventory).filter(([id, amount]) => amount > 0 && categories.includes(itemInfo[id]?.category || "other") && (itemInfo[id]?.category || "other") === selectedCategory);
		grid.innerHTML = entries.length ? entries.map(([id, amount]) => {
			const image = itemInfo[id]?.art ? FernfallCooking.images[itemInfo[id].art]?.src : "";
			const icon = image ? `<img class="item-texture" src="${image}" alt="">` : `<span class="item-icon">${itemInfo[id]?.icon || id.slice(0, 1).toUpperCase()}</span>`;
			return `<button type="button" class="item-slot filled${selectedItem === id ? " selected" : ""}" data-item-id="${id}" title="${label(id)}: ${amount}" aria-pressed="${selectedItem === id}">${icon}<span class="item-count">${amount}</span></button>`;
		}).join("") : `<p class="inventory-empty">No ${selectedCategory} items yet.</p>`;
		const useButton = document.querySelector("#use-selected-button");
		const hasSelected = selectedItem && (player.inventory[selectedItem] || 0) > 0;
		useButton.disabled = !hasSelected;
		useButton.textContent = selectedItem === "campfire_kit" ? "Place campfire" : selectedItem === "crafting_table" ? "Place crafting table" : ["cooking_pot", "frying_pan"].includes(selectedItem) ? "Place cookware" : itemInfo[selectedItem]?.category === "food" ? "Eat selected" : "Equip selected";
		const status = document.querySelector("#survival-status");
		if (status) status.textContent = selectedItem ? `Selected: ${label(selectedItem)} x${player.inventory[selectedItem] || 0}` : "Select an item to use or place it.";
	}

	function generateResourceChunks() {
		const centerX = Math.floor(player.x / WORLD_CHUNK_SIZE);
		const centerY = Math.floor(player.y / WORLD_CHUNK_SIZE);
		for (let cy = centerY - 1; cy <= centerY + 1; cy += 1) {
			for (let cx = centerX - 1; cx <= centerX + 1; cx += 1) {
				const key = `${cx},${cy}`;
				if (resourceChunks.has(key)) continue;
				resourceChunks.add(key);
				let seed = (Math.imul(cx, 374761393) ^ Math.imul(cy, 668265263)) >>> 0;
				const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
				const types = ["stone", "carrot", "potato", "berry", "mushroom", "grain", "herb"];
				for (let index = 0; index < 7; index += 1) {
					const resource = {
						x: cx * WORLD_CHUNK_SIZE + 32 + random() * (WORLD_CHUNK_SIZE - 64),
						y: cy * WORLD_CHUNK_SIZE + 32 + random() * (WORLD_CHUNK_SIZE - 64),
						type: types[Math.floor(random() * types.length)], available: true,
					};
					if (!collides(resource.x, resource.y) && Math.hypot(player.x - resource.x, player.y - resource.y) > 85) resources.push(resource);
				}
				if (random() < 0.22) ponds.push({ x: cx * WORLD_CHUNK_SIZE + 100 + random() * 300, y: cy * WORLD_CHUNK_SIZE + 100 + random() * 300 });
				generateVillage(random, cx, cy);
			}
		}
	}

	function generateVillage(random, chunkX, chunkY) {
		const key = `${chunkX},${chunkY}`;
		if (villageChunks.has(key)) return;
		villageChunks.add(key);
		if (random() > 0.7) return;
		const center = { x: chunkX * WORLD_CHUNK_SIZE + WORLD_CHUNK_SIZE / 2, y: chunkY * WORLD_CHUNK_SIZE + WORLD_CHUNK_SIZE / 2 };
		const layouts = [[-96, -72], [96, -72], [-96, 72], [96, 72], [0, -150]];
		const houseCount = 3 + Math.floor(random() * 3);
		const houses = [];
		const roles = [{ role: "mayor", asset: "town_hall" }, { role: "shopkeeper", asset: "general_store" }, { role: "blacksmith", asset: "blacksmith_building" }, { role: "farmer", asset: "farmer_cottage" }, { role: "innkeeper", asset: "inn" }, { role: "healer", asset: "healer_house" }];
		for (const [offsetX, offsetY] of layouts) {
			if (houses.length >= houseCount) break;
			const role = roles[houses.length];
			const house = { x: center.x + offsetX, y: center.y + offsetY, width: 88, height: 76, doorSide: "center", role: role.role, asset: role.asset };
			if (collides(house.x, house.y) || houses.some((other) => Math.abs(other.x - house.x) < 96 && Math.abs(other.y - house.y) < 84)) continue;
			houses.push(house);
			villagers.push({ id: `${key}-${role.role}`, role: role.role, x: house.x, y: house.y + house.height / 2 + 20, direction: "down", phase: random() * 6, villageId: key });
		}
		if (houses.length < 3) return;
		villages.push({ id: `village-${key}`, ...center, houses });
		craftingTables.push({ id: `village-table-${key}`, x: center.x, y: center.y + 8, village: true });
	}

	function generateVillageChunks() {
		const centerX = Math.floor(player.x / WORLD_CHUNK_SIZE);
		const centerY = Math.floor(player.y / WORLD_CHUNK_SIZE);
		for (let cy = centerY - 1; cy <= centerY + 1; cy += 1) {
			for (let cx = centerX - 1; cx <= centerX + 1; cx += 1) {
				if (villageChunks.has(`${cx},${cy}`)) continue;
				let seed = (Math.imul(cx, 374761393) ^ Math.imul(cy, 668265263) ^ 1103515245) >>> 0;
				const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
				generateVillage(random, cx, cy);
			}
		}
	}

	function generateHostileChunks(nightIndex) {
		const centerX = Math.floor(player.x / WORLD_CHUNK_SIZE);
		const centerY = Math.floor(player.y / WORLD_CHUNK_SIZE);
		for (let cy = centerY - 1; cy <= centerY + 1; cy += 1) {
			for (let cx = centerX - 1; cx <= centerX + 1; cx += 1) {
				const key = `${nightIndex}:${cx},${cy}`;
				if (hostileChunks.has(key)) continue;
				hostileChunks.add(key);
				let seed = (Math.imul(cx, 374761393) ^ Math.imul(cy, 668265263) ^ Math.imul(nightIndex + 1, 2246822519)) >>> 0;
				const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
				if (random() > 0.62) continue;
				const roll = random();
				const type = roll < 0.12 ? "witch" : roll < 0.33 ? "spider" : roll < 0.48 ? "bat" : roll < 0.7 ? "skeleton" : roll < 0.82 ? "zombie" : "slime";
				const position = {
					x: cx * WORLD_CHUNK_SIZE + 70 + random() * (WORLD_CHUNK_SIZE - 140),
					y: cy * WORLD_CHUNK_SIZE + 70 + random() * (WORLD_CHUNK_SIZE - 140),
				};
				if (collides(position.x, position.y) || Math.hypot(player.x - position.x, player.y - position.y) < 120) continue;
				const hp = type === "witch" ? 5 : type === "zombie" ? 4 : type === "bat" || type === "slime" ? 2 : 3;
				mobs.push({ ...position, type, hp, maxHp: hp, alive: true, phase: random() * 6, hit: 0, lastSpell: 0 });
			}
		}
	}

	function update() {
		generateVillageChunks();
		generateResourceChunks();
		const now = Date.now();
		const { isNight, nightIndex } = updateWorldClock(now);
		if (isNight && nightIndex !== currentNightIndex) currentNightIndex = nightIndex;
		if (isNight) generateHostileChunks(nightIndex);
		for (const animal of animals) {
			const health = { cow: 4, pig: 3, sheep: 3, rabbit: 2, wolf: 5, jimothy: 3 }[animal.type] || 3;
			animal.maxHp ??= health;
			animal.hp ??= animal.maxHp;
			if (animal.hit > 0) animal.hit -= 1;
			if (animal.type === "rabbit" && near(animal, player, 138)) {
				animal.roamAngle = Math.atan2(animal.y - player.y, animal.x - player.x);
				animal.turnTimer = Math.min(animal.turnTimer || 1, 1);
			}
			if (animal.type === "wolf" && animal.tamed && now - (animal.lastBite || 0) > 1000) {
				const target = mobs.find((mob) => mob.alive && near(mob, animal, 72));
				if (target) {
					animal.lastBite = now;
					target.hp -= 1;
					target.hit = 8;
					if (target.hp <= 0) {
						target.alive = false;
						player.coins += 1;
						player.xp += 1;
						if (!hostileTypes.includes(target.type)) addDrop(target.x, target.y, "gel");
						show(`Your wolf helped defeat a ${target.type || "slime"}!`);
						checkQuest();
						updateHud();
						saveGame();
					}
				}
			}
		}
		for (const enemy of mobs) {
			if (!enemy.alive || enemy.type !== "witch") continue;
			const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
			if (distance < 320 && distance > 36 && now - (enemy.lastSpell || 0) > 2400) {
				enemy.lastSpell = now;
				const speed = 3.2;
				hostileProjectiles.push({ x: enemy.x, y: enemy.y - 12, vx: (player.x - enemy.x) / distance * speed, vy: (player.y - enemy.y) / distance * speed, expiresAt: now + 2400 });
			}
		}
		for (let index = hostileProjectiles.length - 1; index >= 0; index -= 1) {
			const projectile = hostileProjectiles[index];
			projectile.x += projectile.vx;
			projectile.y += projectile.vy;
			if (near(projectile, player, 18)) {
				hostileProjectiles.splice(index, 1);
				player.health = Math.max(0, player.health - 1);
				player.hurt = 14;
				show("A witch's spell struck you!");
				if (player.health === 0) {
					player.health = MAX_HEALTH;
					player.x = 478;
					player.y = 322;
					show("A friendly nap. Back to the trail!");
				}
				updateHud();
			} else if (projectile.expiresAt <= now) hostileProjectiles.splice(index, 1);
		}
		for (const resource of resources) {
			if (!resource.available && resource.respawnAt && resource.respawnAt <= now) {
				resource.available = true;
				resource.respawnAt = 0;
			}
		}
		if (sickUntil && now >= sickUntil) {
			sickUntil = 0;
			nextSicknessDamage = 0;
			show("You are feeling better.");
		} else if (sickUntil && now >= nextSicknessDamage) {
			player.health = Math.max(1, player.health - 1);
			nextSicknessDamage = now + 2500;
			updateHud();
		}
		for (const fire of campfires) {
			if (fire.cooking && !fire.cooking.ready && now - fire.cooking.startedAt >= fire.cooking.duration) {
				fire.cooking.ready = true;
				show(`${label(fire.cooking.recipeId)} is ready to collect.`);
				saveGame();
			}
		}
		if (document.querySelector("#survival-dialog")?.open && now - lastRefresh > 250) {
			lastRefresh = now;
			refreshPanel();
		}
	}

	function setup(state) {
		Object.assign(itemInfo, itemDefinitions);
		for (const id of Object.keys(itemDefinitions)) player.inventory[id] ??= 0;
		restore(state);
		if (!worldEpoch) {
			worldEpoch = Date.now();
			mobs.splice(0, mobs.length, ...mobs.filter((mob) => !hostileTypes.includes(mob.type)));
		}
		document.querySelectorAll("[data-inventory-category]").forEach((button) => button.addEventListener("click", () => {
			selectedCategory = button.dataset.inventoryCategory;
			refreshInventory();
		}));
		document.querySelector("#inventory-grid").addEventListener("click", (event) => {
			const button = event.target.closest("[data-item-id]");
			if (!button) return;
			selectedItem = button.dataset.itemId;
			refreshInventory();
		}));
		document.querySelector("#crafting-inventory").addEventListener("click", (event) => {
			const button = event.target.closest("[data-craft-item]");
			if (!button || button.disabled) return;
			const slot = craftingSlots.findIndex((id) => !id);
			if (slot < 0) return show("The crafting grid is full.");
			craftingSlots[slot] = button.dataset.craftItem;
			refreshPanel();
		});
		document.querySelector("#crafting-grid").addEventListener("click", (event) => {
			const button = event.target.closest("[data-craft-slot]");
			if (!button) return;
			craftingSlots[Number(button.dataset.craftSlot)] = "";
			refreshPanel();
		});
		document.querySelector("#crafting-output").addEventListener("click", () => {
			const recipe = craftingRecipes.find(craftingGridMatches);
			if (recipe) addCraftedItem(recipe);
		});
		document.querySelector("#use-selected-button").addEventListener("click", useSelected);
		document.querySelector("#craft-menu-button").addEventListener("click", () => openPanel("craft"));
		document.querySelector("#survival-close").addEventListener("click", () => document.querySelector("#survival-dialog").close());
		document.addEventListener("keydown", (event) => {
			if (event.key === "Tab" && !event.repeat && !document.querySelector("#survival-dialog").open) {
				event.preventDefault();
				openPanel("craft");
			}
		});
		document.querySelector("#survival-list").addEventListener("click", (event) => {
			const button = event.target.closest("[data-survival-action]");
			if (!button || button.disabled) return;
			if (button.dataset.survivalAction === "craft") addCraftedItem(craftingRecipes.find((entry) => entry.id === button.dataset.recipe));
			if (button.dataset.survivalAction === "cook") startCook(button.dataset.recipe, currentFire());
			if (button.dataset.survivalAction === "remove-cookware") {
				const fire = currentFire();
				if (!fire?.cookware || fire.cooking) return;
				player.inventory[fire.cookware] = (player.inventory[fire.cookware] || 0) + 1;
				fire.cookware = "";
				updateHud();
				saveGame();
				refreshPanel();
			}
		});
		refreshInventory();
		refreshQuests();
	}

	function restore(state) {
		if (!state) return;
		if (Array.isArray(state.inventory)) player.inventory = Object.fromEntries(state.inventory);
		else if (state.inventory && typeof state.inventory === "object") player.inventory = state.inventory;
		if (Array.isArray(state.resources)) resources.splice(0, resources.length, ...state.resources);
		if (Array.isArray(state.animals)) animals.splice(0, animals.length, ...state.animals);
		else if (state.jimothyMet) {
			const jimothyIndex = animals.findIndex((animal) => animal.type === "jimothy");
			if (jimothyIndex >= 0) animals.splice(jimothyIndex, 1);
		}
		if (Array.isArray(state.mobs)) mobs.splice(0, mobs.length, ...state.mobs);
		if (Array.isArray(state.pickups)) pickups.splice(0, pickups.length, ...state.pickups);
		if (Array.isArray(state.obstacles)) {
			obstacles.splice(0, obstacles.length, ...state.obstacles);
			obstacleChunks.clear();
			obstacles.forEach(indexObstacle);
		}
		if (Array.isArray(state.generatedChunks)) {
			generatedChunks.clear();
			state.generatedChunks.forEach((key) => generatedChunks.add(key));
		}
		campfires.splice(0, campfires.length, ...(state.campfires || []));
		villages.splice(0, villages.length, ...(state.villages || []));
		villagers.splice(0, villagers.length, ...(state.villagers || []));
		craftingTables.splice(0, craftingTables.length, ...(state.craftingTables || []));
		ponds.splice(0, ponds.length, ...(state.ponds || []));
		hostileProjectiles.splice(0, hostileProjectiles.length, ...(state.hostileProjectiles || []));
		(state.resourceChunks || []).forEach((key) => resourceChunks.add(key));
		(state.villageChunks || []).forEach((key) => villageChunks.add(key));
		(state.discoveredRecipes || []).forEach((key) => discoveredRecipes.add(key));
		jimothyMet = state.jimothyMet ?? jimothyMet;
		worldEpoch = state.worldEpoch || 0;
		(state.hostileChunks || []).forEach((key) => hostileChunks.add(key));
		Object.assign(questProgress, state.questProgress || {});
		(state.completedSurvivalQuests || []).forEach((id) => completedSurvivalQuests.add(id));
		selectedItem = state.selectedItem || "";
		if (Array.isArray(state.craftingSlots) && state.craftingSlots.length === 16) craftingSlots.splice(0, 16, ...state.craftingSlots);
	}

	function save() {
		return {
			inventory: player.inventory, resources, animals, mobs, pickups, obstacles,
			generatedChunks: [...generatedChunks], resourceChunks: [...resourceChunks], villageChunks: [...villageChunks],
			villages, villagers, craftingTables, ponds, campfires, hostileProjectiles, craftingSlots,
			discoveredRecipes: [...discoveredRecipes], jimothyMet, selectedItem, questProgress,
			completedSurvivalQuests: [...completedSurvivalQuests], worldEpoch,
			hostileChunks: [...hostileChunks],
		};
	}

	return {
		setup, update, interact, attackAnimal, blocks, drawResource, drawPonds, drawStations, drawProjectiles, drawPickup,
		refreshInventory, openCrafting: () => openPanel("craft"), recordQuest, save,
	};
})();
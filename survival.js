const FernfallSurvival = (() => {
	const itemDefinitions = {
		berry: { name: "Wild berry", category: "food", icon: "●", heal: 1 },
		wood: { name: "Softwood", category: "materials", icon: "▰" },
		gel: { name: "Slime gel", category: "other", icon: "●" },
		tonic: { name: "Health potion", category: "food", icon: "♧", heal: 3 },
		seed: { name: "Acorn", category: "materials", icon: "✿" },
		coal: { name: "Coal", category: "materials", icon: "●" },
		coal: { name: "Coal", category: "materials", icon: "C" },
		stone: { name: "Stone", category: "materials", icon: "S" }, carrot: { name: "Carrot", category: "food", icon: "C", heal: 1 },
		furnace: { name: "Furnace", category: "equipment", icon: "♨" },
		potato: { name: "Potato", category: "food", icon: "P", heal: 1 }, mushroom: { name: "Forest mushroom", category: "food", icon: "M", heal: 1 },
		grain: { name: "Grain", category: "materials", icon: "G" }, herb: { name: "Forest herbs", category: "food", icon: "H", heal: 1 },
		beef_raw: { name: "Raw beef", category: "food", icon: "B", raw: true, art: "beef_raw" },
		pork_raw: { name: "Raw pork", category: "food", icon: "P", raw: true, art: "pork_raw" },
		mutton_raw: { name: "Raw mutton", category: "food", icon: "M", raw: true, art: "mutton_raw" },
		rabbit_raw: { name: "Raw rabbit", category: "food", icon: "R", raw: true, art: "rabbit_raw" },
		wool: { name: "Wool", category: "materials", icon: "W" }, wooden_stick: { name: "Wooden stick", category: "materials", icon: "|" },
		beef_cooked: { name: "Cooked beef", category: "food", icon: "B", heal: 3, art: "beef_cooked" },
		pork_cooked: { name: "Cooked pork", category: "food", icon: "P", heal: 3, art: "pork_cooked" },
		mutton_cooked: { name: "Cooked mutton", category: "food", icon: "M", heal: 3, art: "mutton_cooked" },
		rabbit_cooked: { name: "Cooked rabbit", category: "food", icon: "R", heal: 3, art: "rabbit_cooked" },
		cooked_steak: { name: "Grilled steak", category: "food", icon: "S", heal: 4, art: "cooked_steak" },
		steak_veggies: { name: "Steak and vegetables", category: "food", icon: "V", heal: 5, art: "steak_veggies" },
		pork_chop: { name: "Pan-seared pork chop", category: "food", icon: "P", heal: 4, art: "pork_chop" },
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
		bed: { name: "Bed", category: "equipment", icon: "B" },
	};
	const craftingRecipes = [
		{ id: "crafting_table", name: "Crafting table", ingredients: { wood: 4 }, pattern: ["wood", "wood", "", "wood", "wood", "", "", "", ""] },
		{ id: "campfire_kit", name: "Campfire kit", ingredients: { wood: 3, stone: 2 }, pattern: ["", "stone", "", "wood", "wood", "wood", "", "stone", ""] },
		{ id: "bucket_empty", name: "Empty bucket", ingredients: { wood: 3, stone: 1 }, pattern: ["wood", "", "wood", "", "stone", "", "", "wood", ""] },
		{ id: "cooking_pot", name: "Cooking pot", ingredients: { stone: 3, wood: 1 }, pattern: ["stone", "stone", "stone", "", "wood", "", "", "", ""] },
		{ id: "frying_pan", name: "Frying pan", ingredients: { stone: 2, wood: 2 }, pattern: ["stone", "stone", "", "", "wood", "", "", "wood", ""] },
		{ id: "bowl", name: "Wooden bowl", ingredients: { wood: 3 }, pattern: ["wood", "", "wood", "", "wood", "", "", "", ""] },
		{ id: "wooden_stick", name: "Three wooden sticks", ingredients: { wood: 2 }, pattern: ["wood", "", "", "wood", "", "", "", "", ""], amount: 3 },
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
	const furnaceRecipeIds = new Set(["beef_cooked", "pork_cooked", "mutton_cooked", "rabbit_cooked"]);
	const furnaceFuelMs = { coal: 32000, wood: 12000, wooden_stick: 2000 };
	const meatTypes = ["beef_raw", "pork_raw", "mutton_raw", "rabbit_raw"];
	const hostileTypes = ["skeleton", "witch", "spider", "bat", "zombie"];
	const categories = ["food", "materials", "equipment", "other"];
	const inventoryIconKeys = {
		berry: "berries", wood: "wood", stone: "stone", carrot: "carrot", potato: "potato", mushroom: "mushroom", grain: "grain", herb: "herbs",
		beef_raw: "beef_raw", pork_raw: "pork_raw", mutton_raw: "mutton_raw", rabbit_raw: "rabbit_raw", wool: "wool", wooden_stick: "stick",
		seed: "seed", gel: "slime_gel", tonic: "item_potion",
		beef_cooked: "beef_cooked", pork_cooked: "pork_cooked", mutton_cooked: "mutton_cooked", rabbit_cooked: "rabbit_cooked",
		cooked_steak: "cooked_steak", steak_veggies: "steak_veggies", pork_chop: "pork_chop", roasted_pork: "roasted_pork",
		lamb_stew: "lamb_stew", meat_stew: "meat_stew", rabbit_stew: "rabbit_stew", berry_hand_pie: "berry_hand_pie",
		campfire_kit: "campfire_0", bucket_empty: "bucket_empty", bucket_milk: "bucket_milk", bucket_water: "bucket_water",
		cooking_pot: "cooking_pot_empty", frying_pan: "frying_pan_empty", bowl: "bowl_empty",
	};
	const resourcePlantArt = {
		berry: "world_berries_plant", carrot: "world_carrot_plant", potato: "world_potato_plant",
		mushroom: "world_mushroom_plant", grain: "world_grain_plant", herb: "world_herbs_plant",
	};
	const campfires = [];
	const packArtCache = new Map();
	const villages = [];
	const villageSpriteCache = new WeakMap();
	const villagers = [];
	const craftingTables = [];
	const ponds = [];
	const hostileProjectiles = [];
	const resourceChunks = new Set();
	const villageChunks = new Set();
	const discoveredRecipes = new Set();
	const questProgress = { gathered: 0, campfire: 0, meal: 0, milk: 0, wolf: 0, jimothy: 0 };
	const completedSurvivalQuests = new Set();
	const villagerQuestDefinitions = {
		mayor: { title: "Stock the village pantry", description: "Gather five supplies for the village pantry.", greeting: "Our pantry is running low. Could you gather supplies for everyone?", event: "gathered", goal: 5, reward: 3 },
		shopkeeper: { title: "Gather wild berries", description: "Gather three wild berries for the shop.", greeting: "Wild berries sell quickly. Could you bring me three?", event: "berry", goal: 3, reward: 3 },
		blacksmith: { title: "Gather softwood", description: "Gather four pieces of softwood for the forge.", greeting: "I need good softwood for a new tool handle. Can you gather four pieces?", event: "wood", goal: 4, reward: 4 },
		farmer: { title: "Help with the harvest", description: "Gather four crops from the forest edge.", greeting: "The harvest could use a hand. Bring back four crops, please.", event: "crop", goal: 4, reward: 3 },
		innkeeper: { title: "Cook a warm meal", description: "Cook one meal at a campfire.", greeting: "A warm meal lifts everyone's spirits. Could you cook one for the inn?", event: "meal", goal: 1, reward: 4 },
		healer: { title: "Make a friend", description: "Tame a wolf with a wild berry.", greeting: "A wolf has been wandering nearby. A berry may help you earn its trust.", event: "wolf", goal: 1, reward: 5 },
	};
	const villagerQuestStates = {};
	const craftingSlots = Array(9).fill("");
	const NIGHT_CYCLE_MS = 240000;
	const hostileChunks = new Set();
	let selectedCategory = "food";
	let selectedItem = "";
	let activeMode = "craft";
	let activeVillagerRole = "";
	let activeFireId = null;
	let lastRefresh = 0;
	let sickUntil = 0;
	let nextSicknessDamage = 0;
	let worldEpoch = 0;
	let currentNightIndex = -1;
	let bed = null;
	let bedSpawned = false;
	let spawnPoint = null;
	const HOUSE_WIDTH = 216;
	const HOUSE_HEIGHT = 186;

	function label(id) {
		return itemInfo[id]?.name || id.replaceAll("_", " ");
	}

	function inventoryImageSource(id) {
		const survivalKey = inventoryIconKeys[id];
		const survivalImages = typeof fernfallSurvival === "undefined" ? null : fernfallSurvival;
		const survivalImage = survivalKey && survivalImages?.[`inventory_64_${survivalKey}`];
		if (survivalImage?.src) return survivalImage.src;
		const cookingImage = FernfallCooking.images[itemInfo[id]?.art || id];
		if (cookingImage?.src) return cookingImage.src;
		const packImage = window.FERNFALL_ITEM_IMAGES?.[survivalKey || id];
		if (packImage) return packImage;
		if (id === "crafting_table") return window.fernfallSettlementArt?.placeables?.crafting_table?.src || "";
		if (id === "gel") return art.slime.green_idle1?.src || "";
		if (id === "tonic") return art.item.potion?.src || "";
		return "";
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
		recordVillagerQuestProgress(id, amount);
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

	function villagerQuestState(role) {
		const quest = villagerQuestDefinitions[role];
		if (!quest) return null;
		return (villagerQuestStates[role] ??= { accepted: false, progress: 0, claimed: false });
	}

	function refreshVillageQuestBoard() {
		const section = document.querySelector("#village-quest-section");
		const list = document.querySelector("#village-quest-list");
		if (!section || !list) return;
		const activeQuests = Object.entries(villagerQuestDefinitions).filter(([role]) => {
			const state = villagerQuestStates[role];
			return state?.accepted && !state.claimed;
		});
		section.hidden = activeQuests.length === 0;
		list.innerHTML = activeQuests.map(([role, quest]) => {
			const state = villagerQuestStates[role];
			const ready = state.progress >= quest.goal;
			return `<p class="survival-quest${ready ? " complete" : ""}"><span>${ready ? "✓" : "○"}</span><span>${quest.title}</span><strong>${Math.min(state.progress, quest.goal)}/${quest.goal}</strong></p>`;
		}).join("");
	}

	function recordVillagerQuestProgress(event, amount = 1) {
		if (["carrot", "potato", "grain"].includes(event)) event = "crop";
		let changed = false;
		for (const [role, quest] of Object.entries(villagerQuestDefinitions)) {
			const state = villagerQuestStates[role];
			if (!state?.accepted || state.claimed || quest.event !== event) continue;
			const previousProgress = state.progress || 0;
			state.progress = Math.min(quest.goal, previousProgress + amount);
			if (state.progress !== previousProgress) changed = true;
			if (previousProgress < quest.goal && state.progress >= quest.goal) show(`${quest.title} is ready to turn in.`);
		}
		if (!changed) return;
		refreshVillageQuestBoard();
		saveGame();
	}

	function refreshVillagerDialogue() {
		const role = activeVillagerRole;
		const quest = villagerQuestDefinitions[role];
		const state = villagerQuestState(role);
		if (!quest || !state) return;
		const roleName = role[0].toUpperCase() + role.slice(1);
		const ready = state.accepted && !state.claimed && state.progress >= quest.goal;
		document.querySelector("#villager-dialog-name").textContent = roleName;
		document.querySelector("#villager-greeting").textContent = quest.greeting;
		document.querySelector("#villager-quest-title").textContent = quest.title;
		document.querySelector("#villager-quest-description").textContent = quest.description;
		const status = document.querySelector("#villager-quest-status");
		const action = document.querySelector("#villager-quest-action");
		if (state.claimed) {
			status.textContent = "Quest complete. Thank you for helping the village.";
			action.textContent = "Completed";
			action.disabled = true;
		} else if (ready) {
			status.textContent = `Complete: ${quest.goal}/${quest.goal}. Return your report for ${quest.reward} coins.`;
			action.textContent = `Claim ${quest.reward} coins`;
			action.disabled = false;
		} else if (state.accepted) {
			status.textContent = `In progress: ${Math.min(state.progress, quest.goal)}/${quest.goal}. Reward: ${quest.reward} coins.`;
			action.textContent = "Quest accepted";
			action.disabled = true;
		} else {
			status.textContent = `Reward: ${quest.reward} coins.`;
			action.textContent = "Accept quest";
			action.disabled = false;
		}
	}

	function openVillagerDialogue(villager) {
		if (!villagerQuestDefinitions[villager.role]) {
			show("The villager smiles and waves.");
			return;
		}
		activeVillagerRole = villager.role;
		refreshVillagerDialogue();
		const dialog = document.querySelector("#villager-dialog");
		if (!dialog.open) dialog.showModal();
	}

	function handleVillagerQuestAction() {
		const quest = villagerQuestDefinitions[activeVillagerRole];
		const state = villagerQuestState(activeVillagerRole);
		if (!quest || !state || state.claimed) return;
		if (!state.accepted) {
			state.accepted = true;
			show(`Quest accepted: ${quest.title}.`);
		} else if (state.progress >= quest.goal) {
			state.claimed = true;
			player.coins += quest.reward;
			show(`Quest complete: +${quest.reward} coins.`);
			updateHud();
		}
		refreshVillagerDialogue();
		refreshVillageQuestBoard();
		saveGame();
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
		for (const mirrored of [false, true]) {
			for (let offsetY = 0; offsetY < 3; offsetY += 1) {
				for (let offsetX = 0; offsetX < 3; offsetX += 1) {
					const pattern = Array(9).fill("");
					let fits = true;
					recipe.pattern.forEach((item, index) => {
						if (!item) return;
						const sourceX = mirrored ? 2 - index % 3 : index % 3;
						const x = sourceX + offsetX;
						const y = Math.floor(index / 3) + offsetY;
						if (x > 2 || y > 2) {
							fits = false;
						return;
						}
						pattern[y * 3 + x] = item;
					});
					if (fits && pattern.every((item, index) => item === craftingSlots[index])) return true;
				}
			}
		}
		return false;
	}

	function recipeHasIngredients(recipe) {
		return Object.entries(recipe.ingredients).every(([id, count]) => (player.inventory[id] || 0) >= count);
	}

	function selectQuickCraftRecipe(recipeId) {
		const recipe = craftingRecipes.find((entry) => entry.id === recipeId);
		if (!recipe || !recipeHasIngredients(recipe)) return;
		craftingSlots.splice(0, craftingSlots.length, ...recipe.pattern);
		refreshPanel();
	}

	function missingCraftIngredients(recipe) {
		const counts = craftingGridCounts();
		return Object.entries(recipe.ingredients)
			.filter(([id, amount]) => counts[id] !== amount)
			.map(([id, amount]) => `${label(id)} ${counts[id] || 0}/${amount}`);
	}

	function stationReady(recipe, fire) {
		const multiPart = Object.keys(recipe.ingredients || {}).length > 1;
		if (recipe.id === "meat_skewers") return true;
		if (recipe.station === "fire" && !multiPart) return true;
		if (multiPart) {
			if (recipe.station === "pot" || /stew|soup/.test(recipe.id)) return fire.cookware === "cooking_pot";
			if (recipe.station === "pan" || /pie|steak_veggies|vegetables/.test(recipe.id)) return fire.cookware === "frying_pan";
			return fire.cookware === "frying_pan" || fire.cookware === "cooking_pot";
		}
		if (recipe.station === "open_fire_or_pan") {
			return !fire.cookware || fire.cookware === "frying_pan" || fire.cookware === "cooking_pot";
		}
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
		if (!stationReady(recipe, fire)) {
			const multiPart = Object.keys(recipe.ingredients || {}).length > 1;
			const cookware = recipe.station === "pot" || (multiPart && /stew|soup/.test(recipe.id))
				? "a cooking pot"
				: recipe.station === "pan" || (multiPart && /pie|steak_veggies|vegetables/.test(recipe.id))
					? "a frying pan"
					: "a frying pan or cooking pot";
			return show(`Place ${cookware} on this campfire first.`);
		}
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

	function addFurnaceFuel(fire, fuelId) {
		const burnMs = furnaceFuelMs[fuelId];
		if (!fire || fire.kind !== "furnace" || !burnMs || !(player.inventory[fuelId] > 0)) return false;
		if ((fire.furnaceFuelMs || 0) >= 120000) return show("The furnace is already full of fuel."), false;
		player.inventory[fuelId] -= 1;
		fire.furnaceFuelMs = Math.min(120000, (fire.furnaceFuelMs || 0) + burnMs);
		fire.furnaceFuelType = fuelId;
		show(`${label(fuelId)} added to the furnace.`);
		updateHud();
		saveGame();
		refreshPanel();
		return true;
	}

	function startFurnaceCook(recipeId, fire) {
		const recipe = recipes.find((entry) => entry.id === recipeId && furnaceRecipeIds.has(entry.id));
		if (!recipe || !fire || fire.kind !== "furnace" || fire.cooking) return false;
		const [inputId, inputCount] = Object.entries(recipe.ingredients)[0] || [];
		if (!inputId || (player.inventory[inputId] || 0) < inputCount) return show(`You need ${label(inputId || "raw meat")} to smelt this.`), false;
		const duration = recipe.seconds * 1000;
		if ((fire.furnaceFuelMs || 0) < duration) return show("Add more furnace fuel before smelting."), false;
		player.inventory[inputId] -= inputCount;
		fire.furnaceFuelMs -= duration;
		if (fire.furnaceFuelMs <= 0) fire.furnaceFuelType = "";
		fire.cooking = { recipeId: recipe.id, inputId, startedAt: Date.now(), duration, ready: false, notified: false };
		discoveredRecipes.add(recipe.id);
		updateHud();
		saveGame();
		refreshPanel();
		return true;
	}

	function renderFurnaceWorkspace(fire) {
		const workspace = document.querySelector("#furnace-workspace");
		workspace.hidden = activeMode !== "furnace";
		if (workspace.hidden) return;
		const smeltRecipes = recipes.filter((recipe) => furnaceRecipeIds.has(recipe.id));
		const cooking = fire?.cooking;
		const inputList = document.querySelector("#furnace-recipe-list");
		inputList.innerHTML = smeltRecipes.map((recipe) => {
			const inputId = Object.keys(recipe.ingredients)[0];
			const image = inventoryImageSource(inputId);
			const icon = image ? `<img class="item-texture" src="${image}" alt="">` : `<span class="item-icon">${itemInfo[inputId]?.icon || "?"}</span>`;
			const count = player.inventory[inputId] || 0;
			const fuelReady = (fire?.furnaceFuelMs || 0) >= recipe.seconds * 1000;
			return `<button type="button" class="furnace-recipe" data-furnace-recipe="${recipe.id}" ${!fire || fire.cooking || count < 1 || !fuelReady ? "disabled" : ""}>${icon}<span>${label(inputId)} → ${recipe.name}</span><small>${count}</small></button>`;
		}).join("");
		const fuelList = document.querySelector("#furnace-fuel-list");
		fuelList.innerHTML = Object.entries(furnaceFuelMs).map(([id, burnMs]) => {
			const image = inventoryImageSource(id);
			const icon = image ? `<img class="item-texture" src="${image}" alt="">` : `<span class="item-icon">${itemInfo[id]?.icon || "?"}</span>`;
			const count = player.inventory[id] || 0;
			return `<button type="button" class="furnace-fuel" data-furnace-fuel="${id}" ${!fire || count < 1 || (fire.furnaceFuelMs || 0) >= 120000 ? "disabled" : ""}>${icon}<span>${label(id)}</span><small>${count} · ${Math.round(burnMs / 1000)}s</small></button>`;
		}).join("");
		const imageMarkup = (id) => {
			if (!id) return "";
			const image = inventoryImageSource(id);
			return image ? `<img class="item-texture" src="${image}" alt="">` : `<span class="item-icon">${itemInfo[id]?.icon || "?"}</span>`;
		};
		const inputId = cooking?.inputId || "";
		const outputId = cooking?.recipeId || "";
		document.querySelector("#furnace-input-slot").innerHTML = imageMarkup(inputId);
		document.querySelector("#furnace-output-slot").innerHTML = imageMarkup(outputId);
		document.querySelector("#furnace-fuel-slot").innerHTML = fire?.furnaceFuelType ? imageMarkup(fire.furnaceFuelType) : "";
		const fuelSeconds = Math.ceil((fire?.furnaceFuelMs || 0) / 1000);
		document.querySelector("#furnace-fuel-status").textContent = fuelSeconds ? `${label(fire.furnaceFuelType || "coal")} · ${fuelSeconds}s fuel remaining` : "Add coal, wood, or sticks for fuel.";
		const progress = cooking ? Math.min(100, (Date.now() - cooking.startedAt) / cooking.duration * 100) : 0;
		document.querySelector("#furnace-progress-fill").style.width = `${progress}%`;
		document.querySelector("#furnace-status").textContent = cooking ? cooking.ready ? `${label(cooking.recipeId)} is ready.` : `Smelting ${label(cooking.inputId)}…` : "Choose raw meat to smelt.";
		const collect = document.querySelector("#furnace-collect");
		collect.hidden = !cooking?.ready;
		collect.disabled = !cooking?.ready;
	}

	function openPanel(mode, fire = null) {
		if (mode === "craft" && window.FernfallCrafting) {
			window.FernfallCrafting.open();
			return;
		}
		activeMode = mode;
		activeFireId = fire?.id ?? null;
		const dialog = document.querySelector("#survival-dialog");
		document.querySelector("#survival-title").textContent = mode === "furnace" ? "Furnace" : mode === "cook" ? "Campfire cooking" : "Crafting bench";
		if (!dialog.open) dialog.show();
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
		return `<article class="recipe-row"><div><strong>${recipe.name}</strong><p>${requirements.join(" · ")}</p><small>${activeMode === "cook" ? `${recipe.seconds}s · ${recipe.station === "either" ? "Pot or pan" : recipe.station === "open_fire_or_pan" ? "Fire, furnace, pot or pan" : recipe.station === "fire" ? "Campfire or furnace" : recipe.station === "pan" ? "Frying pan" : "Cooking pot"}` : "Craft equipment"}</small>${missing.length ? `<small class="missing-items">Missing: ${missing.join(", ")}</small>` : ""}</div><button type="button" class="recipe-action" data-survival-action="${action}" data-recipe="${recipe.id}" ${unavailable ? "disabled" : ""}>${activeMode === "cook" ? "Start" : "Craft"}</button></article>`;
	}

	function renderCraftingWorkspace() {
		const workspace = document.querySelector("#crafting-workspace");
		workspace.hidden = activeMode !== "craft";
		if (workspace.hidden) return;
		const grid = document.querySelector("#crafting-grid");
		grid.innerHTML = craftingSlots.map((id, index) => {
			const image = id ? inventoryImageSource(id) : "";
			const icon = image
				? `<img class="item-texture" src="${image}" alt="">`
				: id ? `<span class="item-icon">${itemInfo[id]?.icon || id[0].toUpperCase()}</span>` : "";
			return `<button type="button" class="crafting-slot${id ? " filled" : ""}" data-craft-slot="${index}" aria-label="${id ? `Remove ${label(id)}` : `Empty slot ${index + 1}`}">${icon}</button>`;
		}).join("");
		const quickCraft = document.querySelector("#quick-craft-list");
		quickCraft.innerHTML = craftingRecipes.map((recipe) => {
			const image = inventoryImageSource(recipe.id);
			const icon = image
				? `<img class="item-texture" src="${image}" alt="">`
				: `<span class="item-icon">${itemInfo[recipe.id]?.icon || recipe.id[0].toUpperCase()}</span>`;
			return `<button type="button" class="quick-craft-recipe" data-quick-craft="${recipe.id}" ${recipeHasIngredients(recipe) ? "" : "disabled"}>${icon}<span>${recipe.name}</span></button>`;
		}).join("");
		const ingredients = new Set(craftingRecipes.flatMap((recipe) => Object.keys(recipe.ingredients)));
		const inventory = document.querySelector("#crafting-inventory");
		inventory.innerHTML = Object.entries(player.inventory).filter(([id, amount]) => amount > 0 && ingredients.has(id)).map(([id, amount]) => {
			const placed = craftingGridCounts()[id] || 0;
			const image = inventoryImageSource(id);
			const icon = image
				? `<img class="item-texture" src="${image}" alt="">`
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
		document.querySelector("#crafting-grid-status").textContent = matched ? `Ready to craft: ${matched.name}` : "Arrange a recipe in the 3×3 grid.";
	}

	function refreshPanel() {
		const list = document.querySelector("#survival-list");
		if (!list) return;
		const furnaceWorkspace = document.querySelector("#furnace-workspace");
		if (furnaceWorkspace && activeMode !== "furnace") furnaceWorkspace.hidden = true;
		const fire = currentFire();
		if (activeMode === "craft") {
			renderCraftingWorkspace();
			list.innerHTML = "";
			return;
		}
		renderCraftingWorkspace();
		if (activeMode === "furnace") {
			renderFurnaceWorkspace(fire);
			list.innerHTML = "";
			return;
		}
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
		const amount = Number.isInteger(recipe.amount) && recipe.amount > 0 ? recipe.amount : 1;
		for (const [id, count] of Object.entries(recipe.ingredients)) player.inventory[id] -= count;
		craftingSlots.fill("");
		player.inventory[recipe.id] = (player.inventory[recipe.id] || 0) + amount;
		if (recipe.id === "campfire_kit") recordQuest("campfire");
		show(`Crafted ${recipe.name}${amount > 1 ? ` ×${amount}` : ""}.`);
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

	function placeFurnace() {
		const offset = { up: [0, -52], down: [0, 52], left: [-52, 0], right: [52, 0] }[player.direction];
		const x = player.x + offset[0];
		const y = player.y + offset[1];
		if (collides(x, y) || campfires.some((fire) => near(fire, { x, y }, 50))) return show("There is no clear space for a furnace.");
		campfires.push({ id: `furnace-${Date.now()}-${campfires.length}`, kind: "furnace", x, y, cookware: "", cooking: null });
		player.inventory.furnace -= 1;
		show("Furnace placed. Press E nearby to cook.");
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

	function placeBed() {
		if (bed) return show("Your bed is already placed. Click it to pick it up first.");
		const offset = { up: [0, -60], down: [0, 60], left: [-60, 0], right: [60, 0] }[player.direction];
		const candidate = { x: player.x + offset[0], y: player.y + offset[1] };
		if (collides(candidate.x, candidate.y) || spawnBlocked(candidate.x, candidate.y, 20)) return show("There is no clear space for a bed.");
		bed = candidate;
		player.inventory.bed -= 1;
		show("Bed placed. Press E beside it to sleep and set your spawn.");
		updateHud();
		saveGame();
	}

	function ensureStartBed() {
		if (bed || bedSpawned) return;
		for (const [x, y] of [[478, 232], [478, 200], [478, 262], [400, 232], [560, 232]]) {
			if (collides(x, y) || spawnBlocked(x, y, 20)) continue;
			bed = { x, y };
			bedSpawned = true;
			return;
		}
	}

	function sleepInBed() {
		const front = { x: bed.x, y: bed.y + 46 };
		spawnPoint = collides(front.x, front.y) ? { x: bed.x, y: bed.y } : front;
		player.health = MAX_HEALTH;
		show("You rested. This bed is now your spawn point.");
		updateHud();
		saveGame();
	}

	function respawnPoint() {
		return spawnPoint ? { ...spawnPoint } : null;
	}

	function drawBed() {
		if (!bed) return;
		ctx.fillStyle = "#30483b44";
		ctx.beginPath();
		ctx.ellipse(bed.x, bed.y + 24, 25, 7, 0, 0, Math.PI * 2);
		ctx.fill();
		if (window.fernfallDrawNatureSprite?.("beds", "bed_down", bed.x, bed.y, 46, 53)) return;
		ctx.fillStyle = "#8a5a35";
		ctx.fillRect(bed.x - 20, bed.y - 24, 40, 48);
		ctx.fillStyle = "#d9d2c0";
		ctx.fillRect(bed.x - 17, bed.y - 20, 34, 24);
	}

	function blocks(x, y, animalType = "") {
		if (animalType !== "rabbit" && campfires.some((fire) => Math.hypot(x - fire.x, y - fire.y) < (fire.kind === "furnace" ? 34 : 27))) return true;
		if (ponds.some((pond) => {
			const radiusX = (pond.width || 120) * 0.39;
			const radiusY = (pond.height || 84) * 0.39;
			return ((x - pond.x) / radiusX) ** 2 + ((y - pond.y) / radiusY) ** 2 < 1;
		})) return true;
		if (animalType !== "rabbit") {
			for (const village of villages) {
				for (const house of village.houses) {
					const halfWidth = house.width / 2 + (animalType ? 46 : 5);
					const halfHeight = house.height / 2 + (animalType ? 42 : 5);
					const inside = Math.abs(x - house.x) < halfWidth && Math.abs(y - house.y) < halfHeight;
					const doorway = !animalType && Math.abs(x - house.x) < 11 && y > house.y + house.height / 2 - 18;
					if (inside && !doorway) return true;
				}
			}
		}
		return craftingTables.some((table) => Math.abs(x - table.x) < 22 && Math.abs(y - table.y) < 17);
	}

	function spawnBlocked(x, y, radius = 24) {
		if (ponds.some((pond) => {
			const radiusX = (pond.width || 120) / 2 + radius + 12;
			const radiusY = (pond.height || 84) / 2 + radius + 12;
			return ((x - pond.x) / radiusX) ** 2 + ((y - pond.y) / radiusY) ** 2 < 1;
		})) return true;
		if (campfires.some((fire) => Math.hypot(x - fire.x, y - fire.y) < radius + (fire.kind === "furnace" ? 34 : 27))) return true;
		if (craftingTables.some((table) => Math.abs(x - table.x) < radius + 26 && Math.abs(y - table.y) < radius + 24)) return true;
		if (bed && Math.abs(x - bed.x) < radius + 26 && Math.abs(y - bed.y) < radius + 30) return true;
		return villages.some((village) => village.houses.some((house) => Math.abs(x - house.x) < radius + house.width / 2 && Math.abs(y - house.y) < radius + house.height / 2));
	}

	function keepAnimalsOffRoofs() {
		for (const animal of animals) {
			if (animal.type === "rabbit") continue;
			for (const village of villages) {
				for (const house of village.houses) {
					const halfWidth = house.width / 2 + 46;
					const halfHeight = house.height / 2 + 42;
					const dx = animal.x - house.x;
					const dy = animal.y - house.y;
					if (Math.abs(dx) >= halfWidth || Math.abs(dy) >= halfHeight) continue;
					if (halfWidth - Math.abs(dx) < halfHeight - Math.abs(dy)) {
						animal.x = house.x + (dx < 0 ? -halfWidth : halfWidth);
					} else {
						animal.y = house.y + (dy < 0 ? -halfHeight : halfHeight);
					}
				}
			}
		}
	}

	function useSelected() {
		const item = itemInfo[selectedItem];
		if (!item || !(player.inventory[selectedItem] > 0)) return;
		if (item.category === "food" || selectedItem === "bucket_milk" || selectedItem === "bucket_water") {
			const bucketItem = selectedItem === "bucket_milk" || selectedItem === "bucket_water";
			if (player.health >= MAX_HEALTH && player.hunger >= MAX_HUNGER && !bucketItem) return show("You are already full.");
			if (item.raw && Math.random() < 0.25) {
				sickUntil = Date.now() + 7000;
				nextSicknessDamage = Date.now() + 2200;
			}
			const heal = item.raw ? 1 : item.heal || (selectedItem === "bucket_water" ? 1 : 2);
			const hungerGain = selectedItem === "bucket_water" ? 5 : item.raw ? 8 : bucketItem ? 14 : 12 + (item.heal || 1) * 4;
			const saturationMultiplier = item.raw ? 0.25 : selectedItem === "bucket_water" ? 0 : ["berry", "herb"].includes(selectedItem) ? 0.35 : selectedItem === "mushroom" ? 0.4 : selectedItem === "potato" ? 0.5 : /cooked|stew|pie|soup|meal/.test(selectedItem) ? 0.9 : 0.65;
			const saturationGain = Math.round(hungerGain * saturationMultiplier);
			player.health = Math.min(MAX_HEALTH, player.health + heal);
			player.hunger = Math.min(MAX_HUNGER, player.hunger + hungerGain);
			player.saturation = Math.min(MAX_SATURATION, (player.saturation || 0) + saturationGain);
			player.lastFoodEaten = selectedItem;
			player.inventory[selectedItem] -= 1;
			if (selectedItem === "bucket_milk" || selectedItem === "bucket_water") player.inventory.bucket_empty = (player.inventory.bucket_empty || 0) + 1;
			show(item.raw && sickUntil > Date.now() ? "Raw food helped a little, but you feel unwell." : `Ate ${item.name.toLowerCase()}.`);
		} else if (selectedItem === "campfire_kit") {
			placeCampfire();
			return;
		} else if (selectedItem === "furnace") {
			placeFurnace();
			return;
		} else if (selectedItem === "crafting_table") {
			placeCraftingTable();
			return;
		} else if (selectedItem === "bed") {
			placeBed();
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

	function useItem(id) {
		if (!itemInfo[id] || !(player.inventory[id] > 0)) return false;
		selectedItem = id;
		useSelected();
		return true;
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

	function pickupAt(x, y) {
		if (bed && Math.hypot(bed.x - x, bed.y - y) < 38) {
			bed = null;
			player.inventory.bed = (player.inventory.bed || 0) + 1;
			show("Picked up bed. Your spawn point stays where you last slept.");
			return true;
		}
		const resource = resources.find((entry) => entry.available && Math.hypot(entry.x - x, entry.y - y) < 30);
		if (resource) {
			resource.available = false;
			resource.respawnAt = Date.now() + 30000;
			player.inventory[resource.type] = (player.inventory[resource.type] || 0) + 1;
			recordQuest("gathered");
			recordVillagerQuestProgress(resource.type);
			show(`Gathered ${label(resource.type)}.`);
			return true;
		}

		const furnaceIndex = campfires.findIndex((fire) => fire.kind === "furnace" && !fire.cooking && Math.hypot(fire.x - x, fire.y - y) < 36);
		if (furnaceIndex >= 0) {
			campfires.splice(furnaceIndex, 1);
			player.inventory.furnace = (player.inventory.furnace || 0) + 1;
			show("Picked up furnace.");
			return true;
		}

		const coalFire = campfires.find((fire) => fire.kind !== "furnace" && !fire.coalCollected && Math.hypot(fire.x + 32 - x, fire.y + 12 - y) < 14);
		if (coalFire) {
			coalFire.coalCollected = true;
			player.inventory.coal = (player.inventory.coal || 0) + 1;
			show("Picked up coal from the campfire.");
			return true;
		}

		const tableIndex = craftingTables.findIndex((table) => !table.village && Math.hypot(table.x - x, table.y - y) < 36);
		if (tableIndex >= 0) {
			craftingTables.splice(tableIndex, 1);
			player.inventory.crafting_table = (player.inventory.crafting_table || 0) + 1;
			show("Picked up crafting table.");
			return true;
		}
		return false;
	}

	function interact() {
		if (bed && near(bed, player, 66) && !campfires.some((entry) => near(entry, player, 68))) {
			sleepInBed();
			return true;
		}
		const fire = campfires.find((entry) => near(entry, player, 68));
		if (fire) {
			if (collectFire(fire)) return true;
			openPanel(fire.kind === "furnace" ? "furnace" : "cook", fire);
			return true;
		}
		const villager = villagers.find((resident) => near(resident, player, 58));
		if (villager) {
			openVillagerDialogue(villager);
			return true;
		}
		if (craftingTables.some((table) => near(table, player, 62))) {
			openPanel("craft");
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
			const amount = pickup.amount || 1;
			player.inventory[pickup.type] = (player.inventory[pickup.type] || 0) + amount;
			recordQuest("gathered", amount);
			recordVillagerQuestProgress(pickup.type, amount);
			show(`Collected ${label(pickup.type)} x${pickup.amount || 1}.`);
			updateHud();
			saveGame();
			return true;
		}
		const resource = resources.find((entry) => entry.available && ["stone", "carrot", "potato", "mushroom", "grain", "herb"].includes(entry.type) && near(entry, player, 50));
		if (resource) {
			window.FernfallGameInventory?.animate(resource.type === "stone" ? "mine" : ["carrot", "potato", "grain"].includes(resource.type) ? "till" : "dig");
			resource.available = false;
			resource.respawnAt = Date.now() + 30000;
			player.inventory[resource.type] = (player.inventory[resource.type] || 0) + 1;
			recordQuest("gathered");
			recordVillagerQuestProgress(resource.type);
			show(`Gathered ${label(resource.type)}.`);
			updateHud();
			saveGame();
			return true;
		}
		const tree = obstacles.find((entry) => !entry.chopped && near(entry, player, 56));
		if (tree) {
			window.FernfallGameInventory?.animate("chop");
			tree.woodHits = (tree.woodHits || 0) + 1;
			player.inventory.wood = (player.inventory.wood || 0) + 1;
			recordQuest("gathered");
			recordVillagerQuestProgress("wood");
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
		window.FernfallGameInventory?.animate("attack");
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
		if (!resource.available) return true;
		const bob = Math.sin(performance.now() / 260 + resource.x) * 2;
		ctx.fillStyle = "#49674655";
		ctx.beginPath();
		ctx.ellipse(resource.x, resource.y + 9, 12, 4, 0, 0, Math.PI * 2);
		ctx.fill();
		const plantKey = resourcePlantArt[resource.type];
		const plant = plantKey && typeof fernfallSurvival !== "undefined" ? fernfallSurvival[plantKey] : null;
		if (plant && drawArt(ctx, plant, resource.x, resource.y - 6, 48, 48)) return true;
		if (drawPackItemIcon(resource.type, resource.x, resource.y + bob, 36)) return true;
		if (resource.type === "seed") {
			ctx.fillStyle = "#8a5a35";
			ctx.beginPath();
			ctx.ellipse(resource.x, resource.y + bob + 2, 8, 10, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "#5e3d25";
			ctx.fillRect(resource.x - 9, resource.y + bob - 9, 18, 6);
			return true;
		}
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
			const x = pond.x - camera.x;
			const y = pond.y - camera.y;
			const radiusX = (pond.width || 120) / 2;
			const radiusY = (pond.height || 84) / 2;
			const depth = pond.depth ?? 0.5;
			ctx.fillStyle = "#34473866";
			ctx.beginPath();
			ctx.ellipse(x, y + 7, radiusX + 8, radiusY + 7, -0.12, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "#70834f";
			ctx.beginPath();
			ctx.ellipse(x, y, radiusX + 3, radiusY + 3, -0.12, 0, Math.PI * 2);
			ctx.fill();
			const water = ctx.createLinearGradient(x, y - radiusY, x, y + radiusY);
			water.addColorStop(0, depth > 0.65 ? "#427e89" : "#679c91");
			water.addColorStop(0.52, depth > 0.65 ? "#286276" : "#3b8290");
			water.addColorStop(1, depth > 0.65 ? "#20495d" : "#315d68");
			ctx.fillStyle = water;
			ctx.beginPath();
			ctx.ellipse(x, y, radiusX - 2, radiusY - 2, -0.12, 0, Math.PI * 2);
			ctx.fill();
			ctx.save();
			ctx.beginPath();
			ctx.ellipse(x, y, radiusX - 3, radiusY - 3, -0.12, 0, Math.PI * 2);
			ctx.clip();
			ctx.strokeStyle = "#b0d7c354";
			ctx.lineWidth = 2;
			for (let index = 0; index < Math.floor(radiusX / 18); index += 1) {
				const rippleX = x - radiusX + 14 + index * 31;
				const rippleY = y - radiusY * 0.45 + ((index * 19) % Math.max(12, radiusY));
				ctx.beginPath();
				ctx.ellipse(rippleX, rippleY, 8 + (index % 3) * 3, 2, -0.12, 0, Math.PI);
				ctx.stroke();
			}
			ctx.restore();
		}
		drawVillages();
	}

	function villageSpriteWithoutBackground(image) {
		if (!image?.complete || !image.naturalWidth) return null;
		if (villageSpriteCache.has(image)) return villageSpriteCache.get(image);

		const canvas = document.createElement("canvas");
		canvas.width = image.naturalWidth;
		canvas.height = image.naturalHeight;
		const context = canvas.getContext("2d", { willReadFrequently: true });
		context.drawImage(image, 0, 0);
		const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
		const pixels = imageData.data;
		const pixelCount = canvas.width * canvas.height;
		const visited = new Uint8Array(pixelCount);
		const removed = new Uint8Array(pixelCount);
		const background = [pixels[0], pixels[1], pixels[2]];
		const matchesBackground = (index) => {
			const offset = index * 4;
			return Math.abs(pixels[offset] - background[0]) <= 18 &&
				Math.abs(pixels[offset + 1] - background[1]) <= 18 &&
				Math.abs(pixels[offset + 2] - background[2]) <= 18;
		};
		for (let start = 0; start < pixelCount; start += 1) {
			if (visited[start]) continue;
			visited[start] = 1;
			if (!matchesBackground(start)) continue;
			const component = [start];
			for (let cursor = 0; cursor < component.length; cursor += 1) {
				const index = component[cursor];
				const x = index % canvas.width;
				const y = Math.floor(index / canvas.width);
				const neighbors = [
					x > 0 ? index - 1 : -1,
					x < canvas.width - 1 ? index + 1 : -1,
					y > 0 ? index - canvas.width : -1,
					y < canvas.height - 1 ? index + canvas.width : -1,
				];
				for (const neighbor of neighbors) {
					if (neighbor < 0 || visited[neighbor]) continue;
					visited[neighbor] = 1;
					if (matchesBackground(neighbor)) component.push(neighbor);
				}
			}
			if (component.length < 16) continue;
			for (const index of component) {
				removed[index] = 1;
				pixels[index * 4 + 3] = 0;
			}
		}

		for (let index = 0; index < pixelCount; index += 1) {
			if (removed[index] || !pixels[index * 4 + 3]) continue;
			const x = index % canvas.width;
			const y = Math.floor(index / canvas.width);
			let touchesBackground = false;
			for (let offsetY = -1; offsetY <= 1 && !touchesBackground; offsetY += 1) {
				for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
					const nextX = x + offsetX;
					const nextY = y + offsetY;
					if (nextX >= 0 && nextX < canvas.width && nextY >= 0 && nextY < canvas.height && removed[nextY * canvas.width + nextX]) {
						touchesBackground = true;
						break;
					}
				}
			}
			if (!touchesBackground) continue;
			const offset = index * 4;
			const distance = Math.max(
				Math.abs(pixels[offset] - background[0]),
				Math.abs(pixels[offset + 1] - background[1]),
				Math.abs(pixels[offset + 2] - background[2]),
			);
			if (distance <= 35) pixels[offset + 3] = 0;
			else if (distance <= 60) pixels[offset + 3] = Math.round(pixels[offset + 3] * (distance - 35) / 25);
		}

		context.putImageData(imageData, 0, 0);
		villageSpriteCache.set(image, canvas);
		return canvas;
	}

	function drawVillageSprite(image, x, y, width, height) {
		const sprite = villageSpriteWithoutBackground(image);
		if (!sprite) return false;
		ctx.save();
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(sprite, Math.round(x - width / 2), Math.round(y - height / 2), width, height);
		ctx.restore();
		return true;
	}

	function drawVillages() {
		const settlementArt = window.fernfallSettlementArt;
		for (const village of villages) {
			for (const house of village.houses) {
				const x = house.x - camera.x;
				const y = house.y - camera.y;
				const image = settlementArt?.village_assets?.[house.asset];
				if (!drawVillageSprite(image, x, y, house.width, house.height)) {
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
			if (!drawVillageSprite(image, villager.x - camera.x, y, 42, 48)) {
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
			const quest = villagerQuestDefinitions[villager.role];
			const state = villagerQuestStates[villager.role];
			if (!quest || state?.claimed) continue;
			const ready = Boolean(state?.accepted && state.progress >= quest.goal);
			if (state?.accepted && !ready) continue;
			const markX = villager.x - camera.x;
			const markY = y - 38 + Math.sin(performance.now() / 240 + villager.phase) * 2;
			ctx.save();
			ctx.font = "bold 24px sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.lineWidth = 4;
			ctx.strokeStyle = "#2d2a1f";
			ctx.strokeText("!", markX, markY);
			ctx.fillStyle = ready ? "#59c466" : "#f4cf3d";
			ctx.fillText("!", markX, markY);
			ctx.restore();
		}
	}

	function drawCraftingTable(table, x, y) {
		const tableImage = window.fernfallSettlementArt?.placeables?.crafting_table;
		if (drawArt(ctx, tableImage, x, y, 52, 48)) return;
		const left = x - 20;
		const top = y - 12;
		ctx.fillStyle = "#62472f";
		ctx.fillRect(left + 4, top + 10, 5, 15);
		ctx.fillRect(left + 31, top + 10, 5, 15);
		ctx.fillStyle = "#9a7448";
		ctx.fillRect(left, top, 40, 13);
		ctx.strokeStyle = "#57402e";
		ctx.lineWidth = 2;
		ctx.strokeRect(left, top, 40, 13);
		ctx.strokeStyle = "#c2a16b";
		ctx.beginPath();
		ctx.moveTo(left + 13, top + 1);
		ctx.lineTo(left + 13, top + 11);
		ctx.moveTo(left + 26, top + 1);
		ctx.lineTo(left + 26, top + 11);
		ctx.stroke();
	}

	function drawCraftingTablesBehindTrees() {
		for (const table of craftingTables) {
			if (table.id === "village-table-spawn") drawCraftingTable(table, table.x - camera.x, table.y - camera.y);
		}
	}

	function drawPackStationArt(id, x, y, size) {
		const source = window.FERNFALL_ITEM_IMAGES?.[id];
		if (!source) return false;
		if (!packArtCache.has(source)) {
			const image = new Image();
			image.src = source;
			packArtCache.set(source, image);
		}
		const image = packArtCache.get(source);
		if (!image.complete || !image.naturalWidth) return false;
		ctx.save();
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(image, Math.round(x - size / 2), Math.round(y - size / 2), size, size);
		ctx.restore();
		return true;
	}

	function drawStations() {
		drawBed();
		for (const fire of campfires) {
			if (fire.kind !== "furnace" && !fire.coalCollected) {
				const coalX = fire.x + 32;
				const coalY = fire.y + 12;
				ctx.fillStyle = "#342d22";
				ctx.beginPath();
				ctx.arc(coalX, coalY, 11, 0, Math.PI * 2);
				ctx.fill();
				if (!drawPackItemIcon("coal", coalX, coalY, 18)) {
					ctx.fillStyle = "#17191a";
					ctx.fillRect(coalX - 6, coalY - 5, 12, 10);
				}
			}
			if (fire.kind === "furnace") {
				if (!drawPackStationArt(fire.cooking ? "furnace_lit" : "furnace_unlit", fire.x, fire.y, 58)) {
					ctx.fillStyle = "#77776f";
					ctx.fillRect(fire.x - 20, fire.y - 20, 40, 40);
					ctx.fillStyle = fire.cooking ? "#ef9b4b" : "#343b39";
					ctx.fillRect(fire.x - 9, fire.y - 8, 18, 19);
				}
			} else {
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
			if (table.id === "village-table-spawn") continue;
			drawCraftingTable(table, table.x, table.y);
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
			const image = inventoryImageSource(id);
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
				if (random() < 0.5) continue;
				for (let index = 0; index < 7; index += 1) {
					let resource = null;
					for (let attempt = 0; attempt < 14; attempt += 1) {
						const candidate = {
							x: cx * WORLD_CHUNK_SIZE + 32 + random() * (WORLD_CHUNK_SIZE - 64),
							y: cy * WORLD_CHUNK_SIZE + 32 + random() * (WORLD_CHUNK_SIZE - 64),
							type: types[Math.floor(random() * types.length)], available: true,
						};
						const clear = window.fernfallSpawnAreaIsClear?.(candidate.x, candidate.y, 24) ?? !collides(candidate.x, candidate.y);
						if (clear) {
							resource = candidate;
							break;
						}
					}
					if (!resource || Math.hypot(player.x - resource.x, player.y - resource.y) <= 85) continue;
					if (resource.type === "berry" && random() < 0.55) continue;
					resources.push(resource);
					if (resource.type === "berry") {
						const offsets = [[-58, -20], [58, -20], [-20, 58], [20, 58]];
						const clusterSize = 2 + Math.floor(random() * 2);
						for (const [offsetX, offsetY] of offsets.slice(0, clusterSize)) {
							const berry = { ...resource, x: resource.x + offsetX, y: resource.y + offsetY };
							const clear = window.fernfallSpawnAreaIsClear?.(berry.x, berry.y, 18) ?? !collides(berry.x, berry.y);
							if (clear && Math.hypot(player.x - berry.x, player.y - berry.y) > 85) resources.push(berry);
						}
					}
				}
				if (random() < 0.12) {
					for (let attempt = 0; attempt < 14; attempt += 1) {
						const small = random() < 0.38;
						const columns = small ? 4 + Math.floor(random() * 2) : 6 + Math.floor(random() * 2);
						const rows = small ? 3 + Math.floor(random() * 2) : 4 + Math.floor(random() * 2);
						const width = columns * 64;
						const height = rows * 64;
						const pond = {
							x: cx * WORLD_CHUNK_SIZE + 110 + random() * 292,
							y: cy * WORLD_CHUNK_SIZE + 110 + random() * 292,
							width, height, depth: random(), sizeVersion: 1,
						};
						if (window.fernfallPathOverlaps?.(pond.x, pond.y, width + 40, height + 40)) continue;
						const clear = window.fernfallSpawnAreaIsClear?.(pond.x, pond.y, Math.max(width, height) / 2 + 20) ?? !collides(pond.x, pond.y);
						if (!clear) continue;
						ponds.push(pond);
						break;
					}
				}
				generateVillage(random, cx, cy);
			}
		}
	}

	function generateVillage(random, chunkX, chunkY) {
		const key = `${chunkX},${chunkY}`;
		if (villageChunks.has(key)) return;
		villageChunks.add(key);
		if (random() > 0.08) return;
		const center = { x: chunkX * WORLD_CHUNK_SIZE + WORLD_CHUNK_SIZE / 2, y: chunkY * WORLD_CHUNK_SIZE + WORLD_CHUNK_SIZE / 2 };
		const layouts = [[-150, -110], [150, -110], [-150, 130], [150, 130], [0, -330]];
		const houseCount = 3 + Math.floor(random() * 3);
		const houses = [];
		const roles = [{ role: "mayor", asset: "town_hall" }, { role: "shopkeeper", asset: "general_store" }, { role: "blacksmith", asset: "blacksmith_building" }, { role: "farmer", asset: "farmer_cottage" }, { role: "innkeeper", asset: "inn" }, { role: "healer", asset: "healer_house" }];
		for (const [offsetX, offsetY] of layouts) {
			if (houses.length >= houseCount) break;
			const role = roles[houses.length];
			const position = findVillageHousePosition(center.x + offsetX, center.y + offsetY, houses);
			if (!position) continue;
			const house = { ...position, width: HOUSE_WIDTH, height: HOUSE_HEIGHT, doorSide: "center", role: role.role, asset: role.asset };
			houses.push(house);
			villagers.push({ id: `${key}-${role.role}`, role: role.role, x: house.x, y: house.y + house.height / 2 + 20, direction: "down", phase: random() * 6, villageId: key });
		}
		if (houses.length < 3) return;
		villages.push({ id: `village-${key}`, ...center, houses });
		const tablePosition = findVillageTablePosition(center, houses);
		if (tablePosition) craftingTables.push({ id: `village-table-${key}`, ...tablePosition, village: true });
	}

	function findVillageHousePosition(x, y, houses, relaxed = false) {
		const houseWidth = HOUSE_WIDTH;
		const houseHeight = HOUSE_HEIGHT;
		const offsets = [[0, 0], [0, -260], [0, 260], [-260, 0], [260, 0], [0, -400], [0, 400], [-400, 0], [400, 0], [0, -520], [0, 520]];
		for (const [offsetX, offsetY] of offsets) {
			const candidate = { x: x + offsetX, y: y + offsetY };
			if (window.fernfallPathOverlaps?.(candidate.x, candidate.y, houseWidth + 36, houseHeight + 36)) continue;
			if (ponds.some((pond) => {
				const radiusX = (pond.width || 120) / 2 + houseWidth / 2 + 24;
				const radiusY = (pond.height || 84) / 2 + houseHeight / 2 + 24;
				return ((candidate.x - pond.x) / radiusX) ** 2 + ((candidate.y - pond.y) / radiusY) ** 2 < 1;
			})) continue;
			if (!relaxed && window.fernfallSpawnAreaIsClear && !window.fernfallSpawnAreaIsClear(candidate.x, candidate.y, Math.max(houseWidth, houseHeight) / 2 + 32)) continue;
			if (!window.fernfallSpawnAreaIsClear && collides(candidate.x, candidate.y)) continue;
			if (!relaxed && obstacles.some((tree) => Math.abs(tree.x - candidate.x) < houseWidth / 2 + tree.r * 0.66 && Math.abs(tree.y - candidate.y) < houseHeight / 2 + tree.r * 0.66)) continue;
			if (craftingTables.some((table) => Math.abs(table.x - candidate.x) < houseWidth / 2 + 32 && Math.abs(table.y - candidate.y) < houseHeight / 2 + 28)) continue;
			if (houses.some((house) => Math.abs(house.x - candidate.x) < (house.width + houseWidth) / 2 + 20 && Math.abs(house.y - candidate.y) < (house.height + houseHeight) / 2 + 20)) continue;
			return candidate;
		}
		return null;
	}

	function findVillageTablePosition(center, houses) {
		const offsets = [[0, 100], [0, -130], [0, -180], [0, 130], [150, -120], [-150, -120], [170, 0], [-170, 0], [0, 220]];
		for (const [offsetX, offsetY] of offsets) {
			const candidate = { x: center.x + offsetX, y: center.y + offsetY };
			if (collides(candidate.x, candidate.y)) continue;
			if (window.fernfallPathOverlaps?.(candidate.x, candidate.y, 56, 56)) continue;
			if (obstacles.some((tree) => Math.hypot(candidate.x - tree.x, candidate.y - tree.y) < tree.r * 0.66 + 42)) continue;
			if (ponds.some((pond) => ((candidate.x - pond.x) / (pond.width / 2 + 28)) ** 2 + ((candidate.y - pond.y) / (pond.height / 2 + 28)) ** 2 < 1)) continue;
			if (houses.some((house) => Math.abs(house.x - candidate.x) < house.width / 2 + 34 && Math.abs(house.y - candidate.y) < house.height / 2 + 30)) continue;
			if (craftingTables.some((table) => Math.hypot(table.x - candidate.x, table.y - candidate.y) < 64)) continue;
			return candidate;
		}
		return null;
	}

	function ensureSpawnVillage() {
		const villageId = "village-spawn";
		const tableId = "village-table-spawn";
		const center = { x: 478, y: 322 };
		if (!villages.some((village) => village.id === villageId)) {
			const legacyVillageIndex = villages.findIndex((village) => village.id === "village-0,0");
			if (legacyVillageIndex >= 0) villages.splice(legacyVillageIndex, 1);
			villagers.splice(0, villagers.length, ...villagers.filter((villager) => villager.villageId !== "0,0"));
			craftingTables.splice(0, craftingTables.length, ...craftingTables.filter((table) => table.id !== "village-table-0,0"));
			const houseSpecs = [
				{ x: 318, y: 120, width: HOUSE_WIDTH, height: HOUSE_HEIGHT, doorSide: "center", role: "mayor", asset: "town_hall" },
				{ x: 638, y: 120, width: HOUSE_WIDTH, height: HOUSE_HEIGHT, doorSide: "center", role: "shopkeeper", asset: "general_store" },
				{ x: 478, y: 560, width: HOUSE_WIDTH, height: HOUSE_HEIGHT, doorSide: "center", role: "blacksmith", asset: "blacksmith_building" },
			];
			const houses = [];
			const savedBed = bed;
			bed = null;
			craftingTables.splice(0, craftingTables.length, ...craftingTables.filter((table) => table.id !== tableId));
			for (const house of houseSpecs) {
				const position = findVillageHousePosition(house.x, house.y, houses, true);
				if (position) houses.push({ ...house, ...position });
			}
			bed = savedBed;
			const insideHouse = (entry, margin) => houses.some((house) => Math.abs(entry.x - house.x) < house.width / 2 + margin && Math.abs(entry.y - house.y) < house.height / 2 + margin);
			for (let index = obstacles.length - 1; index >= 0; index -= 1) if (insideHouse(obstacles[index], obstacles[index].r * 0.5)) obstacles.splice(index, 1);
			obstacleChunks.clear();
			obstacles.forEach(indexObstacle);
			resources.splice(0, resources.length, ...resources.filter((resource) => !insideHouse(resource, 24)));
			villages.push({ id: villageId, ...center, houses });
			villagers.push(...houses.map((house) => ({
				id: `${villageId}-${house.role}`,
				role: house.role,
				x: house.x,
				y: house.y + house.height / 2 + 20,
				direction: "down",
				phase: 0,
				villageId,
			})));
		}
		const oldTableIndex = craftingTables.findIndex((table) => table.id === tableId);
		if (oldTableIndex >= 0) craftingTables.splice(oldTableIndex, 1);
		const spawnVillage = villages.find((village) => village.id === villageId);
		const tablePosition = findVillageTablePosition(center, spawnVillage?.houses || []);
		if (tablePosition) craftingTables.push({ id: tableId, ...tablePosition, village: true });
		villageChunks.add("0,0");
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
				let position = null;
				for (let attempt = 0; attempt < 16; attempt += 1) {
					const candidate = {
						x: cx * WORLD_CHUNK_SIZE + 70 + random() * (WORLD_CHUNK_SIZE - 140),
						y: cy * WORLD_CHUNK_SIZE + 70 + random() * (WORLD_CHUNK_SIZE - 140),
					};
					const clear = window.fernfallSpawnAreaIsClear?.(candidate.x, candidate.y, 22) ?? !collides(candidate.x, candidate.y);
					if (clear && Math.hypot(player.x - candidate.x, player.y - candidate.y) >= 120) {
						position = candidate;
						break;
					}
				}
				if (!position) continue;
				const hp = type === "witch" ? 5 : type === "zombie" ? 4 : type === "bat" || type === "slime" ? 2 : 3;
				mobs.push({ ...position, type, hp, maxHp: hp, alive: true, phase: random() * 6, hit: 0, lastSpell: 0 });
			}
		}
	}

	function updateVillagers(now) {
		for (const villager of villagers) {
			villager.homeX ??= villager.x;
			villager.homeY ??= villager.y;
			villager.roamAngle ??= (villager.phase || 0) * 1.7;
			if (now >= (villager.roamUntil ?? 0)) {
				villager.roamAngle = Math.random() * Math.PI * 2;
				villager.roamUntil = now + 900 + Math.random() * 1800;
			}
			if (Math.hypot(villager.x - villager.homeX, villager.y - villager.homeY) > 40) {
				villager.roamAngle = Math.atan2(villager.homeY - villager.y, villager.homeX - villager.x);
			}

			const previousX = villager.x;
			const previousY = villager.y;
			const speed = 0.32;
			const dx = Math.cos(villager.roamAngle) * speed;
			const dy = Math.sin(villager.roamAngle) * speed;
			if (!collides(villager.x + dx, villager.y)) villager.x += dx;
			if (!collides(villager.x, villager.y + dy)) villager.y += dy;
			const movedX = villager.x - previousX;
			const movedY = villager.y - previousY;
			if (movedX || movedY) villager.direction = Math.abs(movedX) > Math.abs(movedY) ? (movedX < 0 ? "left" : "right") : (movedY < 0 ? "up" : "down");
			else villager.roamUntil = now;
		}
	}

	function drawNightOverlay() {
		if (!worldEpoch) return;
		const elapsed = ((Date.now() - worldEpoch) % NIGHT_CYCLE_MS + NIGHT_CYCLE_MS) % NIGHT_CYCLE_MS;
		const phase = elapsed / NIGHT_CYCLE_MS;
		const maxOpacity = 0.52;
		let opacity = 0;
		if (phase >= 0.62 && phase < 0.68) opacity = (phase - 0.62) / 0.06 * maxOpacity;
		else if (phase >= 0.68 || phase < 0.1) opacity = maxOpacity;
		else if (phase < 0.16) opacity = (0.16 - phase) / 0.06 * maxOpacity;
		if (!opacity) return;
		ctx.save();
		ctx.fillStyle = `rgba(15, 27, 48, ${opacity})`;
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
		ctx.restore();
	}

	function update() {
		generateVillageChunks();
		generateResourceChunks();
		keepAnimalsOffRoofs();
		const now = Date.now();
		updateVillagers(now);
		const { isNight, nightIndex } = updateWorldClock(now);
		if (isNight && nightIndex !== currentNightIndex) currentNightIndex = nightIndex;
		if (isNight) generateHostileChunks(nightIndex);
		else mobs.splice(0, mobs.length, ...mobs.filter((mob) => !hostileTypes.includes(mob.type) && mob.type !== "slime"));
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
					const home = respawnPoint() || { x: 478, y: 322 };
					player.x = home.x;
					player.y = home.y;
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
		ensureSpawnVillage();
		ensureStartBed();
		if (!worldEpoch) {
			worldEpoch = Date.now() - NIGHT_CYCLE_MS * 0.24;
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
		});
		document.querySelector("#crafting-inventory").addEventListener("click", (event) => {
			const button = event.target.closest("[data-craft-item]");
			if (!button || button.disabled) return;
			const slot = craftingSlots.findIndex((id) => !id);
			if (slot < 0) return show("The crafting grid is full.");
			craftingSlots[slot] = button.dataset.craftItem;
			refreshPanel();
		});
		document.querySelector("#quick-craft-list").addEventListener("click", (event) => {
			const button = event.target.closest("[data-quick-craft]");
			if (button && !button.disabled) selectQuickCraftRecipe(button.dataset.quickCraft);
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
		document.querySelector("#villager-quest-action").addEventListener("click", handleVillagerQuestAction);
		document.querySelector("#villager-dialog-close").addEventListener("click", () => document.querySelector("#villager-dialog").close());
		document.querySelector("#villager-dialog-close-secondary").addEventListener("click", () => document.querySelector("#villager-dialog").close());
		document.querySelector("#survival-list").addEventListener("click", (event) => {
			const button = event.target.closest("[data-survival-action]");
			const furnaceRecipe = event.target.closest("[data-furnace-recipe]");
			const furnaceFuel = event.target.closest("[data-furnace-fuel]");
			if (furnaceRecipe && !furnaceRecipe.disabled) return startFurnaceCook(furnaceRecipe.dataset.furnaceRecipe, currentFire());
			if (furnaceFuel && !furnaceFuel.disabled) return addFurnaceFuel(currentFire(), furnaceFuel.dataset.furnaceFuel);
			if (event.target.closest("#furnace-collect")) {
				if (collectFire(currentFire())) refreshPanel();
				return;
			}
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
		refreshVillageQuestBoard();
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
			const pathSafeObstacles = state.obstacles.filter((obstacle) =>
				!window.fernfallPathOverlaps?.(obstacle.x, obstacle.y + 5, (obstacle.r || 42) * 2, (obstacle.r || 42) * 2),
			);
			obstacles.splice(0, obstacles.length, ...pathSafeObstacles);
			obstacleChunks.clear();
			obstacles.forEach(indexObstacle);
		}
		if (Array.isArray(state.generatedChunks)) {
			generatedChunks.clear();
			state.generatedChunks.forEach((key) => generatedChunks.add(key));
		}
		campfires.splice(0, campfires.length, ...(state.campfires || []));
		craftingTables.splice(0, craftingTables.length, ...(state.craftingTables || []));
		const restoredPonds = [];
		for (const savedPond of state.ponds || []) {
			const width = savedPond.width || 120;
			const scale = savedPond.sizeVersion === 1 ? 1 : Math.max(1.5, 200 / width);
			const pond = {
				...savedPond,
				width: width * scale,
				height: (savedPond.height || 84) * scale,
				sizeVersion: 1,
			};
			const radius = Math.max(pond.width, pond.height) / 2 + 20;
			const stepX = pond.width + 64;
			const stepY = pond.height + 64;
			const offsets = [[0, 0], [0, -stepY], [0, stepY], [-stepX, 0], [stepX, 0], [-stepX, -stepY], [stepX, -stepY], [-stepX, stepY], [stepX, stepY]];
			const position = offsets.map(([offsetX, offsetY]) => ({ x: pond.x + offsetX, y: pond.y + offsetY })).find((candidate) => {
				if (window.fernfallPathOverlaps?.(candidate.x, candidate.y, pond.width + 40, pond.height + 40)) return false;
				if (obstacles.some((tree) => Math.hypot(candidate.x - tree.x, candidate.y - tree.y) < radius + tree.r * 0.66)) return false;
				if (resources.some((resource) => Math.hypot(candidate.x - resource.x, candidate.y - resource.y) < radius + 22)) return false;
				if (animals.some((animal) => Math.hypot(candidate.x - animal.x, candidate.y - animal.y) < radius + 32)) return false;
				if (mobs.some((mob) => mob.alive && Math.hypot(candidate.x - mob.x, candidate.y - mob.y) < radius + 24)) return false;
				if (pickups.some((pickup) => Math.hypot(candidate.x - pickup.x, candidate.y - pickup.y) < radius + 14)) return false;
				if (campfires.some((fire) => Math.hypot(candidate.x - fire.x, candidate.y - fire.y) < radius + 34)) return false;
				if (craftingTables.some((table) => Math.abs(candidate.x - table.x) < pond.width / 2 + 32 && Math.abs(candidate.y - table.y) < pond.height / 2 + 28)) return false;
				if ((state.villages || []).some((village) => village.houses.some((house) => Math.abs(candidate.x - house.x) < pond.width / 2 + house.width / 2 + 24 && Math.abs(candidate.y - house.y) < pond.height / 2 + house.height / 2 + 24))) return false;
				return !restoredPonds.some((other) => {
					const radiusX = (other.width || 120) / 2 + pond.width / 2 + 24;
					const radiusY = (other.height || 84) / 2 + pond.height / 2 + 24;
					return ((candidate.x - other.x) / radiusX) ** 2 + ((candidate.y - other.y) / radiusY) ** 2 < 1;
				});
			});
			if (position) restoredPonds.push({ ...pond, ...position });
		}
		ponds.splice(0, ponds.length, ...restoredPonds);
		const houseMoves = new Map();
		const spawnHouseLocations = {
			mayor: { x: 318, y: 120 },
			shopkeeper: { x: 638, y: 120 },
			blacksmith: { x: 478, y: 560 },
		};
		const restoredVillages = (state.villages || []).filter((village) => village.id !== "village-spawn" || (village.houses || []).length >= 3 && village.houses.every((house) => house.width === HOUSE_WIDTH && Math.hypot(house.x - 478, house.y - 322) < 500)).map((village) => {
			const houses = [];
			for (const house of village.houses || []) {
				const spawnHouse = village.id === "village-spawn" ? spawnHouseLocations[house.role] : null;
				const target = spawnHouse || house;
				const position = findVillageHousePosition(target.x, target.y, houses, Boolean(spawnHouse));
				if (!position) continue;
				const restoredHouse = { ...house, ...position, width: HOUSE_WIDTH, height: HOUSE_HEIGHT };
				houses.push(restoredHouse);
				const move = { x: position.x - house.x, y: position.y - house.y };
				houseMoves.set(`${village.id}:${house.role}`, move);
				houseMoves.set(`${village.id.replace(/^village-/, "")}:${house.role}`, move);
			}
			return { ...village, houses };
		});
		const starterHouses = restoredVillages.find((village) => village.id === "village-spawn")?.houses || [];
		const insideStarterHouse = (entry, margin) => starterHouses.some((house) => Math.abs(entry.x - house.x) < house.width / 2 + margin && Math.abs(entry.y - house.y) < house.height / 2 + margin);
		if (starterHouses.length) {
			for (let index = obstacles.length - 1; index >= 0; index -= 1) if (insideStarterHouse(obstacles[index], obstacles[index].r * 0.5)) obstacles.splice(index, 1);
			obstacleChunks.clear();
			obstacles.forEach(indexObstacle);
			resources.splice(0, resources.length, ...resources.filter((resource) => !insideStarterHouse(resource, 24)));
		}
		villages.splice(0, villages.length, ...restoredVillages);
		const restoredVillagers = (state.villagers || []).flatMap((villager) => {
			const move = houseMoves.get(`${villager.villageId}:${villager.role}`);
			if (!move) return [];
			return [{
				...villager,
				x: villager.x + move.x,
				y: villager.y + move.y,
				homeX: villager.homeX === undefined ? undefined : villager.homeX + move.x,
				homeY: villager.homeY === undefined ? undefined : villager.homeY + move.y,
			}];
		});
		villagers.splice(0, villagers.length, ...restoredVillagers);
		hostileProjectiles.splice(0, hostileProjectiles.length, ...(state.hostileProjectiles || []));
		(state.resourceChunks || []).forEach((key) => resourceChunks.add(key));
		(state.villageChunks || []).forEach((key) => villageChunks.add(key));
		(state.discoveredRecipes || []).forEach((key) => discoveredRecipes.add(key));
		jimothyMet = state.jimothyMet ?? jimothyMet;
		worldEpoch = state.worldEpoch || 0;
		(state.hostileChunks || []).forEach((key) => hostileChunks.add(key));
		Object.assign(questProgress, state.questProgress || {});
		Object.assign(villagerQuestStates, state.villagerQuestStates || {});
		(state.completedSurvivalQuests || []).forEach((id) => completedSurvivalQuests.add(id));
		selectedItem = state.selectedItem || "";
		bed = state.bed || null;
		bedSpawned = Boolean(state.bedSpawned || state.bed);
		spawnPoint = state.spawnPoint || null;
		if (Array.isArray(state.craftingSlots)) {
			const savedGrid = state.craftingSlots.length === 16
				? [0, 1, 2, 4, 5, 6, 8, 9, 10].map((index) => state.craftingSlots[index])
				: state.craftingSlots;
			if (savedGrid.length === 9) craftingSlots.splice(0, 9, ...savedGrid);
		}
	}

	function save() {
		return {
			inventory: player.inventory, resources, animals, mobs, pickups, obstacles,
			generatedChunks: [...generatedChunks], resourceChunks: [...resourceChunks], villageChunks: [...villageChunks],
			villages, villagers, craftingTables, ponds, campfires, hostileProjectiles, craftingSlots,
			discoveredRecipes: [...discoveredRecipes], jimothyMet, selectedItem, questProgress, villagerQuestStates,
			completedSurvivalQuests: [...completedSurvivalQuests], worldEpoch,
			hostileChunks: [...hostileChunks],
			bed, bedSpawned, spawnPoint,
		};
	}

	return {
		setup, update, interact, pickupAt, attackAnimal, blocks, spawnBlocked, drawResource, drawPonds, drawVillages, drawStations, drawCraftingTablesBehindTrees, drawProjectiles, drawPickup, drawNightOverlay,
		refreshInventory, openCrafting: () => openPanel("craft"), useItem, recordQuest, recordVillagerQuestProgress, save, respawnPoint,
		campfires, hostileProjectiles,
	};
})();
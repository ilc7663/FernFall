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
	const torches = [];
	const TORCH_LIGHT_RADIUS = 160;
	let nightLayer = null;
	const ponds = [];
	const hostileProjectiles = [];
	const resourceChunks = new Set();
	const pondChunks = new Set();
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
		healer: { title: "Make a friend", description: "Tame a wolf with a piece of meat.", greeting: "A wolf has been wandering nearby. A bit of meat may help you earn its trust.", event: "wolf", goal: 1, reward: 5 },
	};
	const villagerFollowupQuestDefinitions = {
		mayor: { id: "night_watch", unlockDay: 3, title: "Prepare the Night Watch", description: "Craft a campfire so the night watch can keep the village safe.", greeting: "The nights are getting colder. Could you prepare a campfire for the night watch?", event: "campfire", goal: 1, reward: 5 },
		shopkeeper: { id: "berry_resupply", unlockDay: 3, title: "Restock the Berry Stall", description: "Gather five wild berries for the stall.", greeting: "The berry baskets are empty again. Could you bring five more?", event: "berry", goal: 5, reward: 5 },
		blacksmith: { id: "forge_fuel", unlockDay: 3, title: "Fuel the Forge", description: "Gather six pieces of softwood for the forge.", greeting: "The forge needs another stack of softwood. Can you bring me six?", event: "wood", goal: 6, reward: 6 },
		farmer: { id: "harvest_crates", unlockDay: 3, title: "Fill the Harvest Crates", description: "Gather six crops for the village stores.", greeting: "We need another harvest before the next market. Bring six crops, please.", event: "crop", goal: 6, reward: 5 },
		innkeeper: { id: "second_supper", unlockDay: 3, title: "Serve a Village Supper", description: "Cook two meals for the evening table.", greeting: "The village supper is growing popular. Could you cook two meals for us?", event: "meal", goal: 2, reward: 6 },
		healer: { id: "find_jimothy", unlockDay: 3, title: "Check on Jimothy", description: "Find Jimothy and let the healer know he is well.", greeting: "Jimothy has been out exploring. Could you find him and make sure he is safe?", event: "jimothy", goal: 1, reward: 6 },
	};
	const villagerQuestStates = {};
	const villagerQuestVariants = {
		mayor: [villagerQuestDefinitions.mayor,
			{ title: "Mend the village paths", description: "Gather five stones to repair the village paths.", greeting: "The cobbles are worn thin. Could you gather five stones for repairs?", event: "stone", goal: 5, reward: 4 },
			{ title: "Host a village feast", description: "Cook one meal for the village feast.", greeting: "We want to hold a feast. Could you cook a meal for the table?", event: "meal", goal: 1, reward: 4 }],
		shopkeeper: [villagerQuestDefinitions.shopkeeper,
			{ title: "Stock the herb shelf", description: "Gather four forest herbs for the shop.", greeting: "Customers keep asking for herbs. Could you bring me four?", event: "herb", goal: 4, reward: 3 },
			{ title: "Mushroom market day", description: "Gather four forest mushrooms for the market stall.", greeting: "Market day is coming and my mushroom crates are empty. Could you gather four?", event: "mushroom", goal: 4, reward: 4 }],
		blacksmith: [villagerQuestDefinitions.blacksmith,
			{ title: "Stone for the forge", description: "Gather six stones for the forge walls.", greeting: "The forge walls are cracking. Six good stones should do it.", event: "stone", goal: 6, reward: 5 },
			{ title: "Winter lumber", description: "Gather five pieces of softwood for the lumber rack.", greeting: "Winter is coming and my lumber rack is bare. Can you bring five pieces of softwood?", event: "wood", goal: 5, reward: 4 }],
		farmer: [villagerQuestDefinitions.farmer,
			{ title: "Fresh milk run", description: "Milk a cow and bring the milk home.", greeting: "My cows are fussy for me today. Could you milk one for the farm?", event: "milk", goal: 1, reward: 4 },
			{ title: "Fill the root cellar", description: "Gather six crops for the root cellar.", greeting: "The root cellar is nearly empty. Six crops would see us through.", event: "crop", goal: 6, reward: 5 }],
		innkeeper: [villagerQuestDefinitions.innkeeper,
			{ title: "Berry pie filling", description: "Gather five wild berries for the inn's pies.", greeting: "I'm baking pies tonight and I'm short on berries. Could you gather five?", event: "berry", goal: 5, reward: 4 },
			{ title: "Mushroom stew supplies", description: "Gather three forest mushrooms for the stew pot.", greeting: "A mushroom stew would be perfect on a cold night. Could you gather three?", event: "mushroom", goal: 3, reward: 3 }],
		healer: [villagerQuestDefinitions.healer,
			{ title: "Gather healing herbs", description: "Gather five forest herbs for the healer's remedies.", greeting: "My remedy shelf is bare. Could you gather five herbs?", event: "herb", goal: 5, reward: 4 },
			{ title: "Stock the clinic", description: "Gather six supplies for the clinic.", greeting: "The clinic is running low on everything. Could you gather six supplies?", event: "gathered", goal: 6, reward: 4 }],
	};
	const villageQuestNames = ["Mossbrook", "Hollowfen", "Larkspur", "Thistledown", "Ember Glen", "Willowmere", "Brindle Hill", "Foxglove"];

	function villageKey(villageId) {
		return String(villageId || "spawn").replace(/^village-/, "");
	}

	function villageHash(text) {
		let hash = 2166136261;
		for (const char of text) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
		return hash >>> 0;
	}

	function villageDisplayName(key) {
		return key === "spawn" ? "Fernfall" : villageQuestNames[villageHash(key) % villageQuestNames.length];
	}

	function villageQuestVariant(role, key) {
		const variants = villagerQuestVariants[role];
		return key === "spawn" ? variants[0] : variants[villageHash(`${key}:${role}`) % variants.length];
	}

	// The spawn village keeps the legacy role-only key so existing saves stay valid.
	function villagerStateKey(role, key, quest) {
		const base = key === "spawn" ? role : `${key}|${role}`;
		return quest?.id ? `${base}:${quest.id}` : base;
	}

	function villageQuestPairs() {
		const pairs = new Map();
		for (const villager of villagers) {
			if (!villagerQuestVariants[villager.role]) continue;
			const key = villageKey(villager.villageId);
			pairs.set(`${key}|${villager.role}`, { role: villager.role, key });
		}
		return [...pairs.values()];
	}
	const craftingSlots = Array(9).fill("");
	const NIGHT_CYCLE_MS = 600000;
	const POND_SPAWN_VERSION = 2;
	const hostileChunks = new Set();
	let selectedCategory = "food";
	let selectedItem = "";
	let activeMode = "craft";
	let activeVillagerRole = "";
	let activeVillageKey = "spawn";
	let gatherTask = null;
	const oreKinds = ["iron", "coal", "gold", "crystal", "rock"];
	const oreSpecs = {
		rock: { drop: "stone", ms: 1600 },
		coal: { drop: "coal", ms: 2200 },
		iron: { drop: "iron_ore", ms: 2800 },
		gold: { drop: "gold_ore", ms: 3400 },
		crystal: { drop: "crystal_ore", ms: 4000 },
	};
	const oreItemDefinitions = {
		iron_ore: { name: "Iron ore", category: "materials", icon: "I" },
		gold_ore: { name: "Gold ore", category: "materials", icon: "G" },
		crystal_ore: { name: "Crystal ore", category: "materials", icon: "C" },
		iron: { name: "Iron ingot", category: "materials", icon: "I" },
		gold: { name: "Gold ingot", category: "materials", icon: "G" },
		crystal: { name: "Crystal ingot", category: "materials", icon: "C" },
		torch: { name: "Torch", category: "equipment", icon: "i" },
	};
	const oreSmeltRecipes = [
		{ id: "iron", name: "Iron ingot", ingredients: { iron_ore: 1 }, seconds: 8 },
		{ id: "gold", name: "Gold ingot", ingredients: { gold_ore: 1 }, seconds: 10 },
		{ id: "crystal", name: "Crystal ingot", ingredients: { crystal_ore: 1 }, seconds: 12 },
	];

	// Cumulative spawn odds out of 100: stone 34, coal 28, iron 18, gold 12, crystal 8.
	const oreSpawnLimits = [["rock", 34], ["coal", 62], ["iron", 80], ["gold", 92], ["crystal", 100]];

	function oreKindOf(resource) {
		const roll = Math.abs(Math.floor(resource.x * 7 + resource.y * 13)) % 100;
		return oreSpawnLimits.find(([, limit]) => roll < limit)[0];
	}
	const gatherSpecs = {
		stone: { tool: "pickaxe", baseMs: 1600 },
		berry: { tool: "none", baseMs: 700 },
		wood: { tool: "axe", baseMs: 1800 },
		carrot: { tool: "hoe", baseMs: 800 },
		potato: { tool: "hoe", baseMs: 800 },
		grain: { tool: "hoe", baseMs: 800 },
		mushroom: { tool: "shovel", baseMs: 600 },
		herb: { tool: "shovel", baseMs: 600 },
		shear: { tool: "shears", baseMs: 1200 },
	};

	// Each ore needs a pickaxe one tier below its own level; stone needs none.
	const orePickaxeTier = { rock: 0, coal: 1, iron: 2, gold: 3, crystal: 4 };
	const pickaxeMaterials = ["wood", "stone", "iron", "gold", "crystal"];

	function heldPickaxeTier() {
		const id = window.FernfallGameInventory?.heldTool?.().id || "";
		return pickaxeMaterials.indexOf(id.replace(/_pickaxe$/, "")) + 1;
	}

	function canMineOre(target) {
		const ore = oreKindOf(target);
		const needed = orePickaxeTier[ore];
		if (heldPickaxeTier() >= needed) return true;
		show(`${label(oreSpecs[ore].drop)} needs a ${pickaxeMaterials[needed - 1]} pickaxe or better. Hold one on the hotbar.`);
		return false;
	}

	function gatherDuration(kind, target) {
		const spec = gatherSpecs[kind];
		const baseMs = kind === "stone" ? oreSpecs[oreKindOf(target)].ms : spec.baseMs;
		const held = window.FernfallGameInventory?.heldTool?.() || { tool: "empty", speed: 1 };
		return Math.round(baseMs / (held.tool === spec.tool ? held.speed : 1));
	}

	function startGather(kind, target, finish, remote = false) {
		if (gatherTask?.target === target) return;
		if (kind === "stone" && !canMineOre(target)) return;
		const dx = target.x - player.x;
		const dy = target.y - player.y;
		player.direction = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : dy < 0 ? "up" : "down";
		const duration = gatherDuration(kind, target);
		gatherTask = { kind, target, finish, remote, startedAt: performance.now(), until: performance.now() + duration };
		window.fernfallStartUseAnimation?.(duration);
	}

	function updateGather() {
		if (!gatherTask) return;
		const { kind, target, finish, until, remote } = gatherTask;
		if ((typeof moving === "function" && moving()) || (!remote && !near(target, player, 80))) {
			gatherTask = null;
			player.useUntil = 0;
			return;
		}
		const now = performance.now();
		if (now < until) {
			if (now - (gatherTask.fxAt || 0) >= 450) {
				gatherTask.fxAt = now;
				window.fernfallGatherFx?.(kind, target, false);
			}
			return;
		}
		gatherTask = null;
		window.fernfallGatherFx?.(kind, target, true);
		finish();
	}

	function collectResource(resource) {
		if (!resource.available) return;
		const amount = resource.type === "berry" ? 2 + Math.floor(Math.random() * 2) : 1;
		resource.available = false;
		resource.respawnAt = Date.now() + NIGHT_CYCLE_MS * 3;
		const drop = resource.type === "stone" ? oreSpecs[oreKindOf(resource)].drop : resource.type;
		player.inventory[drop] = (player.inventory[drop] || 0) + amount;
		recordQuest("gathered", amount);
		recordVillagerQuestProgress(resource.type, amount);
		show(resource.type === "stone" && drop !== "stone" ? `Mined ${label(drop).toLowerCase()}.` : amount > 1 ? `Picked ${amount} ${label(resource.type).toLowerCase()}s from the bush.` : `Gathered ${label(drop)}.`);
		updateHud();
		saveGame();
	}

	function chopTree(tree) {
		if (tree.chopped) return;
		tree.woodHits = (tree.woodHits || 0) + 1;
		player.inventory.wood = (player.inventory.wood || 0) + 1;
		recordQuest("gathered");
		recordVillagerQuestProgress("wood");
		if (tree.woodHits >= 3) tree.chopped = true;
		show(tree.chopped ? "Gathered wood. The tree is now a stump." : "Gathered wood from the tree.");
		updateHud();
		saveGame();
	}

	function shearSheep(sheep) {
		sheep.shornUntil = Date.now() + 60000;
		addDrop(sheep.x, sheep.y, "wool", 2);
		show("You sheared the sheep.");
		saveGame();
	}
	let activeFireId = null;
	let lastRefresh = 0;
	let sickUntil = 0;
	let nextSicknessDamage = 0;
	let worldEpoch = 0; 	let spawnTableTaken = false;
	let currentNightIndex = -1;
	let bed = null;
	let bedSpawned = false;
	let spawnPoint = null;
	let sleepOverlayTimer = 0;
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

	function dayProgress(now = Date.now()) {
		if (!worldEpoch) worldEpoch = now;
		const elapsed = Math.max(0, now - worldEpoch);
		const phase = (elapsed % NIGHT_CYCLE_MS) / NIGHT_CYCLE_MS;
		return { day: Math.floor(elapsed / NIGHT_CYCLE_MS) + 1, progress: phase };
	}

	function updateWorldClock(now) {
		const elapsed = Math.max(0, now - worldEpoch);
		const phase = (elapsed % NIGHT_CYCLE_MS) / NIGHT_CYCLE_MS;
		const isNight = phase >= 0.68 || phase < 0.16;
		const timeLabel = document.querySelector("#time-label");
		if (timeLabel) timeLabel.textContent = isNight ? "Night" : phase < 0.24 ? "Dawn" : phase < 0.5 ? "Morning" : phase < 0.68 ? "Evening" : "Night";
		const dayLabel = document.querySelector("#day-count");
		const day = Math.floor(elapsed / NIGHT_CYCLE_MS) + 1;
		if (dayLabel) dayLabel.textContent = String(day);
		const tracker = document.querySelector("#day-tracker");
		if (tracker) {
			const progress = phase * 100;
			tracker.setAttribute("aria-valuenow", String(Math.round(progress)));
			tracker.querySelector(".day-fill").style.width = `${progress}%`;
			tracker.querySelector(".day-value").textContent = `${Math.round(progress)}%`;
			tracker.querySelector(".day-label").textContent = `DAY ${day}`;
		}
		return { isNight, nightIndex: day - 1 };
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

	function currentVillagerQuest(role, key = "spawn") {
		const firstQuest = villageQuestVariant(role, key);
		const firstState = villagerQuestStates[villagerStateKey(role, key)];
		const followup = villagerFollowupQuestDefinitions[role];
		return followup && dayProgress().day >= followup.unlockDay && firstState?.claimed && (firstState.claimedDay === undefined || dayProgress().day > firstState.claimedDay) ? followup : firstQuest;
	}

	function villagerQuestState(role, key = "spawn", quest = currentVillagerQuest(role, key)) {
		if (!quest) return null;
		return (villagerQuestStates[villagerStateKey(role, key, quest)] ??= { accepted: false, progress: 0, claimed: false });
	}

	function refreshVillageQuestBoard() {
		const section = document.querySelector("#village-quest-section");
		const list = document.querySelector("#village-quest-list");
		if (!section || !list) return;
		const activeQuests = villageQuestPairs().flatMap(({ role, key }) => {
			const quest = currentVillagerQuest(role, key);
			const state = villagerQuestState(role, key, quest);
			return state?.accepted && !state.claimed ? [[key, quest, state]] : [];
		});
		section.hidden = activeQuests.length === 0;
		list.innerHTML = activeQuests.map(([key, quest, state]) => {
			const ready = state.progress >= quest.goal;
			return `<p class="survival-quest${ready ? " complete" : ""}" title="${villageDisplayName(key)}"><span>${ready ? "✓" : "○"}</span><span>${quest.title} · ${villageDisplayName(key)}</span><strong>${Math.min(state.progress, quest.goal)}/${quest.goal}</strong></p>`;
		}).join("");
	}

	function recordVillagerQuestProgress(event, amount = 1) {
		if (["carrot", "potato", "grain"].includes(event)) event = "crop";
		let changed = false;
		for (const { role, key } of villageQuestPairs()) {
			const quest = currentVillagerQuest(role, key);
			const state = villagerQuestState(role, key, quest);
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
		const quest = currentVillagerQuest(role, activeVillageKey);
		const state = villagerQuestState(role, activeVillageKey, quest);
		if (!quest || !state) return;
		const roleName = `${role[0].toUpperCase() + role.slice(1)} of ${villageDisplayName(activeVillageKey)}`;
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
		if (!villagerQuestVariants[villager.role]) {
			show("The villager smiles and waves.");
			return;
		}
		activeVillagerRole = villager.role;
		activeVillageKey = villageKey(villager.villageId);
		refreshVillagerDialogue();
		const dialog = document.querySelector("#villager-dialog");
		if (!dialog.open) dialog.showModal();
	}

	function handleVillagerQuestAction() {
		const quest = currentVillagerQuest(activeVillagerRole, activeVillageKey);
		const state = villagerQuestState(activeVillagerRole, activeVillageKey, quest);
		if (!quest || !state || state.claimed) return;
		if (!state.accepted) {
			state.accepted = true;
			show(`Quest accepted: ${quest.title}.`);
		} else if (state.progress >= quest.goal) {
			state.claimed = true;
			state.claimedDay = dayProgress().day;
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

	const FURNACE_STACK = 64;
	let furnaceCursor = null;

	function furnaceRecipes() {
		return [...recipes.filter((recipe) => furnaceRecipeIds.has(recipe.id)), ...oreSmeltRecipes];
	}

	function smeltRecipeFor(inputId) {
		return furnaceRecipes().find((recipe) => Object.keys(recipe.ingredients)[0] === inputId);
	}

	// Converts older single-item furnace saves to the slot model once.
	function furnaceState(fire) {
		if (fire.furnaceReady) return fire;
		fire.furnaceReady = true;
		fire.input ??= null;
		fire.fuel ??= null;
		fire.output ??= null;
		fire.burnMs = fire.furnaceFuelMs || 0;
		if (fire.cooking) {
			if (fire.cooking.ready) fire.output = { id: fire.cooking.recipeId, count: 1 };
			else if (fire.cooking.inputId) fire.input = { id: fire.cooking.inputId, count: 1 };
			fire.cooking = null;
		}
		return fire;
	}

	function furnaceHasItems(fire) {
		return Boolean(fire.input || fire.fuel || fire.output || fire.cooking);
	}

	function stackIntoSlot(fire, slot, id, count) {
		const current = fire[slot];
		if (current && current.id !== id) return 0;
		const moved = Math.min(FURNACE_STACK - (current?.count || 0), count);
		if (moved <= 0) return 0;
		fire[slot] = { id, count: (current?.count || 0) + moved };
		return moved;
	}

	function refuelFurnace(fire) {
		if (fire.burnMs > 0) return true;
		const burnMs = fire.fuel && furnaceFuelMs[fire.fuel.id];
		if (!burnMs) return false;
		fire.burnId = fire.fuel.id;
		fire.fuel.count -= 1;
		if (fire.fuel.count <= 0) fire.fuel = null;
		fire.burnMs = burnMs;
		return true;
	}

	function tryStartSmelt(fire) {
		const recipe = fire.input && smeltRecipeFor(fire.input.id);
		if (!recipe) return;
		if (fire.output && (fire.output.id !== recipe.id || fire.output.count >= FURNACE_STACK)) return;
		if (!(fire.burnMs > 0) && !(fire.fuel && furnaceFuelMs[fire.fuel.id])) return;
		const inputId = fire.input.id;
		fire.input.count -= 1;
		if (fire.input.count <= 0) fire.input = null;
		fire.cooking = { recipeId: recipe.id, inputId, startedAt: Date.now(), duration: recipe.seconds * 1000, ready: false };
		discoveredRecipes.add(recipe.id);
	}

	// Fuel only burns while something is smelting, so a coal stack keeps the furnace running.
	function updateFurnaces(now) {
		for (const fire of campfires) {
			if (fire.kind !== "furnace") continue;
			furnaceState(fire);
			const elapsed = Math.min(now - (fire.lastTick || now), 500);
			fire.lastTick = now;
			if (!fire.cooking) {
				tryStartSmelt(fire);
				continue;
			}
			if (!refuelFurnace(fire)) {
				fire.cooking.startedAt += elapsed;
				continue;
			}
			fire.burnMs -= elapsed;
			if (now - fire.cooking.startedAt < fire.cooking.duration) continue;
			stackIntoSlot(fire, "output", fire.cooking.recipeId, 1);
			fire.cooking = null;
			tryStartSmelt(fire);
			saveGame();
		}
	}

	function furnaceItemMarkup(id) {
		if (!id) return "";
		const image = inventoryImageSource(id);
		return image ? `<img class="item-texture" src="${image}" alt="">` : `<span class="item-icon">${itemInfo[id]?.icon || "?"}</span>`;
	}

	function renderFurnaceCursor() {
		let element = document.querySelector("#furnace-cursor");
		if (!element) {
			element = document.createElement("div");
			element.id = "furnace-cursor";
			element.hidden = true;
			document.body.append(element);
		}
		element.hidden = !furnaceCursor;
		element.innerHTML = furnaceCursor ? `${furnaceItemMarkup(furnaceCursor.id)}<b>${furnaceCursor.count}</b>` : "";
	}

	function moveFurnaceCursor(event) {
		const element = document.querySelector("#furnace-cursor");
		if (!element || !furnaceCursor) return;
		element.style.left = `${event.clientX + 14}px`;
		element.style.top = `${event.clientY + 14}px`;
	}

	function returnFurnaceCursor() {
		if (!furnaceCursor) return;
		player.inventory[furnaceCursor.id] = (player.inventory[furnaceCursor.id] || 0) + furnaceCursor.count;
		furnaceCursor = null;
		renderFurnaceCursor();
		updateHud();
		saveGame();
	}

	function pickUpForFurnace(id) {
		returnFurnaceCursor();
		const count = Math.min(player.inventory[id] || 0, FURNACE_STACK);
		if (count < 1) return;
		player.inventory[id] -= count;
		furnaceCursor = { id, count };
	}

	function useFurnaceSlot(slot, placeOne) {
		const fire = currentFire();
		if (!fire) return;
		furnaceState(fire);
		if (placeOne && !furnaceCursor && slot !== "collect" && fire[slot]) {
			const stack = fire[slot];
			const half = Math.ceil(stack.count / 2);
			player.inventory[stack.id] = (player.inventory[stack.id] || 0) + half;
			stack.count -= half;
			if (stack.count <= 0) fire[slot] = null;
			updateHud();
			saveGame();
			return;
		}
		if (slot === "output" || slot === "collect") {
			if (furnaceCursor && slot === "output") return show("Nothing can be put in the output.");
			const output = fire.output;
			if (!output) return;
			player.inventory[output.id] = (player.inventory[output.id] || 0) + output.count;
			fire.output = null;
			if (itemInfo[output.id]?.category === "food") recordQuest("meal");
			show(`Collected ${label(output.id).toLowerCase()} x${output.count}.`);
			updateHud();
			saveGame();
			return;
		}
		if (!furnaceCursor) {
			if (!fire[slot]) return;
			furnaceCursor = fire[slot];
			fire[slot] = null;
			saveGame();
			return;
		}
		const id = furnaceCursor.id;
		if (slot === "input" && !smeltRecipeFor(id)) return show(furnaceFuelMs[id] ? `${label(id)} is fuel. Put it in the FUEL slot.` : `${label(id)} can't be smelted.`);
		if (slot === "fuel" && !furnaceFuelMs[id]) return show(`${label(id)} isn't fuel. Use coal, wood or sticks.`);
		if (fire[slot] && fire[slot].id !== id) return show("Take out what is in that slot first.");
		const moved = stackIntoSlot(fire, slot, id, placeOne ? 1 : furnaceCursor.count);
		if (!moved) return show("That slot is full.");
		furnaceCursor.count -= moved;
		if (furnaceCursor.count <= 0) furnaceCursor = null;
		updateHud();
		saveGame();
	}

	function renderFurnaceWorkspace(fire) {
		const workspace = document.querySelector("#furnace-workspace");
		workspace.hidden = activeMode !== "furnace";
		if (workspace.hidden) return;
		if (fire) furnaceState(fire);
		const setHtml = (element, html) => {
			if (element.dataset.html === html) return;
			element.dataset.html = html;
			element.innerHTML = html;
		};
		const inputIds = [...new Set(furnaceRecipes().map((recipe) => Object.keys(recipe.ingredients)[0]))];
		setHtml(document.querySelector("#furnace-recipe-list"), inputIds.map((id) => {
			const count = player.inventory[id] || 0;
			return `<button type="button" class="furnace-recipe" data-furnace-pick="${id}" data-tip="${label(id)}" ${count < 1 ? "disabled" : ""}>${furnaceItemMarkup(id)}<span>${label(id)} → ${smeltRecipeFor(id).name}</span><small>${count}</small></button>`;
		}).join(""));
		setHtml(document.querySelector("#furnace-fuel-list"), Object.entries(furnaceFuelMs).map(([id, burnMs]) => {
			const count = player.inventory[id] || 0;
			return `<button type="button" class="furnace-fuel" data-furnace-pick="${id}" data-tip="${label(id)}" ${count < 1 ? "disabled" : ""}>${furnaceItemMarkup(id)}<span>${label(id)}</span><small>${count} · ${Math.round(burnMs / 1000)}s</small></button>`;
		}).join(""));
		const cooking = fire?.cooking;
		const slotMarkup = (stack) => (stack ? `${furnaceItemMarkup(stack.id)}${stack.count > 1 ? `<b class="furnace-slot-count">${stack.count}</b>` : ""}` : "");
		const inputStack = fire?.input || (cooking ? { id: cooking.inputId, count: 1 } : null);
		const fuelStack = fire?.fuel || (fire?.burnMs > 0 ? { id: fire.burnId || "coal", count: 1 } : null);
		setHtml(document.querySelector("#furnace-input-slot"), slotMarkup(inputStack));
		setHtml(document.querySelector("#furnace-fuel-slot"), slotMarkup(fuelStack));
		setHtml(document.querySelector("#furnace-output-slot"), slotMarkup(fire?.output));
		for (const [selector, stack] of [["#furnace-input-slot", inputStack], ["#furnace-fuel-slot", fuelStack], ["#furnace-output-slot", fire?.output]]) {
			const slotElement = document.querySelector(selector);
			if (stack) slotElement.dataset.tip = `${label(stack.id)}${stack.count > 1 ? ` ×${stack.count}` : ""}`;
			else delete slotElement.dataset.tip;
		}
		const burning = (fire?.burnMs || 0) > 0;
		document.querySelector("#furnace-fuel-status").textContent = burning ? `Burning · ${Math.ceil(fire.burnMs / 1000)}s left on this fuel` : fire?.fuel ? "Fuel loaded. It burns while smelting." : "Add coal, wood, or sticks for fuel.";
		const progress = cooking ? Math.min(100, (Date.now() - cooking.startedAt) / cooking.duration * 100) : 0;
		document.querySelector("#furnace-progress-fill").style.width = `${progress}%`;
		let status = "Pick up an item on the left, then click INPUT or FUEL.";
		if (cooking) status = burning || fire.fuel ? `Smelting ${label(cooking.inputId)} → ${label(cooking.recipeId)}…` : "Out of fuel. Add more to keep smelting.";
		else if (fire?.input && !(burning || fire.fuel)) status = "Add fuel to start smelting.";
		else if (fire?.input && fire.output && fire.output.id !== smeltRecipeFor(fire.input.id)?.id) status = "Collect the output to smelt something different.";
		else if (fire?.output) status = "Click OUTPUT to collect.";
		document.querySelector("#furnace-status").textContent = status;
		const collect = document.querySelector("#furnace-collect");
		collect.hidden = !fire?.output;
		collect.disabled = !fire?.output;
	}

	function openPanel(mode, fire = null) {
		returnFurnaceCursor();
		if (mode === "craft" && window.FernfallCrafting) {
			window.FernfallCrafting.open({ table: true });
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

	function placeTorch() {
		const offset = { up: [0, -40], down: [0, 40], left: [-40, 0], right: [40, 0] }[player.direction];
		const x = player.x + offset[0];
		const y = player.y + offset[1];
		if (collides(x, y) || spawnBlocked(x, y, 8) || torches.some((torch) => near(torch, { x, y }, 28))) return show("There is no clear space for a torch.");
		torches.push({ id: `torch-${Date.now()}-${torches.length}`, x, y });
		player.inventory.torch -= 1;
		show("Torch placed. It lights the night and keeps monsters from spawning nearby.");
		updateHud();
		saveGame();
	}

	function torchLit(x, y) {
		return torches.some((torch) => Math.hypot(torch.x - x, torch.y - y) < TORCH_LIGHT_RADIUS);
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
		const now = Date.now();
		const elapsed = Math.max(0, now - worldEpoch);
		const dayIndex = Math.floor(elapsed / NIGHT_CYCLE_MS);
		worldEpoch = now - (dayIndex * NIGHT_CYCLE_MS + NIGHT_CYCLE_MS * 0.16);
		currentNightIndex = dayIndex;
		hostileProjectiles.length = 0;
		updateWorldClock(now);
		let overlay = document.querySelector("#sleep-overlay");
		if (!overlay) {
			overlay = document.createElement("div");
			overlay.id = "sleep-overlay";
			overlay.className = "sleep-overlay";
			overlay.setAttribute("role", "status");
			overlay.setAttribute("aria-live", "assertive");
			overlay.textContent = "Sleeping through the night";
			(document.querySelector(".scene-wrap") || document.body).append(overlay);
		}
		window.clearTimeout(sleepOverlayTimer);
		overlay.classList.add("is-visible");
		sleepOverlayTimer = window.setTimeout(() => overlay.classList.remove("is-visible"), 2200);
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
		ctx.ellipse(bed.x, bed.y + 28, 25, 7, 0, 0, Math.PI * 2);
		ctx.fill();
		if (window.fernfallDrawNatureSprite?.("beds", "bed_down", bed.x, bed.y, 44, 60)) return;
		ctx.fillStyle = "#8a5a35";
		ctx.fillRect(bed.x - 20, bed.y - 24, 40, 48);
		ctx.fillStyle = "#d9d2c0";
		ctx.fillRect(bed.x - 17, bed.y - 20, 34, 24);
	}

	function blocks(x, y, animalType = "") {
		if (animalType !== "rabbit" && campfires.some((fire) => Math.hypot(x - fire.x, y - fire.y) < (fire.kind === "furnace" ? 34 : 27))) return true;
		if (bed && Math.abs(x - bed.x) < 28 && Math.abs(y - bed.y) < 31) return true;
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

	function pondSpawnIsClear(pond, nearbyPonds = ponds, nearbyVillages = villages) {
		const halfWidth = pond.width / 2;
		const halfHeight = pond.height / 2;
		const overlaps = (entry, padX = 18, padY = padX) =>
			Math.abs(pond.x - entry.x) < halfWidth + padX && Math.abs(pond.y - entry.y) < halfHeight + padY;
		if (window.fernfallPathOverlaps?.(pond.x, pond.y, pond.width + 40, pond.height + 40)) return false;
		const clearRadius = Math.min(halfWidth, halfHeight) + 20;
		const spawnAreaIsClear = window.fernfallSpawnAreaIsClear
			? window.fernfallSpawnAreaIsClear(pond.x, pond.y, clearRadius)
			: !collides(pond.x, pond.y);
		if (!spawnAreaIsClear || overlaps(player, 48, 48)) return false;
		if (obstacles.some((tree) => overlaps(tree, tree.r * 0.66))) return false;
		if (resources.some((resource) => overlaps(resource, 22))) return false;
		if (animals.some((animal) => overlaps(animal, 32))) return false;
		if (mobs.some((mob) => mob.alive && overlaps(mob, 24))) return false;
		if (pickups.some((pickup) => overlaps(pickup, 14))) return false;
		if (campfires.some((fire) => overlaps(fire, 34))) return false;
		if (craftingTables.some((table) => overlaps(table, 32, 28))) return false;
		if (bed && overlaps(bed, 30, 36)) return false;
		if (nearbyVillages.some((village) => village.houses.some((house) =>
			Math.abs(pond.x - house.x) < halfWidth + house.width / 2 + 24 &&
			Math.abs(pond.y - house.y) < halfHeight + house.height / 2 + 24,
		))) return false;
		return !nearbyPonds.some((other) =>
			Math.abs(pond.x - other.x) < halfWidth + (other.width || 120) / 2 + 24 &&
			Math.abs(pond.y - other.y) < halfHeight + (other.height || 84) / 2 + 24,
		);
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
		} else if (selectedItem === "torch") {
			placeTorch();
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
		if (itemInfo[recipeId]?.category === "food") recordQuest("meal");
		fire.cooking = null;
		show(`${label(recipeId)} added to your pack.`);
		updateHud();
		saveGame();
		return true;
	}

	function pickupBed() {
		if (!bed) return false;
		bed = null;
		player.inventory.bed = (player.inventory.bed || 0) + 1;
		show("Picked up bed. Your spawn point stays where you last slept.");
		updateHud();
		saveGame();
		return true;
	}

	function pickupAt(x, y) {
		if (bed && Math.abs(bed.x - x) <= 28 && Math.abs(bed.y - y) <= 32) {
			return pickupBed();
		}
		const resource = resources.find((entry) => entry.available && Math.hypot(entry.x - x, entry.y - y) < 30);
		if (resource) {
			if (gatherSpecs[resource.type]) startGather(resource.type, resource, () => collectResource(resource), true);
			else {
				window.fernfallStartUseAnimation?.();
				collectResource(resource);
			}
			return true;
		}

		const furnaceIndex = campfires.findIndex((fire) => fire.kind === "furnace" && Math.hypot(fire.x - x, fire.y - y) < 36);
		if (furnaceIndex >= 0) {
			const furnace = furnaceState(campfires[furnaceIndex]);
			const contents = [furnace.input, furnace.fuel, furnace.output, furnace.cooking ? { id: furnace.cooking.inputId, count: 1 } : null];
			for (const stack of contents) {
				if (stack) player.inventory[stack.id] = (player.inventory[stack.id] || 0) + stack.count;
			}
			campfires.splice(furnaceIndex, 1);
			player.inventory.furnace = (player.inventory.furnace || 0) + 1;
			show(contents.some(Boolean) ? "Picked up furnace and everything inside." : "Picked up furnace.");
			updateHud();
			saveGame();
			return true;
		}

		const torchIndex = torches.findIndex((torch) => Math.hypot(torch.x - x, torch.y - y) < 20);
		if (torchIndex >= 0) {
			torches.splice(torchIndex, 1);
			player.inventory.torch = (player.inventory.torch || 0) + 1;
			show("Picked up torch.");
			updateHud();
			saveGame();
			return true;
		}

		const coalFire = campfires.find((fire) => fire.kind !== "furnace" && !fire.coalCollected && Math.hypot(fire.x + 24 - x, fire.y + 10 - y) < 14);
		if (coalFire) {
			coalFire.coalCollected = true;
			player.inventory.coal = (player.inventory.coal || 0) + 1;
			show("Picked up coal from the campfire.");
			return true;
		}

		const tableIndex = craftingTables.findIndex((table) => Math.hypot(table.x - x, table.y - y) < 36);
		if (tableIndex >= 0) {
			if (craftingTables[tableIndex].id === "village-table-spawn") spawnTableTaken = true;
			craftingTables.splice(tableIndex, 1);
			player.inventory.crafting_table = (player.inventory.crafting_table || 0) + 1;
			show("Picked up crafting table.");
			return true;
		}
		return false;
	}

	function relocateJimothy(jimothy) {
		for (let attempt = 0; attempt < 24; attempt += 1) {
			const angle = Math.random() * Math.PI * 2;
			const distance = 650 + Math.random() * 800;
			const x = player.x + Math.cos(angle) * distance;
			const y = player.y + Math.sin(angle) * distance;
			if (!(window.fernfallSpawnAreaIsClear?.(x, y, 20) ?? !collides(x, y)) && attempt < 23) continue;
			jimothy.x = x;
			jimothy.y = y;
			break;
		}
		jimothy.roamAngle = Math.random() * Math.PI * 2;
	}

	function ensureJimothy() {
		if (animals.some((animal) => animal.type === "jimothy")) return;
		const jimothy = { type: "jimothy", name: "Jimothy", x: player.x, y: player.y, phase: 5, roamAngle: 2.2, turnTimer: 0, direction: "down", moving: false };
		relocateJimothy(jimothy);
		animals.push(jimothy);
	}

	// Untamed Jimothy wanders off to another part of the world; a carrot tames him for good.
	function meetJimothy(jimothy) {
		jimothyMet = true;
		recordQuest("jimothy");
		if (player.inventory.carrot > 0) {
			player.inventory.carrot -= 1;
			if (Math.random() < 0.35) {
				relocateJimothy(jimothy);
				show("Jimothy nibbles the carrot, isn't satisfied, and trots off. Try again with another.");
				updateHud();
				saveGame();
				return;
			}
			jimothy.tamed = true;
			jimothy.happyUntil = performance.now() + 1800;
			show("Jimothy happily crunches the carrot and joins you!");
		} else {
			const hasBerry = player.inventory.berry > 0;
			if (hasBerry) {
				player.inventory.berry -= 1;
				addDrop(jimothy.x, jimothy.y, "berry_hand_pie");
			}
			relocateJimothy(jimothy);
			show(hasBerry ? "Jimothy shares a berry hand pie, then bounds off to another part of the forest." : "Jimothy bounds off to another part of the forest. A carrot might make him stay.");
		}
		updateHud();
		saveGame();
	}

	function interact() {
		if (bed && near(bed, player, 66) && !campfires.some((entry) => near(entry, player, 68))) {
			if (updateWorldClock(Date.now()).isNight) sleepInBed();
			else pickupBed();
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
		const jimothy = animals.find((animal) => animal.type === "jimothy" && !animal.tamed && near(animal, player, 58));
		if (jimothy) {
			meetJimothy(jimothy);
			return true;
		}
		if ((selectedItem === "bucket_empty" || window.FernfallGameInventory?.heldTool?.().id === "bucket_empty") && player.inventory.bucket_empty > 0) {
			const cow = animals.find((animal) => animal.type === "cow" && near(animal, player, 58));
			if (cow) {
				if (cow.milkedUntil > Date.now()) show("This cow needs time before it can be milked again.");
				else {
					cow.milkedUntil = Date.now() + 45000;
					player.inventory.bucket_empty -= 1;
					player.inventory.bucket_milk = (player.inventory.bucket_milk || 0) + 1;
					recordQuest("milk");
					window.fernfallStartUseAnimation?.(500);
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
				window.fernfallStartUseAnimation?.(500);
				show("You filled the bucket with water.");
				updateHud();
				saveGame();
				return true;
			}
		}
		if (window.FernfallGameInventory?.heldTool?.().tool === "shears") {
			const sheep = animals.find((animal) => animal.type === "sheep" && near(animal, player, 58));
			if (sheep) {
				if ((sheep.shornUntil || 0) > Date.now()) show("This sheep needs time to regrow its wool.");
				else startGather("shear", sheep, () => shearSheep(sheep));
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
		const resource = resources.find((entry) => entry.available && ["stone", "berry", "carrot", "potato", "mushroom", "grain", "herb"].includes(entry.type) && near(entry, player, 50));
		if (resource) {
			startGather(resource.type, resource, () => collectResource(resource));
			return true;
		}
		const tree = obstacles.find((entry) => !entry.chopped && near(entry, player, 56));
		if (tree) {
			startGather("wood", tree, () => chopTree(tree));
			return true;
		}
		return false;
	}

	function attackAnimal() {
		const animal = animals.find((entry) => entry.hp > 0 && !(entry.type === "wolf" && entry.tamed) && (window.fernfallMeleeHitboxContains?.(entry) ?? near(entry, player, 62)));
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
			const key = villageKey(villager.villageId);
			const quest = villagerQuestVariants[villager.role] && currentVillagerQuest(villager.role, key);
			const state = quest && villagerQuestStates[villagerStateKey(villager.role, key, quest)];
			if (!quest || state?.claimed) continue;
			const ready = Boolean(state?.accepted && state.progress >= quest.goal);
			const inProgress = Boolean(state?.accepted && !ready);
			const markX = villager.x - camera.x;
			const markY = y - 38 + Math.sin(performance.now() / 240 + villager.phase) * 2;
			ctx.save();
			ctx.font = "bold 24px sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.lineWidth = 4;
			ctx.strokeStyle = "#2d2a1f";
			ctx.strokeText("!", markX, markY);
			ctx.fillStyle = ready ? "#59c466" : inProgress ? "#a9adb0" : "#f4cf3d";
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
		for (const torch of torches) {
			const flicker = 0.85 + Math.sin(performance.now() / 110 + torch.x) * 0.15;
			ctx.fillStyle = "#30483b44";
			ctx.beginPath();
			ctx.ellipse(torch.x, torch.y + 8, 9, 3, 0, 0, Math.PI * 2);
			ctx.fill();
			if (!drawPackStationArt("torch", torch.x, torch.y - 6, 34)) {
				ctx.fillStyle = "#7a5632";
				ctx.fillRect(torch.x - 2, torch.y - 10, 4, 18);
				ctx.fillStyle = "#ef9b4b";
				ctx.beginPath();
				ctx.arc(torch.x, torch.y - 14, 5 * flicker, 0, Math.PI * 2);
				ctx.fill();
			}
		}
		if (gatherTask) {
			const progress = Math.min(1, (performance.now() - gatherTask.startedAt) / (gatherTask.until - gatherTask.startedAt));
			ctx.fillStyle = "#1b2a21cc";
			ctx.fillRect(player.x - 18, player.y - 52, 36, 6);
			ctx.fillStyle = "#e7c56e";
			ctx.fillRect(player.x - 17, player.y - 51, 34 * progress, 4);
		}
		for (const fire of campfires) {
			if (fire.kind !== "furnace" && !fire.coalCollected) {
				const coalX = fire.x + 24;
				const coalY = fire.y + 10;
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
				if (!drawPackStationArt(fire.cooking && fire.burnMs > 0 ? "furnace_lit" : "furnace_unlit", fire.x, fire.y, 58)) {
					ctx.fillStyle = "#77776f";
					ctx.fillRect(fire.x - 20, fire.y - 20, 40, 40);
					ctx.fillStyle = fire.cooking ? "#ef9b4b" : "#343b39";
					ctx.fillRect(fire.x - 9, fire.y - 8, 18, 19);
				}
			} else {
				const x = fire.x - 28;
				const y = fire.y - 28;
				if (!FernfallCooking.drawCampfire(ctx, x, y, performance.now(), 56, true)) {
					ctx.fillStyle = "#875938";
					ctx.fillRect(fire.x - 17, fire.y - 6, 34, 12);
					ctx.fillStyle = "#ef9b4b";
					ctx.beginPath();
					ctx.arc(fire.x, fire.y - 5, 9 + Math.sin(performance.now() / 120) * 2, 0, Math.PI * 2);
					ctx.fill();
				}
			}
			if (fire.cookware) FernfallCooking.draw(ctx, fire.cooking ? `${fire.cookware}_food` : `${fire.cookware}_empty`, fire.x - 18, fire.y - 36, 36, 30);
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
				const types = ["stone", "stone", "carrot", "potato", "berry", "mushroom", "grain", "herb"];
				if (random() < 0.68) continue;
				for (let index = 0; index < 5; index += 1) {
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
					if (resource.type !== "stone" && random() < 0.4) continue;
					if (resource.type === "berry" && random() < 0.55) continue;
					resources.push(resource);
					if (resource.type === "mushroom") {
						const clusterSize = 2 + Math.floor(random() * 3);
						for (let member = 0; member < clusterSize; member += 1) {
							for (let attempt = 0; attempt < 6; attempt += 1) {
								const angle = random() * Math.PI * 2;
								const distance = 26 + random() * 26;
								const mushroom = { ...resource, x: resource.x + Math.cos(angle) * distance, y: resource.y + Math.sin(angle) * distance };
								const clear = window.fernfallSpawnAreaIsClear?.(mushroom.x, mushroom.y, 10) ?? !collides(mushroom.x, mushroom.y);
								if (!clear || Math.hypot(player.x - mushroom.x, player.y - mushroom.y) <= 85) continue;
								resources.push(mushroom);
								break;
							}
						}
					}
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
				generateVillage(random, cx, cy);
			}
		}
	}

	function generatePondChunks() {
		const centerX = Math.floor(player.x / WORLD_CHUNK_SIZE);
		const centerY = Math.floor(player.y / WORLD_CHUNK_SIZE);
		for (let cy = centerY - 1; cy <= centerY + 1; cy += 1) {
			for (let cx = centerX - 1; cx <= centerX + 1; cx += 1) {
				const key = `${cx},${cy}`;
				if (pondChunks.has(key)) continue;
				pondChunks.add(key);
				let seed = (Math.imul(cx, 374761393) ^ Math.imul(cy, 668265263) ^ 0x9e3779b9) >>> 0;
				const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
				if (random() > 0.4) continue;
				for (let attempt = 0; attempt < 28; attempt += 1) {
					const small = random() < 0.42;
					const columns = small ? 4 + Math.floor(random() * 2) : 6 + Math.floor(random() * 2);
					const rows = small ? 3 + Math.floor(random() * 2) : 4 + Math.floor(random() * 2);
					const width = columns * 64;
					const height = rows * 64;
					const pond = {
						x: cx * WORLD_CHUNK_SIZE + width / 2 + random() * (WORLD_CHUNK_SIZE - width),
						y: cy * WORLD_CHUNK_SIZE + height / 2 + random() * (WORLD_CHUNK_SIZE - height),
						width, height, depth: random(), sizeVersion: 1,
					};
					if (!pondSpawnIsClear(pond)) continue;
					ponds.push(pond);
					break;
				}
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
				return Math.abs(candidate.x - pond.x) < radiusX && Math.abs(candidate.y - pond.y) < radiusY;
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
		if (tablePosition && !spawnTableTaken) craftingTables.push({ id: tableId, ...tablePosition, village: true });
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
				if (random() > 0.75) continue;
				const roll = random();
				const type = roll < 0.12 ? "witch" : roll < 0.33 ? "spider" : roll < 0.48 ? "bat" : roll < 0.7 ? "skeleton" : roll < 0.82 ? "zombie" : "slime";
				let position = null;
				for (let attempt = 0; attempt < 16; attempt += 1) {
					const candidate = {
						x: cx * WORLD_CHUNK_SIZE + 70 + random() * (WORLD_CHUNK_SIZE - 140),
						y: cy * WORLD_CHUNK_SIZE + 70 + random() * (WORLD_CHUNK_SIZE - 140),
					};
					const clear = window.fernfallSpawnAreaIsClear?.(candidate.x, candidate.y, 22) ?? !collides(candidate.x, candidate.y);
					if (clear && Math.hypot(player.x - candidate.x, player.y - candidate.y) >= 120 && !torchLit(candidate.x, candidate.y)) {
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
		const lights = torches.filter((torch) => torch.x > camera.x - TORCH_LIGHT_RADIUS && torch.x < camera.x + WIDTH + TORCH_LIGHT_RADIUS && torch.y > camera.y - TORCH_LIGHT_RADIUS && torch.y < camera.y + HEIGHT + TORCH_LIGHT_RADIUS);
		if (!lights.length) {
			ctx.save();
			ctx.fillStyle = `rgba(15, 27, 48, ${opacity})`;
			ctx.fillRect(0, 0, WIDTH, HEIGHT);
			ctx.restore();
			return;
		}
		// Punch soft holes in the darkness around each torch so the lit band is visible.
		if (!nightLayer) {
			nightLayer = document.createElement("canvas");
			nightLayer.width = WIDTH;
			nightLayer.height = HEIGHT;
		}
		const layer = nightLayer.getContext("2d");
		layer.globalCompositeOperation = "source-over";
		layer.clearRect(0, 0, WIDTH, HEIGHT);
		layer.fillStyle = `rgba(15, 27, 48, ${opacity})`;
		layer.fillRect(0, 0, WIDTH, HEIGHT);
		layer.globalCompositeOperation = "destination-out";
		const now = performance.now();
		for (const torch of lights) {
			const radius = TORCH_LIGHT_RADIUS * (1 + Math.sin(now / 140 + torch.x) * 0.03);
			const lx = torch.x - camera.x;
			const ly = torch.y - camera.y;
			const hole = layer.createRadialGradient(lx, ly, radius * 0.25, lx, ly, radius);
			hole.addColorStop(0, "rgba(0, 0, 0, 1)");
			hole.addColorStop(1, "rgba(0, 0, 0, 0)");
			layer.fillStyle = hole;
			layer.beginPath();
			layer.arc(lx, ly, radius, 0, Math.PI * 2);
			layer.fill();
		}
		ctx.drawImage(nightLayer, 0, 0);
		ctx.save();
		ctx.globalCompositeOperation = "lighter";
		for (const torch of lights) {
			const lx = torch.x - camera.x;
			const ly = torch.y - camera.y;
			const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, TORCH_LIGHT_RADIUS);
			glow.addColorStop(0, `rgba(255, 170, 80, ${opacity * 0.35})`);
			glow.addColorStop(1, "rgba(255, 170, 80, 0)");
			ctx.fillStyle = glow;
			ctx.beginPath();
			ctx.arc(lx, ly, TORCH_LIGHT_RADIUS, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	function update() {
		ensureJimothy();
		generateVillageChunks();
		generateResourceChunks();
		generatePondChunks();
		updateGather();
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
		updateFurnaces(now);
		for (const fire of campfires) {
			if (fire.kind !== "furnace" && fire.cooking && !fire.cooking.ready && now - fire.cooking.startedAt >= fire.cooking.duration) {
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

	// Drops trees that sit on top of an earlier tree, such as those from older saves.
	function thinOverlappingTrees() {
		const kept = [];
		for (const tree of obstacles) {
			if (kept.some((other) => Math.hypot(other.x - tree.x, other.y - tree.y) < 62)) continue;
			kept.push(tree);
		}
		if (kept.length === obstacles.length) return;
		obstacles.splice(0, obstacles.length, ...kept);
		obstacleChunks.clear();
		obstacles.forEach(indexObstacle);
	}

	function setup(state) {
		Object.assign(itemInfo, itemDefinitions, oreItemDefinitions);
		for (const id of [...Object.keys(itemDefinitions), ...Object.keys(oreItemDefinitions)]) player.inventory[id] ??= 0;
		restore(state);
		thinOverlappingTrees();
		ensureSpawnVillage();
		ensureStartBed();
		if (!worldEpoch) {
			worldEpoch = Date.now() - NIGHT_CYCLE_MS * 0.24;
			mobs.splice(0, mobs.length, ...mobs.filter((mob) => !hostileTypes.includes(mob.type)));
		}
		updateWorldClock(Date.now());
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
		const furnaceWorkspace = document.querySelector("#furnace-workspace");
		const furnaceAction = (event, placeOne) => {
			const pick = event.target.closest("[data-furnace-pick]");
			const slot = event.target.closest("#furnace-collect") ? "collect" : event.target.closest("#furnace-input-slot") ? "input" : event.target.closest("#furnace-fuel-slot") ? "fuel" : event.target.closest("#furnace-output-slot") ? "output" : "";
			if (furnaceCursor && event.target.closest(".furnace-input-panel")) returnFurnaceCursor();
			else if (pick && !pick.disabled) pickUpForFurnace(pick.dataset.furnacePick);
			else if (slot) useFurnaceSlot(slot, placeOne);
			else return false;
			renderFurnaceCursor();
			moveFurnaceCursor(event);
			updateHud();
			refreshPanel();
			return true;
		};
		furnaceWorkspace.addEventListener("click", (event) => furnaceAction(event, false));
		furnaceWorkspace.addEventListener("contextmenu", (event) => {
			if (furnaceAction(event, true)) event.preventDefault();
		});
		document.addEventListener("pointermove", moveFurnaceCursor);
		const nameTip = document.createElement("div");
		nameTip.id = "item-name-tip";
		nameTip.hidden = true;
		nameTip.style.cssText = "position:fixed;z-index:2147483001;pointer-events:none;padding:5px 9px;background:#263324;color:#fbf1d4;border:2px solid #9cad87;border-radius:4px;font:12px 'DM Sans',sans-serif";
		document.body.append(nameTip);
		document.addEventListener("pointermove", (event) => {
			const text = event.target.closest?.("[data-tip]")?.dataset.tip;
			nameTip.hidden = !text;
			if (!text) return;
			nameTip.textContent = text;
			nameTip.style.left = `${event.clientX + 16}px`;
			nameTip.style.top = `${event.clientY + (furnaceCursor ? 54 : 20)}px`;
		});
		document.querySelector("#survival-dialog").addEventListener("close", returnFurnaceCursor);
		document.querySelector("#craft-menu-button").addEventListener("click", () => openPanel("craft"));
		document.querySelector("#survival-close").addEventListener("click", () => document.querySelector("#survival-dialog").close());
		document.querySelector("#villager-quest-action").addEventListener("click", handleVillagerQuestAction);
		document.querySelector("#villager-dialog-close").addEventListener("click", () => document.querySelector("#villager-dialog").close());
		document.querySelector("#villager-dialog-close-secondary").addEventListener("click", () => document.querySelector("#villager-dialog").close());
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
		torches.splice(0, torches.length, ...(state.torches || []));
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
		if (state.pondSpawnVersion === POND_SPAWN_VERSION) {
			(state.pondChunks || []).forEach((key) => pondChunks.add(key));
		}
		(state.villageChunks || []).forEach((key) => villageChunks.add(key));
		(state.discoveredRecipes || []).forEach((key) => discoveredRecipes.add(key));
		jimothyMet = state.jimothyMet ?? jimothyMet;
		spawnTableTaken = Boolean(state.spawnTableTaken);
		if (state.furnaceCursor?.id) player.inventory[state.furnaceCursor.id] = (player.inventory[state.furnaceCursor.id] || 0) + state.furnaceCursor.count;
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
			generatedChunks: [...generatedChunks], resourceChunks: [...resourceChunks], pondChunks: [...pondChunks], pondSpawnVersion: POND_SPAWN_VERSION, villageChunks: [...villageChunks],
			villages, villagers, craftingTables, torches, ponds, campfires, hostileProjectiles, craftingSlots,
			discoveredRecipes: [...discoveredRecipes], jimothyMet, spawnTableTaken, furnaceCursor, selectedItem, questProgress, villagerQuestStates,
			completedSurvivalQuests: [...completedSurvivalQuests], worldEpoch,
			hostileChunks: [...hostileChunks],
			bed, bedSpawned, spawnPoint,
		};
	}

	return {
		setup, update, interact, meetJimothy, pickupAt, oreKindOf, attackAnimal, blocks, spawnBlocked, drawResource, drawPonds, drawVillages, drawStations, drawCraftingTablesBehindTrees, drawProjectiles, drawPickup, drawNightOverlay,
		refreshInventory, openCrafting: () => openPanel("craft"), useItem, recordQuest, recordVillagerQuestProgress, dayProgress, save, respawnPoint,
		campfires, hostileProjectiles,
	};
})();

window.FernfallSurvival = FernfallSurvival;
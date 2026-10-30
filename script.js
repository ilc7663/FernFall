const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const SAVE_KEY = "fernfall-save-v1";
const keys = new Set();
const heldDirections = new Set();
const MAX_HEALTH = 10;
const MAX_HUNGER = 100;
const MAX_SATURATION = 100;
const SATURATION_REGEN_COST = 10;
const HUNGER_DRAIN_MS = 20000;
const HUNGER_REGEN_MS = 6000;
const STARVATION_DAMAGE_MS = 8000;
const WORLD_CHUNK_SIZE = 512;
const camera = { x: 0, y: 0 };
const generatedChunks = new Set(["0,0"]);
const loadingChunks = new Set();
const chunkRetryAfter = new Map();
const animalSpriteBounds = new WeakMap();
const packItemIconCache = new Map();

const itemInfo = {
	berry: { name: "Wild berry", icon: "●" },
	wood: { name: "Softwood", icon: "▰" },
	gel: { name: "Slime gel", icon: "●" },
	tonic: { name: "Health potion", icon: "♧" },
	seed: { name: "Acorn", icon: "✿" },
};

const saved = loadSave();
const player = {
	x: saved?.x ?? 478,
	y: saved?.y ?? 322,
	direction: "down",
	health: saved?.health ?? MAX_HEALTH,
	hunger: saved?.hunger ?? MAX_HUNGER,
	saturation: Math.min(MAX_SATURATION, Math.max(0, saved?.saturation ?? 0)),
	lastFoodEaten: saved?.lastFoodEaten ?? "",
	coins: saved?.coins ?? 0,
	xp: saved?.xp ?? 0,
	level: saved?.level ?? 1,
	inventory: saved?.inventory ?? { berry: 0, wood: 0, gel: 0, tonic: 1, seed: 0 },
	swing: 0,
	hurt: 0,
};
camera.x = player.x - WIDTH / 2;
camera.y = player.y - HEIGHT / 2;

const obstacles = [
	{ x: 120, y: 110, r: 39 }, { x: 276, y: 95, r: 34 }, { x: 470, y: 106, r: 41 },
	{ x: 693, y: 95, r: 36 }, { x: 850, y: 128, r: 43 }, { x: 202, y: 200, r: 42 },
	{ x: 380, y: 180, r: 35 }, { x: 762, y: 270, r: 43 }, { x: 102, y: 440, r: 40 },
	{ x: 303, y: 465, r: 36 }, { x: 636, y: 452, r: 42 }, { x: 856, y: 455, r: 39 },
];
const obstacleChunks = new Map();

function obstacleChunkKey(x, y) {
	return `${Math.floor(x / WORLD_CHUNK_SIZE)},${Math.floor(y / WORLD_CHUNK_SIZE)}`;
}

function indexObstacle(obstacle) {
	const key = obstacleChunkKey(obstacle.x, obstacle.y);
	if (!obstacleChunks.has(key)) obstacleChunks.set(key, []);
	obstacleChunks.get(key).push(obstacle);
}

function addObstacle(obstacle) {
	obstacle.variant ??= Math.abs(Math.floor(obstacle.x * 17 + obstacle.y * 31)) % 3 === 0 ? "pine" : "oak";
	obstacles.push(obstacle);
	indexObstacle(obstacle);
}

obstacles.forEach((obstacle, index) => {
	obstacle.variant = index % 3 === 0 ? "pine" : "oak";
	indexObstacle(obstacle);
});

const resources = [
	{ x: 70, y: 210, type: "berry", available: true },
	{ x: 310, y: 230, type: "wood", available: true },
	{ x: 571, y: 186, type: "berry", available: true },
	{ x: 830, y: 214, type: "seed", available: true },
	{ x: 257, y: 360, type: "berry", available: true },
	{ x: 250, y: 550, type: "wood", available: true },
	{ x: 739, y: 365, type: "seed", available: true },
];

const mobs = [];

const animals = [
	{ type: "sheep", x: 910, y: 250, phase: 0, roamAngle: 1.8, turnTimer: 0, direction: "down", moving: false },
	{ type: "cow", x: 180, y: 560, phase: 1, roamAngle: 0.4, turnTimer: 0, direction: "down", moving: false },
	{ type: "pig", x: 900, y: 560, phase: 2, roamAngle: 2.7, turnTimer: 0, direction: "down", moving: false },
	{ type: "rabbit", x: 140, y: 330, phase: 3, roamAngle: 5.2, turnTimer: 0, direction: "down", moving: false },
	{ type: "wolf", x: 600, y: 580, phase: 4, roamAngle: 3.3, turnTimer: 0, direction: "down", moving: false, tamed: saved?.wolfTamed ?? false },
	...(!saved?.jimothyMet ? [{ type: "jimothy", name: "Jimothy", x: 760, y: 165, phase: 5, roamAngle: 2.2, turnTimer: 0, direction: "down", moving: false }] : []),
];

function chunkRandom(chunkX, chunkY) {
	let state = (Math.imul(chunkX, 73856093) ^ Math.imul(chunkY, 19349663)) >>> 0;
	if (!state) state = 1;
	return () => {
		state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
		return state / 4294967296;
	};
}

function randomChunkPosition(random, chunkX, chunkY) {
	return {
		x: chunkX * WORLD_CHUNK_SIZE + 40 + random() * (WORLD_CHUNK_SIZE - 80),
		y: chunkY * WORLD_CHUNK_SIZE + 40 + random() * (WORLD_CHUNK_SIZE - 80),
	};
}
 
function spawnAreaIsClear(x, y, radius = 24, spawnGroup = null) {
	if (collides(x, y) || window.fernfallPathOverlaps?.(x, y, radius * 2, radius * 2)) return false;
	if (Math.hypot(x - player.x, y - player.y) < radius + 48) return false;
	if (obstacles.some((tree) => Math.hypot(x - tree.x, y - tree.y) < radius + tree.r * 0.66)) return false;
	if (resources.some((resource) => Math.hypot(x - resource.x, y - resource.y) < radius + 22)) return false;
	if (animals.some((animal) => {
		const sameGroup = spawnGroup && animal.spawnGroup === spawnGroup;
		return Math.hypot(x - animal.x, y - animal.y) < radius + (sameGroup ? 20 : 32);
	})) return false;
	if (mobs.some((mob) => mob.alive && Math.hypot(x - mob.x, y - mob.y) < radius + 24)) return false;
	if (pickups.some((pickup) => Math.hypot(x - pickup.x, y - pickup.y) < radius + 14)) return false;
	if (typeof FernfallSurvival !== "undefined") {
		const world = FernfallSurvival.save?.();
		if (world?.ponds?.some((pond) => {
			const pondWidth = pond.width || 90;
			const pondHeight = pond.height || 56;
			const radiusX = pondWidth / 2 + radius + 12;
			const radiusY = pondHeight / 2 + radius + 12;
			return ((x - pond.x) / radiusX) ** 2 + ((y - pond.y) / radiusY) ** 2 < 1;
		})) return false;
		if (world?.campfires?.some((fire) => Math.hypot(x - fire.x, y - fire.y) < radius + 34)) return false;
		if (world?.craftingTables?.some((table) => Math.abs(x - table.x) < radius + 26 && Math.abs(y - table.y) < radius + 24)) return false;
		if (world?.villages?.some((village) => village.houses.some((house) => Math.abs(x - house.x) < radius + house.width / 2 && Math.abs(y - house.y) < radius + house.height / 2))) return false;
		if (FernfallSurvival.blocks?.(x, y)) return false;
	}
	return true;
}

window.fernfallSpawnAreaIsClear = spawnAreaIsClear;

function randomClearChunkPosition(random, chunkX, chunkY, radius, attempts = 16) {
	for (let attempt = 0; attempt < attempts; attempt += 1) {
		const position = randomChunkPosition(random, chunkX, chunkY);
		if (spawnAreaIsClear(position.x, position.y, radius)) return position;
	}
	return null;
}

function spawnPassiveGroup(random, chunkX, chunkY) {
	if (random() >= 0.18) return;
	const roll = random();
	const herd = roll < 0.34
		? { type: "sheep", min: 3, max: 5 }
		: roll < 0.54
			? { type: "rabbit", min: 2, max: 4 }
			: roll < 0.74
				? { type: "cow", min: 2, max: 3 }
				: roll < 0.92
					? { type: "pig", min: 2, max: 3 }
					: { type: "wolf", min: 2, max: 3 };
	const herdId = `${chunkX},${chunkY}:${herd.type}`;
	const anchor = randomClearChunkPosition(random, chunkX, chunkY, 20, 32);
	if (!anchor || Math.hypot(player.x - anchor.x, player.y - anchor.y) < 110) return;
	const count = herd.min + Math.floor(random() * (herd.max - herd.min + 1));
	for (let index = 0; index < count; index += 1) {
		let position = index === 0 ? anchor : null;
		for (let attempt = 0; !position && attempt < 18; attempt += 1) {
			const angle = random() * Math.PI * 2;
			const distance = 42 + random() * 40;
			const candidate = { x: anchor.x + Math.cos(angle) * distance, y: anchor.y + Math.sin(angle) * distance };
			if (candidate.x < chunkX * WORLD_CHUNK_SIZE + 32 || candidate.x > (chunkX + 1) * WORLD_CHUNK_SIZE - 32) continue;
			if (candidate.y < chunkY * WORLD_CHUNK_SIZE + 32 || candidate.y > (chunkY + 1) * WORLD_CHUNK_SIZE - 32) continue;
			if (spawnAreaIsClear(candidate.x, candidate.y, 16, herdId)) position = candidate;
		}
		if (!position || Math.hypot(player.x - position.x, player.y - position.y) < 70) continue;
		animals.push({ ...position, type: herd.type, spawnGroup: herdId, phase: random() * 6, roamAngle: random() * Math.PI * 2, turnTimer: 0, direction: "down", moving: false, tamed: false });
	}
}

function generateWorldChunk(chunkX, chunkY) {
	const key = `${chunkX},${chunkY}`;
	if (generatedChunks.has(key) || loadingChunks.has(key) || Date.now() < (chunkRetryAfter.get(key) ?? 0)) return;
	if (window.FERNFALL_SERVER_MODE) {
		loadingChunks.add(key);
		fetch("/api/chunk", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				chunkX, chunkY, playerX: player.x, playerY: player.y,
				obstacles: obstacles.map(({ x, y, r }) => ({ x, y, r })),
			}),
		}).then((response) => {
			if (!response.ok) throw new Error("Chunk request failed");
			return response.json();
		}).then((chunk) => {
					for (const obstacle of chunk.obstacles) {
						if (spawnAreaIsClear(obstacle.x, obstacle.y, 44)) addObstacle(obstacle);
					}
					for (const resource of chunk.resources) {
						if (spawnAreaIsClear(resource.x, resource.y, 22)) resources.push(resource);
					}
					spawnPassiveGroup(chunkRandom(chunkX, chunkY), chunkX, chunkY);
			generatedChunks.add(key);
			chunkRetryAfter.delete(key);
		}).catch(() => {
			chunkRetryAfter.set(key, Date.now() + 2000);
			showToast("A forest area could not be loaded. Retrying shortly.");
		}).finally(() => loadingChunks.delete(key));
		return;
	}
	generatedChunks.add(key);
	const random = chunkRandom(chunkX, chunkY);
	const placedTrees = [];
	const inChunk = (x, y) => x > chunkX * WORLD_CHUNK_SIZE + 32 && x < (chunkX + 1) * WORLD_CHUNK_SIZE - 32 && y > chunkY * WORLD_CHUNK_SIZE + 32 && y < (chunkY + 1) * WORLD_CHUNK_SIZE - 32;
	const plantTree = (position) => {
		const tree = { ...position, r: 30 + random() * 12 };
		addObstacle(tree);
		placedTrees.push(tree);
	};
	const groves = random() < 0.5 ? 2 : 1;
	for (let grove = 0; grove < groves; grove += 1) {
		const anchor = randomClearChunkPosition(random, chunkX, chunkY, 44);
		if (!anchor || Math.hypot(player.x - anchor.x, player.y - anchor.y) <= 90) continue;
		plantTree(anchor);
		const size = 1 + Math.floor(random() * 3);
		for (let member = 0; member < size; member += 1) {
			for (let attempt = 0; attempt < 12; attempt += 1) {
				const angle = random() * Math.PI * 2;
				const distance = 76 + random() * 60;
				const candidate = { x: anchor.x + Math.cos(angle) * distance, y: anchor.y + Math.sin(angle) * distance };
				if (!inChunk(candidate.x, candidate.y) || Math.hypot(player.x - candidate.x, player.y - candidate.y) <= 90) continue;
				if (!spawnAreaIsClear(candidate.x, candidate.y, 40)) continue;
				plantTree(candidate);
				break;
			}
		}
	}
	const loneTrees = Math.floor(random() * 2);
	for (let index = 0; index < loneTrees; index += 1) {
		const position = randomClearChunkPosition(random, chunkX, chunkY, 44);
		if (position && Math.hypot(player.x - position.x, player.y - position.y) > 90) plantTree(position);
	}
	// Fallen logs only appear beside standing trees.
	const logs = Math.min(placedTrees.length, Math.floor(random() * 2) + (random() < 0.5 ? 1 : 0));
	for (let index = 0; index < logs; index += 1) {
		const tree = placedTrees[Math.floor(random() * placedTrees.length)];
		for (let attempt = 0; attempt < 8; attempt += 1) {
			const angle = random() * Math.PI * 2;
			const distance = 48 + random() * 26;
			const position = { x: tree.x + Math.cos(angle) * distance, y: tree.y + Math.sin(angle) * distance };
			if (!inChunk(position.x, position.y) || Math.hypot(player.x - position.x, player.y - position.y) <= 70) continue;
			if (!spawnAreaIsClear(position.x, position.y, 16)) continue;
			resources.push({ ...position, type: "wood", available: true });
			break;
		}
	}
	for (let index = 0; index < 1; index += 1) {
			const position = randomClearChunkPosition(random, chunkX, chunkY, 22);
			if (position && random() < 0.6 && Math.hypot(player.x - position.x, player.y - position.y) > 70) {
				resources.push({ ...position, type: ["berry", "seed"][Math.floor(random() * 2)], available: true });
			}
	}
		spawnPassiveGroup(random, chunkX, chunkY);
}

function ensureWorldChunks() {
	const centerX = Math.floor(player.x / WORLD_CHUNK_SIZE);
	const centerY = Math.floor(player.y / WORLD_CHUNK_SIZE);
	for (let chunkY = centerY - 1; chunkY <= centerY + 1; chunkY += 1) {
		for (let chunkX = centerX - 1; chunkX <= centerX + 1; chunkX += 1) {
			generateWorldChunk(chunkX, chunkY);
		}
	}
}

const pickups = [];
let lastAttack = 0;
let lastDamage = 0;
let lastSave = 0;
let lastHungerDrain = performance.now();
let lastHungerRegen = performance.now();
let lastStarvationDamage = performance.now();
let starvationWarningShown = false;
let starvationWarned = false;
const toastQueue = [];
let toastTimer;
const gatherTasks = {
	berry: { noun: "wild berries", titles: ["Berry picking", "Sweet tooth", "Pantry run"] },
	wood: { noun: "softwood", titles: ["Timber run", "Firewood duty", "Lumber call"] },
	stone: { noun: "stones", titles: ["Rock collector", "Quarry day", "Pebble hunt"] },
	carrot: { noun: "carrots", titles: ["Carrot patch", "Root harvest"] },
	potato: { noun: "potatoes", titles: ["Spud hunting", "Potato dig"] },
	mushroom: { noun: "forest mushrooms", titles: ["Mushroom foray", "Fungus forager"] },
	grain: { noun: "grain", titles: ["Grain gathering", "Harvest hands"] },
	herb: { noun: "forest herbs", titles: ["Herbalist's errand", "Herb round"] },
};
const slimeTaskTitles = ["Brave the woods", "Slime patrol", "Bubble trouble"];
let dailyTask = saved?.dailyTask ?? rollDailyTask();
let taskLastInventory = { ...player.inventory };
let taskLastDefeated = 0;
let jimothyMet = saved?.jimothyMet ?? false;

function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)];
}

function rollDailyTask(previousKey) {
	const keys = ["slime", ...Object.keys(gatherTasks)].filter((key) => key !== previousKey);
	const key = pickRandom(keys);
	if (key === "slime") {
		const goal = 2 + Math.floor(Math.random() * 4);
		return { key, title: pickRandom(slimeTaskTitles), copy: `Defeat ${goal} little slimes. They look grumpy, but they're mostly bubbles.`, goal, progress: 0, reward: goal };
	}
	const goal = 3 + Math.floor(Math.random() * 6);
	const info = gatherTasks[key];
	return { key, title: pickRandom(info.titles), copy: `Gather ${goal} ${info.noun} out in the forest.`, goal, progress: 0, reward: 1 + Math.ceil(goal / 2) };
}

function trackDailyTask() {
	const defeated = mobs.filter((mob) => !mob.alive).length;
	if (dailyTask.key === "slime") dailyTask.progress += Math.max(0, defeated - taskLastDefeated);
	else dailyTask.progress += Math.max(0, (player.inventory[dailyTask.key] || 0) - (taskLastInventory[dailyTask.key] || 0));
	taskLastDefeated = defeated;
	taskLastInventory = { ...player.inventory };
	if (dailyTask.progress < dailyTask.goal) return;
	player.coins += dailyTask.reward;
	showToast(`Task complete: ${dailyTask.title}! +${dailyTask.reward} coins.`);
	dailyTask = rollDailyTask(dailyTask.key);
	showToast(`New task: ${dailyTask.title}.`);
	saveGame();
}

function meleeTargetRadius(target) {
	const radii = {
		bat: 17, spider: 20, skeleton: 22, witch: 22, zombie: 21, slime: 20,
		cow: 23, rabbit: 15, jimothy: 20, wolf: 19, sheep: 19, pig: 19,
	};
	return radii[target.type] || 18;
}

function meleeHitboxContains(target, reach = 44) {
	const dx = target.x - player.x;
	const dy = target.y - player.y;
	const forward = player.direction === "up" ? -dy : player.direction === "down" ? dy : player.direction === "left" ? -dx : dx;
	const lateral = player.direction === "up" || player.direction === "down" ? dx : dy;
	const radius = meleeTargetRadius(target);
	return forward + radius >= 2 && forward - radius <= reach && Math.abs(lateral) <= 16 + radius;
}

window.fernfallMeleeHitboxContains = meleeHitboxContains;
let soundEnabled = false;
let audioContext;
let gamePaused = true;
let gameMenuView = "home";
const gameMenuDialog = document.querySelector("#game-menu-dialog");

function loadSave() {
	if (window.FERNFALL_SERVER_MODE && window.FERNFALL_SERVER_SAVE) return window.FERNFALL_SERVER_SAVE;
	try {
		return JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
	} catch {
		return null;
	}
}

function saveGame() {
	let serializedSave;
	try {
		const save = {
			x: player.x, y: player.y, health: player.health, hunger: player.hunger, saturation: player.saturation, lastFoodEaten: player.lastFoodEaten, coins: player.coins,
			xp: player.xp, level: player.level, inventory: player.inventory, dailyTask,
			wolfTamed: animals.find((animal) => animal.type === "wolf")?.tamed ?? false,
			jimothyMet,
			...FernfallSurvival.save(),
		};
		serializedSave = JSON.stringify(save);
	} catch {
		showToast("Progress could not be prepared for saving.");
		return;
	}
	try {
		localStorage.setItem(SAVE_KEY, serializedSave);
	} catch {
		if (!window.FERNFALL_SERVER_MODE) {
			for (const obstacle of chunk.obstacles) {
				if (spawnAreaIsClear(obstacle.x, obstacle.y, 44)) addObstacle(obstacle);
			}
			return;
		}
	}
	if (window.FERNFALL_SERVER_MODE) {
		fetch("/api/save", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: serializedSave,
		}).then((response) => {
			if (!response.ok) throw new Error("Save request failed");
		}).catch(() => showToast("Progress could not be saved to the game server."));
	}
}

function showToast(message) {
	const toast = document.querySelector("#toast");
	if (!toast) return;
	if (toastQueue.includes(message) || (toastTimer && toast.textContent === message)) return;
	toastQueue.push(message);
	if (!toastTimer) showNextToast();
}

function showNextToast() {
	const toast = document.querySelector("#toast");
	const message = toastQueue.shift();
	if (!toast || !message) {
		toast?.classList.remove("show");
		toastTimer = null;
		return;
	}
	toast.textContent = message;
	toast.classList.add("show");
	toastTimer = setTimeout(() => {
		toast.classList.remove("show");
		toastTimer = setTimeout(() => {
			toastTimer = null;
			showNextToast();
		}, 180);
	}, 2400);
}

function playTone(frequency, duration = 0.12) {
	if (!soundEnabled || !window.AudioContext) return;
	audioContext ??= new AudioContext();
	const oscillator = audioContext.createOscillator();
	const gain = audioContext.createGain();
	oscillator.frequency.value = frequency;
	gain.gain.setValueAtTime(0.05, audioContext.currentTime);
	gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
	oscillator.connect(gain);
	gain.connect(audioContext.destination);
	oscillator.start();
	oscillator.stop(audioContext.currentTime + duration);
}

function drawGround() {
	drawFernfallGround(ctx, WIDTH, HEIGHT);
}

function drawTree(tree) {
	const sprite = tree.variant === "pine" ? art.forest.tree_pine : art.forest.tree_oak;
	if (!drawArt(ctx, sprite, tree.x, tree.y - 16, 108, 120)) {
		ctx.fillStyle = "#6c4a32";
		ctx.fillRect(tree.x - 8, tree.y + 6, 16, 24);
		ctx.fillStyle = "#4d7950";
		ctx.beginPath();
		ctx.arc(tree.x, tree.y, tree.r, 0, Math.PI * 2);
		ctx.fill();
	}
}

// The slime gel art ships with a light backdrop; clear it the same way the inventory icon does.
const cleanedGelIcons = new WeakMap();
function cleanedGelIcon(image) {
	if (cleanedGelIcons.has(image)) return cleanedGelIcons.get(image);
	const canvas = document.createElement("canvas");
	canvas.width = image.naturalWidth;
	canvas.height = image.naturalHeight;
	const context = canvas.getContext("2d", { willReadFrequently: true });
	context.drawImage(image, 0, 0);
	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	const pixels = imageData.data;
	const pixelCount = canvas.width * canvas.height;
	const visited = new Uint8Array(pixelCount);
	const isBackdrop = (index) => {
		const offset = index * 4;
		const min = Math.min(pixels[offset], pixels[offset + 1], pixels[offset + 2]);
		const max = Math.max(pixels[offset], pixels[offset + 1], pixels[offset + 2]);
		return pixels[offset + 3] > 0 && min >= 210 && max - min <= 55;
	};
	for (let start = 0; start < pixelCount; start += 1) {
		if (visited[start]) continue;
		visited[start] = 1;
		if (!isBackdrop(start)) continue;
		const component = [start];
		for (let head = 0; head < component.length; head += 1) {
			const index = component[head];
			const x = index % canvas.width;
			const y = Math.floor(index / canvas.width);
			for (const neighbor of [x ? index - 1 : -1, x < canvas.width - 1 ? index + 1 : -1, y ? index - canvas.width : -1, y < canvas.height - 1 ? index + canvas.width : -1]) {
				if (neighbor < 0 || visited[neighbor]) continue;
				visited[neighbor] = 1;
				if (isBackdrop(neighbor)) component.push(neighbor);
			}
		}
		if (component.length >= 64) for (const index of component) pixels[index * 4 + 3] = 0;
	}
	context.putImageData(imageData, 0, 0);
	cleanedGelIcons.set(image, canvas);
	return canvas;
}

function drawPackItemIcon(itemType, x, y, size) {
	const iconId = {
		berry: "berries", herb: "herbs", gel: "slime_gel", tonic: "item_potion", wooden_stick: "stick",
		cooking_pot: "cooking_pot_empty", frying_pan: "frying_pan_empty", bowl: "bowl_empty", campfire_kit: "campfire_0",
	}[itemType] || itemType;
	const source = window.FERNFALL_ITEM_IMAGES?.[iconId];
	if (!source) return false;
	let sprite = packItemIconCache.get(iconId);
	if (!sprite) {
		sprite = new Image();
		sprite.src = source;
		packItemIconCache.set(iconId, sprite);
	}
	if (iconId === "slime_gel") {
		if (!sprite.complete || !sprite.naturalWidth) return false;
		ctx.save();
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(cleanedGelIcon(sprite), Math.round(x - size / 2), Math.round(y - size / 2), size, size);
		ctx.restore();
		return true;
	}
	return drawArt(ctx, sprite, x, y, size, size);
}

function drawResource(resource) {
	if (!resource.available) return;
	const bob = Math.sin(performance.now() / 260 + resource.x) * 2;
	ctx.fillStyle = "#4a6741";
	ctx.beginPath();
	ctx.ellipse(resource.x, resource.y + 8, 15, 5, 0, 0, Math.PI * 2);
	ctx.fill();
	if (!drawPackItemIcon(resource.type, resource.x, resource.y + bob, 34)) {
		ctx.fillStyle = resource.type === "wood" ? "#805538" : "#d85f59";
		ctx.beginPath();
		ctx.arc(resource.x, resource.y + bob, 9, 0, Math.PI * 2);
		ctx.fill();
	}
}

function drawPlayer() {
	const bob = Math.sin(performance.now() / 90) * (moving() ? 2 : 0.6);
	ctx.fillStyle = "#49674655";
	ctx.beginPath();
	ctx.ellipse(player.x, player.y + 11, 14, 7, 0, 0, Math.PI * 2);
	ctx.fill();
	const now = performance.now();
	if (drawRangerSprite(now, bob)) return;
	const action = player.swing > 0
		? `attack${Math.floor(now / 100) % 2 + 1}`
		: moving() ? `walk${Math.floor(now / 180) % 2 + 1}` : "idle";
	const ranger = art.ranger[`${player.direction}_${action}`];
	if (ranger?.complete && ranger.naturalWidth) {
		ctx.save();
		if (player.hurt > 0 && Math.floor(now / 90) % 2 === 0) ctx.filter = "brightness(1.8)";
		drawArt(ctx, ranger, player.x, player.y + bob, 62, 62);
		ctx.restore();
		return;
	}
	ctx.fillStyle = player.hurt > 0 && Math.floor(performance.now() / 90) % 2 === 0 ? "#fff" : "#df8058";
	ctx.fillRect(player.x - 9, player.y - 4 + bob, 18, 17);
	ctx.fillStyle = "#f1c881";
	ctx.fillRect(player.x - 8, player.y - 13 + bob, 16, 14);
	ctx.fillStyle = "#3e6748";
	ctx.fillRect(player.x - 10, player.y - 15 + bob, 20, 6);
	ctx.fillRect(player.x - 6, player.y - 20 + bob, 12, 7);
	ctx.fillStyle = "#394037";
	const eyeX = player.direction === "left" ? -5 : player.direction === "right" ? 4 : -4;
	ctx.fillRect(player.x + eyeX, player.y - 7 + bob, 2, 3);
	ctx.fillRect(player.x + eyeX + 6, player.y - 7 + bob, 2, 3);
	if (player.swing > 0) {
		ctx.strokeStyle = "#f8e6ae";
		ctx.lineWidth = 5;
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(player.x + (player.direction === "left" ? -8 : 8), player.y + 2);
		ctx.lineTo(player.x + (player.direction === "left" ? -33 : 33), player.y - 13);
		ctx.stroke();
	} else {
		ctx.strokeStyle = "#895d37";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(player.x + 8, player.y + 4);
		ctx.lineTo(player.x + 18, player.y + 11);
		ctx.stroke();
	}
}

// Absolute URL so the temporary <base> used by other loaders cannot redirect the sprite paths.
const characterSpriteBase = new URL("Video_Game_PNGs/Fernfall_Characters_Complete_Rebuild", window.location.href).href;
window.FernfallSprites?.init(characterSpriteBase).then((sprites) => {
	const { ranger, zombie } = sprites.manifest;
	for (const tool of Object.keys(ranger)) {
		for (const direction of Object.keys(ranger[tool])) {
			for (const frame of Object.keys(ranger[tool][direction])) sprites.get("ranger", tool, direction, frame);
		}
	}
	for (const direction of Object.keys(zombie)) {
		for (const frame of Object.keys(zombie[direction])) sprites.get("zombie", null, direction, frame);
	}
}).catch((error) => console.warn("Character sprites could not be loaded.", error));

function characterFrame(kind, tool, direction, frame) {
	const image = window.FernfallSprites?.get(kind, tool, direction, frame);
	return image?.complete && image.naturalWidth ? image : null;
}

function startUseAnimation(ms = 380) {
	const now = performance.now();
	player.useStartedAt = now;
	player.useUntil = now + ms;
}
window.fernfallStartUseAnimation = startUseAnimation;

function drawRangerSprite(now, bob) {
	const tool = window.FernfallGameInventory?.heldTool?.().tool || "empty";
	const animating = now < (player.useUntil || 0);
	const swingPose = player.swing > 0 || (animating && Math.floor((now - player.useStartedAt) / 130) % 2 === 0);
	const frame = swingPose ? "use" : animating ? "idle" : moving() ? `walk_${Math.floor(now / 180) % 2 + 1}` : "idle";
	const sprite = characterFrame("ranger", tool, player.direction, frame) || characterFrame("ranger", "empty", player.direction, frame);
	if (!sprite) return false;
	ctx.save();
	if (player.hurt > 0 && Math.floor(now / 90) % 2 === 0) ctx.filter = "brightness(1.8)";
	ctx.imageSmoothingEnabled = true;
	ctx.imageSmoothingQuality = "high";
	// Frames are 352px with feet at ~92% of the height; anchor the feet near the shadow.
	// Front/back frames fill ~16% less height than side frames, so scale them up around the feet.
	const size = player.direction === "down" || player.direction === "up" ? 64 * 1.12 : 64;
	const feetY = player.y + bob - 45 + 64 * 0.94;
	ctx.drawImage(sprite, Math.round(player.x - size / 2), Math.round(feetY - size * 0.94), size, size);
	ctx.restore();
	return true;
}

// Called after trees and stations so the head always stays visible.
function drawPlayerHead() {
	const now = performance.now();
	const bob = Math.sin(now / 90) * (moving() ? 2 : 0.6);
	ctx.save();
	ctx.beginPath();
	ctx.rect(player.x - 36, player.y + bob - 54, 72, 33);
	ctx.clip();
	drawRangerSprite(now, bob);
	ctx.restore();
}

function drawMob(mob) {
	if (!mob.alive) return;
	const wobble = Math.sin(performance.now() / 180 + mob.phase) * 3;
	const x = mob.x;
	const y = mob.y + wobble;
	ctx.fillStyle = "#49674655";
	ctx.beginPath();
	ctx.ellipse(x, y + 12, 18, 7, 0, 0, Math.PI * 2);
	ctx.fill();
	const slimeFrame = Math.floor(performance.now() / 260 + mob.phase) % 2 + 1;
	const slime = art.slime[`green_idle${slimeFrame}`];
	if (slime?.complete && slime.naturalWidth) {
		ctx.save();
		if (mob.hit > 0) ctx.filter = "brightness(1.7)";
		drawArt(ctx, slime, x, y, 54, 54);
		ctx.restore();
		if (mob.hp < mob.maxHp) drawMobHealth(mob, x, y);
		return;
	}
	ctx.fillStyle = mob.hit > 0 ? "#fbf2c1" : "#6bbcb0";
	ctx.beginPath();
	ctx.moveTo(x - 17, y + 9);
	ctx.quadraticCurveTo(x - 19, y - 12, x, y - 14);
	ctx.quadraticCurveTo(x + 18, y - 12, x + 17, y + 9);
	ctx.quadraticCurveTo(x, y + 17, x - 17, y + 9);
	ctx.fill();
	ctx.fillStyle = "#e9f3d5";
	ctx.fillRect(x - 8, y - 4, 5, 7);
	ctx.fillRect(x + 3, y - 4, 5, 7);
	ctx.fillStyle = "#294d47";
	ctx.fillRect(x - 6, y - 1, 2, 4);
	ctx.fillRect(x + 5, y - 1, 2, 4);
	if (mob.hp < mob.maxHp) {
		drawMobHealth(mob, x, y);
	}
}

function drawAnimal(animal) {
	const now = performance.now();
	const artType = animal.type === "wolf" && animal.tamed ? "wolf_tamed" : animal.type;
	const animalArt = passiveArt[artType];
	const frame = animal.moving ? `walk${Math.floor(now / 220 + animal.phase) % 2 + 1}` : "idle";
	const pose = animal.happyUntil > now && ["down", "up"].includes(animal.direction) ? "happy" : frame;
	const sprite = animalArt?.[`${animal.direction}_${pose}`] || animalArt?.[`${animal.direction}_${frame}`] || animalArt?.[`${animal.direction}_idle`];
	if (!sprite?.complete || !sprite.naturalWidth) return;
	const size = animal.type === "cow" ? 58 : animal.type === "rabbit" ? 37 : animal.type === "jimothy" ? 51 : 48;
	let bounds = animalSpriteBounds.get(sprite);
	if (!bounds) {
		const source = document.createElement("canvas");
		source.width = sprite.naturalWidth;
		source.height = sprite.naturalHeight;
		const sourceContext = source.getContext("2d", { willReadFrequently: true });
		sourceContext.drawImage(sprite, 0, 0);
		const pixels = sourceContext.getImageData(0, 0, source.width, source.height).data;
		let left = source.width;
		let top = source.height;
		let right = -1;
		let bottom = -1;
		for (let y = 0; y < source.height; y += 1) {
			for (let x = 0; x < source.width; x += 1) {
				if (pixels[(y * source.width + x) * 4 + 3] <= 8) continue;
				left = Math.min(left, x);
				top = Math.min(top, y);
				right = Math.max(right, x);
				bottom = Math.max(bottom, y);
			}
		}
		bounds = right >= left && bottom >= top
			? { left, top, width: right - left + 1, height: bottom - top + 1 }
			: { left: 0, top: 0, width: source.width, height: source.height };
		animalSpriteBounds.set(sprite, bounds);
	}
	const scale = size / Math.max(bounds.width, bounds.height);
	const drawWidth = bounds.width * scale;
	const drawHeight = bounds.height * scale;
	ctx.fillStyle = "#49674655";
	ctx.beginPath();
	ctx.ellipse(animal.x, animal.y + size * 0.24, size * 0.32, size * 0.1, 0, 0, Math.PI * 2);
	ctx.fill();
	ctx.save();
	ctx.imageSmoothingEnabled = false;
	ctx.drawImage(sprite, bounds.left, bounds.top, bounds.width, bounds.height, Math.round(animal.x - drawWidth / 2), Math.round(animal.y - drawHeight / 2), Math.round(drawWidth), Math.round(drawHeight));
	ctx.restore();
	if ((animal.type === "wolf" || animal.type === "jimothy") && animal.tamed) {
		ctx.strokeStyle = "#e7c56e";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.ellipse(animal.x, animal.y + 8, 11, 4, 0, 0, Math.PI * 2);
		ctx.stroke();
	}
	if (animal.type === "jimothy") {
		ctx.font = "600 11px 'DM Sans', sans-serif";
		ctx.textAlign = "center";
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#f1e7c9";
		ctx.strokeText("Jimothy", animal.x, animal.y - size / 2 - 3);
		ctx.fillStyle = "#30483b";
		ctx.fillText("Jimothy", animal.x, animal.y - size / 2 - 3);
	}
}

function drawMobHealth(mob, x, y) {
	ctx.fillStyle = "#435c48";
	ctx.fillRect(x - 15, y - 23, 30, 4);
	ctx.fillStyle = "#e47660";
	ctx.fillRect(x - 15, y - 23, 30 * mob.hp / mob.maxHp, 4);
}

function updateCamera() {
	const deadZoneX = 90;
	const deadZoneY = 65;
	const screenX = player.x - camera.x;
	const screenY = player.y - camera.y;
	let targetX = camera.x;
	let targetY = camera.y;
	if (screenX < WIDTH / 2 - deadZoneX) targetX = player.x - (WIDTH / 2 - deadZoneX);
	if (screenX > WIDTH / 2 + deadZoneX) targetX = player.x - (WIDTH / 2 + deadZoneX);
	if (screenY < HEIGHT / 2 - deadZoneY) targetY = player.y - (HEIGHT / 2 - deadZoneY);
	if (screenY > HEIGHT / 2 + deadZoneY) targetY = player.y - (HEIGHT / 2 + deadZoneY);
	camera.x += (targetX - camera.x) * 0.12;
	camera.y += (targetY - camera.y) * 0.12;
	camera.x = Math.round(camera.x);
	camera.y = Math.round(camera.y);
}

function render() {
	if (gamePaused) return;
	updateCamera();
	drawGround();
	ctx.save();
	ctx.translate(-camera.x, -camera.y);
	const visible = (entity, margin = 96) => entity.x > camera.x - margin && entity.x < camera.x + WIDTH + margin &&
		entity.y > camera.y - margin && entity.y < camera.y + HEIGHT + margin;
	resources.filter((resource) => visible(resource)).forEach(drawResource);
	animals.filter((animal) => visible(animal) && animal.y < player.y).forEach(drawAnimal);
	mobs.filter((mob) => mob.alive && visible(mob) && mob.y < player.y).forEach(drawMob);
	obstacles.filter((tree) => visible(tree, 140) && tree.y < player.y).forEach(drawTree);
	pickups.forEach((pickup) => {
		if (!visible(pickup)) return;
		const bob = Math.sin(performance.now() / 300 + pickup.x) * 1.5;
		ctx.fillStyle = "#49674655";
		ctx.beginPath();
		ctx.ellipse(pickup.x, pickup.y + 9, 9, 3, 0, 0, Math.PI * 2);
		ctx.fill();
		const drawn = drawPackItemIcon(pickup.type, pickup.x, pickup.y + bob, 26) ||
			(typeof FernfallSurvival !== "undefined" && FernfallSurvival.drawPickup({ ...pickup, y: pickup.y + bob }));
		if (!drawn) {
			ctx.fillStyle = itemInfo[pickup.type]?.category === "food" ? "#d85f59" : "#d1ad62";
			ctx.beginPath();
			ctx.arc(pickup.x, pickup.y + bob, 7, 0, Math.PI * 2);
			ctx.fill();
		}
		if ((pickup.amount || 1) > 1) {
			ctx.fillStyle = "#fff";
			ctx.strokeStyle = "#30483b";
			ctx.lineWidth = 3;
			ctx.font = "bold 12px sans-serif";
			ctx.textAlign = "right";
			ctx.strokeText(`x${pickup.amount}`, pickup.x + 16, pickup.y + 16);
			ctx.fillText(`x${pickup.amount}`, pickup.x + 16, pickup.y + 16);
			ctx.textAlign = "left";
		}
	});
	animals.filter((animal) => visible(animal) && animal.y >= player.y).forEach(drawAnimal);
	mobs.filter((mob) => mob.alive && visible(mob) && mob.y >= player.y).forEach(drawMob);
	drawPlayer();
	obstacles.filter((tree) => visible(tree, 140) && tree.y >= player.y).forEach(drawTree);
	ctx.restore();
	requestAnimationFrame(render);
}

function moving() {
	return keys.has("ArrowUp") || keys.has("w") || heldDirections.has("up") ||
		keys.has("ArrowDown") || keys.has("s") || heldDirections.has("down") ||
		keys.has("ArrowLeft") || keys.has("a") || heldDirections.has("left") ||
		keys.has("ArrowRight") || keys.has("d") || heldDirections.has("right");
}

function collides(x, y) {
	const minChunkX = Math.floor((x - 48) / WORLD_CHUNK_SIZE);
	const maxChunkX = Math.floor((x + 48) / WORLD_CHUNK_SIZE);
	const minChunkY = Math.floor((y - 48) / WORLD_CHUNK_SIZE);
	const maxChunkY = Math.floor((y + 48) / WORLD_CHUNK_SIZE);
	for (let chunkY = minChunkY; chunkY <= maxChunkY; chunkY += 1) {
		for (let chunkX = minChunkX; chunkX <= maxChunkX; chunkX += 1) {
			for (const tree of obstacleChunks.get(`${chunkX},${chunkY}`) ?? []) {
				if (Math.hypot(x - tree.x, y - (tree.y + 5)) < tree.r * .66 + 9) return true;
			}
		}
	}
	return false;
}

function update() {
	ensureWorldChunks();
	const speed = 2.65;
	let dx = 0;
	let dy = 0;
	if (keys.has("ArrowUp") || keys.has("w") || heldDirections.has("up")) dy -= 1;
	if (keys.has("ArrowDown") || keys.has("s") || heldDirections.has("down")) dy += 1;
	if (keys.has("ArrowLeft") || keys.has("a") || heldDirections.has("left")) dx -= 1;
	if (keys.has("ArrowRight") || keys.has("d") || heldDirections.has("right")) dx += 1;
	if (dx || dy) {
		const length = Math.hypot(dx, dy);
		dx = dx / length * speed;
		dy = dy / length * speed;
		if (Math.abs(dx) > Math.abs(dy)) player.direction = dx < 0 ? "left" : "right";
		else player.direction = dy < 0 ? "up" : "down";
		if (!collides(player.x + dx, player.y)) player.x += dx;
		if (!collides(player.x, player.y + dy)) player.y += dy;
	}

	const now = performance.now();
	if (now - lastHungerDrain >= HUNGER_DRAIN_MS) {
		const drain = Math.floor((now - lastHungerDrain) / HUNGER_DRAIN_MS);
		player.hunger = Math.max(0, player.hunger - drain);
		lastHungerDrain += drain * HUNGER_DRAIN_MS;
		updateHud();
	}
	if (player.hunger >= MAX_HUNGER && player.saturation > 0 && player.health < MAX_HEALTH) {
		if (now - lastHungerRegen >= HUNGER_REGEN_MS) {
			player.health = Math.min(MAX_HEALTH, player.health + 1);
			player.saturation = Math.max(0, player.saturation - SATURATION_REGEN_COST);
			lastHungerRegen = now;
			updateHud();
			saveGame();
		}
	} else {
		lastHungerRegen = now;
	}
	if (player.hunger > 0) starvationWarningShown = false;
	if (player.hunger === 0) {
		if (!starvationWarned) {
			starvationWarned = true;
			lastStarvationDamage = now;
			if (!starvationWarningShown) {
				starvationWarningShown = true;
				showToast("You are starving. Find food soon.");
			}
		} else if (now - lastStarvationDamage >= STARVATION_DAMAGE_MS) {
			lastStarvationDamage = now;
			player.health = Math.max(0, player.health - 1);
			player.hurt = 14;
			if (player.health === 0) {
				player.health = MAX_HEALTH;
				player.hunger = Math.ceil(MAX_HUNGER / 4);
				const home = FernfallSurvival.respawnPoint?.() || { x: 160, y: 192 };
				player.x = home.x;
				player.y = home.y;
				camera.x = player.x - WIDTH / 2;
				camera.y = player.y - HEIGHT / 2;
				keys.clear();
				heldDirections.clear();
				starvationWarned = false;
				showToast("You collapsed from hunger and woke at camp.");
			}
			updateHud();
			saveGame();
		}
	} else {
		starvationWarned = false;
		lastStarvationDamage = now;
	}
	if (player.swing > 0) player.swing = Math.max(0, player.swing - 0.06);
	if (player.hurt > 0) player.hurt -= 1;
	for (const animal of animals) {
		if ((animal.type === "wolf" || animal.type === "jimothy") && animal.tamed || Math.hypot(player.x - animal.x, player.y - animal.y) < 720) updateAnimal(animal);
	}
	for (const mob of mobs) {
		if (!mob.alive) continue;
		if (mob.hit > 0) mob.hit -= 1;
		const distance = Math.hypot(player.x - mob.x, player.y - mob.y);
		if (mob.type === "witch") continue;
		if (distance >= 240) continue;
		if (distance < 195 && distance > 28) {
			const speedToPlayer = .65;
			const mx = (player.x - mob.x) / distance * speedToPlayer;
			const my = (player.y - mob.y) / distance * speedToPlayer;
				if (!collides(mob.x + mx, mob.y, "mob") && !collides(mob.x, mob.y + my, "mob") &&
					!mobs.some((other) => other !== mob && other.alive && Math.hypot(mob.x + mx - other.x, mob.y + my - other.y) < 28)) {
					mob.x += mx;
					mob.y += my;
				}
		} else if (distance <= 29 && now - lastDamage > 950) {
			lastDamage = now;
			player.health = Math.max(0, player.health - 1);
			player.hurt = 14;
			const hitMessages = {
				slime: "Oof! A slime bonked you.",
				skeleton: "A skeleton struck you!",
				spider: "A spider bit you!",
				witch: "A witch's spell struck you!",
				bat: "A bat swooped into you!",
				zombie: "A zombie struck you!",
			};
			showToast(hitMessages[mob.type] || "An enemy struck you!");
			if (player.health === 0) {
				player.health = MAX_HEALTH;
				const home = FernfallSurvival.respawnPoint?.() || { x: 478, y: 322 };
				player.x = home.x;
				player.y = home.y;
				showToast("A friendly nap. Back to the trail!");
			}
			updateHud();
		}
	}
	if (now - lastSave > 5000) {
		saveGame();
		lastSave = now;
	}
}

function updateAnimal(animal) {
	if ((animal.type === "wolf" || animal.type === "jimothy") && animal.tamed) {
		const prey = animal.type === "wolf" ? mobs.filter((mob) => mob.alive && Math.hypot(mob.x - player.x, mob.y - player.y) < 260).sort((a, b) => Math.hypot(a.x - animal.x, a.y - animal.y) - Math.hypot(b.x - animal.x, b.y - animal.y))[0] : null;
		if (prey && Math.hypot(prey.x - animal.x, prey.y - animal.y) > 34) {
			const gap = Math.hypot(prey.x - animal.x, prey.y - animal.y);
			const dx = (prey.x - animal.x) / gap * 1.7;
			const dy = (prey.y - animal.y) / gap * 1.7;
			if (!collides(animal.x + dx, animal.y, animal.type)) animal.x += dx;
			if (!collides(animal.x, animal.y + dy, animal.type)) animal.y += dy;
			animal.direction = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : (dy < 0 ? "up" : "down");
			animal.moving = true;
			return;
		}
		if (prey) {
			animal.moving = false;
			return;
		}
		const distance = Math.hypot(player.x - animal.x, player.y - animal.y);
		if (distance > 68) {
			const speed = 0.95;
			const dx = (player.x - animal.x) / distance * speed;
			const dy = (player.y - animal.y) / distance * speed;
			if (!collides(animal.x + dx, animal.y, animal.type)) animal.x += dx;
			if (!collides(animal.x, animal.y + dy, animal.type)) animal.y += dy;
			animal.direction = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : (dy < 0 ? "up" : "down");
			animal.moving = true;
		} else {
			animal.moving = false;
		}
		return;
	}
	if (animal.turnTimer <= 0) {
		animal.roamAngle += (Math.random() - 0.5) * 1.8;
		animal.turnTimer = 75 + Math.random() * 100;
	}
	const speed = animal.type === "rabbit" ? 0.52 : 0.3;
	const nextX = animal.x + Math.cos(animal.roamAngle) * speed;
	const nextY = animal.y + Math.sin(animal.roamAngle) * speed;
	if (collides(nextX, nextY, animal.type)) {
		animal.roamAngle += Math.PI * (0.65 + Math.random() * 0.7);
		animal.turnTimer = 20;
		animal.moving = false;
	} else {
		animal.x = nextX;
		animal.y = nextY;
		animal.direction = Math.abs(Math.cos(animal.roamAngle)) > Math.abs(Math.sin(animal.roamAngle))
			? (Math.cos(animal.roamAngle) < 0 ? "left" : "right")
			: (Math.sin(animal.roamAngle) < 0 ? "up" : "down");
		animal.moving = true;
	}
	animal.turnTimer -= 1;
}

function addItem(type, amount) {
	player.inventory[type] = (player.inventory[type] || 0) + amount;
	updateHud();
	saveGame();
}

const wolfMeatTypes = ["beef_raw", "pork_raw", "mutton_raw", "rabbit_raw", "beef_cooked", "pork_cooked", "mutton_cooked", "rabbit_cooked"];

function gather() {
	const nearbyJimothy = animals.find((animal) => animal.type === "jimothy" && !animal.tamed && Math.hypot(player.x - animal.x, player.y - animal.y) < 58);
	if (nearbyJimothy) {
		FernfallSurvival.meetJimothy(nearbyJimothy);
		return true;
	}
	const nearbyWolf = animals.find((animal) => animal.type === "wolf" && Math.hypot(player.x - animal.x, player.y - animal.y) < 58);
	if (nearbyWolf) {
		if (nearbyWolf.tamed) {
			showToast("Your wolf is already by your side.");
		} else if (!wolfMeatTypes.some((type) => player.inventory[type] > 0)) {
			showToast("This wolf needs meat to trust you.");
		} else {
			const meat = wolfMeatTypes.find((type) => player.inventory[type] > 0);
			player.inventory[meat] -= 1;
			// Some wolves are easy, others need several pieces of meat before they trust you.
			nearbyWolf.tameNeeded ??= Math.random() < 0.5 ? 1 : 2 + Math.floor(Math.random() * 3);
			nearbyWolf.tameProgress = (nearbyWolf.tameProgress || 0) + 1;
			if (nearbyWolf.tameProgress < nearbyWolf.tameNeeded) {
				nearbyWolf.happyUntil = performance.now() + 600;
				showToast("The wolf wolfs down the meat but still eyes you warily. Maybe a little more?");
				updateHud();
				saveGame();
				return true;
			}
			nearbyWolf.tamed = true;
			nearbyWolf.happyUntil = performance.now() + 1800;
			playTone(700);
			showToast("A wolf joined your party!");
			updateHud();
			saveGame();
		}
		return true;
	}
	const nearbyPickup = pickups.find((pickup) => Math.hypot(player.x - pickup.x, player.y - pickup.y) < 55);
	if (nearbyPickup) {
		const index = pickups.indexOf(nearbyPickup);
		pickups.splice(index, 1);
		const amount = nearbyPickup.amount || 1;
		addItem(nearbyPickup.type, amount);
		const itemName = itemInfo[nearbyPickup.type]?.name || nearbyPickup.type.replaceAll("_", " ");
		showToast(`Picked up ${itemName.toLowerCase()}${amount > 1 ? ` ×${amount}` : ""}.`);
		return true;
	}
	if (window.FernfallGameInventory?.placeSelectedItem()) return true;
	const resource = resources.find((item) => item.available && Math.hypot(player.x - item.x, player.y - item.y) < 48);
	if (!resource) return false;
	window.FernfallGameInventory?.animate(resource.type === "wood" ? "chop" : "dig");
	resource.available = false;
	addItem(resource.type, 1);
	playTone(620);
	showToast(`Gathered ${itemInfo[resource.type].name.toLowerCase()}!`);
	setTimeout(() => { resource.available = true; }, 1800000);
	return true;
}

function attack() {
	const now = performance.now();
	if (now - lastAttack < 360) return;
	lastAttack = now;
	window.FernfallGameInventory?.animate("attack");
	player.swing = 1;
	let hit = false;
	for (const mob of mobs) {
		if (!mob.alive) continue;
		if (meleeHitboxContains(mob)) {
			mob.hp -= 1;
			mob.hit = 9;
			hit = true;
			playTone(260, 0.08);
			if (mob.hp <= 0) {
				mob.alive = false;
				player.coins += 1;
				player.xp += 1;
				pickups.push({ x: mob.x, y: mob.y, type: "gel" });
				showToast("Slime popped! +1 coin and some gel.");
				if (player.xp >= player.level * 3) {
					player.level += 1;
					player.xp = 0;
					player.health = MAX_HEALTH;
					showToast(`Level ${player.level}! You feel a little braver.`);
				}
				checkQuest();
			}
		}
	}
	if (!hit) showToast("Whoosh! Try facing a slime first.");
	updateHud();
	saveGame();
}

function useTonic() {
	if (player.health >= MAX_HEALTH) {
		showToast("You're already feeling great!");
	} else if (!player.inventory.tonic) {
		showToast("No health potion in your pack.");
	} else {
		player.inventory.tonic -= 1;
		player.health = Math.min(MAX_HEALTH, player.health + 3);
		showToast("Health potion! 3 health restored.");
		updateHud();
		saveGame();
	}
}

function syncGameMenuSound() {
	const button = document.querySelector("#game-menu-sound");
	if (!button) return;
	button.textContent = `Sound: ${soundEnabled ? "On" : "Off"}`;
	button.setAttribute("aria-pressed", String(soundEnabled));
}

function showGameMenu(view) {
	gamePaused = true;
	gameMenuView = view;
	keys.clear();
	heldDirections.clear();
	if (view === "paused") {
		window.FernfallInventory?.close();
		window.FernfallCrafting?.close();
		for (const id of ["survival-dialog", "villager-dialog"]) {
			const dialog = document.querySelector(`#${id}`);
			if (dialog?.open) dialog.close();
		}
	}
	const isHome = view === "home";
	document.querySelector("#game-menu-kicker").textContent = isHome ? "FERNFALL · WHISPERING WOODS" : "TAKE A BREATHER";
	document.querySelector("#game-menu-title").textContent = isHome ? "The trail awaits" : "Adventure paused";
	document.querySelector("#game-menu-copy").textContent = isHome
		? "A quiet trail, a little shelter, and a fresh start."
		: "Your trail is waiting right where you left it.";
	document.querySelector("#game-menu-primary").textContent = isHome ? "Enter the forest" : "Resume adventure";
	document.querySelector("#game-menu-home").hidden = isHome;
	syncGameMenuSound();
	if (!gameMenuDialog.open) gameMenuDialog.show();
}

function resumeGameMenu() {
	if (gameMenuDialog.open) gameMenuDialog.close();
	gamePaused = false;
	lastHungerDrain = performance.now();
	lastHungerRegen = lastHungerDrain;
	lastStarvationDamage = lastHungerDrain;
	keys.clear();
	heldDirections.clear();
	render();
}

function resetCharacter() {
	const resetPoints = [
		{ x: 160, y: 192 }, { x: 224, y: 192 }, { x: 96, y: 192 },
		{ x: 160, y: 256 }, { x: 160, y: 128 }, { x: 288, y: 192 },
		{ x: 224, y: 256 }, { x: 96, y: 256 },
	];
	const position = resetPoints.find(({ x, y }) =>
		!collides(x, y) && !window.fernfallPathOverlaps?.(x, y, 48, 48),
	);
	if (!position) return showToast("No clear reset point is available right now.");
	keys.clear();
	heldDirections.clear();
	player.x = position.x;
	player.y = position.y;
	player.direction = "down";
	player.swing = 0;
	player.hurt = 0;
	player.toolAction = null;
	player.toolActionUntil = 0;
	camera.x = player.x - WIDTH / 2;
	camera.y = player.y - HEIGHT / 2;
	window.FernfallInventory?.close();
	window.FernfallCrafting?.close();
	const cookingDialog = document.querySelector("#survival-dialog");
	if (cookingDialog?.open) cookingDialog.close();
	showToast("Character reset to a safe clearing. Inventory and progress kept.");
	updateHud();
	saveGame();
}

function checkQuest() {
	trackDailyTask();
}

let lastHudHealth = player.health;

function isMenuOpen() {
	const inventory = document.querySelector("#fernfall-inventory-root")?.classList.contains("fi-open");
	const crafting = document.querySelector("#fernfall-crafting");
	return Boolean(inventory || (crafting && !crafting.hidden) || [...document.querySelectorAll("dialog")].some((dialog) => dialog.open));
}

function flashDamageScreen() {
	let overlay = document.querySelector("#damage-flash");
	if (!overlay) {
		overlay = document.createElement("div");
		overlay.id = "damage-flash";
		overlay.setAttribute("aria-hidden", "true");
		overlay.style.cssText = "position:fixed;inset:0;z-index:2147483000;pointer-events:none;background:#d62828;opacity:0";
		document.body.append(overlay);
	}
	overlay.getAnimations().forEach((animation) => animation.cancel());
	overlay.animate([{ opacity: 0 }, { opacity: 0.45, offset: 0.35 }, { opacity: 0 }], { duration: 700, easing: "ease-in-out" });
}

function updateHud() {
	if (player.health < lastHudHealth && isMenuOpen()) flashDamageScreen();
	lastHudHealth = player.health;
	document.querySelector("#health-fill").style.width = `${player.health / MAX_HEALTH * 100}%`;
	document.querySelector("#health-value").textContent = `${player.health} / ${MAX_HEALTH}`;
	window.FernfallInventory?.setVitals({ health: player.health, maxHealth: MAX_HEALTH, hunger: player.hunger, maxHunger: MAX_HUNGER, saturation: player.saturation, maxSaturation: MAX_SATURATION });
	const statusbar = document.querySelector(".statusbar");
	let dayTracker = document.querySelector("#day-tracker");
	if (!dayTracker && statusbar) {
		dayTracker = document.createElement("div");
		dayTracker.id = "day-tracker";
		dayTracker.className = "day-tracker";
		dayTracker.setAttribute("role", "meter");
		dayTracker.setAttribute("aria-label", "Day progress");
		dayTracker.innerHTML = '<span class="day-label">DAY 1</span><span class="day-track"><span class="day-fill"></span></span><span class="day-value" title="Percent of the current day that has passed.">0%</span>';
		statusbar.append(dayTracker);
	}
	if (dayTracker) {
		const dayStatus = window.FernfallSurvival?.dayProgress?.() || { day: Number(document.querySelector("#day-count")?.textContent || 1), progress: 0 };
		const percentage = dayStatus.progress * 100;
		dayTracker.setAttribute("aria-valuemin", "0");
		dayTracker.setAttribute("aria-valuemax", "100");
		dayTracker.setAttribute("aria-valuenow", String(Math.round(percentage)));
		dayTracker.querySelector(".day-label").textContent = `DAY ${dayStatus.day}`;
		dayTracker.querySelector(".day-fill").style.width = `${percentage}%`;
		const dayValue = dayTracker.querySelector(".day-value");
		dayValue.textContent = `${Math.round(percentage)}%`;
		dayValue.title = "Percent of the current day that has passed.";
		dayValue.setAttribute("aria-label", `${Math.round(percentage)} percent of the current day has passed`);
	}
	document.querySelector("#coin-value").textContent = player.coins;
	document.querySelector("#level-value").textContent = player.level;
	trackDailyTask();
	document.querySelector("#quest-title").textContent = dailyTask.title;
	document.querySelector("#quest-copy").textContent = dailyTask.copy;
	document.querySelector("#quest-reward").textContent = `+ ${dailyTask.reward} coins`;
	document.querySelector("#quest-progress").textContent = `${dailyTask.progress} / ${dailyTask.goal}`;
	document.querySelector("#quest-fill").style.width = `${dailyTask.progress / dailyTask.goal * 100}%`;
	document.querySelector("#inventory-grid").innerHTML = Object.entries(itemInfo).map(([type, item]) => {
		const count = player.inventory[type] || 0;
		return `<div class="item-slot${count ? " filled" : ""}" title="${item.name}: ${count}" aria-label="${item.name}: ${count}"><span class="item-icon">${item.icon}</span>${count ? `<span class="item-count">${count}</span>` : ""}</div>`;
	}).join("");
	const total = Object.values(player.inventory).reduce((sum, count) => sum + count, 0);
	document.querySelector("#inventory-note").textContent = total ? `${total} little treasure${total === 1 ? "" : "s"} tucked away.` : "Your pockets are ready for an adventure.";
}

function setDirectionFromPointer(event) {
	const bounds = canvas.getBoundingClientRect();
	const x = (event.clientX - bounds.left) * WIDTH / bounds.width + camera.x;
	const y = (event.clientY - bounds.top) * HEIGHT / bounds.height + camera.y;
	const dx = x - player.x;
	const dy = y - player.y;
	player.direction = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : (dy < 0 ? "up" : "down");
}

document.addEventListener("keydown", (event) => {
	const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
	if (key === "Escape") {
		if (gameMenuDialog.open) {
			event.preventDefault();
			if (gameMenuView === "paused") resumeGameMenu();
			return;
		}
		const inventoryOpen = document.querySelector("#fernfall-inventory-root")?.classList.contains("fi-open");
		const crafting = document.querySelector("#fernfall-crafting");
		if (inventoryOpen || (crafting && !crafting.hidden) || [...document.querySelectorAll("dialog")].some((dialog) => dialog.open)) return;
		event.preventDefault();
		showGameMenu("paused");
		return;
	}
	if (gamePaused) return;
	if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) event.preventDefault();
	keys.add(key);
	if (event.repeat) return;
	if (key === "e") gather();
	if (key === " " || key === "Spacebar") attack();
});

document.addEventListener("keyup", (event) => keys.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key));
window.addEventListener("blur", () => { keys.clear(); heldDirections.clear(); });
const CLICK_REACH = 110;
function inClickReach(point) {
	return Math.hypot(point.x - player.x, point.y - player.y) <= CLICK_REACH;
}
canvas.addEventListener("pointerdown", (event) => {
	if (event.button !== 0) return;
	const bounds = canvas.getBoundingClientRect();
	const x = (event.clientX - bounds.left) * WIDTH / bounds.width + camera.x;
	const y = (event.clientY - bounds.top) * HEIGHT / bounds.height + camera.y;
	const pickup = pickups.find((item) => Math.hypot(item.x - x, item.y - y) < 24);
	const clickedJimothy = animals.find((animal) => animal.type === "jimothy" && !animal.tamed && Math.hypot(animal.x - x, animal.y - y) < 30);
	if (clickedJimothy && inClickReach(clickedJimothy)) {
		FernfallSurvival.meetJimothy(clickedJimothy);
		event.preventDefault();
		event.stopImmediatePropagation();
		return;
	}
	if (pickup && !inClickReach(pickup)) {
		showToast("Too far away. Move closer to pick that up.");
		event.preventDefault();
		event.stopImmediatePropagation();
		return;
	}
	if (pickup) {
		pickups.splice(pickups.indexOf(pickup), 1);
		const amount = pickup.amount || 1;
		addItem(pickup.type, amount);
		window.FernfallSurvival?.recordQuest?.("gathered", amount);
		window.FernfallSurvival?.recordVillagerQuestProgress?.(pickup.type, amount);
		const itemName = itemInfo[pickup.type]?.name || pickup.type.replaceAll("_", " ");
		showToast(`Picked up ${itemName.toLowerCase()}${amount > 1 ? ` ×${amount}` : ""}.`);
		event.preventDefault();
		event.stopImmediatePropagation();
		return;
	}
	if (!inClickReach({ x, y }) || !window.FernfallSurvival?.pickupAt(x, y)) return;
	event.preventDefault();
	event.stopImmediatePropagation();
}, { capture: true });
canvas.addEventListener("pointerdown", setDirectionFromPointer);
const gameTips = [
	"Pressing C opens a 2×2 crafting grid. Tools, furnaces and campfires need the 3×3 grid at a crafting table.",
	"Tools wear out. Watch the bar under a tool's slot; when it empties the tool breaks, and the next copy starts fresh.",
	"Ore gets rarer with every tier: stone and coal are common, iron less so, then gold, and crystal is the rarest.",
	"Gathered plants and ore take about three days to grow back, so plan your trips and move on to new ground.",
	"You can only left-click things within arm's reach. Walk closer if a click does nothing.",
	"Click Jimothy and he runs off to another part of the world. Carry a carrot to tame him, or a berry to get a hand pie as he goes.",
	"Villagers wait a day after you finish a quest before they have another one for you.",
	"Ores need a pickaxe one tier below them: coal needs wood, iron stone, gold iron, crystal gold. Stone needs none.",
	"Offer meat with E to tame the wolf. Your wolf will chase down and bite nearby monsters. Bring a carrot to tame Jimothy instead of just meeting him.",
	"Select a tool on the hotbar (1–9) and the ranger holds it. Bare hands work for everything, just slower.",
	"Pickaxes mine rocks and ore faster. Press E beside a rock and keep still until the bar fills.",
	"Axes chop trees faster. Each tree gives three wood before it becomes a stump.",
	"Hoes speed up carrots, potatoes and grain. Shovels speed up mushrooms and herbs.",
	"Hold shears and press E beside a sheep to take its wool without hurting it. The wool regrows in a minute.",
	"Hold an empty bucket and press E beside a cow or a pond to fill it.",
	"Tool tiers, slowest to fastest: wood, stone, iron, gold, crystal. A better tier finishes the job sooner.",
	"Rocks hide coal, iron, gold and crystal. Rarer ore takes longer to mine and gives that ore.",
	"Ore must be smelted in a furnace before it can make tools or weapons. Add coal for fuel, then smelt it into an ingot.",
	"Craft torches from coal and a stick, then place them. At night they light a circle and monsters can't spawn inside it.",
	"Scroll the mouse wheel over the game to switch hotbar slots.",
	"In a furnace, click an item to pick it up, then click INPUT or FUEL to drop it in. Right-click a furnace slot to take half the stack back.",
	"Stack ore in the furnace and fill FUEL with coal, and it smelts one after another without more clicks.",
	"Picking up a furnace gives back everything inside it: input, fuel and output.",
	"Left-click berries, crops, ore, torches, furnaces and crafting tables to pick them up.",
	"Coal is furnace fuel only. It is smelted with, never smelted itself.",
	"Moving cancels a job in progress, so stand still while the bar fills.",
	"Berry bushes need no tool. Pick them by hand for a few berries at a time.",
];
let gameTipIndex = Math.floor(Math.random() * gameTips.length);
function showNextTip() {
	const tip = document.querySelector("#tip-text");
	if (!tip) return;
	tip.textContent = gameTips[gameTipIndex];
	gameTipIndex = (gameTipIndex + 1) % gameTips.length;
}
showNextTip();
setInterval(showNextTip, 15000);
document.querySelector("#gather-button").addEventListener("click", gather);
document.querySelector("#attack-button").addEventListener("click", attack);
document.querySelector("#potion-button").addEventListener("click", useTonic);
document.querySelector("#reset-character-button").addEventListener("click", resetCharacter);
document.querySelector("#game-menu-button").addEventListener("click", () => showGameMenu("paused"));
document.querySelector("#game-menu-primary").addEventListener("click", (event) => {
	event.preventDefault();
	resumeGameMenu();
});
document.querySelector("#game-menu-home").addEventListener("click", () => showGameMenu("home"));
document.querySelector("#game-menu-sound").addEventListener("click", () => document.querySelector("#sound-toggle").click());
document.querySelector("#mobile-attack").addEventListener("pointerdown", (event) => { event.preventDefault(); attack(); });
document.querySelectorAll("[data-move]").forEach((button) => {
	const direction = button.dataset.move;
	button.addEventListener("pointerdown", (event) => { event.preventDefault(); button.setPointerCapture(event.pointerId); heldDirections.add(direction); });
	for (const type of ["pointerup", "pointercancel", "lostpointercapture"]) button.addEventListener(type, () => heldDirections.delete(direction));
});
document.querySelector("#sound-toggle").addEventListener("click", (event) => {
	if (!window.AudioContext) {
		showToast("Game sounds are not available in this browser.");
		return;
	}
	soundEnabled = !soundEnabled;
	event.currentTarget.setAttribute("aria-pressed", String(soundEnabled));
	document.querySelector("#sound-icon").textContent = soundEnabled ? "♫" : "♪";
	if (soundEnabled) {
		audioContext ??= new AudioContext();
		audioContext.resume();
		playTone(520);
	}
	showToast(soundEnabled ? "Game sounds are on." : "Game sounds are off.");
	syncGameMenuSound();
});

function gameLoop() {
	if (!gamePaused) update();
	requestAnimationFrame(gameLoop);
}

document.querySelector("#day-count").textContent = String(Math.max(1, Math.floor((saved?.xp ?? 0) / 3) + 1));
updateHud();
showGameMenu("home");
render();
gameLoop();

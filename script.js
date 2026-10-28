const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const SAVE_KEY = "fernfall-save-v1";
const keys = new Set();
const heldDirections = new Set();
const MAX_HEALTH = 10;
const MAX_HUNGER = 100;
const HUNGER_DRAIN_MS = 12000;
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
	tonic: { name: "Berry tonic", icon: "♧" },
	seed: { name: "Acorn", icon: "✿" },
};

const saved = loadSave();
const player = {
	x: saved?.x ?? 478,
	y: saved?.y ?? 322,
	direction: "down",
	health: saved?.health ?? MAX_HEALTH,
	hunger: saved?.hunger ?? MAX_HUNGER,
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
	{ x: 167, y: 190, type: "berry", available: true },
	{ x: 335, y: 161, type: "wood", available: true },
	{ x: 571, y: 186, type: "berry", available: true },
	{ x: 830, y: 214, type: "seed", available: true },
	{ x: 257, y: 360, type: "berry", available: true },
	{ x: 470, y: 424, type: "wood", available: true },
	{ x: 739, y: 365, type: "seed", available: true },
];

const mobs = [];

const animals = [
	{ type: "sheep", x: 518, y: 170, phase: 0, roamAngle: 1.8, turnTimer: 0, direction: "down", moving: false },
	{ type: "cow", x: 340, y: 365, phase: 1, roamAngle: 0.4, turnTimer: 0, direction: "down", moving: false },
	{ type: "pig", x: 700, y: 390, phase: 2, roamAngle: 2.7, turnTimer: 0, direction: "down", moving: false },
	{ type: "rabbit", x: 140, y: 330, phase: 3, roamAngle: 5.2, turnTimer: 0, direction: "down", moving: false },
	{ type: "wolf", x: 520, y: 500, phase: 4, roamAngle: 3.3, turnTimer: 0, direction: "down", moving: false, tamed: saved?.wolfTamed ?? false },
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
			chunk.obstacles.forEach(addObstacle);
			resources.push(...chunk.resources);
			animals.push(...chunk.animals);
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
	for (let index = 0; index < 5; index += 1) {
		const position = randomChunkPosition(random, chunkX, chunkY);
		const onPath = window.fernfallPathOverlaps?.(position.x, position.y + 5, 84, 84);
		if (!collides(position.x, position.y) && !onPath && Math.hypot(player.x - position.x, player.y - position.y) > 90) {
			addObstacle({ ...position, r: 30 + random() * 12 });
		}
	}
	for (let index = 0; index < 3; index += 1) {
		resources.push({ ...randomChunkPosition(random, chunkX, chunkY), type: ["berry", "wood", "seed"][Math.floor(random() * 3)], available: true });
	}
	const animalTypes = ["sheep", "cow", "pig", "rabbit", "wolf"];
	for (let index = 0; index < 2; index += 1) {
		animals.push({
			...randomChunkPosition(random, chunkX, chunkY),
			type: animalTypes[Math.floor(random() * animalTypes.length)],
			phase: random() * 6,
			roamAngle: random() * Math.PI * 2,
			turnTimer: 0,
			direction: "down",
			moving: false,
			tamed: false,
		});
	}
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
const toastQueue = [];
let toastTimer;
let questClaimed = saved?.questClaimed ?? false;
let jimothyMet = saved?.jimothyMet ?? false;
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
			x: player.x, y: player.y, health: player.health, hunger: player.hunger, coins: player.coins,
			xp: player.xp, level: player.level, inventory: player.inventory, questClaimed,
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
			showToast("Progress could not be saved in this browser.");
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
	if (drawToolAction(now, bob)) return;
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

function drawToolAction(now, bob) {
	const animations = window.FernfallToolAnimations;
	if (!player.toolAction || now >= player.toolActionUntil || !animations?.draw) return false;
	const frames = animations.images?.[`${player.toolAction}_${player.direction}`] || animations.images?.[`${player.toolAction}_down`];
	const frame = frames?.[Math.floor(now / 90) % frames.length];
	if (!frame?.complete || !frame.naturalWidth) return false;
	ctx.save();
	ctx.imageSmoothingEnabled = false;
	animations.draw(ctx, player.toolAction, player.direction, player.x - 32, player.y + bob - 32, 64, now - player.toolActionStarted);
	ctx.restore();
	return true;
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
	if (animal.type === "wolf" && animal.tamed) {
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
	if (player.swing > 0) player.swing = Math.max(0, player.swing - 0.06);
	if (player.hurt > 0) player.hurt -= 1;
	for (const animal of animals) {
		if (animal.type === "wolf" && animal.tamed || Math.hypot(player.x - animal.x, player.y - animal.y) < 720) updateAnimal(animal);
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
			if (!mobs.some((other) => other !== mob && other.alive && Math.hypot(mob.x + mx - other.x, mob.y + my - other.y) < 28)) {
				mob.x += mx;
				mob.y += my;
			}
		} else if (distance <= 29 && now - lastDamage > 950) {
			lastDamage = now;
			player.health = Math.max(0, player.health - 1);
			player.hurt = 14;
			showToast(mob.type === "skeleton" ? "A skeleton struck you!" : "Oof! A slime bonked you.");
			if (player.health === 0) {
				player.health = MAX_HEALTH;
				player.x = 478;
				player.y = 322;
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
	if (animal.type === "wolf" && animal.tamed) {
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

function gather() {
	const nearbyJimothy = animals.find((animal) => animal.type === "jimothy" && Math.hypot(player.x - animal.x, player.y - animal.y) < 58);
	if (nearbyJimothy) {
		jimothyMet = true;
		animals.splice(animals.indexOf(nearbyJimothy), 1);
		showToast("Jimothy waves goodbye and slips into the woods. That was your one meeting!");
		saveGame();
		return true;
	}
	const nearbyWolf = animals.find((animal) => animal.type === "wolf" && Math.hypot(player.x - animal.x, player.y - animal.y) < 58);
	if (nearbyWolf) {
		if (nearbyWolf.tamed) {
			showToast("Your wolf is already by your side.");
		} else if (!player.inventory.berry) {
			showToast("This wolf needs a wild berry to trust you.");
		} else {
			player.inventory.berry -= 1;
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
	const resource = resources.find((item) => item.available && Math.hypot(player.x - item.x, player.y - item.y) < 48);
	if (!resource) return false;
	window.FernfallGameInventory?.animate(resource.type === "wood" ? "chop" : "dig");
	resource.available = false;
	addItem(resource.type, 1);
	playTone(620);
	showToast(`Gathered ${itemInfo[resource.type].name.toLowerCase()}!`);
	setTimeout(() => { resource.available = true; }, 12000);
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
		const dx = mob.x - player.x;
		const dy = mob.y - player.y;
		const distance = Math.hypot(dx, dy);
		const facingDot = player.direction === "up" ? -dy : player.direction === "down" ? dy : player.direction === "left" ? -dx : dx;
		if (distance < 62 && facingDot > 2) {
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
		showToast("No berry tonic in your pack.");
	} else {
		player.inventory.tonic -= 1;
		player.health = Math.min(MAX_HEALTH, player.health + 2);
		showToast("Berry tonic! Two hearts restored.");
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
	if (!gameMenuDialog.open) gameMenuDialog.showModal();
}

function resumeGameMenu() {
	if (gameMenuDialog.open) gameMenuDialog.close();
	gamePaused = false;
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
	const defeated = mobs.filter((mob) => !mob.alive).length;
	if (defeated >= 3 && !questClaimed) {
		questClaimed = true;
		player.coins += 3;
		showToast("Quest complete! +3 bonus coins.");
		saveGame();
	}
}

function updateHud() {
	document.querySelector("#health-fill").style.width = `${player.health / MAX_HEALTH * 100}%`;
	document.querySelector("#health-value").textContent = `${player.health} / ${MAX_HEALTH}`;
	window.FernfallInventory?.setVitals({ health: player.health, maxHealth: MAX_HEALTH, hunger: player.hunger, maxHunger: MAX_HUNGER });
	document.querySelector("#coin-value").textContent = player.coins;
	document.querySelector("#level-value").textContent = player.level;
	const defeated = mobs.filter((mob) => !mob.alive).length;
	document.querySelector("#quest-progress").textContent = questClaimed ? "Done!" : `${defeated} / 3`;
	document.querySelector("#quest-fill").style.width = `${questClaimed ? 100 : defeated / 3 * 100}%`;
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
canvas.addEventListener("pointerdown", setDirectionFromPointer);
document.querySelector("#gather-button").addEventListener("click", gather);
document.querySelector("#attack-button").addEventListener("click", attack);
document.querySelector("#potion-button").addEventListener("click", useTonic);
document.querySelector("#reset-character-button").addEventListener("click", resetCharacter);
document.querySelector("#game-menu-button").addEventListener("click", () => showGameMenu("paused"));
document.querySelector("#game-menu-primary").addEventListener("click", resumeGameMenu);
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

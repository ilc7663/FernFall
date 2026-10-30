(() => {
	const STORAGE_KEY = "fernfall_tool_durability_v1";
	const materialUses = { wood: 40, stone: 80, iron: 160, gold: 240, crystal: 400 };
	const toolFactor = { pickaxe: 1, axe: 1, shovel: 1, hoe: 1, sword: 1, shears: 1 };
	const gatherTool = { stone: "pickaxe", wood: "axe", carrot: "hoe", potato: "hoe", grain: "hoe", mushroom: "shovel", herb: "shovel", shear: "shears" };
	// One counter per tool id tracks the copy in use; when it breaks the next copy starts fresh.
	let wear = {};
	try { wear = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { wear = {}; }

	function maxUses(id) {
		const match = /^(?:([a-z]+)_)?(pickaxe|axe|shovel|hoe|sword|shears)$/.exec(id || "");
		if (!match) return 0;
		return (materialUses[match[1]] || 60) * toolFactor[match[2]];
	}

	function saveWear() {
		try { localStorage.setItem(STORAGE_KEY, JSON.stringify(wear)); } catch { /* storage unavailable */ }
	}

	function heldId() {
		return window.FernfallInventory?.getSelected?.()?.id || "";
	}

	function wearTool(id) {
		const max = maxUses(id);
		if (!max || !(player.inventory[id] > 0)) return;
		const left = (wear[id] ?? max) - 1;
		if (left > 0) {
			wear[id] = left;
			saveWear();
			paintBars();
			return;
		}
		delete wear[id];
		saveWear();
		player.inventory[id] -= 1;
		showToast(`Your ${(window.FERNFALL_ITEM_LABELS?.[id] || id.replaceAll("_", " ")).toLowerCase()} broke!`);
		updateHud();
		saveGame();
	}

	const originalGatherFx = window.fernfallGatherFx;
	window.fernfallGatherFx = function (kind, target, done) {
		const result = originalGatherFx?.(kind, target, done);
		const id = heldId();
		if (done && gatherTool[kind] && id.split("_").pop() === gatherTool[kind] && maxUses(id)) wearTool(id);
		return result;
	};

	const originalAttack = attack;
	attack = function () {
		const id = heldId();
		const before = [...mobs, ...animals].reduce((sum, entry) => sum + (entry.hp || 0), 0);
		const result = originalAttack();
		const after = [...mobs, ...animals].reduce((sum, entry) => sum + (entry.hp || 0), 0);
		if (id.endsWith("_sword") && after < before) wearTool(id);
		return result;
	};

	const style = document.createElement("style");
	style.textContent = `
		#fernfall-inventory-root .fi-durability { position: absolute; left: 4px; right: 4px; bottom: 3px; height: 4px; background: #1b2a21; border-radius: 2px; pointer-events: none; }
		#fernfall-inventory-root .fi-durability i { display: block; height: 100%; border-radius: 2px; }
	`;
	document.head.append(style);

	function paintBars() {
		for (const slot of document.querySelectorAll("#fernfall-inventory-root .fi-slot")) {
			slot.querySelector(".fi-durability")?.remove();
			const id = [...slot.classList].find((name) => name.startsWith("fi-item-"))?.slice(8);
			const max = maxUses(id);
			if (!max || wear[id] === undefined) continue;
			const ratio = Math.max(0, Math.min(1, wear[id] / max));
			const bar = document.createElement("span");
			bar.className = "fi-durability";
			bar.innerHTML = `<i style="width:${ratio * 100}%;background:${ratio > 0.5 ? "#7bc45a" : ratio > 0.2 ? "#e4bc57" : "#d6603f"}"></i>`;
			slot.append(bar);
		}
	}

	const observer = new MutationObserver(() => {
		observer.disconnect();
		paintBars();
		watch();
	});
	function watch() {
		for (const container of document.querySelectorAll("#fernfall-inventory-root .fi-hotbar, #fernfall-inventory-root .fi-backpack, #fernfall-inventory-root .fi-gridbar")) {
			observer.observe(container, { childList: true });
		}
	}
	watch();
	paintBars();
})();

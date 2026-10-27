const passiveArt = {};
const passiveArtReady = (() => {
	const baseUrl = new URL("Video_Game_PNGs/Fernfall_Passive_Mobs_Game_Ready/assets/passive/", document.baseURI);
	const directions = {
		down: ["idle", "walk1", "walk2", "happy"],
		left: ["idle", "walk1", "walk2", "rest"],
		right: ["idle", "walk1", "walk2", "rest"],
		up: ["idle", "walk1", "walk2", "happy"],
	};
	const species = ["sheep", "cow", "pig", "wolf", "rabbit", "jimothy"];
	const images = [];
	for (const name of species) {
		passiveArt[name] = {};
		for (const [direction, actions] of Object.entries(directions)) {
			for (const action of actions) {
				const image = new Image();
				image.src = new URL(`${name}_${direction}_${action}.png`, baseUrl);
				passiveArt[name][`${direction}_${action}`] = image;
				images.push(image.decode().catch(() => {}));
			}
		}
	}
	passiveArt.wolf_tamed = passiveArt.wolf;
	return Promise.all(images).then(() => passiveArt);
})();
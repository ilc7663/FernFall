// Fernfall background terrain renderer. Load BEFORE script.js.
const fernfallGround = {};
const fernfallGroundBase = new URL("assets/ground/", document.currentScript.src);
const FERNFALL_TILES = ["grass_light","grass_meadow","grass_dark","grass_clover","grass_flowers","grass_sparse","grass_wildflower","grass_worn","path_pebbles","path_light","path_earth","path_stones","moss_stones","moss_ferns","moss_earth","moss_dark"];
for (const name of FERNFALL_TILES) {
  const img = new Image();
  img.src = new URL(`${name}.png`, fernfallGroundBase);
  fernfallGround[name] = img;
}
function drawFernfallGround(ctx, width, height) {
  const tileSize = 64;
  ctx.fillStyle = '#749d58';
  ctx.fillRect(0, 0, width, height);
  for (let row = 0; row < Math.ceil(height / tileSize); row++) {
    for (let col = 0; col < Math.ceil(width / tileSize); col++) {
      const x = col * tileSize, y = row * tileSize;
      const hash = ((col*73856093) ^ (row*19349663)) >>> 0;
      const rand = hash % 100;
      const pathY = 325 - 23*Math.sin((x / 960)*Math.PI*2);
      let name;
      if (Math.abs(y + tileSize/2 - pathY) < 54) {
        name = FERNFALL_TILES[8 + (hash % 4)];
      } else if (rand < 8) {
        name = FERNFALL_TILES[12 + (hash % 4)];
      } else {
        name = FERNFALL_TILES[hash % 8];
      }
      const img = fernfallGround[name];
      if (img.complete && img.naturalWidth) ctx.drawImage(img,x,y,tileSize,tileSize);
    }
  }
}

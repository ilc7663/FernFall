// Fernfall background terrain renderer. Load BEFORE script.js.
const fernfallGround = {};
const fernfallGroundBase = new URL("assets/ground/", document.currentScript.src);
const FERNFALL_TILES = ["grass_light","grass_meadow","grass_dark","grass_clover","grass_flowers","grass_sparse","grass_wildflower","grass_worn","path_pebbles","path_light","path_earth","path_stones","moss_stones","moss_ferns","moss_earth","moss_dark"];
for (const name of FERNFALL_TILES) {
  const img = new Image();
  img.src = new URL(`${name}.png`, fernfallGroundBase);
  fernfallGround[name] = img;
}
function drawFernfallGround(ctx, width, height, cameraX, cameraY) {
  const tileSize = 64;
  cameraX ??= typeof camera === "undefined" ? 0 : camera.x;
  cameraY ??= typeof camera === "undefined" ? 0 : camera.y;
  ctx.fillStyle = '#749d58';
  ctx.fillRect(0, 0, width, height);
  const firstCol = Math.floor(cameraX / tileSize);
  const firstRow = Math.floor(cameraY / tileSize);
  for (let row = 0; row <= Math.ceil(height / tileSize); row++) {
    for (let col = 0; col <= Math.ceil(width / tileSize); col++) {
      const worldCol = firstCol + col, worldRow = firstRow + row;
      const worldX = worldCol * tileSize, worldY = worldRow * tileSize;
      const x = worldX - cameraX, y = worldY - cameraY;
      const hash = ((worldCol*73856093) ^ (worldRow*19349663)) >>> 0;
      const rand = hash % 100;
      const pathY = 325 - 23*Math.sin((worldX / 960)*Math.PI*2);
      let name;
      if (Math.abs(worldY + tileSize/2 - pathY) < 54) {
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

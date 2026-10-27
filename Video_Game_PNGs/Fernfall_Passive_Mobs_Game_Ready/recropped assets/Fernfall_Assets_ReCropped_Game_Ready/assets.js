// Fernfall sprite loader — add <script src="assets.js"></script> before script.js
const art = {};
const artFiles = {
  ranger: Object.fromEntries(['up','down','left','right'].flatMap(d => ['idle','walk1','walk2','attack1','attack2'].map(s => [d+'_'+s, 'ranger_'+d+'_'+s+'.png']))),
  slime: Object.fromEntries(['green','blue'].flatMap(c => ['idle1','idle2','angry','squash','jump1','jump2','splash','attack'].map(s => [c+'_'+s, 'slime_'+c+'_'+s+'.png']))),
  forest: Object.fromEntries(['tree_oak','tree_pine','tree_stump','tree_log','rock_small','rock_moss','rock_cluster','bush','fern','mushroom_red','mushroom_brown','flowers_white','flowers_yellow','ground_grass','ground_dirt','ground_moss','ground_stone'].map(s => [s, s+'.png'])),
  item: Object.fromEntries(['coin','gem','heart','potion','herb','key','arrows','wood'].map(s => [s, 'item_'+s+'.png']))
};
for (const [group, names] of Object.entries(artFiles)) {
  art[group] = {};
  for (const [name, filename] of Object.entries(names)) {
    const img = new Image(); img.src = 'assets/' + filename; art[group][name] = img;
  }
}
// Canvas helper: draws sprites centered at x, y, returns false until loaded.
function drawArt(ctx, img, x, y, w, h) {
  if (!img || !img.complete || !img.naturalWidth) return false;
  ctx.save(); ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, Math.round(x-w/2), Math.round(y-h/2), w, h);
  ctx.restore(); return true;
}

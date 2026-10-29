// Fernfall nature sprite loader — call await loadFernfallNatureAssets() before rendering.
window.loadFernfallNatureAssets = async function(basePath = 'assets') {
  const groups = {"beds": ["bed_down", "bed_up", "bed_left", "bed_right", "bed_down_left", "bed_down_right", "bed_up_left", "bed_up_right"], "berries": ["berry_bush_red", "berry_bush_blue", "berry_bush_black", "berry_bush_empty", "berries_red", "berries_blue", "berries_black", "berry_leaves"], "mushrooms": ["mushroom_brown", "mushroom_red", "mushroom_orange", "mushroom_purple", "mushroom_brown_small", "mushroom_red_small", "mushroom_orange_small", "mushroom_purple_small"], "logs": ["log_large", "log_medium", "log_small", "log_hollow", "log_branch", "log_split", "log_mossy", "log_with_plant", "log_plain"], "pond_tiles": ["pond_edge_w", "pond_edge_e", "pond_corner_se", "pond_corner_ne", "pond_center", "pond_water_lily", "pond_corner_sw", "grass", "pond_edge_n", "pond_water", "pond_edge_s", "pond_water_deep", "pond_corner_nw", "pond_water_flower"], "pond_decor": ["ripples", "reeds", "lilypad", "pond_rock"]};
  const art = {};
  const jobs=[];
  for (const [group, names] of Object.entries(groups)) {
    art[group] = {};
    for (const name of names) {
      const img=new Image();
      art[group][name]=img;
      jobs.push(new Promise(resolve=>{img.onload=()=>resolve(true);img.onerror=()=>resolve(false);img.src=`${basePath}/${group}/${name}.png`;}));
    }
  }
  const loaded=await Promise.all(jobs);
  if (loaded.includes(false)) console.warn('Some Fernfall nature assets failed to load; check paths.');
  window.fernfallNatureArt=art;
  return art;
};

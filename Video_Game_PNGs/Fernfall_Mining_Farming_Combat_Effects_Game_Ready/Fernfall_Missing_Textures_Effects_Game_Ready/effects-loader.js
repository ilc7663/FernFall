// Fernfall texture + effects loader; includes all frame names in window.fernfallEffects
window.fernfallEffects = {};
window.loadFernfallEffects = async function(base = '') {
  const data = await fetch(base + 'manifest.json').then(r => r.json());
  const jobs = [];
  for (const [group, files] of Object.entries(data)) {
    window.fernfallEffects[group] = {};
    for (const [key, filename] of Object.entries(files)) {
      const img = new Image();
      window.fernfallEffects[group][key] = img;
      jobs.push(new Promise(resolve => {img.onload = resolve; img.onerror = resolve; img.src = base + filename;}));
    }
  }
  await Promise.all(jobs);
  return window.fernfallEffects;
};

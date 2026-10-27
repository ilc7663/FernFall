// Fernfall cooking add-on: include BEFORE script.js in site.html.
// Visual sprites + optional recipe data. Does NOT automatically change gameplay.
(function (global) {
  'use strict';
  const paths = {
  "beef_raw": "assets/food/raw/beef_raw.png",
  "pork_raw": "assets/food/raw/pork_raw.png",
  "mutton_raw": "assets/food/raw/mutton_raw.png",
  "rabbit_raw": "assets/food/raw/rabbit_raw.png",
  "bird_raw": "assets/food/raw/bird_raw.png",
  "deer_raw": "assets/food/raw/deer_raw.png",
  "boar_raw": "assets/food/raw/boar_raw.png",
  "fish_raw": "assets/food/raw/fish_raw.png",
  "beef_cooked": "assets/food/cooked/beef_cooked.png",
  "pork_cooked": "assets/food/cooked/pork_cooked.png",
  "mutton_cooked": "assets/food/cooked/mutton_cooked.png",
  "rabbit_cooked": "assets/food/cooked/rabbit_cooked.png",
  "bird_cooked": "assets/food/cooked/bird_cooked.png",
  "deer_cooked": "assets/food/cooked/deer_cooked.png",
  "boar_cooked": "assets/food/cooked/boar_cooked.png",
  "fish_cooked": "assets/food/cooked/fish_cooked.png",
  "cooked_steak": "assets/food/recipes/cooked_steak.png",
  "steak_veggies": "assets/food/recipes/steak_veggies.png",
  "pork_chop": "assets/food/recipes/pork_chop.png",
  "roasted_pork": "assets/food/recipes/roasted_pork.png",
  "lamb_stew": "assets/food/recipes/lamb_stew.png",
  "mutton_chops": "assets/food/recipes/mutton_chops.png",
  "rabbit_stew": "assets/food/recipes/rabbit_stew.png",
  "meat_stew": "assets/food/recipes/meat_stew.png",
  "fish_stew": "assets/food/recipes/fish_stew.png",
  "campfire_0": "assets/campfire/campfire_0.png",
  "campfire_1": "assets/campfire/campfire_1.png",
  "campfire_2": "assets/campfire/campfire_2.png",
  "campfire_3": "assets/campfire/campfire_3.png",
  "campfire_4": "assets/campfire/campfire_4.png",
  "campfire_5": "assets/campfire/campfire_5.png",
  "campfire_6": "assets/campfire/campfire_6.png",
  "cooking_pot_empty": "assets/cookware/cooking_pot_empty.png",
  "cooking_pot_food": "assets/cookware/cooking_pot_food.png",
  "frying_pan_empty": "assets/cookware/frying_pan_empty.png",
  "frying_pan_food": "assets/cookware/frying_pan_food.png",
  "pot_lid": "assets/cookware/pot_lid.png",
  "small_pan": "assets/cookware/small_pan.png",
  "bowl_empty": "assets/cookware/bowl_empty.png",
  "bowl_food": "assets/cookware/bowl_food.png",
  "bucket_empty": "assets/bucket/bucket_empty.png",
  "bucket_water": "assets/bucket/bucket_water.png",
  "berry_hand_pie": "assets/food/recipes/berry_hand_pie.png"
};
  const recipes = {
  "beef_cooked": {
    "name": "Cooked Beef",
    "ingredients": {
      "beef_raw": 1
    },
    "station": "campfire",
    "cookSeconds": 4,
    "hearts": 3
  },
  "pork_cooked": {
    "name": "Cooked Pork",
    "ingredients": {
      "pork_raw": 1
    },
    "station": "campfire",
    "cookSeconds": 4,
    "hearts": 3
  },
  "mutton_cooked": {
    "name": "Cooked Mutton",
    "ingredients": {
      "mutton_raw": 1
    },
    "station": "campfire",
    "cookSeconds": 4,
    "hearts": 3
  },
  "rabbit_cooked": {
    "name": "Cooked Rabbit",
    "ingredients": {
      "rabbit_raw": 1
    },
    "station": "campfire",
    "cookSeconds": 4,
    "hearts": 2
  },
  "cooked_steak": {
    "name": "Grilled Steak",
    "ingredients": {
      "beef_raw": 1
    },
    "station": "frying_pan",
    "cookSeconds": 6,
    "hearts": 4
  },
  "steak_veggies": {
    "name": "Steak and Vegetables",
    "ingredients": {
      "beef_raw": 1,
      "carrot": 1,
      "potato": 1
    },
    "station": "frying_pan",
    "cookSeconds": 8,
    "hearts": 6
  },
  "pork_chop": {
    "name": "Pan-Seared Pork Chop",
    "ingredients": {
      "pork_raw": 1
    },
    "station": "frying_pan",
    "cookSeconds": 6,
    "hearts": 4
  },
  "roasted_pork": {
    "name": "Herb-Roasted Pork",
    "ingredients": {
      "pork_raw": 1,
      "herb": 1
    },
    "station": "cooking_pot",
    "cookSeconds": 8,
    "hearts": 5
  },
  "lamb_stew": {
    "name": "Mutton Stew",
    "ingredients": {
      "mutton_raw": 1,
      "carrot": 1,
      "potato": 1
    },
    "station": "cooking_pot",
    "cookSeconds": 10,
    "hearts": 6
  },
  "mutton_chops": {
    "name": "Grilled Mutton Chops",
    "ingredients": {
      "mutton_raw": 1,
      "herb": 1
    },
    "station": "frying_pan",
    "cookSeconds": 7,
    "hearts": 5
  },
  "rabbit_stew": {
    "name": "Rabbit Stew",
    "ingredients": {
      "rabbit_raw": 1,
      "carrot": 1,
      "potato": 1
    },
    "station": "cooking_pot",
    "cookSeconds": 9,
    "hearts": 5
  },
  "meat_stew": {
    "name": "Hearty Meat Stew",
    "ingredients": {
      "beef_raw": 1,
      "carrot": 1,
      "potato": 1
    },
    "station": "cooking_pot",
    "cookSeconds": 10,
    "hearts": 6
  }
};
  const drops = {
  "cow": {
    "beef_raw": [
      1,
      2
    ]
  },
  "pig": {
    "pork_raw": [
      1,
      2
    ]
  },
  "sheep": {
    "mutton_raw": [
      1,
      2
    ]
  },
  "rabbit": {
    "rabbit_raw": [
      1,
      1
    ]
  },
  "wolf": {},
  "jimothy": {
    "berry_hand_pie": [
      0,
      1
    ]
  }
};
  const images = {};
  const basePath = (global.FERNFALL_COOKING_BASE_PATH || new URL('.', document.currentScript.src).href).replace(/\/$/, '');
  const ready = Promise.all(Object.entries(paths).map(([key, p]) => new Promise((resolve) => {
    const img = new Image();
    images[key] = img;
    img.onload = () => resolve(key);
    img.onerror = () => { console.warn('[FernfallCooking] Failed to load ' + p); resolve(null); };
    img.src = basePath ? basePath + '/' + p : p;
  })));
  function draw(ctx, key, x, y, width=42, height=width) {
    const img = images[key];
    if (!img || !img.complete || !img.naturalWidth) return false;
    ctx.save(); ctx.imageSmoothingEnabled=false;
    ctx.drawImage(img,x,y,width,height); ctx.restore(); return true;
  }
  function drawCampfire(ctx, x, y, ms, size=82, lit=true) {
    const frame = lit ? 1 + Math.floor(ms / 150) % 6 : 0;
    return draw(ctx, 'campfire_' + frame, x, y, size, size);
  }
  function canCook(recipeKey, inventory) {
    const recipe = recipes[recipeKey];
    if (!recipe) return false;
    return Object.entries(recipe.ingredients).every(([id, n]) => (inventory[id] || 0) >= n);
  }
  function cook(recipeKey, inventory) {
    if (!canCook(recipeKey, inventory)) return false;
    for (const [id, n] of Object.entries(recipes[recipeKey].ingredients)) {
      inventory[id] -= n;
    }
    inventory[recipeKey] = (inventory[recipeKey] || 0) + 1;
    return true; // demo helper: immediate craft; add timers/station checks in script.js
  }
  global.FernfallCooking = { paths, images, ready, recipes, animalDrops:drops,
    draw, drawCampfire, canCook, cook };
})(window);

(()=>{'use strict';
const recipes={"campfire": {"wood": 3, "stone": 4}, "crafting_table": {"wood": 4}, "furnace": {"stone": 8}, "bucket_empty": {"iron": 3}, "cooking_pot_empty": {"iron": 5}, "frying_pan_empty": {"iron": 3, "wood": 1}, "bowl_empty": {"wood": 2}, "wood_pickaxe": {"wood": 3, "stick": 2}, "wood_axe": {"wood": 3, "stick": 2}, "wood_shovel": {"wood": 1, "stick": 2}, "wood_hoe": {"wood": 2, "stick": 2}, "wood_sword": {"wood": 2, "stick": 1}, "stone_pickaxe": {"stone": 3, "stick": 2}, "stone_axe": {"stone": 3, "stick": 2}, "stone_shovel": {"stone": 1, "stick": 2}, "stone_hoe": {"stone": 2, "stick": 2}, "stone_sword": {"stone": 2, "stick": 1}, "iron_pickaxe": {"iron": 3, "stick": 2}, "iron_axe": {"iron": 3, "stick": 2}, "iron_shovel": {"iron": 1, "stick": 2}, "iron_hoe": {"iron": 2, "stick": 2}, "iron_sword": {"iron": 2, "stick": 1}, "gold_pickaxe": {"gold": 3, "stick": 2}, "gold_axe": {"gold": 3, "stick": 2}, "gold_shovel": {"gold": 1, "stick": 2}, "gold_hoe": {"gold": 2, "stick": 2}, "gold_sword": {"gold": 2, "stick": 1}, "crystal_pickaxe": {"crystal": 3, "stick": 2}, "crystal_axe": {"crystal": 3, "stick": 2}, "crystal_shovel": {"crystal": 1, "stick": 2}, "crystal_hoe": {"crystal": 2, "stick": 2}, "crystal_sword": {"crystal": 2, "stick": 1}, "torch": {"wood": 1, "coal": 1}, "rope": {"spider_silk": 3}, "arrow": {"stick": 1, "stone": 1}, "beef_cooked": {"beef_raw": 1}, "pork_cooked": {"pork_raw": 1}, "mutton_cooked": {"mutton_raw": 1}, "rabbit_cooked": {"rabbit_raw": 1}, "lamb_stew": {"mutton_raw": 1, "carrot": 1, "potato": 1}, "steak_veggies": {"beef_raw": 1, "carrot": 1, "potato": 1}, "rabbit_stew": {"rabbit_raw": 1, "carrot": 1, "potato": 1}, "meat_stew": {"beef_raw": 1, "carrot": 1, "potato": 1}};
const el=document.createElement('div');el.id='fernfall-crafting';el.hidden=true;
el.innerHTML=`<div class="fc-head"><span>🌿 Crafting</span><button type="button" class="fc-close">×</button></div><div class="fc-body"><aside><label for="fc-search">Find a recipe</label><input id="fc-search" placeholder="Search..." autocomplete="off"><div class="fc-recipes"></div></aside><section><h3 class="fc-name">Select an item</h3><div class="fc-work"><div class="fc-grid"></div><div class="fc-arrow">➜</div><div class="fc-output"></div></div><p class="fc-needs"></p><button class="fc-craft" type="button">Craft item</button><p class="fc-message" role="status"></p></section></div>`;
document.body.append(el);
let selected='crafting_table';const names=window.FERNFALL_ITEM_LABELS||{}, images=window.FERNFALL_ITEM_IMAGES||{};
const icon=id=>images[id]?`<img src="${images[id]}" alt="">`:id.replaceAll('_',' ');
const count=id=>window.FernfallInventory?.count(id)||0;
function render(){
	const search=el.querySelector('#fc-search').value.toLowerCase();
	const filtered=Object.keys(recipes).filter(id=>(names[id]||id.replaceAll('_',' ')).toLowerCase().includes(search));
	const craftable=filtered.filter(id=>Object.entries(recipes[id]).every(([item,amount])=>count(item)>=amount));
	const unavailable=filtered.filter(id=>!craftable.includes(id));
	const button=id=>`<button data-recipe="${id}" class="${selected===id?'active':''} ${craftable.includes(id)?'':'fc-unavailable'}">${icon(id)} <span>${names[id]||id.replaceAll('_',' ')}</span></button>`;
	const divider=craftable.length&&unavailable.length?'<div class="fc-recipe-break" role="separator"><span>More recipes</span></div>':'';
	el.querySelector('.fc-recipes').innerHTML=craftable.map(button).join('')+divider+unavailable.map(button).join('');
	const parts=Object.entries(recipes[selected]||{});
	el.querySelector('.fc-name').textContent=names[selected]||selected.replaceAll('_',' ');
	el.querySelector('.fc-grid').innerHTML=Array.from({length:9},(_,i)=>`<div class="fc-cell">${parts[i]?icon(parts[i][0]):''}</div>`).join('');
	el.querySelector('.fc-output').innerHTML=icon(selected);
	el.querySelector('.fc-needs').innerHTML=parts.map(([id,n])=>`<span class="${count(id)>=n?'ready':'missing'}">${names[id]||id}: ${count(id)}/${n}</span>`).join('');
	el.querySelector('.fc-craft').disabled=!window.FernfallInventory||!parts.every(([id,n])=>count(id)>=n);
}
function toggle(force){el.hidden=force===undefined?!el.hidden:!force; if(!el.hidden)render();}
el.addEventListener('click',e=>{const b=e.target.closest('[data-recipe]');if(b){selected=b.dataset.recipe;render()}if(e.target.closest('.fc-close'))toggle(false);if(e.target.closest('.fc-craft')){const parts=Object.entries(recipes[selected]);if(!parts.every(([id,n])=>count(id)>=n))return render();for(const [id,n] of parts)FernfallInventory.remove(id,n);const left=FernfallInventory.add(selected,1);if(left){for(const [id,n] of parts)FernfallInventory.add(id,n);el.querySelector('.fc-message').textContent='Inventory full';}else{el.querySelector('.fc-message').textContent='Crafted '+(names[selected]||selected);window.dispatchEvent(new CustomEvent('fernfall:item-crafted',{detail:{id:selected}}));}render();}});
el.querySelector('#fc-search').addEventListener('input',render);
document.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,[contenteditable]'))return;if(e.key.toLowerCase()==='c'){e.preventDefault();toggle()}if(e.key==='Escape'&&!el.hidden)toggle(false)});
window.addEventListener('fernfall:inventory-change',()=>{if(!el.hidden)render()});
window.FernfallCrafting={open:()=>toggle(true),close:()=>toggle(false),toggle:()=>toggle(),recipes};
})();
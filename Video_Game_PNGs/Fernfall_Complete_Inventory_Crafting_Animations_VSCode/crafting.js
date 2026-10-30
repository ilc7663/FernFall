(()=>{'use strict';
const recipes={"campfire": {"wood": 3, "stone": 4}, "crafting_table": {"wood": 4}, "furnace": {"stone": 8}, "bucket_empty": {"iron": 3}, "cooking_pot_empty": {"iron": 5}, "frying_pan_empty": {"iron": 3, "wood": 1}, "bowl_empty": {"wood": 2}, "wood_pickaxe": {"wood": 3, "stick": 2}, "wood_axe": {"wood": 3, "stick": 2}, "wood_shovel": {"wood": 1, "stick": 2}, "wood_hoe": {"wood": 2, "stick": 2}, "wood_sword": {"wood": 2, "stick": 1}, "stone_pickaxe": {"stone": 3, "stick": 2}, "stone_axe": {"stone": 3, "stick": 2}, "stone_shovel": {"stone": 1, "stick": 2}, "stone_hoe": {"stone": 2, "stick": 2}, "stone_sword": {"stone": 2, "stick": 1}, "iron_pickaxe": {"iron": 3, "stick": 2}, "iron_axe": {"iron": 3, "stick": 2}, "iron_shovel": {"iron": 1, "stick": 2}, "iron_hoe": {"iron": 2, "stick": 2}, "iron_sword": {"iron": 2, "stick": 1}, "gold_pickaxe": {"gold": 3, "stick": 2}, "gold_axe": {"gold": 3, "stick": 2}, "gold_shovel": {"gold": 1, "stick": 2}, "gold_hoe": {"gold": 2, "stick": 2}, "gold_sword": {"gold": 2, "stick": 1}, "crystal_pickaxe": {"crystal": 3, "stick": 2}, "crystal_axe": {"crystal": 3, "stick": 2}, "crystal_shovel": {"crystal": 1, "stick": 2}, "crystal_hoe": {"crystal": 2, "stick": 2}, "crystal_sword": {"crystal": 2, "stick": 1}, "torch": {"wood": 1, "coal": 1}, "rope": {"spider_silk": 3}, "arrow": {"stick": 1, "stone": 1}, "beef_cooked": {"beef_raw": 1}, "pork_cooked": {"pork_raw": 1}, "mutton_cooked": {"mutton_raw": 1}, "rabbit_cooked": {"rabbit_raw": 1}, "lamb_stew": {"mutton_raw": 1, "carrot": 1, "potato": 1}, "steak_veggies": {"beef_raw": 1, "carrot": 1, "potato": 1}, "rabbit_stew": {"rabbit_raw": 1, "carrot": 1, "potato": 1}, "meat_stew": {"beef_raw": 1, "carrot": 1, "potato": 1}};
for(const id of ['beef_cooked','pork_cooked','mutton_cooked','rabbit_cooked','lamb_stew','steak_veggies','rabbit_stew','meat_stew'])delete recipes[id];
recipes.stick={wood:2};
recipes.torch={coal:1,stick:1};
const outputAmounts={stick:3,torch:2};
const outputAmount=id=>outputAmounts[id]||1;
const shapedRecipes={
	crafting_table:['wood','wood','','wood','wood','','','',''],
	furnace:['stone','stone','stone','stone','','stone','stone','stone','stone'],
	campfire:['stone','wood','stone','wood','wood','wood','','stone',''],
	bucket_empty:['iron','','iron','','iron','','','',''],
	cooking_pot_empty:['iron','iron','iron','iron','','iron','','iron',''],
	frying_pan_empty:['iron','iron','iron','','wood','','','',''],
	bowl_empty:['wood','','wood','','wood','','','','']
};
// Returns size*size cells, or null when the recipe cannot fit a size*size grid.
function recipePattern(id,ingredients,size=3){
	let grid=shapedRecipes[id];
	const tool=id.match(/_(pickaxe|axe|shovel|hoe|sword)$/);
	if(!grid&&tool){const material=Object.keys(ingredients).find(item=>item!=='stick')||'wood';const patterns={pickaxe:[material,material,material,'','stick','','','stick',''],axe:[material,material,'',material,'stick','','','stick',''],shovel:[material,'','','','stick','','','stick',''],hoe:[material,material,'','','stick','','','stick',''],sword:[material,'', '',material,'','','stick','','']};grid=patterns[tool[1]]}
	if(!grid){
		const cells=[];for(const [item,amount] of Object.entries(ingredients))for(let i=0;i<amount;i++)cells.push(item);
		if(cells.length>size*size)return size===3?cells.slice(0,9):null;
		return Array.from({length:size*size},(_,index)=>cells[index]||'');
	}
	if(size===3)return grid;
	const used=grid.map((item,index)=>item?index:-1).filter(index=>index>=0);
	const rows=used.map(index=>Math.floor(index/3)),cols=used.map(index=>index%3);
	const top=Math.min(...rows),left=Math.min(...cols);
	if(Math.max(...rows)-top>=size||Math.max(...cols)-left>=size)return null;
	const cropped=Array(size*size).fill('');
	for(const index of used)cropped[(Math.floor(index/3)-top)*size+index%3-left]=grid[index];
	return cropped;
}
let useTable=false;
const gridSize=()=>useTable?3:2;
const available=id=>Boolean(recipePattern(id,recipes[id],gridSize()));
const el=document.createElement('div');el.id='fernfall-crafting';el.hidden=true;
el.innerHTML=`<div class="fc-head"><span class="fc-title">🌿 Crafting</span><button type="button" class="fc-close">×</button></div><div class="fc-body"><aside><label for="fc-search">Find a recipe</label><input id="fc-search" placeholder="Search..." autocomplete="off"><div class="fc-recipes"></div></aside><section><h3 class="fc-name">Select an item</h3><div class="fc-work"><div class="fc-grid"></div><div class="fc-arrow">➜</div><div class="fc-output"></div></div><p class="fc-needs"></p><p class="fc-hint"></p><button class="fc-craft" type="button">Craft item</button><p class="fc-message" role="status"></p></section></div>`;
const gameWindow=document.querySelector('.scene-wrap');
if(gameWindow)gameWindow.append(el);else document.body.append(el);
let selected='crafting_table';const names=window.FERNFALL_ITEM_LABELS||{}, images=window.FERNFALL_ITEM_IMAGES||{};
const icon=id=>images[id]?`<img src="${images[id]}" alt="">`:id.replaceAll('_',' ');
const count=id=>window.FernfallInventory?.count(id)||0;
function render(){
	const search=el.querySelector('#fc-search').value.toLowerCase();
	const size=gridSize();
	el.querySelector('.fc-title').textContent=useTable?'🌿 Crafting table (3×3)':'🌿 Crafting (2×2)';
	el.querySelector('.fc-hint').textContent=useTable?'':'Bigger recipes need a crafting table.';
	if(!available(selected))selected=Object.keys(recipes).find(available)||selected;
	const filtered=Object.keys(recipes).filter(id=>available(id)&&(names[id]||id.replaceAll('_',' ')).toLowerCase().includes(search));
	const craftable=filtered.filter(id=>Object.entries(recipes[id]).every(([item,amount])=>count(item)>=amount));
	const unavailable=filtered.filter(id=>!craftable.includes(id));
	const button=id=>`<button data-recipe="${id}" class="${selected===id?'active':''} ${craftable.includes(id)?'':'fc-unavailable'}">${icon(id)} <span>${names[id]||id.replaceAll('_',' ')}</span></button>`;
	const divider=craftable.length&&unavailable.length?'<div class="fc-recipe-break" role="separator"><span>More recipes</span></div>':'';
	el.querySelector('.fc-recipes').innerHTML=craftable.map(button).join('')+divider+unavailable.map(button).join('');
	const parts=Object.entries(recipes[selected]||{});
	const amount=outputAmount(selected);
	el.querySelector('.fc-name').textContent=names[selected]||selected.replaceAll('_',' ');
	const gridEl=el.querySelector('.fc-grid');
	gridEl.style.gridTemplateColumns=`repeat(${size},58px)`;
	gridEl.innerHTML=(recipePattern(selected,recipes[selected],size)||[]).map(item=>`<div class="fc-cell">${item?icon(item):''}</div>`).join('');
	el.querySelector('.fc-output').innerHTML=icon(selected)+(amount>1?`<b class="fc-output-count">×${amount}</b>`:'');
	el.querySelector('.fc-needs').innerHTML=parts.map(([id,n])=>`<span class="${count(id)>=n?'ready':'missing'}">${names[id]||id}: ${count(id)}/${n}</span>`).join('');
	el.querySelector('.fc-craft').disabled=!window.FernfallInventory||!parts.every(([id,n])=>count(id)>=n);
}
function toggle(force){const wasOpen=!el.hidden;el.hidden=force===undefined?!el.hidden:!force;if(!el.hidden)render();if(wasOpen!==!el.hidden)window.dispatchEvent(new CustomEvent('fernfall:crafting-open',{detail:{open:!el.hidden}}));}
function craftSelected(){
	const parts=Object.entries(recipes[selected]||{}),amount=outputAmount(selected);
	if(!available(selected)||!parts.every(([id,n])=>count(id)>=n))return render();
	for(const [id,n] of parts)FernfallInventory.remove(id,n);
	const left=FernfallInventory.add(selected,amount);
	if(left){
		const inserted=amount-left;
		if(inserted)FernfallInventory.remove(selected,inserted);
		for(const [id,n] of parts)FernfallInventory.add(id,n);
		el.querySelector('.fc-message').textContent='Inventory full';
	}else{
		const label=names[selected]||selected.replaceAll('_',' ');
		el.querySelector('.fc-message').textContent=`Crafted ${label}${amount>1?` ×${amount}`:''}`;
		window.dispatchEvent(new CustomEvent('fernfall:item-crafted',{detail:{id:selected,amount}}));
	}
	render();
}
el.addEventListener('click',e=>{const b=e.target.closest('[data-recipe]');if(b){selected=b.dataset.recipe;render()}if(e.target.closest('.fc-close'))toggle(false);if(e.target.closest('.fc-craft'))craftSelected()});
el.querySelector('#fc-search').addEventListener('input',render);
document.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,[contenteditable]'))return;if(e.key.toLowerCase()==='c'){e.preventDefault();if(el.hidden)useTable=false;toggle()}if(e.key==='Escape'&&!el.hidden)toggle(false)});
window.addEventListener('fernfall:inventory-change',()=>{if(!el.hidden)render()});
window.addEventListener('fernfall:inventory-open',event=>{if(event.detail?.open&&!el.hidden)toggle(false)});
window.FernfallCrafting={open:(options)=>{useTable=Boolean(options?.table);toggle(true)},close:()=>toggle(false),toggle:()=>{if(el.hidden)useTable=false;toggle()},recipes};
})();
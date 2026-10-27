/* Fernfall inventory: standalone browser module. No framework needed. */
(() => {
  'use strict';
  const SIZE = 36, BAR = 9, STACK = 64, KEY = 'fernfall_inventory_v1';
  const catalog = {
    wood: ['Wood','🪵','materials'], stone:['Stone','🪨','materials'],
    carrot:['Carrot','🥕','food'], potato:['Potato','🥔','food'], herb:['Herb','🌿','materials'],
    berries:['Wild Berries','🫐','food'], grain:['Grain','🌾','materials'], mushroom:['Mushroom','🍄','food'],
    beef_raw:['Raw Beef','🥩','food'], pork_raw:['Raw Pork','🥩','food'], mutton_raw:['Raw Mutton','🥩','food'], rabbit_raw:['Raw Rabbit','🍖','food'],
    beef_cooked:['Cooked Beef','🍖','food'], pork_cooked:['Cooked Pork','🍖','food'], mutton_cooked:['Cooked Mutton','🍖','food'],rabbit_cooked:['Cooked Rabbit','🍖','food'],
    milk_bucket:['Milk Bucket','🥛','tools'],water_bucket:['Water Bucket','🪣','tools'], bucket_empty:['Empty Bucket','🪣','tools'],
    campfire:['Campfire','🔥','placeables'], crafting_table:['Crafting Table','🛠️','placeables'], furnace:['Furnace','♨️','placeables'],
    cooking_pot:['Cooking Pot','🍲','tools'], frying_pan:['Frying Pan','🍳','tools'],
    bone:['Bone','🦴','materials'], wool:['Wool','☁️','materials'], slime_gel:['Slime Gel','🟢','materials'],
    potion:['Tonic','🧪','food'], coin:['Coin','🪙','materials'],
    steak_veggies:['Steak & Vegetables','🍛','food'], lamb_stew:['Lamb Stew','🥘','food'], rabbit_stew:['Rabbit Stew','🍲','food']
  };
  for (const [id,path] of Object.entries(window.FERNFALL_ITEM_IMAGES || {})) { if (!catalog[id]) catalog[id]=[(window.FERNFALL_ITEM_LABELS||{})[id]||id.replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase()), '📦', (window.FERNFALL_ITEM_CATEGORIES||{})[id]||'materials']; }
  const maxFor = id => ['bucket_empty','milk_bucket','water_bucket','crafting_table','furnace','campfire','cooking_pot','frying_pan'].includes(id) ? 1 : STACK;
  const saved = (()=>{try{return JSON.parse(localStorage.getItem(KEY))}catch{return null}})();
  let slots = Array.from({length:SIZE},(_,i)=> {const v=saved?.slots?.[i];return v && catalog[v.id] && Number.isInteger(v.count) && v.count>0 ? {id:v.id,count:Math.min(v.count,maxFor(v.id))}:null});
  let selected = Number.isInteger(saved?.selected) ? Math.max(0,Math.min(8,saved.selected)) : 0;
  let cursor=null, open=false, category='all';
  const root=document.createElement('div');root.id='fernfall-inventory-root';
  root.innerHTML=`<div class="fi-hotbar" aria-label="Item hotbar"></div><div class="fi-window" hidden role="dialog" aria-label="Inventory"><header><strong>✦ Ranger's Pack</strong><button class="fi-close" aria-label="Close inventory">×</button></header><div class="fi-tabs"><button data-cat="all">All</button><button data-cat="food">Food</button><button data-cat="materials">Materials</button><button data-cat="tools">Tools</button><button data-cat="placeables">Placeables</button></div><div class="fi-title">BACKPACK · 27 SLOTS</div><div class="fi-backpack"></div><div class="fi-title">HOTBAR · 9 SLOTS</div><div class="fi-gridbar"></div><div class="fi-hint">Click: pick up / place · Shift+click: move stack · Right-click: split / place one · 1–9: select hotbar · I: inventory</div></div><div class="fi-cursor" hidden></div><div class="fi-tooltip" hidden></div>`;
  document.body.append(root);
  const hotbar=root.querySelector('.fi-hotbar'), backpack=root.querySelector('.fi-backpack'), gridbar=root.querySelector('.fi-gridbar');
  const panel=root.querySelector('.fi-window'), cur=root.querySelector('.fi-cursor'),tip=root.querySelector('.fi-tooltip');
  const esc = s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function icon(id){const path=window.FERNFALL_ITEM_IMAGES?.[id]; return path?`<img draggable="false" src="${esc(path)}" alt="">`:`<span>${catalog[id]?.[1]||'❔'}</span>`}
  function tile(i,bar=false){const s=slots[i],hidden=s && category!=='all'&&catalog[s.id]?.[2]!==category && open&&!bar;
    return `<button class="fi-slot ${selected===i&&bar?'fi-selected':''} ${hidden?'fi-dim':''}" data-index="${i}" aria-label="Slot ${i+1}${s?' '+catalog[s.id][0]+' '+s.count:''}">${bar?`<small>${i+1}</small>`:''}${s?icon(s.id)+`<b>${s.count>1?s.count:''}</b>`:''}</button>`}
  function save(){try{localStorage.setItem(KEY,JSON.stringify({slots,selected}))}catch{} window.dispatchEvent(new CustomEvent('fernfall:inventory-change',{detail:{slots:getSlots(),selected}}))}
  function getSlots(){return slots.map(s=>s?{...s}:null)}
  function render(){hotbar.innerHTML=Array.from({length:9},(_,i)=>tile(i,true)).join(''); gridbar.innerHTML=Array.from({length:9},(_,i)=>tile(i,true)).join('');backpack.innerHTML=Array.from({length:27},(_,i)=>tile(i+9)).join('');
    root.querySelectorAll('.fi-tabs button').forEach(x=>x.classList.toggle('fi-active',x.dataset.cat===category));
    cur.innerHTML=cursor?icon(cursor.id)+`<b>${cursor.count>1?cursor.count:''}</b>`:'';cur.hidden=!cursor;}
  function add(id,count=1){if(!catalog[id]||!Number.isInteger(count)||count<=0)return count;let left=count;
    for(let i=0;i<SIZE;i++){const s=slots[i];if(s?.id===id&&s.count<maxFor(id)){const n=Math.min(left,maxFor(id)-s.count);s.count+=n;left-=n;if(!left)break}}
    for(let i=0;i<SIZE&&left;i++)if(!slots[i]){const n=Math.min(left,maxFor(id));slots[i]={id,count:n};left-=n}
    save();render();return left}
  function remove(id,count=1){if(!catalog[id]||!Number.isInteger(count)||count<1)return false; if(countItem(id)<count)return false;let left=count;
    for(let i=SIZE-1;i>=0&&left;i--){const s=slots[i];if(s?.id===id){const n=Math.min(left,s.count);s.count-=n;left-=n;if(!s.count)slots[i]=null}}
    save();render();return true}
  function countItem(id){return slots.reduce((sum,s)=>sum+(s?.id===id?s.count:0),0)}
  function clickSlot(i,right,shift){const s=slots[i];if(shift&&!cursor&&s){const range=i<9?[...Array(27)].map((_,n)=>n+9):[...Array(9).keys()];const dest=range.find(j=>slots[j]?.id===s.id&&slots[j].count<maxFor(s.id))??range.find(j=>!slots[j]);if(dest!==undefined){const other=slots[dest];if(other){const n=Math.min(s.count,maxFor(s.id)-other.count);other.count+=n;s.count-=n;if(!s.count)slots[i]=null}else{slots[dest]=s;slots[i]=null}}}
    else if(right){if(!cursor&&s){const n=Math.ceil(s.count/2);cursor={id:s.id,count:n};s.count-=n;if(!s.count)slots[i]=null}
      else if(cursor&&(!s||s.id===cursor.id)){if(!s)slots[i]={id:cursor.id,count:1};else if(s.count<maxFor(s.id))s.count++;else return;cursor.count--;if(!cursor.count)cursor=null}}
    else if(!cursor){cursor=s;slots[i]=null}
    else if(!s){slots[i]=cursor;cursor=null}
    else if(s.id===cursor.id){const n=Math.min(cursor.count,maxFor(s.id)-s.count);s.count+=n;cursor.count-=n;if(!cursor.count)cursor=null}
    else {slots[i]=cursor;cursor=s}
    save();render();}
  function setOpen(val){if(!val&&cursor){const left=add(cursor.id,cursor.count);cursor=left?{...cursor,count:left}:null;if(cursor)return;}open=val;panel.hidden=!open;root.classList.toggle('fi-open',open);render();}
  function select(i){selected=(i+9)%9;save();render()}
  root.addEventListener('click',e=>{if(e.target.closest('.fi-close'))return setOpen(false);const cat=e.target.closest('[data-cat]');if(cat){category=cat.dataset.cat;render();return}const el=e.target.closest('.fi-slot');if(!el)return;const i=Number(el.dataset.index);if(!open){select(i);return}clickSlot(i,false,e.shiftKey)});
  root.addEventListener('contextmenu',e=>{const el=e.target.closest('.fi-slot');if(el){e.preventDefault();if(open)clickSlot(Number(el.dataset.index),true,false)}});
  root.addEventListener('mousemove',e=>{cur.style.left=e.clientX+14+'px';cur.style.top=e.clientY+14+'px';const b=e.target.closest('.fi-slot');const item=b&&slots[Number(b.dataset.index)];tip.hidden=!item;if(item){tip.textContent=catalog[item.id][0]+` ×${item.count}`;tip.style.left=e.clientX+16+'px';tip.style.top=e.clientY-35+'px'}});
  root.addEventListener('mouseleave',()=>tip.hidden=true);
  document.addEventListener('keydown',e=>{if(e.repeat||e.target.closest('input, textarea, select,[contenteditable]'))return;
    if((e.key==='i'||e.key==='I'||(e.key==='e'||e.key==='E'&&window.FERNFALL_INVENTORY_E_KEY))){e.preventDefault();setOpen(!open)}
    if(e.key==='Escape'&&open){e.preventDefault();setOpen(false)}
    if(/^Digit[1-9]$/.test(e.code)){select(Number(e.code.slice(-1))-1)}});
  window.FernfallInventory={add,remove,count:countItem, getSlots, select, toggle:()=>setOpen(!open),open:()=>setOpen(true),close:()=>setOpen(false),getSelected:()=>slots[selected]?{...slots[selected]}:null,
    register:(id,name,emoji='📦',type='materials')=>{catalog[id]=[name,emoji,type]},
    useSelected:()=>{const s=slots[selected];if(!s)return false;window.dispatchEvent(new CustomEvent('fernfall:item-use',{detail:{id:s.id,slot:selected}}));return true}};
  render();
})();

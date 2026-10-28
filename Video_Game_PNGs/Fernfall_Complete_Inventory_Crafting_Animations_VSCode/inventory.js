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
  const maxFor = id => ['bucket_empty','milk_bucket','water_bucket','crafting_table','furnace','campfire','cooking_pot','cooking_pot_empty','frying_pan','frying_pan_empty','bowl_empty'].includes(id) ? 1 : STACK;
  const saved = (()=>{try{return JSON.parse(localStorage.getItem(KEY))}catch{return null}})();
  let slots = Array.from({length:SIZE},(_,i)=> {const v=saved?.slots?.[i];return v && catalog[v.id] && Number.isInteger(v.count) && v.count>0 ? {id:v.id,count:Math.min(v.count,maxFor(v.id))}:null});
  let selected = Number.isInteger(saved?.selected) ? Math.max(0,Math.min(8,saved.selected)) : 0;
  let cursor=null, open=false, category='all';
  let portraitPainter=null;
  const root=document.createElement('div');root.id='fernfall-inventory-root';
  root.innerHTML=`<div class="fi-hotbar" aria-label="Item hotbar"></div><div class="fi-window" hidden role="dialog" aria-label="Inventory"><header><strong>✦ Ranger's Pack</strong><button class="fi-close" aria-label="Close inventory">×</button></header><div class="fi-content"><aside class="fi-character"><div class="fi-character-title">ADVENTURER</div><div class="fi-avatar-frame"><canvas class="fi-avatar" width="128" height="160" aria-label="Ranger character preview"></canvas></div><strong>Little Ranger</strong></aside><section class="fi-storage"><div class="fi-tabs"><button data-cat="all">All</button><button data-cat="food">Food</button><button data-cat="materials">Materials</button><button data-cat="tools">Tools</button><button data-cat="placeables">Placeables</button></div><div class="fi-title">BACKPACK · 27 SLOTS</div><div class="fi-backpack"></div><div class="fi-title">HOTBAR · 9 SLOTS</div><div class="fi-gridbar"></div><button class="fi-use" type="button">Use selected</button><div class="fi-hint">Click: pick up / place · Shift+click: move stack · Right-click: split / place one · 1–9: select hotbar · I: inventory</div></section></div></div><div class="fi-cursor" hidden></div><div class="fi-tooltip" hidden></div>`;
  const gameWindow=document.querySelector('.scene-wrap');
  if(gameWindow){root.classList.add('fi-game-overlay');gameWindow.append(root)}else document.body.append(root);
  const hotbar=root.querySelector('.fi-hotbar'), backpack=root.querySelector('.fi-backpack'), gridbar=root.querySelector('.fi-gridbar');
  const panel=root.querySelector('.fi-window'), cur=root.querySelector('.fi-cursor'),tip=root.querySelector('.fi-tooltip');
  const portrait=root.querySelector('.fi-avatar');
  const cleanedSlimeGelIcons=new Map();
  const esc = s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function icon(id){const path=window.FERNFALL_ITEM_IMAGES?.[id]; return path?`<img draggable="false"${id==='slime_gel'?' data-clean-slime-gel':''} src="${esc(path)}" alt="">`:`<span>${catalog[id]?.[1]||'❔'}</span>`}
  root.addEventListener('load',event=>{
    const image=event.target;
    if(!image.matches?.('img[data-clean-slime-gel]')||image.dataset.cleaned)return;
    const source=image.currentSrc||image.src;
    image.dataset.cleaned='true';
    const cached=cleanedSlimeGelIcons.get(source);
    if(cached){image.src=cached;return}
    const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
    const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(image,0,0);
    const imageData=context.getImageData(0,0,canvas.width,canvas.height),pixels=imageData.data;
    const pixelCount=canvas.width*canvas.height,visited=new Uint8Array(pixelCount),background=[];
    const isBackdrop=index=>{const offset=index*4,min=Math.min(pixels[offset],pixels[offset+1],pixels[offset+2]),max=Math.max(pixels[offset],pixels[offset+1],pixels[offset+2]);return pixels[offset+3]>0&&min>=210&&max-min<=55};
    for(let start=0;start<pixelCount;start++){
      if(visited[start])continue;
      visited[start]=1;
      if(!isBackdrop(start))continue;
      const component=[start];
      for(let cursor=0;cursor<component.length;cursor++){
        const index=component[cursor],x=index%canvas.width,y=Math.floor(index/canvas.width);
        for(const neighbor of [x?index-1:-1,x<canvas.width-1?index+1:-1,y?index-canvas.width:-1,y<canvas.height-1?index+canvas.width:-1]){
          if(neighbor<0||visited[neighbor])continue;
          visited[neighbor]=1;
          if(isBackdrop(neighbor))component.push(neighbor);
        }
      }
      if(component.length>=64)background.push(...component);
    }
    for(const index of background)pixels[index*4+3]=0;
    if(background.length)context.putImageData(imageData,0,0);
    const cleaned=background.length?canvas.toDataURL('image/png'):source;
    cleanedSlimeGelIcons.set(source,cleaned);
    if(cleaned!==source)image.src=cleaned;
  },true);
  function tile(i,bar=false){const s=slots[i],hidden=s && category!=='all'&&catalog[s.id]?.[2]!==category && open&&!bar;
    return `<button class="fi-slot ${selected===i&&bar?'fi-selected':''} ${hidden?'fi-dim':''}" data-index="${i}" aria-label="Slot ${i+1}${s?' '+catalog[s.id][0]+' '+s.count:''}">${bar?`<small>${i+1}</small>`:''}${s?icon(s.id)+`<b>${s.count>1?s.count:''}</b>`:''}</button>`}
  function save(){try{localStorage.setItem(KEY,JSON.stringify({slots,selected}))}catch{} window.dispatchEvent(new CustomEvent('fernfall:inventory-change',{detail:{slots:getSlots(),selected}}))}
  function getSlots(){return slots.map(s=>s?{...s}:null)}
  function hasCursor(){return Boolean(cursor)}
  function render(){hotbar.innerHTML=Array.from({length:9},(_,i)=>tile(i,true)).join(''); gridbar.innerHTML=Array.from({length:9},(_,i)=>tile(i,true)).join('');backpack.innerHTML=Array.from({length:27},(_,i)=>tile(i+9)).join('');
    root.querySelectorAll('.fi-tabs button').forEach(x=>x.classList.toggle('fi-active',x.dataset.cat===category));
    root.querySelector('.fi-use').disabled=!slots[selected];
    cur.innerHTML=cursor?icon(cursor.id)+`<b>${cursor.count>1?cursor.count:''}</b>`:'';cur.hidden=!cursor;
    if(portraitPainter){const context=portrait.getContext('2d');context.clearRect(0,0,portrait.width,portrait.height);portraitPainter(context,portrait.width,portrait.height)}}
  function add(id,count=1){if(!catalog[id]||!Number.isInteger(count)||count<=0)return count;let left=count;
    for(let i=0;i<SIZE;i++){const s=slots[i];if(s?.id===id&&s.count<maxFor(id)){const n=Math.min(left,maxFor(id)-s.count);s.count+=n;left-=n;if(!left)break}}
    for(let i=0;i<SIZE&&left;i++)if(!slots[i]){const n=Math.min(left,maxFor(id));slots[i]={id,count:n};left-=n}
    save();render();return left}
  function remove(id,count=1){if(!catalog[id]||!Number.isInteger(count)||count<1)return false; if(countItem(id)<count)return false;let left=count;
    for(let i=SIZE-1;i>=0&&left;i--){const s=slots[i];if(s?.id===id){const n=Math.min(left,s.count);s.count-=n;left-=n;if(!s.count)slots[i]=null}}
    save();render();return true}
  function countItem(id){return slots.reduce((sum,s)=>sum+(s?.id===id?s.count:0),0)}
  function replace(items){slots=Array.from({length:SIZE},()=>null);for(const [id,value] of Object.entries(items||{})){if(!catalog[id]||!Number.isInteger(value)||value<=0)continue;let left=value;for(let i=0;i<SIZE&&left;i++){const slot=slots[i];if(slot?.id===id&&slot.count<maxFor(id)){const amount=Math.min(left,maxFor(id)-slot.count);slot.count+=amount;left-=amount}}for(let i=0;i<SIZE&&left;i++)if(!slots[i]){const amount=Math.min(left,maxFor(id));slots[i]={id,count:amount};left-=amount}}save();render()}
  function setCount(id,value){if(!catalog[id]||!Number.isInteger(value)||value<0)return false;const current=countItem(id);if(value===current)return true;if(value<current)return remove(id,current-value);return add(id,value-current)===0}
  function clickSlot(i,right,shift){const s=slots[i];if(shift&&!cursor&&s){const range=i<9?[...Array(27)].map((_,n)=>n+9):[...Array(9).keys()];const dest=range.find(j=>slots[j]?.id===s.id&&slots[j].count<maxFor(s.id))??range.find(j=>!slots[j]);if(dest!==undefined){const other=slots[dest];if(other){const n=Math.min(s.count,maxFor(s.id)-other.count);other.count+=n;s.count-=n;if(!s.count)slots[i]=null}else{slots[dest]=s;slots[i]=null}}}
    else if(right){if(!cursor&&s){const n=Math.ceil(s.count/2);cursor={id:s.id,count:n};s.count-=n;if(!s.count)slots[i]=null}
      else if(cursor&&(!s||s.id===cursor.id)){if(!s)slots[i]={id:cursor.id,count:1};else if(s.count<maxFor(s.id))s.count++;else return;cursor.count--;if(!cursor.count)cursor=null}}
    else if(!cursor){cursor=s;slots[i]=null}
    else if(!s){slots[i]=cursor;cursor=null}
    else if(s.id===cursor.id){const n=Math.min(cursor.count,maxFor(s.id)-s.count);s.count+=n;cursor.count-=n;if(!cursor.count)cursor=null}
    else {slots[i]=cursor;cursor=s}
    save();render();}
  function setOpen(val){if(!val&&cursor){const left=add(cursor.id,cursor.count);cursor=left?{...cursor,count:left}:null;if(cursor)return;save()}open=val;if(gameWindow&&root.parentElement!==gameWindow){gameWindow.append(root);root.classList.add('fi-game-overlay')}panel.hidden=!open;root.classList.toggle('fi-open',open);render();window.dispatchEvent(new CustomEvent('fernfall:inventory-open',{detail:{open}}));}
  window.addEventListener('fernfall:crafting-open',event=>{if(event.detail?.open&&open)setOpen(false)});
  function select(i){selected=(i+9)%9;save();render()}
  root.addEventListener('click',e=>{if(e.target.closest('.fi-close'))return setOpen(false);if(e.target.closest('.fi-use'))return window.FernfallInventory.useSelected();const cat=e.target.closest('[data-cat]');if(cat){category=cat.dataset.cat;render();return}const el=e.target.closest('.fi-slot');if(!el)return;const i=Number(el.dataset.index);if(!open){select(i);return}clickSlot(i,false,e.shiftKey)});
  root.addEventListener('contextmenu',e=>{const el=e.target.closest('.fi-slot');if(el){e.preventDefault();if(open)clickSlot(Number(el.dataset.index),true,false)}});
  root.addEventListener('mousemove',e=>{cur.style.left=e.clientX+14+'px';cur.style.top=e.clientY+14+'px';const b=e.target.closest('.fi-slot');const item=b&&slots[Number(b.dataset.index)];tip.hidden=!item;if(item){tip.textContent=catalog[item.id][0]+` ×${item.count}`;tip.style.left=e.clientX+16+'px';tip.style.top=e.clientY-35+'px'}});
  root.addEventListener('mouseleave',()=>tip.hidden=true);
  document.addEventListener('keydown',e=>{if(e.repeat||e.target.closest('input, textarea, select,[contenteditable]'))return;
    if(e.key.toLowerCase()==='i'){e.preventDefault();setOpen(!open)}
    if(e.key==='Escape'&&open){e.preventDefault();setOpen(false)}
    if(/^Digit[1-9]$/.test(e.code)){select(Number(e.code.slice(-1))-1)}});
  window.FernfallInventory={add,remove,count:countItem,setCount,replace,getSlots,hasCursor,setPortrait(painter){portraitPainter=painter;render()},select,toggle:()=>setOpen(!open),open:()=>setOpen(true),close:()=>setOpen(false),getSelected:()=>slots[selected]?{...slots[selected]}:null,
    register:(id,name,emoji='📦',type='materials')=>{catalog[id]=[name,emoji,type]},
    useSelected:()=>{const s=slots[selected];if(!s)return false;window.dispatchEvent(new CustomEvent('fernfall:item-use',{detail:{id:s.id,slot:selected}}));return true}};
  render();
})();

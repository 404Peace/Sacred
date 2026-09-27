/* Auto-split from the single-file guide. Safe to edit. */

const state={q:"",cats:new Set(),statuses:new Set(),lvlMin:0,lvlMax:100,preset:""};

const SORT={key:null,dir:1};

const PLANNER_KEY = "st:planner4";

let PLANNER = [];

const DROPS = {};

const NAME_TO_ITEM = {};

const USED_IN = {};

function parseDrops(){
  for (const line of DROP_CSV.trim().split("\n")){
    const f = line.split(",");
    if (f.length < 11) continue;
    const itemId = f[2]; if (!itemId) continue;
    (DROPS[itemId]=DROPS[itemId]||[]).push({
      mode:f[0], unit:f[1], maxr:+f[3], rmin:+f[4], rmax:+f[5],
      inner:+f[6], outer:+f[7], eff:+f[8], cond:f[9], line:f[10]
    });
  }
}

function buildIndexes(){
  for (const entry of EQUIPMENT){
    const [name,id,cat,lvl,status,sources] = entry;
    NAME_TO_ITEM[name.toLowerCase()] = {name,id,cat,lvl,status,sources};
    const recipe = parseRecipe(sources);
    if (recipe){
      for (const mat of recipe){
        const key = mat.name.toLowerCase();
        (USED_IN[key] = USED_IN[key] || []).push({id, name});
      }
    }
  }
}

function parseRecipe(html){
  if (!html) return null;
  const idx = html.indexOf("Craft:");
  if (idx === -1) return null;
  let text = html.slice(idx).replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/\[WARNING[\s\S]*$/,"");
  text = text.replace("Craft:","").trim();
  const out = [];
  for (const p of text.split("+").map(s=>s.trim()).filter(Boolean)){
    const m = p.match(/^(\d+)\s*×\s*(.+)$/);
    if (m) out.push({qty:+m[1], name:m[2].trim()});
  }
  return out.length ? out : null;
}

function extractBosses(html){
  if (!html) return [];
  const names = [];
  for (const p of html.split(/<hr\s*\/?>/i)){
    const m = p.match(/^\s*([A-Za-z][A-Za-z0-9' \-\.]*?)\s*(?:<span|\[|<br|<small|$)/);
    if (m){
      const n = m[1].trim();
      if (n && n.length > 2 && !/^(Craft|Shop|Loot|Special|World Tree)/i.test(n)){
        if (!names.includes(n)) names.push(n);
      }
    }
  }
  return names;
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

function wc3ToHtml(str){
  if (!str) return "";
  let out = String(str);
  out = out.replace(/\|c([0-9a-fA-F]{8})/g, (_,c)=>`</span><span style="color:#${c.slice(2)}">`);
  out = out.replace(/\|r/g, "</span>");
  out = out.replace(/\|n/g, "<br>");
  return `<span>${out}</span>`;
}


function itemNameColor(id, lvl, cat, status){
  const override = ITEM_NAME_COLORS[id];
  if (override) return "#" + override.slice(-6);
  if (cat === "Divine Card") return "#c9baff";
  if (cat === "Runes") return "#5df3c6";
  if (status === "Unresolved") return "#93a4b8";
  if (status === "Special") return "#ffc861";
  if (lvl >= 95) return "#ff7aa8";
  if (lvl >= 75) return "#ffc861";
  if (lvl >= 55) return "#b79bff";
  if (lvl >= 35) return "#6fc6ff";
  if (lvl >= 15) return "#7ee0a0";
  return "#c9d1d9";
}


const tipEl = document.getElementById("wc3-tip");

function renderStatBlock(stats){
  let html = `<div class="wc3-tip-stats">`;
  if (stats && stats.length){
    html += stats.map(s=>`<div class="wc3-stat-line">${escapeHtml(s)}</div>`).join("");
  } else {
    html += `<div class="wc3-stat-line wc3-stat-missing">No stat bonuses recorded for this item.</div>`;
  }
  html += `</div>`;
  return html;
}

function renderDropBlock(id){
  const rows = DROPS[id];
  if (!rows || !rows.length){
    return `<div class="wc3-drop-section"><div class="wc3-drop-note">No drop data in the extraction for this item.</div></div>`;
  }
  const perUnit = {};
  for (const r of rows){
    if (r.eff <= 0) continue;
    if (!perUnit[r.unit] || perUnit[r.unit].eff < r.eff) perUnit[r.unit] = r;
  }
  const list = Object.values(perUnit).sort((a,b)=>b.eff-a.eff);
  if (!list.length){
    return `<div class="wc3-drop-section"><div class="wc3-drop-note">Only second-tier rolls — no direct per-kill chance.</div></div>`;
  }
  const best = list[0];
  let html = `<div class="wc3-drop-section">`;
  html += `<div class="wc3-drop-best">Best: ${best.eff.toFixed(3)}% / kill</div>`;
  for (const r of list.slice(0, 6)){
    const bname = UNIT_NAMES[r.unit] || ("Unit " + r.unit);
    const cls = r.eff < 1 ? "low" : r.eff < 10 ? "mid" : "";
    html += `<div class="wc3-drop-row"><span class="rn">${escapeHtml(bname)}</span><span class="rv ${cls}">${r.eff.toFixed(3)}%</span></div>`;
  }
  if (list.length > 6) html += `<div class="wc3-drop-note">+${list.length-6} more sources (see table for full breakdown)</div>`;
  html += `</div>`;
  return html;
}

function showItemTip(e, data){
  const {name, id, cat, lvl, status, tooltip} = data;
  const tip = tooltip || {};
  const stats = ITEM_STATS[id] || null;
  const nameColor = itemNameColor(id, lvl, cat, status);

  const headerHtml = `<div class="wc3-tip-header">
      <div class="wc3-tip-title" style="color:${nameColor}">${escapeHtml(name)}</div>
      <div class="wc3-tip-id">${escapeHtml(id)}</div>
    </div>
    <div class="wc3-tip-meta">
      <span class="m">${escapeHtml(cat)}</span>
      <span class="m">Level <b>${lvl}</b></span>
      <span class="m">${escapeHtml(status)}</span>
    </div>`;

  let body = renderStatBlock(stats);
  if (tip.effects) body += `<p>${wc3ToHtml(tip.effects)}</p>`;
  if (tip.flavor)  body += `<p class="flavor">${wc3ToHtml(tip.flavor)}</p>`;
  if (!tip.effects && !tip.flavor) body += `<p class="flavor">No description available in the extracted source data.</p>`;

  tipEl.innerHTML = headerHtml + `<div class="wc3-tip-body">${body}</div>`;
  tipEl.classList.add("show");
  positionTip(e);
}

function showMaterialTip(e, matName){
  const item = NAME_TO_ITEM[matName.toLowerCase()];
  let headerHtml, body = "";

  if (item){
    const nameColor = itemNameColor(item.id, item.lvl, item.cat, item.status);
    headerHtml = `<div class="wc3-tip-header">
        <div class="wc3-tip-title" style="color:${nameColor}">${escapeHtml(item.name)}</div>
        <div class="wc3-tip-id">${escapeHtml(item.id)}</div>
      </div>
      <div class="wc3-tip-meta">
        <span class="m">${escapeHtml(item.cat)}</span>
        <span class="m">Level <b>${item.lvl}</b></span>
        <span class="m">${escapeHtml(item.status)}</span>
      </div>`;
    body += renderDropBlock(item.id);
    const usedIn = USED_IN[item.name.toLowerCase()] || [];
    if (usedIn.length){
      body += `<p style="color:#8ba0b8;font-size:12.5px;margin-top:6px">Used in ${usedIn.length} higher-tier recipe${usedIn.length>1?"s":""}.</p>`;
    }
  } else {
    headerHtml = `<div class="wc3-tip-header">
        <div class="wc3-tip-title">${escapeHtml(matName)}</div>
        <div class="wc3-tip-id">material</div>
      </div>
      <div class="wc3-tip-meta"><span class="m">Crafting material</span></div>`;
    body += `<div class="wc3-drop-section"><div class="wc3-drop-note">This material is not a codex equipment entry — no drop source available in the extraction.</div></div>`;
  }

  tipEl.innerHTML = headerHtml + `<div class="wc3-tip-body">${body}</div>`;
  tipEl.classList.add("show");
  positionTip(e);
}

function positionTip(e){
  const pad = 16;
  const w = tipEl.offsetWidth, h = tipEl.offsetHeight;
  let x = e.clientX + 14;
  let y = e.clientY + 14;
  if (x + w + pad > window.innerWidth) x = e.clientX - w - 14;
  if (y + h + pad > window.innerHeight) y = e.clientY - h - 14;
  tipEl.style.left = Math.max(pad,x) + "px";
  tipEl.style.top = Math.max(pad,y) + "px";
}

function attachItemTip(el, data){
  el.addEventListener("mouseenter", e=>showItemTip(e, data));
  el.addEventListener("mousemove", positionTip);
  el.addEventListener("mouseleave", ()=>tipEl.classList.remove("show"));
}
function attachMaterialTip(el, matName){
  el.addEventListener("mouseenter", e=>showMaterialTip(e, matName));
  el.addEventListener("mousemove", positionTip);
  el.addEventListener("mouseleave", ()=>tipEl.classList.remove("show"));
}
function attachSpellTip(el, text){
  el.addEventListener("mouseenter", e=>{
    tipEl.innerHTML = `<div class="wc3-tip-body">${wc3ToHtml(text)}</div>`;
    tipEl.classList.add("show");
    positionTip(e);
  });
  el.addEventListener("mousemove", positionTip);
  el.addEventListener("mouseleave", ()=>tipEl.classList.remove("show"));
}


function isPlanned(id){ return PLANNER.some(p=>p.id===id); }

function planItem(id){
  if (isPlanned(id)) return false;
  const equip = EQUIPMENT.find(e=>e[1]===id);
  if (!equip) return false;
  const recipe = parseRecipe(equip[5]);
  if (!recipe) return false;
  PLANNER.push({
    id, name: equip[0],
    materials: recipe.map(m=>({qty:m.qty, name:m.name, have:false}))
  });
  savePlanner(); renderPlanner(); syncPlanButtons();
  return true;
}
function unplanItem(id){
  if (!isPlanned(id)) return false;
  PLANNER = PLANNER.filter(p=>p.id!==id);
  savePlanner(); renderPlanner(); syncPlanButtons();
  return true;
}
function syncPlanButtons(){
  document.querySelectorAll("#gear tbody tr[data-id]").forEach(tr=>{
    const id = tr.dataset.id;
    const btn = tr.querySelector(".action-btn.plan");
    if (!btn) return;
    if (isPlanned(id)){ btn.textContent = "✓ Planned"; btn.classList.add("planned"); }
    else { btn.textContent = "+ Plan"; btn.classList.remove("planned"); }
  });
}


function renderSources(sources, id){
  const recipe = parseRecipe(sources);
  if (!recipe) return sources;
  const idx = sources.indexOf("Craft:");
  const prefix = idx >= 0 ? sources.slice(0, idx) : "";
  const warnMatch = sources.match(/\[WARNING[\s\S]*/);
  const warning = warnMatch ? " " + warnMatch[0] : "";
  const parts = recipe.map(m=>{
    const known = !!NAME_TO_ITEM[m.name.toLowerCase()];
    const cls = known ? "mat-link" : "mat-link mat-unknown";
    return `${m.qty} × <span class="${cls}" data-mat="${escapeHtml(m.name)}">${escapeHtml(m.name)}</span>`;
  });
  return prefix + "<b>Craft:</b> " + parts.join(" + ") + warning;
}

function renderStatus(status){
  if (status === "Unresolved") return `<span class="pill pill-unknown">Unresolved</span>`;
  if (status === "Special") return `<span class="pill">Special</span>`;
  if (status === "Shop") return `<span class="pill">Shop</span>`;
  return `<span class="pill">${status}</span>`;
}

function buildDropCell(id){
  const td = document.createElement("td");
  td.className = "drop-cell";
  const rows = DROPS[id];
  if (!rows || !rows.length){ td.innerHTML = `<span class="drop-none">No data</span>`; return td; }
  const perUnit = {};
  for (const r of rows){
    if (r.eff <= 0) continue;
    if (!perUnit[r.unit] || perUnit[r.unit].eff < r.eff) perUnit[r.unit] = r;
  }
  const list = Object.values(perUnit).sort((a,b)=>b.eff-a.eff);
  if (!list.length){ td.innerHTML = `<span class="drop-none">Only second-tier rolls</span>`; return td; }
  const best = list[0];
  td.innerHTML = `<span class="drop-best">${best.eff.toFixed(3)}% <span class="sources">×${list.length} source${list.length>1?"s":""}</span></span>`;
  const det = document.createElement("details");
  det.innerHTML = `<summary>Breakdown</summary>`;
  const listEl = document.createElement("div");
  listEl.className = "drop-list";
  for (const r of list){
    const bname = UNIT_NAMES[r.unit] || "Unknown unit";
    const row = document.createElement("div");
    row.className = "drop-row";
    row.innerHTML = `<span class="bname">${escapeHtml(bname)}<span class="bunit">${r.unit}</span></span>` +
      `<span class="pct ${r.eff<1?'low':r.eff<10?'mid':''}">${r.eff.toFixed(3)}%</span>` +
      `<span class="cond">${r.cond?escapeHtml(r.cond)+" · ":""}mode: ${r.mode} · inner ${r.inner.toFixed(2)}% × outer ${r.outer.toFixed(2)}%</span>`;
    listEl.appendChild(row);
  }
  det.appendChild(listEl); td.appendChild(det);
  return td;
}

function buildTable(){
  const tbody = document.querySelector("#gear tbody");
  tbody.innerHTML = "";  
  const frag = document.createDocumentFragment();
  for (const [name,id,cat,lvl,status,sources] of EQUIPMENT){
    const tr = document.createElement("tr");
    tr.dataset.cat = cat; tr.dataset.status = status; tr.dataset.id = id;
    tr.dataset.level = String(lvl); tr.dataset.name = name;
	tr.dataset.tier = String(lvl >= 95 ? 5 : lvl >= 75 ? 4 : lvl >= 55 ? 3 : lvl >= 35 ? 2 : lvl >= 15 ? 1 : 0);
    tr.dataset.bosses = extractBosses(sources).join("|");
    tr.dataset.recipe = JSON.stringify(parseRecipe(sources)||null);

    const color = itemNameColor(id, lvl, cat, status);

    const nameTd = document.createElement("td");
    nameTd.innerHTML = `<b class="item-name" style="color:${color}">${escapeHtml(name)}</b><br><small class="id">${id}</small>`;
    const nameEl = nameTd.querySelector(".item-name");
    attachItemTip(nameEl, {name, id, cat, lvl, status, tooltip: ITEM_TOOLTIPS[id] || null});

    const catTd = document.createElement("td"); catTd.textContent = cat;
    const lvlTd = document.createElement("td"); lvlTd.textContent = lvl;
    const tier = lvl >= 95 ? 5 : lvl >= 75 ? 4 : lvl >= 55 ? 3 : lvl >= 35 ? 2 : lvl >= 15 ? 1 : 0;
    lvlTd.className = "lvl lvl-" + tier;
    const dropTd = buildDropCell(id);
    const statTd = document.createElement("td"); statTd.innerHTML = renderStatus(status);
    const srcTd = document.createElement("td");
    srcTd.innerHTML = renderSources(sources, id);
    srcTd.querySelectorAll(".mat-link").forEach(el=>{
      attachMaterialTip(el, el.dataset.mat);
    });

    const actTd = document.createElement("td"); actTd.className = "actions-cell";
    const recipe = parseRecipe(sources);
    if (recipe){
      const b = document.createElement("button");
      b.className = "action-btn plan";
      b.textContent = isPlanned(id) ? "✓ Planned" : "+ Plan";
      if (isPlanned(id)) b.classList.add("planned");
      b.onclick = (e)=>{
        e.stopPropagation();
        if (isPlanned(id)){ unplanItem(id); toast("Removed from planner"); }
        else { planItem(id); toast("Added to planner"); }
      };
      actTd.appendChild(b);
    }

    tr.append(nameTd,catTd,lvlTd,dropTd,statTd,srcTd,actTd);
    frag.appendChild(tr);
  }
  tbody.appendChild(frag);

  
  const dtbody = document.querySelector("#dungeons tbody");
  if (dtbody) dtbody.innerHTML = ""; 
  const dfrag = document.createDocumentFragment();
  for (const [zone, drops, desc] of DUNGEONS){
    const tr = document.createElement("tr");
    const td1 = document.createElement("td"); td1.textContent = zone;
    const td2 = document.createElement("td");
    drops.split(/,\s*/).forEach((d,i)=>{
      if (i>0) td2.appendChild(document.createTextNode(", "));
      const btn = document.createElement("button");
      btn.className = "dungeon-link"; btn.textContent = d;
      btn.onclick = ()=>{ state.q = d; document.getElementById("q").value = d; applyFilters();
        document.querySelector("#gear").scrollIntoView({behavior:"smooth"}); };
      td2.appendChild(btn);
    });
    const td3 = document.createElement("td"); td3.textContent = desc;
    tr.append(td1,td2,td3);
    dfrag.appendChild(tr);
  }
  dtbody.appendChild(dfrag);

  
  const heroOrder = {"AGI":0,"AGI/INT":1,"INT":2,"STR/AGI":3,"STR":4};
  const sortedHeroes = [...HEROES].sort((a,b)=>{
    const oa = heroOrder[a.primary] ?? 99;
    const ob = heroOrder[b.primary] ?? 99;
    if (oa !== ob) return oa - ob;
    return a.name.localeCompare(b.name);
  });
  const hg = document.getElementById("hero-grid");
  if (hg) hg.innerHTML = "";
  for (const h of sortedHeroes){
    const card = document.createElement("div");
    card.className = "hero-card";
    const colorHex = "#" + h.color.slice(-6);
    card.innerHTML = `
      <div class="hero-head">
        <h3 class="hero-name" style="color:${colorHex}">${escapeHtml(h.name)}</h3>
        <span class="hero-attr" data-a="${escapeHtml(h.primary)}">${escapeHtml(h.primary)}</span>
      </div>
      <div class="hero-stats">
        <span class="hero-stat">STR <b>${h.str}</b></span>
        <span class="hero-stat">AGI <b>${h.agi}</b></span>
        <span class="hero-stat">INT <b>${h.int}</b></span>
        <span class="hero-stat">HP <b>${h.hp}</b></span>
        ${h.mana?`<span class="hero-stat">Mana <b>${h.mana}</b></span>`:""}
        <span class="hero-stat">DMG <b>${h.dmg}</b></span>
        <span class="hero-stat">MS <b>${h.ms}</b></span>
        <span class="hero-stat">Range <b>${h.range}</b></span>
      </div>
      <div class="spell-list"></div>`;
    const sl = card.querySelector(".spell-list");
    for (const sp of h.spells){
      const spn = document.createElement("div");
      spn.className = "spell";
      spn.innerHTML = `
        <div class="spell-head">
          <span class="spell-name">${escapeHtml(sp.name)}</span>
          <span class="spell-key">${escapeHtml(sp.key)}</span>
        </div>
        <div class="spell-body">${wc3ToHtml(sp.tip)}</div>
        <div class="spell-meta"><span>Lv ${sp.lvl}</span><span>${escapeHtml(sp.id)}</span></div>`;
      spn.querySelector(".spell-head").onclick = ()=>spn.classList.toggle("open");
      attachSpellTip(spn.querySelector(".spell-name"), sp.tip);
      sl.appendChild(spn);
    }
    hg.appendChild(card);
  }
}




function deriveCategory(id, name){
  const n = (name||"").toLowerCase();
  if (/\bcard\b/.test(n)) return "Divine Card";
  if (/rune stone/.test(n)) return "Runes";
  if (/(elixir|potion|nectar|cake|cheese|croissant|meal|pumpkin|sausage|bread|combo|lunch|tea|sparkling water|radish|liquor|chocolate|food|gift pack|holy elixir|drop)/.test(n)) return "Consumable";
  if (/(- materials -|shard|crystal|ore|fragment|whetstone|rag|ember|bone|fossil|crest|atlas|tablet|slab|jade|core|lantern|mushroom|scale|claw|blood|tear|seed|orb|gem|insignia|seal|soul|paper|blaze|rune\b|dried heart|hollow claw|echo)/.test(n)) return "Material";
  const eq = EQUIPMENT.find(e=>e[1]===id);
  if (eq) return eq[2];
  return "Other";
}


function cleanWc3Name(s){
  if (!s) return "";
  return String(s)
    .replace(/\|c[0-9a-fA-F]{8}/g, "")
    .replace(/\|c[0-9a-fA-F]{6}/g, "")
    .replace(/\|r/g, "")
    .replace(/\|n/g, " ")
    .trim();
}


function parseCsvLine(line){
  const out = []; let cur = ""; let q = false;
  for (let i=0;i<line.length;i++){
    const ch = line[i];
    if (q){
      if (ch === '"' && line[i+1] === '"'){ cur += '"'; i++; }
      else if (ch === '"'){ q = false; }
      else cur += ch;
    } else {
      if (ch === '"'){ q = true; }
      else if (ch === ','){ out.push(cur); cur = ""; }
      else cur += ch;
    }
  }
  out.push(cur);
  return out;
}


const EXTRA_ITEMS = {};

function ingestCsv(text){
  if (!text || text.indexOf("__PASTE_") === 0) return;   const lines = text.replace(/\r/g,"").split("\n").filter(Boolean);
  if (!lines.length) return;
  const header = parseCsvLine(lines[0]).map(h=>h.trim().toLowerCase());
  const iId   = header.indexOf("item id");
  const iName = header.findIndex(h => h === "item name" || h === "name");
  const iDesc = header.findIndex(h => h === "description");
  const iTool = header.findIndex(h => h === "tooltip");
  const iExt  = header.findIndex(h => h === "extended tooltip");
  if (iId < 0) return;
  for (let i=1;i<lines.length;i++){
    const f = parseCsvLine(lines[i]);
    const id = (f[iId]||"").trim();
    if (!id) continue;
    const rawName = iName>=0 ? (f[iName]||"").trim() : "";
    const tooltip  = iTool>=0 ? (f[iTool]||"").trim() : "";
    const extTool  = iExt>=0  ? (f[iExt]||"").trim()  : "";
    const desc     = iDesc>=0 ? (f[iDesc]||"").trim() : "";
    const plainName = cleanWc3Name(rawName) || id;
    EXTRA_ITEMS[id] = {
      id,
      name: plainName,
      rawName: rawName,
      tooltip: tooltip || extTool || desc,
      description: desc,
      cat: deriveCategory(id, plainName)
    };
  }
}

ingestCsv(CSV_FULL);
ingestCsv(CSV_MINI);


function buildUnifiedItems(){
  const map = new Map();
  for (const [name,id,cat,lvl,status,sources] of EQUIPMENT){
    map.set(id, {
      id, name, cat, lvl, status, sources,
      tooltip: ITEM_TOOLTIPS[id] ? (ITEM_TOOLTIPS[id].effects || ITEM_TOOLTIPS[id].flavor || "") : "",
      flavor: ITEM_TOOLTIPS[id] ? (ITEM_TOOLTIPS[id].flavor || "") : "",
      stats: ITEM_STATS[id] || null
    });
  }
  for (const [id, ex] of Object.entries(EXTRA_ITEMS)){
    if (map.has(id)){
      const row = map.get(id);
            if (ex.name && ex.name.length > row.name.length) row.name = ex.name;
      if (!row.tooltip && ex.tooltip) row.tooltip = ex.tooltip;
    } else {
      map.set(id, {
        id,
        name: ex.name || id,
        cat: ex.cat || "Other",
        lvl: 0,
        status: "—",
        sources: "",
        tooltip: ex.tooltip || "",
        flavor: "",
        stats: ITEM_STATS[id] || null
      });
    }
  }
  return [...map.values()];
}

const UNIFIED_ITEMS = buildUnifiedItems();


function buildItemGrid(){
  const grid = document.getElementById("item-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const q = (document.getElementById("item-q")?.value || "").toLowerCase();
  const catF = document.getElementById("item-cat")?.value || "";

  const list = UNIFIED_ITEMS.filter(it=>{
    if (catF && it.cat !== catF) return false;
    if (!q) return true;
    const hay = (it.name + " " + it.id + " " + it.cat + " " + (it.sources||"") + " " + (it.tooltip||"")).toLowerCase();
    return hay.includes(q);
  });

  document.getElementById("item-count").textContent =
    list.length + " of " + UNIFIED_ITEMS.length + " items";

  for (const it of list){
    const card = document.createElement("div");
    card.className = "hero-card";

    const color = it.lvl
      ? itemNameColor(it.id, it.lvl, it.cat, it.status)
      : itemNameColor(it.id, 0, it.cat, it.status);

    const head = document.createElement("div");
    head.className = "hero-head";
    head.innerHTML = `
      <h3 class="hero-name" style="color:${color};cursor:help">${escapeHtml(it.name)}</h3>
      <span class="hero-attr" data-a="${escapeHtml(it.cat)}">${escapeHtml(it.cat)}</span>`;

    const meta = document.createElement("div");
    meta.className = "hero-stats";
    meta.innerHTML = `
      <span class="hero-stat">ID <b>${escapeHtml(it.id)}</b></span>
      ${it.lvl ? `<span class="hero-stat">Lv <b>${it.lvl}</b></span>` : ""}
      ${it.status && it.status !== "—" ? `<span class="hero-stat"><b>${escapeHtml(it.status)}</b></span>` : ""}`;

    const body = document.createElement("div");
    body.className = "spell-body";
    body.style.display = "block";
    let html = "";

        if (it.stats && it.stats.length){
      html += `<div style="color:#9fffbf;font-family:var(--mono);font-size:12.5px;line-height:1.7;margin-bottom:8px">` +
              it.stats.map(s=>"▲ " + escapeHtml(s)).join("<br>") + `</div>`;
    }

        if (it.tooltip){
      html += `<p style="margin:8px 0 0">${wc3ToHtml(it.tooltip)}</p>`;
    }

        if (it.flavor && it.flavor !== it.tooltip){
      html += `<p style="font-style:italic;color:#a0b2c8;margin:8px 0 0">“${wc3ToHtml(it.flavor)}”</p>`;
    }

    if (!html) html = `<p style="color:var(--muted);font-style:italic">No description in extracted data.</p>`;
    body.innerHTML = html;

        const nameEl = head.querySelector(".hero-name");
    attachItemTip(nameEl, {
      name: it.name, id: it.id, cat: it.cat, lvl: it.lvl,
      status: it.status,
      tooltip: ITEM_TOOLTIPS[it.id] || { effects: it.tooltip, flavor: it.flavor }
    });

    card.append(head, meta, body);
    grid.appendChild(card);
  }
}


function applyFilters(){
  const tbody = document.querySelectorAll("#gear tbody tr");
  let n = 0; const catCounts = {};
  for (const tr of tbody){
    const txt = tr.textContent.toLowerCase();
    const cat = tr.dataset.cat, lvl = +tr.dataset.level;
    let ok = true;
    if (state.q && !txt.includes(state.q.toLowerCase())) ok = false;
    if (ok && state.cats.size && !state.cats.has(cat)) ok = false;
    if (ok && state.statuses.size && !state.statuses.has(tr.dataset.status)) ok = false;
    if (ok && (lvl < state.lvlMin || lvl > state.lvlMax)) ok = false;
    if (ok && state.preset === "trial" && !tr.textContent.includes("Trial")) ok = false;
    if (ok && state.preset === "unresolved" && tr.dataset.status !== "Unresolved") ok = false;
    if (ok && state.preset === "craftable" && tr.dataset.status !== "Craft") ok = false;
    tr.hidden = !ok;
    if (ok){ n++; catCounts[cat] = (catCounts[cat]||0)+1; }
  }
  document.getElementById("count").textContent = n === 0 ? "No matching equipment" : n + " of " + EQUIPMENT.length + " equipment entries";
  const stats = document.getElementById("stats-breakdown");
  stats.innerHTML = "";
  ["Weapon","Armor","Helmet","Accessory","Collectibles","Divine Card","Runes"].forEach(c=>{
    if (catCounts[c]){
      const el = document.createElement("span");
      el.className = "stat"; el.dataset.cat = c;
      el.innerHTML = `${c} <b>${catCounts[c]}</b>`;
      stats.appendChild(el);
    }
  });
  applySort(); syncURL();
}

function applySort(){
  if (!SORT.key) return;
  const tbody = document.querySelector("#gear tbody");
  const rows = Array.from(tbody.children);
  const dir = SORT.dir;
  rows.sort((a,b)=>{
    let av, bv;
    switch(SORT.key){
      case "name": av = a.dataset.name.toLowerCase(); bv = b.dataset.name.toLowerCase(); break;
      case "cat": av = a.dataset.cat; bv = b.dataset.cat; break;
      case "lvl": av = +a.dataset.level; bv = +b.dataset.level; break;
      case "status": av = a.dataset.status; bv = b.dataset.status; break;
      case "drop":{
        const ar = DROPS[a.dataset.id]||[]; const br = DROPS[b.dataset.id]||[];
        av = ar.length ? Math.max(...ar.map(r=>r.eff)) : -1;
        bv = br.length ? Math.max(...br.map(r=>r.eff)) : -1;
        break;
      }
      default: av = 0; bv = 0;
    }
    if (av < bv) return -1*dir;
    if (av > bv) return 1*dir;
    return 0;
  });
  rows.forEach(r=>tbody.appendChild(r));
  document.querySelectorAll("#gear thead th").forEach(th=>{
    th.classList.remove("sorted","asc");
    if (th.dataset.sort === SORT.key){
      th.classList.add("sorted");
      if (SORT.dir === 1) th.classList.add("asc");
    }
  });
}

function syncURL(){
  try {
    const p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.cats.size) p.set("cats", [...state.cats].join(","));
    if (state.statuses.size) p.set("st", [...state.statuses].join(","));
    if (state.lvlMin) p.set("lmin", state.lvlMin);
    if (state.lvlMax !== 100) p.set("lmax", state.lvlMax);
    if (state.preset) p.set("pre", state.preset);
    history.replaceState(null, "", "?" + p.toString());
  } catch(_) {}
}

function readURL(){
  const p = new URLSearchParams(location.search);
  if (p.has("q")){ state.q = p.get("q"); document.getElementById("q").value = state.q; }
  if (p.has("cats")) state.cats = new Set(p.get("cats").split(",").filter(Boolean));
  if (p.has("st")) state.statuses = new Set(p.get("st").split(",").filter(Boolean));
  if (p.has("lmin")){ state.lvlMin = +p.get("lmin"); document.getElementById("lvl-min").value = state.lvlMin; }
  if (p.has("lmax")){ state.lvlMax = +p.get("lmax"); document.getElementById("lvl-max").value = state.lvlMax; }
  if (p.has("pre")){ state.preset = p.get("pre"); document.getElementById("preset-filter").value = state.preset; }
  syncChips(); updateLevelOutput();
}

let toastTimer;
function toast(msg){ const el=document.getElementById("toast"); el.textContent=msg; el.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),1600); }


function renderPlanner(){
  const box = document.getElementById("planner-content");
  if (!PLANNER.length){ box.innerHTML = `<div class="planner-empty">No items planned yet. Click <b>+ Plan</b> on a craftable row below.</div>`; return; }
  box.innerHTML = "";
  for (const item of PLANNER){
    const div = document.createElement("div");
    div.className = "planner-item";
    const have = item.materials.filter(m=>m.have).length;
    const ready = have === item.materials.length;
    const pct = item.materials.length ? Math.round(have/item.materials.length*100) : 100;
    if (ready) div.classList.add("ready");

    const itemInfo = NAME_TO_ITEM[item.name.toLowerCase()];
    const nameColor = itemInfo ? itemNameColor(itemInfo.id, itemInfo.lvl, itemInfo.cat, itemInfo.status) : "#dbe7f4";

    div.innerHTML = `
      <div class="planner-item-head">
        <b style="color:${nameColor}">${escapeHtml(item.name)}</b>
        ${ready ? `<span class="planner-ready-badge">Ready to be crafted!</span>` : ""}
        <button class="remove" title="Remove from planner">✕</button>
      </div>
      <ul class="planner-mats"></ul>
      <div class="planner-progress">
        <span>${have}/${item.materials.length}</span>
        <div class="planner-bar"><span style="width:${pct}%"></span></div>
        <span>${pct}%</span>
      </div>
      <details class="planner-used">
        <summary>Used in — next craft</summary>
        <div class="used-list"></div>
      </details>`;

    const ul = div.querySelector("ul");
    item.materials.forEach((m,i)=>{
      const li = document.createElement("li");
      const cb = document.createElement("input");
      cb.type = "checkbox"; cb.id = `p_${item.id}_${i}`; cb.checked = !!m.have;
      const lbl = document.createElement("label");
      lbl.htmlFor = cb.id;
      const known = !!NAME_TO_ITEM[m.name.toLowerCase()];
      const mColor = known ? itemNameColor(NAME_TO_ITEM[m.name.toLowerCase()].id, NAME_TO_ITEM[m.name.toLowerCase()].lvl, NAME_TO_ITEM[m.name.toLowerCase()].cat, NAME_TO_ITEM[m.name.toLowerCase()].status) : "";
      lbl.innerHTML = `<span class="planner-mat-qty">×${m.qty}</span> <span class="${known?'mat-link':'mat-link mat-unknown'}" ${mColor?`style="color:${mColor}"`:""}>${escapeHtml(m.name)}</span>`;
      cb.onchange = ()=>{ m.have = cb.checked; savePlanner(); renderPlanner(); };
      const linkEl = lbl.querySelector(".mat-link");
      attachMaterialTip(linkEl, m.name);
      li.append(cb,lbl); ul.appendChild(li);
    });

    const usedList = div.querySelector(".used-list");
    const usedIn = USED_IN[item.name.toLowerCase()] || [];
    if (!usedIn.length){
      usedList.innerHTML = `<div class="used-none">This item is not a material in any registered recipe — it's likely a top-tier craft.</div>`;
    } else {
      for (const ref of usedIn){
        const btn = document.createElement("button");
        btn.className = "used-item" + (isPlanned(ref.id) ? " planned" : "");
        const refInfo = NAME_TO_ITEM[ref.name.toLowerCase()];
        const refColor = refInfo ? itemNameColor(refInfo.id, refInfo.lvl, refInfo.cat, refInfo.status) : "";
        const equip = EQUIPMENT.find(e=>e[1]===ref.id);
        const refLvl = equip ? equip[3] : "?";
        btn.innerHTML = `<span style="color:${refColor}">${escapeHtml(ref.name)}</span><span class="used-tag">Lv ${refLvl}</span>`;
        btn.title = isPlanned(ref.id) ? "Already in planner" : "Add to planner";
        btn.onclick = (e)=>{
          e.stopPropagation();
          if (isPlanned(ref.id)){ toast("Already in planner"); return; }
          if (planItem(ref.id)) toast("Added " + ref.name + " to planner");
        };
        usedList.appendChild(btn);
      }
    }

    div.querySelector(".remove").onclick = ()=>{
      PLANNER = PLANNER.filter(p=>p.id !== item.id);
      savePlanner(); renderPlanner(); syncPlanButtons();
    };
    box.appendChild(div);
  }
}


function buildChips(){
  const cats = ["Weapon","Armor","Helmet","Accessory","Collectibles","Divine Card","Runes"];
  const statuses = ["Drop","Craft","Shop","Special","Unresolved"];
  const cw = document.getElementById("cat-chips");
  cats.forEach(c=>{
    const b = document.createElement("button");
    b.className = "chip"; b.textContent = c; b.dataset.cat = c;
    b.setAttribute("aria-pressed", state.cats.has(c) ? "true" : "false");
    b.onclick = ()=>{ if (state.cats.has(c)) state.cats.delete(c); else state.cats.add(c);
      b.setAttribute("aria-pressed", state.cats.has(c) ? "true" : "false"); applyFilters(); };
    cw.appendChild(b);
  });
  const sw = document.getElementById("status-chips");
  if (cw.children.length || sw.children.length) return;
  statuses.forEach(s=>{
    const b = document.createElement("button");
    b.className = "chip"; b.dataset.tone = "violet"; b.textContent = s; b.dataset.status = s;
    b.setAttribute("aria-pressed", state.statuses.has(s) ? "true" : "false");
    b.onclick = ()=>{ if (state.statuses.has(s)) state.statuses.delete(s); else state.statuses.add(s);
      b.setAttribute("aria-pressed", state.statuses.has(s) ? "true" : "false"); applyFilters(); };
    sw.appendChild(b);
  });
}
function syncChips(){
  document.querySelectorAll("#cat-chips .chip").forEach(c=>c.setAttribute("aria-pressed", state.cats.has(c.dataset.cat) ? "true" : "false"));
  document.querySelectorAll("#status-chips .chip").forEach(c=>c.setAttribute("aria-pressed", state.statuses.has(c.dataset.status) ? "true" : "false"));
}

function updateLevelOutput(){ document.getElementById("lvl-output").textContent = state.lvlMin + " – " + state.lvlMax; }

function attachListeners(){
  const q = document.getElementById("q");
  q.addEventListener("input", ()=>{ state.q = q.value; applyFilters(); });
  document.addEventListener("keydown", e=>{
    if (e.key === "/" && document.activeElement !== q){ e.preventDefault(); q.focus(); }
    if (e.key === "Escape" && document.activeElement === q){ q.value = ""; state.q = ""; applyFilters(); q.blur(); }
  });
  const lmin = document.getElementById("lvl-min"), lmax = document.getElementById("lvl-max");
  lmin.addEventListener("input", ()=>{
    state.lvlMin = +lmin.value;
    if (state.lvlMin > state.lvlMax){ state.lvlMax = state.lvlMin; lmax.value = state.lvlMax; }
    updateLevelOutput(); applyFilters();
  });
  lmax.addEventListener("input", ()=>{
    state.lvlMax = +lmax.value;
    if (state.lvlMax < state.lvlMin){ state.lvlMin = state.lvlMax; lmin.value = state.lvlMin; }
    updateLevelOutput(); applyFilters();
  });
  document.getElementById("preset-filter").addEventListener("change", e=>{
    state.preset = e.target.value;
    if (state.preset === "leveling"){ state.lvlMin = 0; state.lvlMax = 35; }
    else if (state.preset === "midgame"){ state.lvlMin = 35; state.lvlMax = 65; }
    else if (state.preset === "endgame"){ state.lvlMin = 65; state.lvlMax = 90; }
    else if (state.preset === "top"){ state.lvlMin = 90; state.lvlMax = 100; }
    else { state.lvlMin = 0; state.lvlMax = 100; }
    document.getElementById("lvl-min").value = state.lvlMin;
    document.getElementById("lvl-max").value = state.lvlMax;
    updateLevelOutput(); applyFilters();
  });
  document.getElementById("clear-filters").onclick = ()=>{
    state.q = ""; state.cats.clear(); state.statuses.clear();
    state.lvlMin = 0; state.lvlMax = 100; state.preset = "";
    document.getElementById("q").value = "";
    document.getElementById("lvl-min").value = 0;
    document.getElementById("lvl-max").value = 100;
    document.getElementById("preset-filter").value = "";
    updateLevelOutput(); syncChips(); applyFilters();
  };
  document.getElementById("planner-clear").onclick = ()=>{
    if (!PLANNER.length) return;
    if (!confirm("Clear all planned items?")) return;
    PLANNER = []; savePlanner(); renderPlanner(); syncPlanButtons();
  };
  document.querySelectorAll("#gear thead th[data-sort]").forEach(th=>{
    th.addEventListener("click", ()=>{
      const k = th.dataset.sort;
      if (SORT.key === k) SORT.dir *= -1;
      else { SORT.key = k; SORT.dir = 1; }
      applySort();
    });
  });
  document.querySelectorAll(".tab").forEach(t=>{
    t.onclick = ()=>{
      document.querySelectorAll(".tab").forEach(x=>x.setAttribute("aria-selected","false"));
      t.setAttribute("aria-selected","true");
      document.querySelectorAll("[data-tab-content]").forEach(s=>{
        s.classList.toggle("active", s.dataset.tabContent === t.dataset.tab);
      });
      window.scrollTo({top:0,behavior:"smooth"});
    };
  });
  const html = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("st:theme");
  if (saved){ html.dataset.theme = saved; themeBtn.textContent = saved === "light" ? "☀️" : "🌙"; }
  themeBtn.onclick = ()=>{
    const next = html.dataset.theme === "light" ? "dark" : "light";
    html.dataset.theme = next;
    themeBtn.textContent = next === "light" ? "☀️" : "🌙";
    localStorage.setItem("st:theme", next);
  };
  const topBtn = document.getElementById("scroll-top");
  window.addEventListener("scroll", ()=>topBtn.classList.toggle("visible", window.scrollY > 500));
  topBtn.onclick = ()=>window.scrollTo({top:0,behavior:"smooth"});

  
  const itemQ = document.getElementById("item-q");
  const itemCat = document.getElementById("item-cat");
  const itemClear = document.getElementById("item-clear");
  if (itemQ) itemQ.addEventListener("input", buildItemGrid);
  if (itemCat) itemCat.addEventListener("change", buildItemGrid);
  if (itemClear) itemClear.onclick = ()=>{
    document.getElementById("item-q").value = "";
    document.getElementById("item-cat").value = "";
    buildItemGrid();
  };
}


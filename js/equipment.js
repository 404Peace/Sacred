/* Auto-split from the single-file guide. Safe to edit. */

const state={q:"",cats:new Set(),statuses:new Set(),lvlMin:0,lvlMax:100,preset:""};

const SORT={key:"lvl",dir:1};

const PLANNER_KEY = "st:planner4";

let PLANNER = [];

const NAME_TO_ITEM = {};

const USED_IN = {};

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

/* ============================================================
   Official drop rendering (from OFFICIAL_DROPS in data-equipment.js)
   ============================================================ */

function renderOfficialDropBlock(id, sources){
  const best = sources[0];
  const totalSolo = sources.reduce((sum, s) => sum + (s.drop.solo || 0), 0);

  function fmtPct(v){
    if (v === undefined || v === null || !isFinite(v)) return "—";
    return v.toFixed(2) + "%";
  }
  function fmtSolo(v){
    if (v === undefined || v === null || !isFinite(v)) return "—";
    if (v >= 100) return v.toFixed(0);
    if (v >= 10)  return v.toFixed(1);
    return v.toFixed(2);
  }

  let html = `<div class="wc3-drop-section wc3-drop-official">`;
  html += `<div class="wc3-drop-header">
      <span class="wc3-drop-header-label">Official drop rates</span>
      <span class="wc3-drop-header-total">Σ solo ${fmtSolo(totalSolo)}/kill</span>
    </div>`;

  // Group by unit
  const grouped = {};
  for (const s of sources){
    const key = s.unitId;
    (grouped[key] = grouped[key] || { unit: s, sectionList: [] }).sectionList.push(s);
  }

  const groups = Object.values(grouped).sort((a, b) => {
    const aMax = Math.max(...a.sectionList.map(s => s.drop.solo || 0));
    const bMax = Math.max(...b.sectionList.map(s => s.drop.solo || 0));
    return bMax - aMax;
  });

  for (const g of groups){
    const u = g.unit;
    const levelStr = u.level != null ? `Lv ${u.level}` : "—";
    const cond  = u.drop.cond ? ` <span class="wc3-cond-mark" title="Requires additional map condition">[cond]</span>` : "";
    const mult  = u.drop.mult ? `<span class="wc3-drop-mult">×${u.drop.mult}</span>` : "";

    html += `<div class="wc3-drop-unit">`;
    html += `<div class="wc3-drop-unit-head">
        <span class="wc3-drop-unit-name">${escapeHtml(u.unitName)}</span>
        <span class="wc3-drop-unit-meta">${escapeHtml(u.unitId)} · ${escapeHtml(levelStr)}</span>
      </div>`;
    html += `<div class="wc3-drop-unit-trigger">${escapeHtml(u.trigger || "On death")}</div>`;

    for (const s of g.sectionList){
      const rolls = s.rolls || {};
      const rollsStr = rolls.solo ? `${rolls.solo} roll${rolls.solo>1?"s":""}` : "1 roll";
      html += `<div class="wc3-drop-unit-line">
          <span class="rn">${mult}chance ${fmtPct(s.drop.chance)} · solo ${fmtSolo(s.drop.solo)}</span>
          <span class="rv">${rollsStr}${cond}</span>
        </div>`;
      if (rolls.group){
        html += `<div class="wc3-drop-group">Group: ${escapeHtml(rolls.group)}</div>`;
      }
    }
    html += `</div>`;
  }

  html += `<div class="wc3-drop-note">Chance is per single loot roll. Solo = average per kill when playing alone.</div>`;
  html += `</div>`;
  return html;
}

function renderDropBlock(id){
  const official = getOfficialDropsForItem(id);

  if (!official || !official.length){
    return `<div class="wc3-drop-section"><div class="wc3-drop-note">No drop data recorded for this item. (CRAFT ITEM)</div></div>`;
  }

  return renderOfficialDropBlock(id, official);
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

  // Add drop block for items present in the official data
  const official = getOfficialDropsForItem(id);
  if (official && official.length){
    body += renderOfficialDropBlock(id, official);
  }

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
  // ---- Material not in the codex — resolve via alias + normalize ----
  const key      = matName.toLowerCase();
  const aliased  = MATERIAL_ALIASES[key] || key;
  const target   = normalizeMatName(aliased);

  const official = [];
  for (const [unitId, unit] of Object.entries(OFFICIAL_DROPS)){
    if (!unit.sections) continue;
    for (const section of unit.sections){
      for (const drop of section.drops){
        if (!drop.item) continue;
        const dn = normalizeMatName(drop.item);
        if (dn === target || dn === normalizeMatName(key)){
          official.push({
            unitId,
            unitName: unit.name,
            level: unit.level,
            trigger: section.trigger,
            rolls: section.rolls,
            drop
          });
        }
      }
    }
  }

  headerHtml = `<div class="wc3-tip-header">
      <div class="wc3-tip-title">${escapeHtml(matName)}</div>
      <div class="wc3-tip-id">material</div>
    </div>
    <div class="wc3-tip-meta"><span class="m">Crafting material</span></div>`;

  if (official.length){
    official.sort((a,b) => (b.drop.solo || 0) - (a.drop.solo || 0));
    body += renderOfficialDropBlock("__material__", official);
  } else if (MATERIAL_NOTES[key]){
    body += `<div class="wc3-drop-section"><div class="wc3-drop-note">${escapeHtml(MATERIAL_NOTES[key])}</div></div>`;
  } else {
    body += `<div class="wc3-drop-section"><div class="wc3-drop-note">No drop source recorded for this material.</div></div>`;
  }
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

  const official = getOfficialDropsForItem(id);

  if (!official || !official.length){
    td.innerHTML = `<span class="drop-none">No data</span>`;
    return td;
  }

  const best = official[0];
  const totalSolo = official.reduce((s, x) => s + (x.drop.solo || 0), 0);

  td.innerHTML = `
    <span class="drop-best" title="Best per-roll chance from any single boss">
      ${best.drop.chance.toFixed(2)}% <span class="sources">×${official.length} source${official.length>1?"s":""}</span>
    </span>
    <span class="drop-solo" title="Total average drops per solo kill across all sources">
      Σ ${totalSolo.toFixed(2)}/kill
    </span>`;

  const det = document.createElement("details");
  det.innerHTML = `<summary>Breakdown</summary>`;
  const listEl = document.createElement("div");
  listEl.className = "drop-list";

  const grouped = {};
  for (const s of official){
    (grouped[s.unitId] = grouped[s.unitId] || { unit: s, drops: [] }).drops.push(s);
  }
  const groups = Object.values(grouped).sort((a, b) => {
    const aMax = Math.max(...a.drops.map(d => d.drop.solo || 0));
    const bMax = Math.max(...b.drops.map(d => d.drop.solo || 0));
    return bMax - aMax;
  });

  for (const g of groups){
    const u = g.unit;
    const levelStr = u.level != null ? `Lv ${u.level}` : "—";
    const cond  = u.drop.cond ? ` <span class="wc3-cond-mark">[cond]</span>` : "";
    const mult  = u.drop.mult ? ` ×${u.drop.mult}` : "";

    const row = document.createElement("div");
    row.className = "drop-row drop-row-official";
    row.innerHTML =
      `<span class="bname">${escapeHtml(u.unitName)}<span class="bunit">${escapeHtml(u.unitId)} · ${escapeHtml(levelStr)}</span></span>` +
      `<span class="pct">${u.drop.chance.toFixed(2)}%</span>` +
      `<span class="solo-col">Σ ${(u.drop.solo || 0).toFixed(2)}</span>` +
      `<span class="cond">${escapeHtml(u.trigger || "")}${mult}${cond}` +
      (u.rolls && u.rolls.group ? ` · group: ${escapeHtml(u.rolls.group)}` : "") +
      `</span>`;
    listEl.appendChild(row);
  }

  det.appendChild(listEl);
  td.appendChild(det);
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
	const recipe = parseRecipe(sources);
    tr.dataset.recipe = JSON.stringify(recipe || null);

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
  if (dtbody){
    dtbody.innerHTML = "";
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
  }

  const hg = document.getElementById("hero-grid");
  if (hg){
    hg.innerHTML = "";
    const heroOrder = {"AGI":0,"AGI/INT":1,"INT":2,"STR/AGI":3,"STR":4};
    const sortedHeroes = [...HEROES].sort((a,b)=>{
      const oa = heroOrder[a.primary] ?? 99;
      const ob = heroOrder[b.primary] ?? 99;
      if (oa !== ob) return oa - ob;
      return a.name.localeCompare(b.name);
    });
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
  applySort();
}

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
        const ar = getOfficialDropsForItem(a.dataset.id) || [];
        const br = getOfficialDropsForItem(b.dataset.id) || [];
        av = ar.length ? Math.max(...ar.map(r=>r.drop.chance)) : -1;
        bv = br.length ? Math.max(...br.map(r=>r.drop.chance)) : -1;
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
  const cw = document.getElementById("cat-chips");
  const sw = document.getElementById("status-chips");
  if (cw.children.length || sw.children.length) return;
  const cats = ["Weapon","Armor","Helmet","Accessory","Collectibles","Divine Card","Runes"];
  const statuses = ["Drop","Craft","Shop","Special","Unresolved"];
  cats.forEach(c=>{
    const b = document.createElement("button");
    b.className = "chip"; b.textContent = c; b.dataset.cat = c;
    b.setAttribute("aria-pressed", state.cats.has(c) ? "true" : "false");
    b.onclick = ()=>{ if (state.cats.has(c)) state.cats.delete(c); else state.cats.add(c);
      b.setAttribute("aria-pressed", state.cats.has(c) ? "true" : "false"); applyFilters(); };
    cw.appendChild(b);
  });
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

/* NOTE: init chain lives in main.js — do not call it here. */
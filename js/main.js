/* Auto-split from the single-file guide. Safe to edit. */

try {
  const raw = localStorage.getItem(PLANNER_KEY) || localStorage.getItem("st:planner3") || "[]";
  PLANNER = JSON.parse(raw);
  if (!Array.isArray(PLANNER)) PLANNER = [];
} catch(_) { PLANNER = []; }

function savePlanner(){
  try { localStorage.setItem(PLANNER_KEY, JSON.stringify(PLANNER)); } catch(_) {}
}

/* INIT */
parseDrops();
buildIndexes();
buildTable();
buildChips();
renderPlanner();
readURL();
attachListeners();
applyFilters();
syncPlanButtons();
buildItemGrid();

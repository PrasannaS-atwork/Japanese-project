/* ===========================================================
   Nihon no Tabi — UI behaviour
   =========================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const state = { q: "", cat: "all", region: "all", season: "", results: [...window.PLACES], open: -1 };

/* ---------- noren intro ---------- */
setTimeout(() => $("#noren")?.classList.add("done"), 1500);

/* ---------- season + theme ---------- */
const root = document.documentElement;
function setSeason(s) {
  root.dataset.season = s;
  $$(".season-switch button").forEach(b => b.classList.toggle("is-on", b.dataset.season === s));
  window.setParticleSeason?.(s);
  try { localStorage.setItem("nt-season", s); } catch (e) {}
}
$$(".season-switch button").forEach(b => b.onclick = () => setSeason(b.dataset.season));

const themeBtn = $("#themeBtn");
function setTheme(t) {
  root.dataset.theme = t;
  themeBtn.textContent = t === "night" ? "☾" : "☀";
  try { localStorage.setItem("nt-theme", t); } catch (e) {}
}
themeBtn.onclick = () => setTheme(root.dataset.theme === "night" ? "day" : "night");

try {
  const s = localStorage.getItem("nt-season");
  const t = localStorage.getItem("nt-theme");
  setSeason(s || (["spring", "summer", "autumn", "winter"][Math.floor(new Date().getMonth() / 3 + 0.0) % 4] || "spring"));
  setTheme(t || "day");
} catch (e) { setSeason("spring"); setTheme("day"); }

/* ---------- hero parallax ---------- */
const scene = $("#scene");
const layers = [
  [".sky", 0.04], [".clouds", 0.10], [".cranes", 0.16], [".fuji", 0.09],
  [".hills", 0.20], [".waves", 0.30], [".torii-layer", 0.26]
].map(([sel, k]) => [$(sel, scene), k]).filter(([el]) => el);

let mx = 0, my = 0;
addEventListener("scroll", () => {
  const y = scrollY;
  if (y > innerHeight * 1.2) return;
  layers.forEach(([el, k]) => {
    el.style.transform = `translate3d(${mx * k * 26}px, ${y * k * 0.55 + my * k * 14}px, 0) scale(${1 + k * 0.06})`;
  });
}, { passive: true });

addEventListener("mousemove", e => {
  mx = (e.clientX / innerWidth - 0.5) * 2;
  my = (e.clientY / innerHeight - 0.5) * 2;
  layers.forEach(([el, k]) => {
    const y = Math.min(scrollY, innerHeight * 1.2);
    el.style.transform = `translate3d(${mx * k * 26}px, ${y * k * 0.55 + my * k * 14}px, 0) scale(${1 + k * 0.06})`;
  });
}, { passive: true });

/* ---------- counters ---------- */
$$("[data-count]").forEach(el => {
  const target = +el.dataset.count || 0;
  const DUR = 900;
  let t0 = 0;
  const tick = now => {
    if (!t0) t0 = now;
    const k = Math.min(1, (now - t0) / DUR);
    el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(tick);
  };
  setTimeout(() => requestAnimationFrame(tick), 1600);
  // rAF is paused in background tabs — make sure the number always lands.
  setTimeout(() => { el.textContent = target; }, 3200);
});

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.14 });
$$(".reveal").forEach(el => io.observe(el));

/* ---------- cards ---------- */
const grid = $("#grid");
const empty = $("#empty");
const resultline = $("#resultline");

function cardHTML(p, i) {
  const art = window.CAT_ART[p.category] || window.CAT_ART.culture;
  const catEn = window.CAT_EN[p.category] || p.category;
  return `
  <article class="card" data-i="${i}" style="--d:${Math.min(i, 14) * 45}ms" tabindex="0" role="button" aria-label="${p.name}">
    <div class="card-art">
      <span class="card-cat">${catEn}</span>
      <span class="card-season">Best: ${p.season}</span>
      <img src="${art}" alt="${p.category} illustration" loading="lazy">
      <span class="card-jp">${p.jp || ""}</span>
    </div>
    <div class="card-body">
      <h3>${p.name}</h3>
      <p class="card-meta"><b>${p.region}</b> · ${p.romaji || ""}</p>
      <p>${p.description}</p>
      <p class="card-more">Read more <span>→</span></p>
    </div>
  </article>`;
}

function render(list) {
  state.results = list;
  grid.innerHTML = list.map(cardHTML).join("");
  empty.hidden = list.length > 0;
  const bits = [];
  if (state.q) bits.push(`“${state.q}”`);
  if (state.cat !== "all") bits.push(window.CAT_EN[state.cat] || state.cat);
  if (state.region !== "all") bits.push(state.region);
  if (state.season) bits.push(state.season + " highlights");
  resultline.textContent = list.length
    ? `Showing ${list.length} place${list.length > 1 ? "s" : ""}${bits.length ? " · " + bits.join(" · ") : ""}`
    : `No match${bits.length ? " for " + bits.join(" · ") : ""}`;
}

/* ---------- search (Flask API, with local fallback) ---------- */
let timer, controller;
async function runSearch() {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    const params = new URLSearchParams({ q: state.q, category: state.cat, region: state.region });
    try {
      controller?.abort();
      controller = new AbortController();
      const r = await fetch("/api/search?" + params, { signal: controller.signal });
      const data = await r.json();
      let list = data.results;
      if (state.season) list = list.filter(p => p.season === state.season);
      render(list);
    } catch (err) {
      if (err.name === "AbortError") return;
      render(localFilter());
    }
  }, 140);
}

function localFilter() {
  const q = state.q.toLowerCase();
  return window.PLACES.filter(p =>
    (state.cat === "all" || p.category === state.cat) &&
    (state.region === "all" || p.region === state.region) &&
    (!state.season || p.season === state.season) &&
    (!q || p.name.toLowerCase().includes(q) || (p.jp || "").includes(q) ||
      p.region.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  );
}

const q1 = $("#q"), q2 = $("#q2");
function syncQ(v, from) {
  state.q = v;
  if (from !== 1) q1.value = v;
  if (from !== 2) q2.value = v;
  runSearch();
}
q1.addEventListener("input", e => syncQ(e.target.value, 1));
q2.addEventListener("input", e => syncQ(e.target.value, 2));
q1.addEventListener("keydown", e => {
  if (e.key === "Enter") { e.preventDefault(); $("#explore").scrollIntoView({ behavior: "smooth" }); }
});

$$("#quickchips button").forEach(b => b.onclick = () => {
  syncQ(b.dataset.q, 0);
  $("#explore").scrollIntoView({ behavior: "smooth" });
});

$$("#catChips .chip").forEach(c => c.onclick = () => {
  $$("#catChips .chip").forEach(x => x.classList.toggle("is-on", x === c));
  state.cat = c.dataset.cat;
  runSearch();
});

$("#regionSel").onchange = e => { state.region = e.target.value; runSearch(); };

$("#resetBtn").onclick = () => {
  state.cat = "all"; state.region = "all"; state.season = "";
  $("#regionSel").value = "all";
  $$("#catChips .chip").forEach(x => x.classList.toggle("is-on", x.dataset.cat === "all"));
  syncQ("", 0);
};

/* season cards -> repaint + filter */
$$(".scard").forEach(c => c.onclick = () => {
  setSeason(c.dataset.seasonGo);
  state.season = c.dataset.seasonFilter;
  runSearch();
  $("#explore").scrollIntoView({ behavior: "smooth" });
});

/* ---------- おみくじ random ---------- */
$("#luckyBtn").onclick = async () => {
  let p;
  try { p = await (await fetch("/api/random")).json(); }
  catch (e) { p = window.PLACES[(Math.random() * window.PLACES.length) | 0]; }
  const i = state.results.findIndex(x => x.name === p.name);
  if (i >= 0) openSheet(i);
  else { render([p, ...state.results.filter(x => x.name !== p.name)]); openSheet(0); }
};

/* ---------- detail sheet ---------- */
const sheet = $("#sheet");
function openSheet(i) {
  const p = state.results[i];
  if (!p) return;
  state.open = i;
  $("#sheetImg").src = window.CAT_ART[p.category] || window.CAT_ART.culture;
  $("#sheetImg").alt = p.category + " illustration";
  $("#sheetJp").textContent = p.jp || "";
  $("#sheetName").textContent = p.name;
  $("#sheetDesc").textContent = p.description;
  $("#sheetTags").innerHTML = [
    window.CAT_EN[p.category] || p.category,
    p.region, "Best season: " + p.season, p.romaji ? "Romaji: " + p.romaji : ""
  ].filter(Boolean).map(t => `<span>${t}</span>`).join("");
  sheet.hidden = false;
  document.body.style.overflow = "hidden";
  $(".sheet-x").focus();
}
function closeSheet() {
  sheet.hidden = true;
  document.body.style.overflow = "";
}
grid.addEventListener("click", e => {
  const c = e.target.closest(".card");
  if (c) openSheet(+c.dataset.i);
});
grid.addEventListener("keydown", e => {
  const c = e.target.closest(".card");
  if (c && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openSheet(+c.dataset.i); }
});
$$("[data-close]").forEach(el => el.onclick = closeSheet);
$("#sheetNext").onclick = () => openSheet((state.open + 1) % state.results.length);
$("#sheetPrev").onclick = () => openSheet((state.open - 1 + state.results.length) % state.results.length);
addEventListener("keydown", e => {
  if (sheet.hidden) return;
  if (e.key === "Escape") closeSheet();
  if (e.key === "ArrowRight") $("#sheetNext").click();
  if (e.key === "ArrowLeft") $("#sheetPrev").click();
});

/* ---------- phrase flip (touch) ---------- */
$$(".flip").forEach(f => f.onclick = () => f.classList.toggle("on"));

/* ---------- first paint ---------- */
render(window.PLACES);

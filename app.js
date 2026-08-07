const DAY_NAMES = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];

const HISTORY_KEY = "zdash:history";
const CONFIG_KEY = "zdash:config";
const THEME_KEY = "zdash:theme";

/* ---------------- PDF storage (IndexedDB) ---------------- */

const PDF_DB_NAME = "zdash-pdfs";
const PDF_STORE = "pdfs";

function openPdfDb(){
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(PDF_DB_NAME, 1);
    req.onupgradeneeded = () => { req.result.createObjectStore(PDF_STORE); };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function savePdf(bookId, file){
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PDF_STORE, "readwrite");
    tx.objectStore(PDF_STORE).put(file, bookId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function getPdf(bookId){
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PDF_STORE, "readonly");
    const req = tx.objectStore(PDF_STORE).get(bookId);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}
async function deletePdf(bookId){
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PDF_STORE, "readwrite");
    tx.objectStore(PDF_STORE).delete(bookId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/* ---------------- Static content ---------------- */

const DEFAULT_GYM_TYPES = [
  {id:"push", label:"Push", exercises:[]},
  {id:"pull", label:"Pull", exercises:[]},
  {id:"legs", label:"Legs", exercises:[]},
  {id:"kettlebell", label:"Kettlebell circuit", exercises:[]},
];
const DEFAULT_SPORT_EXTRAS = [
  {id:"mobilite", label:"Routine mobilité", onHome:true},
];

const EXERCISE_LIBRARY = [
  {id:"warmup", name:"Warm Up", muscle:"Full Body"},
  {id:"squat", name:"Barbell Squat", muscle:"Quadriceps"},
  {id:"front_squat", name:"Front Squat", muscle:"Quadriceps"},
  {id:"deadlift", name:"Deadlift", muscle:"Hamstrings"},
  {id:"romanian_deadlift", name:"Romanian Deadlift", muscle:"Hamstrings"},
  {id:"bench_press", name:"Bench Press", muscle:"Chest"},
  {id:"incline_bench_press", name:"Incline Bench Press", muscle:"Chest"},
  {id:"push_up", name:"Push Up", muscle:"Chest"},
  {id:"overhead_press", name:"Overhead Press", muscle:"Shoulders"},
  {id:"lateral_raise", name:"Lateral Raise", muscle:"Shoulders"},
  {id:"pull_up", name:"Pull Up", muscle:"Back"},
  {id:"chin_up", name:"Chin Up", muscle:"Back"},
  {id:"lat_pulldown", name:"Lat Pulldown", muscle:"Back"},
  {id:"barbell_row", name:"Barbell Row", muscle:"Back"},
  {id:"seated_cable_row", name:"Seated Cable Row", muscle:"Back"},
  {id:"lunge", name:"Lunge", muscle:"Quadriceps"},
  {id:"bulgarian_split_squat", name:"Bulgarian Split Squat", muscle:"Quadriceps"},
  {id:"leg_press", name:"Leg Press", muscle:"Quadriceps"},
  {id:"leg_curl", name:"Leg Curl", muscle:"Hamstrings"},
  {id:"calf_raise", name:"Calf Raise", muscle:"Calves"},
  {id:"bicep_curl", name:"Bicep Curl", muscle:"Biceps"},
  {id:"hammer_curl", name:"Hammer Curl", muscle:"Biceps"},
  {id:"tricep_dip", name:"Tricep Dip", muscle:"Triceps"},
  {id:"tricep_pushdown", name:"Tricep Pushdown", muscle:"Triceps"},
  {id:"plank", name:"Plank", muscle:"Core"},
  {id:"side_plank", name:"Side Plank", muscle:"Core"},
  {id:"russian_twist", name:"Russian Twist", muscle:"Core"},
  {id:"hanging_leg_raise", name:"Hanging Leg Raise", muscle:"Core"},
  {id:"glute_bridge", name:"Glute Bridge", muscle:"Glutes"},
  {id:"hip_thrust", name:"Hip Thrust", muscle:"Glutes"},
  {id:"burpee", name:"Burpee", muscle:"Full Body"},
  {id:"mountain_climber", name:"Mountain Climber", muscle:"Full Body"},
  {id:"jump_rope", name:"Jump Rope", muscle:"Cardio"},
  {id:"box_jump", name:"Box Jump", muscle:"Legs"},
  {id:"kettlebell_swing", name:"Kettlebell Swing", muscle:"Full Body"},
  {id:"kettlebell_goblet_squat", name:"Kettlebell Goblet Squat", muscle:"Quadriceps"},
  {id:"kettlebell_halo", name:"Kettlebell Halo", muscle:"Shoulders"},
  {id:"gorilla_row_kettlebell", name:"Gorilla Row (Kettlebell)", muscle:"Upper Back"},
  {id:"turkish_getup", name:"Turkish Get-Up", muscle:"Full Body"},
  {id:"farmers_carry", name:"Farmer's Carry", muscle:"Full Body"},
  {id:"renegade_row", name:"Renegade Row", muscle:"Back"},
];
const GYM_BY_WEEKDAY = {1:"push", 2:"pull", 3:"legs", 4:"kettlebell", 5:"push", 6:"legs", 0:"pull"};

const PRAYERS = [
  {id:"fajr", label:"Fajr"},
  {id:"dhuhr", label:"Dhuhr"},
  {id:"asr", label:"Asr"},
  {id:"maghrib", label:"Maghrib"},
  {id:"isha", label:"Isha"},
];

const CULTURE_TOPICS = {
  economie: { label:"Économie", rank:"01", day:"Lun · Mer",
    tasks:[
      {id:"lecture", label:"Article du jour", meta:"15 min", sub:`<a href="https://www.lemonde.fr/economie/" target="_blank" rel="noopener">Le Monde — Économie</a>`},
      {id:"resume", label:"Résumer l'article", meta:"10 min", sub:"3 idées clés"},
      {id:"note", label:"Prendre une note", meta:"5 min", sub:"Ce que j'ai retenu"},
    ],
    resources:[
      {label:"Média", value:`<a href="https://www.lemonde.fr/economie/" target="_blank" rel="noopener">Le Monde — Économie</a>`},
      {label:"Podcast", value:`<a href="https://www.radiofrance.fr/franceculture/podcasts/entendez-vous-l-eco" target="_blank" rel="noopener">Entendez-vous l'éco ?</a> (France Culture)`},
      {label:"Livre", value:"L'Économie pour les Nuls — pour poser les bases"},
    ]},
  geopolitique: { label:"Géopolitique", rank:"02", day:"Mar · Jeu",
    tasks:[
      {id:"podcast", label:"Podcast", meta:"20-30 min", sub:`<a href="https://www.arte.tv/fr/videos/RC-014036/le-dessous-des-cartes/" target="_blank" rel="noopener">Le Dessous des Cartes</a>`},
      {id:"resume", label:"Résumer le podcast", meta:"10 min", sub:"3 idées clés"},
      {id:"article", label:"Lire un article complémentaire", meta:"15 min", sub:"Approfondir le sujet"},
      {id:"note", label:"Prendre une note", meta:"5 min", sub:"Ce que j'ai retenu"},
    ],
    resources:[
      {label:"Média", value:`<a href="https://www.courrierinternational.com/" target="_blank" rel="noopener">Courrier International</a> + <a href="https://www.jeuneafrique.com/" target="_blank" rel="noopener">Jeune Afrique</a>`},
      {label:"Podcast", value:`<a href="https://www.arte.tv/fr/videos/RC-014036/le-dessous-des-cartes/" target="_blank" rel="noopener">Le Dessous des Cartes</a> (Arte)`},
      {label:"Livre", value:"Atlas géopolitique — Pascal Boniface"},
    ]},
  militaire: { label:"Militaire / Stratégie", rank:"03", day:"Ven",
    tasks:[
      {id:"lecture", label:"Lecture de fond", meta:"15-20 min", sub:`<a href="https://www.areion24.news/" target="_blank" rel="noopener">Areion24 / DSI</a>`},
      {id:"resume", label:"Résumer l'article", meta:"10 min", sub:"3 idées clés"},
      {id:"note", label:"Prendre une note", meta:"5 min", sub:"Ce que j'ai retenu"},
    ],
    resources:[
      {label:"Média", value:`<a href="https://www.areion24.news/" target="_blank" rel="noopener">Areion24 / DSI</a>`},
      {label:"Podcast", value:`<a href="https://www.irsem.fr/le-collimateur.html" target="_blank" rel="noopener">Le Collimateur</a> (IRSEM)`},
      {label:"Livre", value:"Stratégie — Lawrence Freedman"},
    ]},
  tech: { label:"Technologie", rank:"04", day:"Weekend",
    tasks:[
      {id:"veille", label:"Veille tech", meta:"15-20 min", sub:`<a href="https://techcrunch.com/" target="_blank" rel="noopener">TechCrunch</a>`},
      {id:"resume", label:"Résumer ce que j'ai lu", meta:"10 min", sub:"3 idées clés"},
      {id:"note", label:"Prendre une note", meta:"5 min", sub:"Ton expérience terrain (n8n, API Claude) compte comme veille active"},
    ],
    resources:[
      {label:"Média", value:`<a href="https://techcrunch.com/" target="_blank" rel="noopener">TechCrunch</a>`},
      {label:"Podcast", value:"Underscore_ — tech francophone"},
      {label:"Note", value:"Ton expérience terrain (n8n, API Claude) compte comme veille active"},
    ]},
};

const TOPIC_BY_WEEKDAY = {1:"economie", 2:"geopolitique", 3:"economie", 4:"geopolitique", 5:"militaire", 6:"tech", 0:"geopolitique"};

const LECTURE_TASKS = [
  {id:"lire", label:"Lire 15-20 min", meta:"15 min"},
  {id:"idee", label:"Noter une idée importante"},
  {id:"citation", label:"Citation du jour"},
];

/* ---------------- Storage ---------------- */

function todayKey(d = new Date()){
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}

function loadHistory(){
  try{ return JSON.parse(localStorage.getItem(HISTORY_KEY)) || {}; }
  catch(e){ return {}; }
}
function saveHistory(h){
  try{ localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); }
  catch(e){ console.error("Erreur de sauvegarde", e); }
}

function emptyDay(d = new Date()){
  return {
    sport:{
      cardioType:"marche", cardioDistance:0, cardioDuration:0, cardioDone:false,
      extras:{},
      gymType: defaultGymType(d.getDay()), gymDone:false,
      gymLog:{},
    },
    cultureTopic: TOPIC_BY_WEEKDAY[d.getDay()],
    cultureDone:{},
    lecturePages:0,
    lectureDone:{},
    wird:{fajr:false, dhuhr:false, asr:false, maghrib:false, isha:false, coranDone:false, coranValue:0},
    freeTasks:[],
  };
}

function loadConfig(){
  try{
    const c = JSON.parse(localStorage.getItem(CONFIG_KEY));
    if(c) return c;
  }catch(e){}
  return {
    books:[{id:"b1", title:"Prisoners of Geography", author:"Tim Marshall", totalPages:300, notes:[]}],
    currentBookId:"b1",
    notes:[],
    weeklyGoal:"Comprendre l'inflation et ses impacts",
    cultureNotes:[],
    gymTypes: DEFAULT_GYM_TYPES.map(t => ({...t})),
    sportExtras: DEFAULT_SPORT_EXTRAS.map(t => ({...t})),
    sportOnHome: {cardio:true, gym:true},
    userName:"",
    userAge:"",
    userWeight:"",
    userHeight:"",
    wirdTrackMode:"hizb",
  };
}
function defaultGymType(weekday){
  const preferred = GYM_BY_WEEKDAY[weekday];
  if(config.gymTypes && config.gymTypes.some(t => t.id === preferred)) return preferred;
  return (config.gymTypes && config.gymTypes[0]) ? config.gymTypes[0].id : "";
}
function saveConfig(c){
  try{ localStorage.setItem(CONFIG_KEY, JSON.stringify(c)); }
  catch(e){ console.error("Erreur de sauvegarde", e); }
}

let history = loadHistory();
let config = loadConfig();
if(!config.gymTypes) config.gymTypes = DEFAULT_GYM_TYPES.map(t => ({...t}));
if(!config.sportExtras) config.sportExtras = DEFAULT_SPORT_EXTRAS.map(t => ({...t}));
config.sportExtras.forEach(e => { if(e.onHome === undefined) e.onHome = true; });
if(!config.sportOnHome) config.sportOnHome = {cardio:true, gym:true};
if(config.userName === undefined) config.userName = "";
if(config.userAge === undefined) config.userAge = "";
if(config.userWeight === undefined) config.userWeight = "";
if(config.userHeight === undefined) config.userHeight = "";
if(!config.wirdTrackMode) config.wirdTrackMode = "hizb";
if(!config.weightUnit) config.weightUnit = "kg";
config.gymTypes.forEach(t => { if(!t.exercises) t.exercises = []; });
function ensureDayShape(day){
  if(!day.sport) day.sport = emptyDay().sport;
  if(!day.sport.extras){
    day.sport.extras = day.sport.mobilityDone !== undefined ? {mobilite: day.sport.mobilityDone} : {};
    delete day.sport.mobilityDone;
  }
  if(!day.sport.gymLog) day.sport.gymLog = {};
  if(!day.wird) day.wird = {fajr:false, dhuhr:false, asr:false, maghrib:false, isha:false, coranDone:false, coranValue:0};
  return day;
}

const KEY = todayKey();
if(!history[KEY]) history[KEY] = emptyDay();
let viewKey = KEY;
let today = ensureDayShape(history[KEY]);
config.books.forEach(b => { if(!b.notes) b.notes = []; });
if(!config.cultureNotes) config.cultureNotes = [];

function persist(){
  history[viewKey] = today;
  saveHistory(history);
}

function switchViewDay(key){
  if(!history[key]){
    const [y,m,d] = key.split("-").map(Number);
    history[key] = emptyDay(new Date(y, m-1, d));
  }
  viewKey = key;
  today = ensureDayShape(history[key]);
  goto("today");
}

let calMonth = new Date().getMonth();
let calYear = new Date().getFullYear();
const lectureExpanded = {idee:false, citation:false};
const bookNotesExpanded = {};
const cultureExpanded = {};

/* ---------------- Router ---------------- */

function goto(page){
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.dataset.page === page));
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  if(page === "today") renderToday();
  if(page === "sport") renderSportPage();
  if(page === "culture") renderCulturePage();
  if(page === "lecture") renderLecturePage();
  if(page === "wird") renderWirdPage();
  if(page === "stats") renderStatsPage();
  if(page === "notes") renderNotesPage();
  if(page === "profil") renderProfilePage();
}

document.getElementById("nav").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-page]");
  if(btn) goto(btn.dataset.page);
});
document.querySelectorAll("[data-goto]").forEach(b => {
  b.addEventListener("click", () => goto(b.dataset.goto));
});

/* ---------------- Helpers ---------------- */

function checkItem(task, done, onToggle){
  const row = document.createElement("label");
  row.className = "check-item" + (done ? " done" : "");
  row.innerHTML = `
    <input type="checkbox" ${done ? "checked" : ""}>
    <span class="txt"><span class="t">${task.label}</span>${task.sub ? `<span class="s">${task.sub}</span>` : ""}</span>
    ${task.meta ? `<span class="meta">${task.meta}</span>` : ""}
  `;
  row.querySelector("input").addEventListener("change", (e) => {
    row.classList.toggle("done", e.target.checked);
    onToggle(e.target.checked);
  });
  return row;
}

function sportExtrasOf(sportRec){
  if(!sportRec) return {};
  if(sportRec.extras) return sportRec.extras;
  if(sportRec.mobilityDone !== undefined) return {mobilite: sportRec.mobilityDone};
  return {};
}

function dayHasCategory(rec, cat){
  if(!rec) return false;
  if(cat === "sport") return !!(rec.sport && (rec.sport.cardioDone || rec.sport.gymDone || Object.values(sportExtrasOf(rec.sport)).some(Boolean)));
  if(cat === "culture") return Object.values(rec.cultureDone||{}).some(Boolean);
  if(cat === "lecture") return Object.values(rec.lectureDone||{}).some(Boolean) || (rec.lecturePages||0) > 0;
  if(cat === "wird") return !!(rec.wird && (PRAYERS.some(p => rec.wird[p.id]) || rec.wird.coranDone));
  return false;
}

function countLifetimeDays(cat){
  return Object.values(history).filter(rec => dayHasCategory(rec, cat)).length;
}

function last7Dates(){
  const arr = [];
  for(let i=6;i>=0;i--){
    const d = new Date();
    d.setDate(d.getDate()-i);
    arr.push(todayKey(d));
  }
  return arr;
}

/* ---------------- Render: Today ---------------- */

function renderGreeting(){
  document.getElementById("greeting").textContent = config.userName ? `Bonjour ${config.userName} 👋` : "Bonjour 👋";
  const editBtn = document.getElementById("editNameBtn");
  editBtn.style.display = config.userName ? "none" : "";
  editBtn.textContent = "✏️ Ajouter mon prénom";
  const [y,m,d] = viewKey.split("-").map(Number);
  const viewDate = new Date(y, m-1, d);
  document.getElementById("todayDate").textContent = DAY_NAMES[viewDate.getDay()] + " " + viewDate.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});

  const banner = document.getElementById("viewingBanner");
  if(viewKey !== KEY){
    banner.style.display = "flex";
    banner.querySelector(".viewing-text").textContent = `Tu modifies l'historique du ${viewDate.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}`;
  }else{
    banner.style.display = "none";
  }
}
document.getElementById("editNameBtn").addEventListener("click", () => {
  const v = prompt("Ton prénom :", config.userName || "");
  if(v !== null){
    config.userName = v.trim();
    saveConfig(config);
    renderGreeting();
  }
});
document.getElementById("backToTodayBtn").addEventListener("click", () => switchViewDay(KEY));

function populateSelect(sel, options, value){
  sel.innerHTML = options.map(o => `<option value="${o.id}">${o.label}</option>`).join("");
  sel.value = value;
}

function renderSportChecklist(container){
  container.innerHTML = "";
  const s = today.sport;
  if(!s.extras) s.extras = {};
  const onHomeExtras = config.sportExtras.filter(e => e.onHome);
  let any = false;

  if(config.sportOnHome.cardio){
    any = true;
    const cardioWrap = document.createElement("div");
    cardioWrap.className = "sport-item" + (s.cardioDone ? " done" : "");
    const cardioLabel = document.createElement("label");
    cardioLabel.className = "check-item" + (s.cardioDone ? " done" : "");
    cardioLabel.innerHTML = `<input type="checkbox" ${s.cardioDone?"checked":""}><span class="txt"><span class="t">Marche / Footing matinal</span></span>`;
    cardioLabel.querySelector("input").addEventListener("change", (e) => {
      s.cardioDone = e.target.checked; persist(); renderSportEverywhere();
    });
    cardioWrap.appendChild(cardioLabel);

    const cardioDetail = document.createElement("div");
    cardioDetail.className = "sport-item-detail";
    const typeSel = document.createElement("select");
    typeSel.innerHTML = `<option value="marche">Marche</option><option value="footing">Footing</option>`;
    typeSel.value = s.cardioType;
    typeSel.addEventListener("change", (e) => { s.cardioType = e.target.value; persist(); });
    const distInput = document.createElement("input");
    distInput.type = "number"; distInput.min = "0"; distInput.step = "0.1"; distInput.value = s.cardioDistance;
    distInput.addEventListener("change", (e) => { s.cardioDistance = Math.max(0, parseFloat(e.target.value)||0); persist(); });
    const durInput = document.createElement("input");
    durInput.type = "number"; durInput.min = "0"; durInput.value = s.cardioDuration;
    durInput.addEventListener("change", (e) => { s.cardioDuration = Math.max(0, parseInt(e.target.value)||0); persist(); });
    cardioDetail.append(typeSel, distInput, document.createTextNode(" km"), durInput, document.createTextNode(" min"));
    cardioWrap.appendChild(cardioDetail);
    container.appendChild(cardioWrap);
  }

  onHomeExtras.forEach(extra => {
    any = true;
    const doneVal = !!s.extras[extra.id];
    const wrap = document.createElement("div");
    wrap.className = "sport-item" + (doneVal ? " done" : "");
    const label = document.createElement("label");
    label.className = "check-item" + (doneVal ? " done" : "");
    label.innerHTML = `<input type="checkbox" ${doneVal?"checked":""}><span class="txt"><span class="t">${extra.label}</span></span>`;
    label.querySelector("input").addEventListener("change", (e) => {
      s.extras[extra.id] = e.target.checked; persist(); renderSportEverywhere();
    });
    wrap.appendChild(label);
    container.appendChild(wrap);
  });

  if(config.sportOnHome.gym){
    any = true;
    const gymWrap = document.createElement("div");
    gymWrap.className = "sport-item" + (s.gymDone ? " done" : "");
    const gymLabel = document.createElement("label");
    gymLabel.className = "check-item" + (s.gymDone ? " done" : "");
    gymLabel.innerHTML = `<input type="checkbox" ${s.gymDone?"checked":""}><span class="txt"><span class="t">Séance gym</span></span>`;
    gymLabel.querySelector("input").addEventListener("change", (e) => {
      s.gymDone = e.target.checked; persist(); renderSportEverywhere();
    });
    gymWrap.appendChild(gymLabel);

    const gymDetail = document.createElement("div");
    gymDetail.className = "sport-item-detail";
    const gymSel = document.createElement("select");
    gymSel.innerHTML = config.gymTypes.map(t => `<option value="${t.id}">${t.label}</option>`).join("");
    gymSel.value = s.gymType;
    gymSel.addEventListener("change", (e) => { s.gymType = e.target.value; persist(); });
    gymDetail.appendChild(gymSel);
    gymWrap.appendChild(gymDetail);
    container.appendChild(gymWrap);
  }

  if(!any){
    container.innerHTML = `<p class="day-empty">Aucune routine ajoutée à l'accueil. Va dans <b>Sport</b> pour en ajouter.</p>`;
  }
}

function sportCounts(){
  const s = today.sport;
  const onHomeExtras = config.sportExtras.filter(e => e.onHome);
  const total = (config.sportOnHome.cardio?1:0) + (config.sportOnHome.gym?1:0) + onHomeExtras.length;
  const done = [
    config.sportOnHome.cardio && s.cardioDone,
    config.sportOnHome.gym && s.gymDone,
    ...onHomeExtras.map(e => s.extras && s.extras[e.id]),
  ].filter(Boolean).length;
  return {done, total};
}

function renderSportProgress(){
  const {done, total} = sportCounts();
  const bar = document.getElementById("sportProgBar");
  const txt = document.getElementById("sportProgTxt");
  const caption = document.getElementById("sportObjectiveCaption");
  if(total === 0){
    if(caption) caption.textContent = "Va dans Sport pour ajouter des routines à l'accueil";
    if(bar) bar.style.width = "0%";
    if(txt) txt.textContent = "Aucune routine";
    return;
  }
  if(caption) caption.textContent = `Objectif : ${total} case${total>1?"s":""} à cocher`;
  if(bar) bar.style.width = Math.round(done/total*100)+"%";
  if(txt) txt.textContent = `${done}/${total}`;
}

function renderSportEverywhere(){
  const cardContainer = document.getElementById("sportChecklist");
  if(cardContainer) renderSportChecklist(cardContainer);
  renderSportProgress();
  renderProgress();
  renderPills();
}

function renderPrayerRow(container){
  container.innerHTML = "";
  PRAYERS.forEach(p => {
    const done = !!today.wird[p.id];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "prayer-pill" + (done ? " done" : "");
    btn.textContent = p.label;
    btn.addEventListener("click", () => {
      today.wird[p.id] = !today.wird[p.id];
      persist();
      renderWirdEverywhere();
    });
    container.appendChild(btn);
  });
}

function renderCoranItem(container){
  container.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "sport-item" + (today.wird.coranDone ? " done" : "");
  const label = document.createElement("label");
  label.className = "check-item" + (today.wird.coranDone ? " done" : "");
  label.innerHTML = `<input type="checkbox" ${today.wird.coranDone?"checked":""}><span class="txt"><span class="t">Lecture du Coran</span></span>`;
  label.querySelector("input").addEventListener("change", (e) => {
    today.wird.coranDone = e.target.checked; persist(); renderWirdEverywhere();
  });
  wrap.appendChild(label);

  const detail = document.createElement("div");
  detail.className = "sport-item-detail";
  const input = document.createElement("input");
  input.type = "number"; input.min = "0";
  input.value = today.wird.coranValue || 0;
  input.addEventListener("change", () => {
    today.wird.coranValue = Math.max(0, parseInt(input.value)||0); persist();
  });
  const unitLabel = document.createTextNode(config.wirdTrackMode === "hizb" ? " Hizb" : " page");
  detail.append(input, unitLabel);
  wrap.appendChild(detail);
  container.appendChild(wrap);
}

function wirdDoneCount(){
  return PRAYERS.filter(p => today.wird[p.id]).length + (today.wird.coranDone ? 1 : 0);
}

function wirdCounts(){
  return {done: wirdDoneCount(), total: PRAYERS.length + 1};
}

function renderWirdProgress(){
  const {done, total} = wirdCounts();
  const bar = document.getElementById("wirdProgBar");
  const txt = document.getElementById("wirdProgTxt");
  const caption = document.getElementById("wirdObjectiveCaption");
  if(caption) caption.textContent = `Objectif : ${total} cases à cocher`;
  if(bar) bar.style.width = Math.round(done/total*100)+"%";
  if(txt) txt.textContent = `${done}/${total}`;
}

function renderWirdEverywhere(){
  const prayerRow = document.getElementById("prayerRow");
  if(prayerRow) renderPrayerRow(prayerRow);
  const coranChecklist = document.getElementById("coranChecklist");
  if(coranChecklist) renderCoranItem(coranChecklist);
  const prayerPageBody = document.getElementById("prayerPageBody");
  if(prayerPageBody) renderPrayerRow(prayerPageBody);
  const coranPageBody = document.getElementById("coranPageBody");
  if(coranPageBody) renderCoranItem(coranPageBody);
  renderWirdProgress();
  renderProgress();
  renderPills();
}

function renderWirdPage(){
  renderWirdEverywhere();
  const modeSel = document.getElementById("wirdModeSelect");
  modeSel.value = config.wirdTrackMode;
  modeSel.onchange = () => {
    config.wirdTrackMode = modeSel.value;
    saveConfig(config);
    renderWirdEverywhere();
  };
}

function buildCultureItem(task, kind){
  const topicId = today.cultureTopic;
  if(!config.cultureNotes) config.cultureNotes = [];
  const existingNote = config.cultureNotes.find(n => n.topicId===topicId && n.taskId===task.id && n.date===todayKey());
  const doneToday = !!today.cultureDone[task.id];
  const expanded = cultureExpanded[task.id];

  const wrap = document.createElement("div");
  wrap.className = "sport-item" + (doneToday ? " done" : "");

  const header = document.createElement("div");
  header.className = "check-item note-item-head" + (doneToday ? " done" : "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = doneToday;
  checkbox.addEventListener("change", (e) => {
    today.cultureDone[task.id] = e.target.checked;
    persist();
    renderCultureCard();
    renderProgress();
    renderPills();
  });

  const labelArea = document.createElement("div");
  labelArea.className = "txt";
  labelArea.style.cursor = "pointer";
  labelArea.innerHTML = `<span class="t">${task.label}</span>${existingNote ? `<span class="s">Enregistré aujourd'hui — clique pour modifier</span>` : (task.sub ? `<span class="s">${task.sub}</span>` : "")}`;
  labelArea.addEventListener("click", () => {
    cultureExpanded[task.id] = !cultureExpanded[task.id];
    renderCultureCard();
  });

  const chevron = document.createElement("span");
  chevron.className = "note-chevron";
  chevron.style.cursor = "pointer";
  chevron.textContent = expanded ? "▾" : "▸";
  chevron.addEventListener("click", () => {
    cultureExpanded[task.id] = !cultureExpanded[task.id];
    renderCultureCard();
  });

  header.append(checkbox, labelArea, chevron);
  wrap.appendChild(header);

  if(expanded){
    const body = document.createElement("div");
    body.className = "note-item-body";
    const input = document.createElement(kind === "title" ? "input" : "textarea");
    if(kind === "title"){
      input.type = "text";
      input.placeholder = "Titre de l'article / podcast…";
    }else{
      input.rows = 3;
      input.placeholder = kind === "resume" ? "Écris ton résumé…" : "Écris ta note…";
    }
    if(existingNote) input.value = existingNote.text;
    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.textContent = "Enregistrer";
    saveBtn.className = "note-save-btn";
    saveBtn.addEventListener("click", () => {
      const text = input.value.trim();
      if(!text) return;
      if(existingNote){
        existingNote.text = text;
      }else{
        config.cultureNotes.unshift({id:"cnote_"+Date.now(), topicId, taskId:task.id, kind, text, date:todayKey()});
      }
      saveConfig(config);
      today.cultureDone[task.id] = true;
      persist();
      cultureExpanded[task.id] = false;
      renderCultureCard();
      renderProgress();
      renderPills();
    });
    body.append(input, saveBtn);
    wrap.appendChild(body);
  }

  return wrap;
}

function renderCultureCard(){
  const sel = document.getElementById("topicSelect");
  populateSelect(sel, Object.keys(CULTURE_TOPICS).map(id => ({id, label:CULTURE_TOPICS[id].label})), today.cultureTopic);
  sel.onchange = () => {
    today.cultureTopic = sel.value;
    Object.keys(cultureExpanded).forEach(k => delete cultureExpanded[k]);
    persist(); renderCultureCard(); renderProgress();
  };

  const topic = CULTURE_TOPICS[today.cultureTopic];
  const list = document.getElementById("cultureChecklist");
  list.innerHTML = "";
  topic.tasks.forEach((t, i) => {
    if(i === 0){
      list.appendChild(buildCultureItem(t, "title"));
    }else if(t.id === "resume"){
      list.appendChild(buildCultureItem(t, "resume"));
    }else if(t.id === "note"){
      list.appendChild(buildCultureItem(t, "note"));
    }else{
      list.appendChild(checkItem(t, !!today.cultureDone[t.id], (checked) => {
        today.cultureDone[t.id] = checked; persist(); renderCultureCard(); renderProgress(); renderPills();
      }));
    }
  });
  const {done, total} = cultureCounts();
  document.getElementById("cultureObjectiveCaption").textContent = `Objectif : ${total} tâche${total>1?"s":""} à compléter`;
  document.getElementById("cultureProgTxt").textContent = `${done}/${total}`;
  document.getElementById("cultureProgBar").style.width = Math.round(done/total*100)+"%";
}

function cultureCounts(){
  const topic = CULTURE_TOPICS[today.cultureTopic];
  const total = topic.tasks.length;
  const done = topic.tasks.filter(t => today.cultureDone[t.id]).length;
  return {done, total};
}

function currentBook(){
  return config.books.find(b => b.id === config.currentBookId) || config.books[0];
}

function buildNoteItem(type, label){
  const book = currentBook();
  const existingNote = (book && book.notes) ? book.notes.find(n => n.type===type && n.date===todayKey()) : null;
  const doneToday = !!today.lectureDone[type];
  const expanded = lectureExpanded[type];

  const wrap = document.createElement("div");
  wrap.className = "sport-item" + (doneToday ? " done" : "");

  const header = document.createElement("div");
  header.className = "check-item note-item-head" + (doneToday ? " done" : "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = doneToday;
  checkbox.addEventListener("change", (e) => {
    today.lectureDone[type] = e.target.checked;
    persist();
    renderLectureCard();
    renderProgress();
    renderPills();
  });

  const labelArea = document.createElement("div");
  labelArea.className = "txt";
  labelArea.style.cursor = "pointer";
  labelArea.innerHTML = `<span class="t">${label}</span>${existingNote ? `<span class="s">Enregistré aujourd'hui — clique pour modifier</span>` : ""}`;
  labelArea.addEventListener("click", () => {
    lectureExpanded[type] = !lectureExpanded[type];
    renderLectureCard();
  });

  const chevron = document.createElement("span");
  chevron.className = "note-chevron";
  chevron.style.cursor = "pointer";
  chevron.textContent = expanded ? "▾" : "▸";
  chevron.addEventListener("click", () => {
    lectureExpanded[type] = !lectureExpanded[type];
    renderLectureCard();
  });

  header.append(checkbox, labelArea, chevron);
  wrap.appendChild(header);

  if(expanded){
    const body = document.createElement("div");
    body.className = "note-item-body";
    const textarea = document.createElement("textarea");
    textarea.rows = 2;
    textarea.placeholder = type==="idee" ? "Écris ton idée…" : "Écris la citation…";
    if(existingNote) textarea.value = existingNote.text;
    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.textContent = "Enregistrer";
    saveBtn.className = "note-save-btn";
    saveBtn.addEventListener("click", () => {
      const text = textarea.value.trim();
      if(!text) return;
      if(!book){ alert("Ajoute d'abord un livre dans ta bibliothèque."); return; }
      if(!book.notes) book.notes = [];
      if(existingNote){
        existingNote.text = text;
      }else{
        book.notes.unshift({id:"note_"+Date.now(), type, text, date:todayKey()});
      }
      saveConfig(config);
      today.lectureDone[type] = true;
      persist();
      lectureExpanded[type] = false;
      renderLectureCard();
      renderProgress();
      renderPills();
    });
    body.append(textarea, saveBtn);
    wrap.appendChild(body);
  }

  return wrap;
}

function renderLectureCard(){
  document.getElementById("lectureObjectiveCaption").textContent = "Livre actuel";
  const sel = document.getElementById("bookSelect");
  populateSelect(sel, config.books.map(b => ({id:b.id, label:b.title})), config.currentBookId);
  sel.onchange = () => { config.currentBookId = sel.value; lectureExpanded.idee = false; lectureExpanded.citation = false; saveConfig(config); renderLectureCard(); };

  const list = document.getElementById("lectureChecklist");
  list.innerHTML = "";
  list.appendChild(checkItem(LECTURE_TASKS[0], !!today.lectureDone.lire, (checked) => {
    today.lectureDone.lire = checked; persist(); renderProgress(); renderPills();
  }));
  list.appendChild(buildNoteItem("idee", "Noter une idée importante"));
  list.appendChild(buildNoteItem("citation", "Citation du jour"));

  const pagesRow = document.createElement("div");
  pagesRow.className = "check-item";
  pagesRow.style.cursor = "default";
  const book = currentBook();
  pagesRow.innerHTML = `
    <span class="txt"><span class="t">Avancement</span><span class="s">${today.lecturePages} / ${book ? book.totalPages : 0} pages</span></span>
  `;
  const input = document.createElement("input");
  input.type = "number"; input.min = "0"; input.value = today.lecturePages; input.style.width = "60px";
  input.addEventListener("change", () => {
    today.lecturePages = Math.max(0, parseInt(input.value)||0); persist(); renderLectureCard(); renderProgress();
  });
  pagesRow.appendChild(input);
  list.appendChild(pagesRow);

  const {done, total} = lectureCounts();
  document.getElementById("lectureProgTxt").textContent = `${done}/${total}`;
  document.getElementById("lectureProgBar").style.width = Math.round(done/total*100)+"%";
}

function lectureCounts(){
  const total = LECTURE_TASKS.length;
  const done = LECTURE_TASKS.filter(t => today.lectureDone[t.id]).length;
  return {done, total};
}

function renderCalendar(){
  const first = new Date(calYear, calMonth, 1);
  const startDow = (first.getDay()+6)%7; // Monday-first
  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  const daysInPrev = new Date(calYear, calMonth, 0).getDate();
  document.getElementById("calTitle").textContent = first.toLocaleDateString("fr-FR",{month:"long", year:"numeric"});

  const grid = document.getElementById("calGrid");
  grid.innerHTML = "";
  ["L","M","M","J","V","S","D"].forEach(d => {
    const el = document.createElement("div"); el.className = "dow"; el.textContent = d; grid.appendChild(el);
  });

  const todayStr = todayKey();
  const cells = [];
  for(let i=startDow-1;i>=0;i--) cells.push({n:daysInPrev-i, other:true});
  for(let n=1;n<=daysInMonth;n++) cells.push({n, other:false});
  let nextN = 1;
  while(cells.length % 7 !== 0) cells.push({n:nextN++, other:true});

  cells.forEach(c => {
    const el = document.createElement("div");
    el.className = "day" + (c.other ? " other" : "");
    el.textContent = c.n;
    if(!c.other){
      const key = calYear+"-"+String(calMonth+1).padStart(2,"0")+"-"+String(c.n).padStart(2,"0");
      if(key === todayStr) el.classList.add("today");
      if(key === viewKey && viewKey !== todayStr) el.classList.add("viewing");
      const rec = history[key];
      if(rec && (dayHasCategory(rec,"sport") || dayHasCategory(rec,"culture") || dayHasCategory(rec,"lecture"))) el.classList.add("has-data");
      el.classList.add("clickable");
      el.addEventListener("click", () => switchViewDay(key));
    }
    grid.appendChild(el);
  });
}
document.getElementById("calPrev").addEventListener("click", () => { calMonth--; if(calMonth<0){calMonth=11;calYear--;} renderCalendar(); });
document.getElementById("calNext").addEventListener("click", () => { calMonth++; if(calMonth>11){calMonth=0;calYear++;} renderCalendar(); });

function weeklyCatCount(cat){
  return last7Dates().filter(k => dayHasCategory(history[k], cat)).length;
}

function renderStatsMini(){
  const wrap = document.getElementById("statsMini");
  wrap.innerHTML = "";
  [["Sport","sport"],["Culture","culture"],["Lecture","lecture"]].forEach(([label,cat]) => {
    const n = weeklyCatCount(cat);
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `<div class="stat-label"><span>${label}</span><span class="n">${n} / 7</span></div><div class="bar"><div class="bar-fill" style="width:${n/7*100}%"></div></div>`;
    wrap.appendChild(row);
  });
}

function renderPills(){
  document.getElementById("pillSport").textContent = countLifetimeDays("sport");
  document.getElementById("pillCulture").textContent = countLifetimeDays("culture");
  document.getElementById("pillLecture").textContent = countLifetimeDays("lecture");
  document.getElementById("pillWird").textContent = countLifetimeDays("wird");
  renderStatsMini();
  renderCalendar();
}

function renderProgress(){
  const s = sportCounts(), c = cultureCounts(), l = lectureCounts(), w = wirdCounts();
  const total = s.total + c.total + l.total + w.total;
  const done = s.done + c.done + l.done + w.done;
  const pct = total ? Math.round(done/total*100) : 0;
  document.getElementById("progressPct").textContent = pct+"%";
  document.getElementById("progressBar").style.width = pct+"%";
  document.getElementById("progressSub").textContent = `${done} / ${total} tâches complétées`;
}

function renderWeeklyGoal(){
  document.getElementById("weeklyGoalText").textContent = config.weeklyGoal;
}
document.getElementById("weeklyGoalBtn").addEventListener("click", () => {
  const v = prompt("Objectif de la semaine :", config.weeklyGoal);
  if(v !== null && v.trim()){ config.weeklyGoal = v.trim(); saveConfig(config); renderWeeklyGoal(); }
});

document.getElementById("qaTask").addEventListener("click", () => {
  const v = prompt("Nouvelle tâche libre :");
  if(v && v.trim()){
    today.freeTasks.push({id:"free_"+Date.now(), label:v.trim(), done:false});
    persist();
    alert("Tâche ajoutée (visible dans la section Notes).");
    config.notes.unshift({id:"n_"+Date.now(), text:"Tâche libre : "+v.trim(), date:todayKey()});
    saveConfig(config);
  }
});
document.getElementById("qaNote").addEventListener("click", () => {
  const v = prompt("Nouvelle note :");
  if(v && v.trim()){
    config.notes.unshift({id:"n_"+Date.now(), text:v.trim(), date:todayKey()});
    saveConfig(config);
    goto("notes");
  }
});

function renderToday(){
  renderGreeting();
  renderSportChecklist(document.getElementById("sportChecklist"));
  renderSportProgress();
  renderCultureCard();
  renderLectureCard();
  renderWirdEverywhere();
  renderWeeklyGoal();
  renderProgress();
  renderPills();
}

/* ---------------- Render: Sport page ---------------- */

function homeToggleBtn(isOn, onClick){
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "home-toggle" + (isOn ? " on" : "");
  btn.textContent = isOn ? "✓ Sur l'accueil" : "+ Accueil";
  btn.title = isOn ? "Retirer de l'accueil" : "Ajouter à l'accueil";
  btn.addEventListener("click", onClick);
  return btn;
}

function renderSportPage(){
  renderSportCatalog();
  renderExtrasManager();
  renderGymManager();
}

function renderSportCatalog(){
  const wrap = document.getElementById("sportPageBody");
  if(!wrap) return;
  wrap.innerHTML = "";

  const cardioRow = document.createElement("div");
  cardioRow.className = "manage-row";
  cardioRow.innerHTML = `<span class="manage-label">Marche / Footing matinal</span>`;
  cardioRow.appendChild(homeToggleBtn(config.sportOnHome.cardio, () => {
    config.sportOnHome.cardio = !config.sportOnHome.cardio;
    saveConfig(config);
    renderSportCatalog();
    renderSportEverywhere();
  }));
  wrap.appendChild(cardioRow);

  const gymRow = document.createElement("div");
  gymRow.className = "manage-row";
  gymRow.innerHTML = `<span class="manage-label">Séance gym</span>`;
  gymRow.appendChild(homeToggleBtn(config.sportOnHome.gym, () => {
    config.sportOnHome.gym = !config.sportOnHome.gym;
    saveConfig(config);
    renderSportCatalog();
    renderSportEverywhere();
  }));
  wrap.appendChild(gymRow);
}

function renderExtrasManager(){
  const wrap = document.getElementById("extrasManager");
  if(!wrap) return;
  wrap.innerHTML = "";
  config.sportExtras.forEach(extra => {
    const row = document.createElement("div");
    row.className = "manage-row";
    row.innerHTML = `<span class="manage-label">${extra.label}</span>`;
    row.appendChild(homeToggleBtn(!!extra.onHome, () => {
      extra.onHome = !extra.onHome;
      saveConfig(config);
      renderExtrasManager();
      renderSportEverywhere();
    }));
    const editBtn = document.createElement("button");
    editBtn.type = "button"; editBtn.textContent = "✏️"; editBtn.title = "Renommer";
    editBtn.addEventListener("click", () => {
      const v = prompt("Nom de la routine :", extra.label);
      if(v && v.trim()){ extra.label = v.trim(); saveConfig(config); renderExtrasManager(); renderSportEverywhere(); }
    });
    const delBtn = document.createElement("button");
    delBtn.type = "button"; delBtn.textContent = "✕"; delBtn.title = "Supprimer";
    delBtn.addEventListener("click", () => {
      config.sportExtras = config.sportExtras.filter(x => x.id !== extra.id);
      saveConfig(config);
      delete today.sport.extras[extra.id];
      persist();
      renderExtrasManager(); renderSportEverywhere();
    });
    row.append(editBtn, delBtn);
    wrap.appendChild(row);
  });
  const addBtn = document.createElement("button");
  addBtn.type = "button"; addBtn.className = "add-btn"; addBtn.textContent = "+ Ajouter une routine";
  addBtn.addEventListener("click", () => {
    const v = prompt("Nom de la nouvelle routine :");
    if(v && v.trim()){
      config.sportExtras.push({id:"extra_"+Date.now(), label:v.trim(), onHome:false});
      saveConfig(config);
      renderExtrasManager(); renderSportEverywhere();
    }
  });
  wrap.appendChild(addBtn);
}

const gymRoutineExpanded = {};

function routineLogFor(routineId){
  if(!today.sport.gymLog[routineId]) today.sport.gymLog[routineId] = {};
  return today.sport.gymLog[routineId];
}

function renderGymManager(){
  const wrap = document.getElementById("gymManager");
  if(!wrap) return;
  wrap.innerHTML = "";
  config.gymTypes.forEach(t => {
    const expanded = !!gymRoutineExpanded[t.id];

    const card = document.createElement("div");
    card.className = "gym-routine-card";

    const head = document.createElement("div");
    head.className = "manage-row gym-routine-head";
    const label = document.createElement("span");
    label.className = "manage-label";
    label.style.cursor = "pointer";
    label.textContent = `${t.label}${t.exercises.length ? ` (${t.exercises.length} exo${t.exercises.length>1?"s":""})` : ""}`;
    label.addEventListener("click", () => {
      gymRoutineExpanded[t.id] = !gymRoutineExpanded[t.id];
      renderGymManager();
    });
    head.appendChild(label);

    const editBtn = document.createElement("button");
    editBtn.type = "button"; editBtn.textContent = "✏️"; editBtn.title = "Renommer";
    editBtn.addEventListener("click", () => {
      const v = prompt("Nom de la routine :", t.label);
      if(v && v.trim()){ t.label = v.trim(); saveConfig(config); renderGymManager(); renderSportEverywhere(); }
    });
    const delBtn = document.createElement("button");
    delBtn.type = "button"; delBtn.textContent = "✕"; delBtn.title = "Supprimer";
    delBtn.addEventListener("click", () => {
      config.gymTypes = config.gymTypes.filter(x => x.id !== t.id);
      saveConfig(config);
      if(today.sport.gymType === t.id){
        today.sport.gymType = config.gymTypes[0] ? config.gymTypes[0].id : "";
        persist();
      }
      renderGymManager(); renderSportEverywhere();
    });
    const chevron = document.createElement("span");
    chevron.className = "note-chevron";
    chevron.style.cursor = "pointer";
    chevron.textContent = expanded ? "▾" : "▸";
    chevron.addEventListener("click", () => {
      gymRoutineExpanded[t.id] = !gymRoutineExpanded[t.id];
      renderGymManager();
    });
    head.append(editBtn, delBtn, chevron);
    card.appendChild(head);

    if(expanded){
      const body = document.createElement("div");
      body.className = "gym-routine-body";
      const routineLog = routineLogFor(t.id);

      if(!t.exercises.length){
        body.innerHTML = `<p class="day-empty">Aucun exercice dans cette routine.</p>`;
      }else{
        t.exercises.forEach(exId => {
          const ex = EXERCISE_LIBRARY.find(e => e.id === exId);
          if(!ex) return;
          if(!routineLog[exId]) routineLog[exId] = [];
          const sets = routineLog[exId];

          const exCard = document.createElement("div");
          exCard.className = "exercise-log-card";
          const exHead = document.createElement("div");
          exHead.className = "exercise-log-head";
          exHead.innerHTML = `<span class="exercise-log-name">${ex.name}</span>`;
          const rmExBtn = document.createElement("button");
          rmExBtn.type = "button"; rmExBtn.textContent = "✕"; rmExBtn.title = "Retirer de la routine";
          rmExBtn.addEventListener("click", () => {
            t.exercises = t.exercises.filter(id => id !== exId);
            saveConfig(config);
            renderGymManager();
          });
          exHead.appendChild(rmExBtn);
          exCard.appendChild(exHead);

          const setsWrap = document.createElement("div");
          setsWrap.className = "exercise-log-sets";
          sets.forEach((set, i) => {
            const setRow = document.createElement("div");
            setRow.className = "exercise-set-row";
            setRow.innerHTML = `<span class="set-n">Série ${i+1}</span>`;
            const repsInput = document.createElement("input");
            repsInput.type = "number"; repsInput.min = "0"; repsInput.placeholder = "reps"; repsInput.value = set.reps || "";
            repsInput.addEventListener("change", () => { set.reps = Math.max(0, parseInt(repsInput.value)||0); persist(); });
            const weightInput = document.createElement("input");
            weightInput.type = "number"; weightInput.min = "0"; weightInput.step = "0.5"; weightInput.placeholder = config.weightUnit; weightInput.value = set.weight || "";
            weightInput.addEventListener("change", () => { set.weight = Math.max(0, parseFloat(weightInput.value)||0); persist(); });
            const delSetBtn = document.createElement("button");
            delSetBtn.type = "button"; delSetBtn.textContent = "✕"; delSetBtn.title = "Supprimer la série";
            delSetBtn.addEventListener("click", () => {
              sets.splice(i, 1);
              persist();
              renderGymManager();
            });
            setRow.append(repsInput, weightInput, delSetBtn);
            setsWrap.appendChild(setRow);
          });
          exCard.appendChild(setsWrap);

          const addSetBtn = document.createElement("button");
          addSetBtn.type = "button"; addSetBtn.className = "add-btn"; addSetBtn.textContent = "+ Ajouter une série";
          addSetBtn.addEventListener("click", () => {
            sets.push({reps:0, weight:0});
            persist();
            renderGymManager();
          });
          exCard.appendChild(addSetBtn);

          body.appendChild(exCard);
        });
      }

      const addExBtn = document.createElement("button");
      addExBtn.type = "button"; addExBtn.className = "add-btn"; addExBtn.textContent = "+ Ajouter un exercice";
      addExBtn.addEventListener("click", () => openExercisePicker(t.id));
      body.appendChild(addExBtn);

      card.appendChild(body);
    }

    wrap.appendChild(card);
  });
  const addBtn = document.createElement("button");
  addBtn.type = "button"; addBtn.className = "add-btn"; addBtn.textContent = "+ Ajouter une routine";
  addBtn.addEventListener("click", () => {
    const v = prompt("Nom de la nouvelle routine de gym :");
    if(v && v.trim()){
      config.gymTypes.push({id:"gym_"+Date.now(), label:v.trim(), exercises:[]});
      saveConfig(config);
      renderGymManager(); renderSportEverywhere();
    }
  });
  wrap.appendChild(addBtn);

  const unitSel = document.getElementById("weightUnitSelect");
  if(unitSel && unitSel.dataset.wired !== "1"){
    unitSel.dataset.wired = "1";
    unitSel.value = config.weightUnit;
    unitSel.addEventListener("change", () => {
      config.weightUnit = unitSel.value;
      saveConfig(config);
      renderGymManager();
    });
  }
  if(unitSel) unitSel.value = config.weightUnit;
}

let exercisePickerTargetRoutineId = null;
function openExercisePicker(routineId){
  exercisePickerTargetRoutineId = routineId;
  document.getElementById("exerciseSearchInput").value = "";
  renderExercisePickerList("");
  document.getElementById("exercisePickerOverlay").classList.add("open");
  document.getElementById("exerciseSearchInput").focus();
}
function closeExercisePicker(){
  document.getElementById("exercisePickerOverlay").classList.remove("open");
  exercisePickerTargetRoutineId = null;
}
document.getElementById("exercisePickerClose").addEventListener("click", closeExercisePicker);
document.getElementById("exercisePickerOverlay").addEventListener("click", (e) => {
  if(e.target.id === "exercisePickerOverlay") closeExercisePicker();
});
document.getElementById("exerciseSearchInput").addEventListener("input", (e) => {
  renderExercisePickerList(e.target.value);
});

function renderExercisePickerList(query){
  const wrap = document.getElementById("exercisePickerList");
  wrap.innerHTML = "";
  const q = query.trim().toLowerCase();
  const matches = EXERCISE_LIBRARY.filter(ex => !q || ex.name.toLowerCase().includes(q) || ex.muscle.toLowerCase().includes(q));
  if(!matches.length){
    wrap.innerHTML = `<p class="day-empty">Aucun exercice trouvé.</p>`;
    return;
  }
  matches.forEach(ex => {
    const row = document.createElement("div");
    row.className = "exercise-row";
    const info = document.createElement("div");
    info.className = "exercise-row-info";
    info.innerHTML = `<div class="exercise-row-name">${ex.name}</div><div class="exercise-row-muscle">${ex.muscle}</div>`;
    info.addEventListener("click", () => {
      const routine = config.gymTypes.find(t => t.id === exercisePickerTargetRoutineId);
      if(!routine) return;
      if(!routine.exercises.includes(ex.id)){
        routine.exercises.push(ex.id);
        saveConfig(config);
      }
      closeExercisePicker();
      renderGymManager();
    });
    const videoBtn = document.createElement("button");
    videoBtn.type = "button";
    videoBtn.className = "exercise-video-btn";
    videoBtn.textContent = "▶";
    videoBtn.title = "Voir une démo vidéo";
    videoBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const q2 = encodeURIComponent(ex.name + " exercise tutorial");
      window.open(`https://www.youtube.com/results?search_query=${q2}`, "_blank", "noopener");
    });
    row.append(info, videoBtn);
    wrap.appendChild(row);
  });
}

/* ---------------- Render: Culture page ---------------- */

function renderCulturePage(){
  const wrap = document.getElementById("pillars");
  wrap.innerHTML = "";
  Object.values(CULTURE_TOPICS).forEach(p => {
    const el = document.createElement("div");
    el.className = "pillar";
    el.innerHTML = `
      <button class="pillar-head" aria-expanded="false">
        <span class="rank">${p.rank}</span>
        <span class="pillar-title">${p.label}</span>
        <span class="pillar-day">${p.day}</span>
        <span class="pillar-chevron">›</span>
      </button>
      <div class="pillar-inner">
        <dl class="pillar-content">
          ${p.resources.map(r => `<div class="resource"><dt>${r.label}</dt><dd>${r.value}</dd></div>`).join("")}
        </dl>
      </div>
    `;
    const head = el.querySelector(".pillar-head");
    const inner = el.querySelector(".pillar-inner");
    head.addEventListener("click", () => {
      const isOpen = el.classList.toggle("open");
      head.setAttribute("aria-expanded", String(isOpen));
      inner.style.maxHeight = isOpen ? inner.scrollHeight+"px" : "0px";
    });
    wrap.appendChild(el);
  });
}

/* ---------------- Render: Lecture page ---------------- */

function renderLecturePage(){
  const wrap = document.getElementById("booksList");
  wrap.innerHTML = "";
  if(!config.books.length){ wrap.innerHTML = `<p class="empty">Aucun livre pour le moment.</p>`; return; }
  config.books.forEach(b => {
    const isCurrent = b.id === config.currentBookId;
    const notes = b.notes || [];
    const expanded = !!bookNotesExpanded[b.id];

    const el = document.createElement("div");
    el.className = "book-card" + (isCurrent ? " current" : "");

    const top = document.createElement("div");
    top.className = "book-card-top";
    top.innerHTML = `
      <div class="b-info">
        <div class="b-title">${b.title}${isCurrent ? " · en cours" : ""}</div>
        <div class="b-author">${b.author || ""} ${b.totalPages ? "— "+b.totalPages+" pages" : ""}</div>
      </div>
    `;
    if(!isCurrent){
      const btn = document.createElement("button");
      btn.textContent = "Lire maintenant";
      btn.addEventListener("click", () => { config.currentBookId = b.id; saveConfig(config); renderLecturePage(); });
      top.appendChild(btn);
    }
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️ Modifier";
    editBtn.addEventListener("click", () => {
      const title = prompt("Titre du livre :", b.title);
      if(!title || !title.trim()) return;
      const author = prompt("Auteur (optionnel) :", b.author || "");
      const pages = parseInt(prompt("Nombre de pages total :", b.totalPages || 0)) || 0;
      b.title = title.trim();
      b.author = (author || "").trim();
      b.totalPages = pages;
      saveConfig(config);
      renderLecturePage();
    });
    top.appendChild(editBtn);
    if(b.hasPdf){
      const readBtn = document.createElement("button");
      readBtn.textContent = "📖 Lire le PDF";
      readBtn.addEventListener("click", () => openPdfReader(b));
      top.appendChild(readBtn);
      const rmPdfBtn = document.createElement("button");
      rmPdfBtn.textContent = "🗑️ PDF";
      rmPdfBtn.title = "Supprimer le PDF";
      rmPdfBtn.addEventListener("click", async () => {
        await deletePdf(b.id);
        b.hasPdf = false;
        saveConfig(config);
        renderLecturePage();
      });
      top.appendChild(rmPdfBtn);
    }else{
      const uploadBtn = document.createElement("button");
      uploadBtn.textContent = "📄 Ajouter le PDF";
      uploadBtn.addEventListener("click", () => {
        pdfUploadTargetId = b.id;
        document.getElementById("pdfFileInput").click();
      });
      top.appendChild(uploadBtn);
    }
    const del = document.createElement("button");
    del.textContent = "Supprimer";
    del.addEventListener("click", () => {
      config.books = config.books.filter(x => x.id !== b.id);
      if(config.currentBookId === b.id) config.currentBookId = config.books[0] ? config.books[0].id : null;
      saveConfig(config);
      deletePdf(b.id);
      renderLecturePage();
    });
    top.appendChild(del);
    el.appendChild(top);

    const toggle = document.createElement("button");
    toggle.className = "book-notes-toggle";
    toggle.textContent = `${expanded ? "▾" : "▸"} ${notes.length} note${notes.length !== 1 ? "s" : ""}`;
    toggle.addEventListener("click", () => {
      bookNotesExpanded[b.id] = !bookNotesExpanded[b.id];
      renderLecturePage();
    });
    el.appendChild(toggle);

    if(expanded){
      if(!notes.length){
        const empty = document.createElement("p");
        empty.className = "book-notes-empty";
        empty.textContent = "Aucune note pour ce livre pour le moment.";
        el.appendChild(empty);
      }else{
        const list = document.createElement("div");
        list.className = "book-notes-list";
        notes.forEach(n => {
          const row = document.createElement("div");
          row.className = "book-note";
          row.innerHTML = `
            <span class="bn-icon">${n.type === "citation" ? "❝" : "💡"}</span>
            <span class="bn-body"><span class="bn-text"></span><span class="bn-date">${n.date}</span></span>
            <button class="bn-del" title="Supprimer">✕</button>
          `;
          row.querySelector(".bn-text").textContent = n.text;
          row.querySelector(".bn-del").addEventListener("click", () => {
            b.notes = b.notes.filter(x => x.id !== n.id);
            saveConfig(config);
            renderLecturePage();
          });
          list.appendChild(row);
        });
        el.appendChild(list);
      }
    }

    wrap.appendChild(el);
  });
}
document.getElementById("addBookBtn").addEventListener("click", () => {
  const title = prompt("Titre du livre :");
  if(!title || !title.trim()) return;
  const author = prompt("Auteur (optionnel) :") || "";
  const pages = parseInt(prompt("Nombre de pages total :","300")) || 0;
  const id = "b_"+Date.now();
  config.books.push({id, title:title.trim(), author:author.trim(), totalPages:pages});
  config.currentBookId = id;
  saveConfig(config);
  renderLecturePage();
});

let pdfUploadTargetId = null;
document.getElementById("pdfFileInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  e.target.value = "";
  if(!file || !pdfUploadTargetId) return;
  if(file.type !== "application/pdf"){ alert("Merci de choisir un fichier PDF."); return; }
  const book = config.books.find(b => b.id === pdfUploadTargetId);
  if(!book) return;
  await savePdf(book.id, file);
  book.hasPdf = true;
  saveConfig(config);
  pdfUploadTargetId = null;
  renderLecturePage();
});

async function openPdfReader(book){
  const blob = await getPdf(book.id);
  if(!blob){ alert("Aucun PDF trouvé pour ce livre."); return; }
  const url = URL.createObjectURL(blob);
  document.getElementById("pdfReaderTitle").textContent = book.title;
  document.getElementById("pdfFrame").src = url + "#view=FitH";
  goto("pdfreader");
}
document.getElementById("pdfReaderBack").addEventListener("click", () => {
  document.getElementById("pdfFrame").src = "";
  goto("lecture");
});
document.getElementById("pdfFullscreenBtn").addEventListener("click", () => {
  const frame = document.getElementById("pdfFrame");
  if(frame.requestFullscreen) frame.requestFullscreen();
});

/* ---------------- Render: Stats page ---------------- */

function renderStatsPage(){
  const wrap = document.getElementById("statsPageBody");
  wrap.innerHTML = "";

  const weekBlock = document.createElement("div");
  weekBlock.className = "routine-block";
  weekBlock.innerHTML = `<h3>Cette semaine</h3>`;
  [["Sport","sport"],["Culture","culture"],["Lecture","lecture"]].forEach(([label,cat]) => {
    const n = weeklyCatCount(cat);
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `<div class="stat-label"><span>${label}</span><span class="n">${n} / 7 jours</span></div><div class="bar"><div class="bar-fill" style="width:${n/7*100}%"></div></div>`;
    weekBlock.appendChild(row);
  });
  wrap.appendChild(weekBlock);

  const lifeBlock = document.createElement("div");
  lifeBlock.className = "routine-block";
  lifeBlock.innerHTML = `<h3>Depuis le début</h3>`;
  const totalDays = Object.keys(history).length;
  [["🔥 Sport","sport"],["🧠 Culture","culture"],["📖 Lecture","lecture"]].forEach(([label,cat]) => {
    const n = countLifetimeDays(cat);
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `<div class="stat-label"><span>${label}</span><span class="n">${n} jours</span></div>`;
    lifeBlock.appendChild(row);
  });
  const p = document.createElement("p");
  p.className = "card-sub"; p.style.marginTop = "8px";
  p.innerHTML = `<span class="caption">${totalDays} jour${totalDays>1?"s":""} suivi${totalDays>1?"s":""} au total</span>`;
  lifeBlock.appendChild(p);
  wrap.appendChild(lifeBlock);
}

/* ---------------- Render: Notes page ---------------- */

function renderNotesPage(){
  const wrap = document.getElementById("notesList");
  wrap.innerHTML = "";
  if(!config.notes.length){ wrap.innerHTML = `<p class="empty">Aucune note pour le moment.</p>`; return; }
  config.notes.forEach(n => {
    const el = document.createElement("div");
    el.className = "note-card";
    el.innerHTML = `<div><span class="n-text"></span><span class="n-date">${n.date}</span></div><button title="Supprimer">✕</button>`;
    el.querySelector(".n-text").textContent = n.text;
    el.querySelector("button").addEventListener("click", () => {
      config.notes = config.notes.filter(x => x.id !== n.id);
      saveConfig(config); renderNotesPage();
    });
    wrap.appendChild(el);
  });
}
document.getElementById("addNoteBtn").addEventListener("click", () => {
  const v = prompt("Nouvelle note :");
  if(v && v.trim()){
    config.notes.unshift({id:"n_"+Date.now(), text:v.trim(), date:todayKey()});
    saveConfig(config);
    renderNotesPage();
  }
});

/* ---------------- Render: Infos personnelles ---------------- */

function renderProfilePage(){
  document.getElementById("profileName").value = config.userName || "";
  document.getElementById("profileAge").value = config.userAge || "";
  document.getElementById("profileWeight").value = config.userWeight || "";
  document.getElementById("profileHeight").value = config.userHeight || "";
}
document.getElementById("profileName").addEventListener("change", (e) => {
  config.userName = e.target.value.trim();
  saveConfig(config);
  renderGreeting();
});
document.getElementById("profileAge").addEventListener("change", (e) => {
  config.userAge = e.target.value ? Math.max(0, parseInt(e.target.value)||0) : "";
  saveConfig(config);
});
document.getElementById("profileWeight").addEventListener("change", (e) => {
  config.userWeight = e.target.value ? Math.max(0, parseFloat(e.target.value)||0) : "";
  saveConfig(config);
});
document.getElementById("profileHeight").addEventListener("change", (e) => {
  config.userHeight = e.target.value ? Math.max(0, parseInt(e.target.value)||0) : "";
  saveConfig(config);
});

/* ---------------- Theme ---------------- */

function initTheme(){
  const btn = document.getElementById("themeToggle");
  let theme = "light";
  try{
    const stored = localStorage.getItem(THEME_KEY);
    if(stored) theme = JSON.parse(stored);
  }catch(e){}
  applyTheme(theme);
  btn.addEventListener("click", () => {
    const next = document.body.classList.contains("dark") ? "light" : "dark";
    applyTheme(next);
    try{ localStorage.setItem(THEME_KEY, JSON.stringify(next)); }
    catch(e){ console.error("Erreur de sauvegarde du thème", e); }
  });
}
function applyTheme(theme){
  document.body.classList.toggle("dark", theme === "dark");
  document.getElementById("themeToggle").title = theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre";
}

/* ---------------- Init ---------------- */

renderToday();
initTheme();

if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(e => console.error("Échec d'enregistrement du service worker", e));
  });
}

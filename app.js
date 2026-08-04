const USER_NAME = "Zaiid";
const DAY_NAMES = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];

const HISTORY_KEY = "zdash:history";
const CONFIG_KEY = "zdash:config";
const THEME_KEY = "zdash:theme";

/* ---------------- Static content ---------------- */

const SPORT_ROUTINES = {
  push: { label:"Push", exercises:[
    {id:"warmup", label:"Échauffement", meta:"10 min"},
    {id:"bench", label:"Développé couché", meta:"4 × 8"},
    {id:"incline", label:"Développé incliné", meta:"3 × 10"},
    {id:"shoulder", label:"Shoulder Press", meta:"3 × 10"},
    {id:"lateral", label:"Élévations latérales", meta:"3 × 15"},
    {id:"dips", label:"Dips", meta:"3 × max"},
    {id:"core", label:"Gainage", meta:"3 × 45 sec"},
  ]},
  pull: { label:"Pull", exercises:[
    {id:"warmup", label:"Échauffement", meta:"10 min"},
    {id:"pullups", label:"Tractions", meta:"4 × 6"},
    {id:"row", label:"Rowing barre", meta:"4 × 8"},
    {id:"latpull", label:"Tirage vertical", meta:"3 × 10"},
    {id:"curl", label:"Curl biceps", meta:"3 × 12"},
    {id:"facepull", label:"Face pull", meta:"3 × 15"},
    {id:"core", label:"Gainage", meta:"3 × 45 sec"},
  ]},
  legs: { label:"Legs", exercises:[
    {id:"warmup", label:"Échauffement", meta:"10 min"},
    {id:"squat", label:"Squat", meta:"4 × 8"},
    {id:"legpress", label:"Presse à cuisses", meta:"3 × 10"},
    {id:"lunges", label:"Fentes", meta:"3 × 12"},
    {id:"legcurl", label:"Leg curl", meta:"3 × 12"},
    {id:"calves", label:"Mollets", meta:"4 × 15"},
    {id:"core", label:"Gainage", meta:"3 × 45 sec"},
  ]},
  kettlebell: { label:"Kettlebell circuit", exercises:[
    {id:"warmup", label:"Échauffement", meta:"5 min"},
    {id:"swings", label:"Swings", meta:"5 × 15"},
    {id:"goblet", label:"Goblet squat", meta:"4 × 12"},
    {id:"cleanpress", label:"Clean & press", meta:"4 × 8"},
    {id:"row", label:"Rowing kettlebell", meta:"3 × 10"},
    {id:"tgu", label:"Turkish get-up", meta:"3 × 3"},
    {id:"core", label:"Gainage", meta:"3 × 45 sec"},
  ]},
  mobility_only: { label:"Mobilité seule", exercises:[
    {id:"morning", label:"Routine mobilité matinale", meta:"15 min"},
    {id:"hips", label:"Étirements hanches", meta:"5 min"},
    {id:"shoulders", label:"Étirements épaules", meta:"5 min"},
    {id:"breathing", label:"Respiration / relâchement", meta:"5 min"},
  ]},
  repos: { label:"Repos", exercises:[
    {id:"morning", label:"Routine mobilité matinale", meta:"15 min"},
    {id:"breathing", label:"Respiration / relâchement", meta:"5 min"},
  ]},
};

const CULTURE_TOPICS = {
  economie: { label:"Économie", rank:"01", day:"Lun · Mer",
    tasks:[
      {id:"lecture", label:"Lecture du jour", meta:"15 min", sub:`<a href="https://www.lemonde.fr/economie/" target="_blank" rel="noopener">Le Monde — Économie</a>`},
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
const ROUTINE_BY_WEEKDAY = {1:"push", 2:"pull", 3:"legs", 4:"kettlebell", 5:"push", 6:"mobility_only", 0:"repos"};

const LECTURE_TASKS = [
  {id:"lire", label:"Lire 15-20 min", meta:"15 min"},
  {id:"idee", label:"Noter une idée importante"},
  {id:"citation", label:"Citation du jour"},
];

const COMM_TIPS = {
  1:"Aujourd'hui : poser une question de relance au lieu de juste acquiescer",
  2:"Aujourd'hui : résumer une idée complexe en une phrase simple",
  3:"Aujourd'hui : reformuler ce que l'autre vient de dire avant de répondre",
  4:"Aujourd'hui : admettre un point que tu ne connais pas, avec curiosité",
  5:"Aujourd'hui : varier le registre — parler légèrement d'un sujet sérieux",
  6:"Aujourd'hui : creuser une couche de plus avec un 'pourquoi selon toi ?'",
  0:"Aujourd'hui : qu'est-ce que tu as retenu ? Qu'est-ce que tu veux creuser la semaine prochaine ?",
};

const HABITS_CONFIG = [
  {id:"marche", icon:"🚶", label:"Marche", unit:"pas", type:"counter", target:8000},
  {id:"mobilite", icon:"🧘", label:"Mobilité", unit:"min", type:"counter", target:15},
  {id:"ecran", icon:"📵", label:"Pas d'écran avant 23h", type:"boolean"},
  {id:"sommeil", icon:"🌙", label:"Dormir avant 23h", type:"boolean"},
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

function emptyDay(){
  const d = new Date();
  return {
    sportRoutine: ROUTINE_BY_WEEKDAY[d.getDay()],
    sportDone:{},
    cultureTopic: TOPIC_BY_WEEKDAY[d.getDay()],
    cultureDone:{},
    lecturePages:0,
    lectureDone:{},
    habits:{},
    commsDone:false,
    commsTime:"",
    freeTasks:[],
  };
}

function loadConfig(){
  try{
    const c = JSON.parse(localStorage.getItem(CONFIG_KEY));
    if(c) return c;
  }catch(e){}
  return {
    books:[{id:"b1", title:"Prisoners of Geography", author:"Tim Marshall", totalPages:300}],
    currentBookId:"b1",
    notes:[],
    weeklyGoal:"Comprendre l'inflation et ses impacts",
  };
}
function saveConfig(c){
  try{ localStorage.setItem(CONFIG_KEY, JSON.stringify(c)); }
  catch(e){ console.error("Erreur de sauvegarde", e); }
}

let history = loadHistory();
let config = loadConfig();
const KEY = todayKey();
if(!history[KEY]) history[KEY] = emptyDay();
let today = history[KEY];

function persist(){
  history[KEY] = today;
  saveHistory(history);
}

let calMonth = new Date().getMonth();
let calYear = new Date().getFullYear();

/* ---------------- Router ---------------- */

function goto(page){
  document.querySelectorAll(".page").forEach(p => p.classList.toggle("active", p.dataset.page === page));
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  if(page === "sport") renderSportPage();
  if(page === "culture") renderCulturePage();
  if(page === "lecture") renderLecturePage();
  if(page === "habitudes") renderHabitsPage();
  if(page === "stats") renderStatsPage();
  if(page === "notes") renderNotesPage();
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

function dayHasCategory(rec, cat){
  if(!rec) return false;
  if(cat === "sport") return Object.values(rec.sportDone||{}).some(Boolean);
  if(cat === "culture") return Object.values(rec.cultureDone||{}).some(Boolean);
  if(cat === "lecture") return Object.values(rec.lectureDone||{}).some(Boolean) || (rec.lecturePages||0) > 0;
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
  document.getElementById("greeting").textContent = `Bonjour ${USER_NAME} 👋`;
  const d = new Date();
  document.getElementById("todayDate").textContent = DAY_NAMES[d.getDay()] + " " + d.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});
}

function populateSelect(sel, options, value){
  sel.innerHTML = options.map(o => `<option value="${o.id}">${o.label}</option>`).join("");
  sel.value = value;
}

function renderSportCard(){
  const sel = document.getElementById("routineSelect");
  populateSelect(sel, Object.keys(SPORT_ROUTINES).map(id => ({id, label:SPORT_ROUTINES[id].label})), today.sportRoutine);
  sel.onchange = () => { today.sportRoutine = sel.value; persist(); renderSportCard(); renderProgress(); };

  const routine = SPORT_ROUTINES[today.sportRoutine];
  const list = document.getElementById("sportChecklist");
  list.innerHTML = "";
  routine.exercises.forEach(ex => {
    list.appendChild(checkItem(ex, !!today.sportDone[ex.id], (checked) => {
      today.sportDone[ex.id] = checked; persist(); renderSportCard(); renderProgress(); renderPills();
    }));
  });
  const done = routine.exercises.filter(ex => today.sportDone[ex.id]).length;
  document.getElementById("sportProgTxt").textContent = `${done}/${routine.exercises.length}`;
  document.getElementById("sportProgBar").style.width = routine.exercises.length ? (done/routine.exercises.length*100)+"%" : "0%";
}

function renderCultureCard(){
  const sel = document.getElementById("topicSelect");
  populateSelect(sel, Object.keys(CULTURE_TOPICS).map(id => ({id, label:CULTURE_TOPICS[id].label})), today.cultureTopic);
  sel.onchange = () => { today.cultureTopic = sel.value; persist(); renderCultureCard(); renderProgress(); };

  const topic = CULTURE_TOPICS[today.cultureTopic];
  const list = document.getElementById("cultureChecklist");
  list.innerHTML = "";
  topic.tasks.forEach(t => {
    list.appendChild(checkItem(t, !!today.cultureDone[t.id], (checked) => {
      today.cultureDone[t.id] = checked; persist(); renderCultureCard(); renderProgress(); renderPills();
    }));
  });
  const done = topic.tasks.filter(t => today.cultureDone[t.id]).length;
  document.getElementById("cultureProgTxt").textContent = `${done}/${topic.tasks.length}`;
  document.getElementById("cultureProgBar").style.width = topic.tasks.length ? (done/topic.tasks.length*100)+"%" : "0%";
}

function currentBook(){
  return config.books.find(b => b.id === config.currentBookId) || config.books[0];
}

function renderLectureCard(){
  const sel = document.getElementById("bookSelect");
  populateSelect(sel, config.books.map(b => ({id:b.id, label:b.title})), config.currentBookId);
  sel.onchange = () => { config.currentBookId = sel.value; saveConfig(config); renderLectureCard(); };

  const list = document.getElementById("lectureChecklist");
  list.innerHTML = "";
  LECTURE_TASKS.forEach(t => {
    list.appendChild(checkItem(t, !!today.lectureDone[t.id], (checked) => {
      today.lectureDone[t.id] = checked; persist(); renderLectureCard(); renderProgress(); renderPills();
    }));
  });

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

  const doneCount = LECTURE_TASKS.filter(t => today.lectureDone[t.id]).length;
  document.getElementById("lectureProgTxt").textContent = `${today.lecturePages} / ${book ? book.totalPages : 0} pages`;
  document.getElementById("lectureProgBar").style.width = (book && book.totalPages) ? Math.min(100, today.lecturePages/book.totalPages*100)+"%" : "0%";
}

function renderCommCard(){
  document.getElementById("commTip").textContent = COMM_TIPS[new Date().getDay()];
  const box = document.getElementById("commCheckbox");
  box.checked = !!today.commsDone;
  document.getElementById("commCheck").classList.toggle("done", !!today.commsDone);
  document.getElementById("commTime").textContent = today.commsDone ? today.commsTime : "";
  box.onchange = () => {
    today.commsDone = box.checked;
    today.commsTime = box.checked ? new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}) : "";
    persist(); renderCommCard(); renderProgress();
  };
}

function renderHabitMiniCard(){
  const wrap = document.getElementById("habitList");
  wrap.innerHTML = "";
  HABITS_CONFIG.forEach(h => {
    const val = today.habits[h.id];
    const row = document.createElement("div");
    row.className = "habit-row";
    if(h.type === "boolean"){
      row.innerHTML = `<span class="emoji">${h.icon}</span><span class="h-label">${h.label}</span>`;
      const cb = document.createElement("input");
      cb.type = "checkbox"; cb.checked = !!val;
      cb.addEventListener("change", () => { today.habits[h.id] = cb.checked; persist(); renderProgress(); });
      row.appendChild(cb);
    }else{
      const ok = (val||0) >= h.target;
      row.innerHTML = `<span class="emoji">${h.icon}</span><span class="h-label">${h.label} ${h.target} ${h.unit}</span><span class="h-val ${ok?"ok":""}">${ok?"✓ ":""}${val||0}</span>`;
    }
    wrap.appendChild(row);
  });
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
      const rec = history[key];
      if(rec && (dayHasCategory(rec,"sport") || dayHasCategory(rec,"culture") || dayHasCategory(rec,"lecture"))) el.classList.add("has-data");
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
  renderStatsMini();
  renderCalendar();
}

function renderProgress(){
  const routine = SPORT_ROUTINES[today.sportRoutine];
  const topic = CULTURE_TOPICS[today.cultureTopic];
  let total = routine.exercises.length + topic.tasks.length + LECTURE_TASKS.length + HABITS_CONFIG.length + 1;
  let done = routine.exercises.filter(e => today.sportDone[e.id]).length
    + topic.tasks.filter(t => today.cultureDone[t.id]).length
    + LECTURE_TASKS.filter(t => today.lectureDone[t.id]).length
    + HABITS_CONFIG.filter(h => h.type==="boolean" ? !!today.habits[h.id] : (today.habits[h.id]||0) >= h.target).length
    + (today.commsDone ? 1 : 0);
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
  renderSportCard();
  renderCultureCard();
  renderLectureCard();
  renderCommCard();
  renderHabitMiniCard();
  renderWeeklyGoal();
  renderProgress();
  renderPills();
}

/* ---------------- Render: Sport page ---------------- */

function renderSportPage(){
  const wrap = document.getElementById("sportPageBody");
  wrap.innerHTML = "";
  Object.keys(SPORT_ROUTINES).forEach(id => {
    const routine = SPORT_ROUTINES[id];
    const block = document.createElement("div");
    block.className = "routine-block";
    const isToday = id === today.sportRoutine;
    block.innerHTML = `<h3>${routine.label}${isToday ? " — routine du jour" : ""}</h3>`;
    const list = document.createElement("div");
    list.className = "checklist";
    routine.exercises.forEach(ex => {
      list.appendChild(checkItem(ex, isToday && !!today.sportDone[ex.id], (checked) => {
        if(!isToday) return;
        today.sportDone[ex.id] = checked; persist(); renderProgress(); renderPills();
      }));
    });
    block.appendChild(list);
    wrap.appendChild(block);
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
    const pages = isCurrent ? today.lecturePages : 0;
    const el = document.createElement("div");
    el.className = "book-card" + (isCurrent ? " current" : "");
    el.innerHTML = `
      <div class="b-info">
        <div class="b-title">${b.title}${isCurrent ? " · en cours" : ""}</div>
        <div class="b-author">${b.author || ""} ${b.totalPages ? "— "+b.totalPages+" pages" : ""}</div>
      </div>
    `;
    if(!isCurrent){
      const btn = document.createElement("button");
      btn.textContent = "Lire maintenant";
      btn.addEventListener("click", () => { config.currentBookId = b.id; saveConfig(config); renderLecturePage(); });
      el.appendChild(btn);
    }
    const del = document.createElement("button");
    del.textContent = "Supprimer";
    del.addEventListener("click", () => {
      config.books = config.books.filter(x => x.id !== b.id);
      if(config.currentBookId === b.id) config.currentBookId = config.books[0] ? config.books[0].id : null;
      saveConfig(config); renderLecturePage();
    });
    el.appendChild(del);
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

/* ---------------- Render: Habitudes page ---------------- */

function renderHabitsPage(){
  const wrap = document.getElementById("habitsPageBody");
  wrap.innerHTML = "";
  const dates = last7Dates();

  const header = document.createElement("div");
  header.className = "habit-week";
  header.innerHTML = `<div></div>` + dates.map(k => {
    const d = new Date(k);
    return `<div style="text-align:center;color:var(--muted);">${DAY_NAMES[d.getDay()].slice(0,2)}</div>`;
  }).join("");
  wrap.appendChild(header);

  HABITS_CONFIG.forEach(h => {
    const row = document.createElement("div");
    row.className = "habit-week";
    let cells = `<div>${h.icon} ${h.label}</div>`;
    dates.forEach(k => {
      const rec = history[k];
      const val = rec ? rec.habits[h.id] : undefined;
      const ok = h.type === "boolean" ? !!val : (val||0) >= h.target;
      cells += `<div class="hw-dot ${ok ? "ok" : ""}"></div>`;
    });
    row.innerHTML = cells;
    wrap.appendChild(row);
  });

  const editBlock = document.createElement("div");
  editBlock.className = "routine-block";
  editBlock.innerHTML = `<h3>Aujourd'hui</h3>`;
  HABITS_CONFIG.forEach(h => {
    const val = today.habits[h.id];
    const row = document.createElement("div");
    row.className = "habit-row";
    if(h.type === "boolean"){
      row.innerHTML = `<span class="emoji">${h.icon}</span><span class="h-label">${h.label}</span>`;
      const cb = document.createElement("input");
      cb.type = "checkbox"; cb.checked = !!val;
      cb.addEventListener("change", () => { today.habits[h.id] = cb.checked; persist(); renderPills(); });
      row.appendChild(cb);
    }else{
      row.innerHTML = `<span class="emoji">${h.icon}</span><span class="h-label">${h.label} (objectif ${h.target} ${h.unit})</span>`;
      const input = document.createElement("input");
      input.type = "number"; input.min = "0"; input.value = val||0;
      input.addEventListener("change", () => { today.habits[h.id] = Math.max(0, parseInt(input.value)||0); persist(); renderPills(); });
      row.appendChild(input);
    }
    editBlock.appendChild(row);
  });
  wrap.appendChild(editBlock);
}

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
  document.getElementById("themeToggle").textContent = theme === "dark" ? "☀️" : "🌙";
}

/* ---------------- Init ---------------- */

renderToday();
initTheme();

if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(e => console.error("Échec d'enregistrement du service worker", e));
  });
}

const USER_NAME = "Zaiid";
const DAY_NAMES = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];

const HISTORY_KEY = "zdash:history";
const CONFIG_KEY = "zdash:config";
const THEME_KEY = "zdash:theme";

/* ---------------- Static content ---------------- */

const GYM_TYPES = { push:"Push", pull:"Pull", legs:"Legs", kettlebell:"Kettlebell circuit" };
const GYM_BY_WEEKDAY = {1:"push", 2:"pull", 3:"legs", 4:"kettlebell", 5:"push", 6:"legs", 0:"pull"};

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

function emptyDay(){
  const d = new Date();
  return {
    sport:{
      cardioType:"marche", cardioDistance:0, cardioDuration:0, cardioDone:false,
      mobilityDone:false,
      gymType: GYM_BY_WEEKDAY[d.getDay()], gymDone:false,
    },
    cultureTopic: TOPIC_BY_WEEKDAY[d.getDay()],
    cultureDone:{},
    lecturePages:0,
    lectureDone:{},
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
if(!today.sport) today.sport = emptyDay().sport;
config.books.forEach(b => { if(!b.notes) b.notes = []; });
if(!config.cultureNotes) config.cultureNotes = [];

function persist(){
  history[KEY] = today;
  saveHistory(history);
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
  if(page === "sport") renderSportPage();
  if(page === "culture") renderCulturePage();
  if(page === "lecture") renderLecturePage();
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
  if(cat === "sport") return !!(rec.sport && (rec.sport.cardioDone || rec.sport.mobilityDone || rec.sport.gymDone));
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

function renderSportInto(container){
  container.innerHTML = "";
  const s = today.sport;

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

  const mobWrap = document.createElement("div");
  mobWrap.className = "sport-item" + (s.mobilityDone ? " done" : "");
  const mobLabel = document.createElement("label");
  mobLabel.className = "check-item" + (s.mobilityDone ? " done" : "");
  mobLabel.innerHTML = `<input type="checkbox" ${s.mobilityDone?"checked":""}><span class="txt"><span class="t">Routine mobilité</span></span>`;
  mobLabel.querySelector("input").addEventListener("change", (e) => {
    s.mobilityDone = e.target.checked; persist(); renderSportEverywhere();
  });
  mobWrap.appendChild(mobLabel);
  container.appendChild(mobWrap);

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
  gymSel.innerHTML = Object.keys(GYM_TYPES).map(id => `<option value="${id}">${GYM_TYPES[id]}</option>`).join("");
  gymSel.value = s.gymType;
  gymSel.addEventListener("change", (e) => { s.gymType = e.target.value; persist(); });
  gymDetail.appendChild(gymSel);
  gymWrap.appendChild(gymDetail);
  container.appendChild(gymWrap);
}

function renderSportProgress(){
  const s = today.sport;
  const done = [s.cardioDone, s.mobilityDone, s.gymDone].filter(Boolean).length;
  const bar = document.getElementById("sportProgBar");
  const txt = document.getElementById("sportProgTxt");
  if(bar) bar.style.width = (done >= 1 ? 100 : 0)+"%";
  if(txt) txt.textContent = done >= 1 ? `Objectif atteint ✓${done > 1 ? ` (+${done-1} bonus)` : ""}` : "Objectif : 1 case sur 3";
}

function renderSportEverywhere(){
  const cardContainer = document.getElementById("sportChecklist");
  if(cardContainer) renderSportInto(cardContainer);
  const pageContainer = document.getElementById("sportPageBody");
  if(pageContainer) renderSportInto(pageContainer);
  renderSportProgress();
  renderProgress();
  renderPills();
}

function buildCultureItem(task, kind){
  const topicId = today.cultureTopic;
  const notes = config.cultureNotes || [];
  const todayCount = notes.filter(n => n.topicId===topicId && n.taskId===task.id && n.date===todayKey()).length;
  const doneToday = !!today.cultureDone[task.id];
  const expanded = cultureExpanded[task.id];

  const wrap = document.createElement("div");
  wrap.className = "sport-item" + (doneToday ? " done" : "");

  const header = document.createElement("button");
  header.type = "button";
  header.className = "check-item note-item-head" + (doneToday ? " done" : "");
  header.innerHTML = `
    <span class="note-check">${doneToday ? "✅" : "☐"}</span>
    <span class="txt"><span class="t">${task.label}</span>${todayCount ? `<span class="s">${todayCount} ${kind==="title"?"titre":"note"}${todayCount>1?"s":""} aujourd'hui</span>` : (task.sub ? `<span class="s">${task.sub}</span>` : "")}</span>
    <span class="note-chevron">${expanded ? "▾" : "▸"}</span>
  `;
  header.addEventListener("click", () => {
    cultureExpanded[task.id] = !cultureExpanded[task.id];
    renderCultureCard();
  });
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
    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.textContent = "Enregistrer";
    saveBtn.className = "note-save-btn";
    saveBtn.addEventListener("click", () => {
      const text = input.value.trim();
      if(!text) return;
      if(!config.cultureNotes) config.cultureNotes = [];
      config.cultureNotes.unshift({id:"cnote_"+Date.now(), topicId, taskId:task.id, kind, text, date:todayKey()});
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
  const done = topic.tasks.filter(t => today.cultureDone[t.id]).length;
  document.getElementById("cultureObjectiveCaption").textContent = `Objectif : 1 tâche sur ${topic.tasks.length} (le reste, c'est du bonus)`;
  document.getElementById("cultureProgTxt").textContent = done >= 1 ? `Objectif atteint ✓${done > 1 ? ` (+${done-1} bonus)` : ""}` : "Objectif : 1 tâche";
  document.getElementById("cultureProgBar").style.width = (done >= 1 ? 100 : 0)+"%";
}

function currentBook(){
  return config.books.find(b => b.id === config.currentBookId) || config.books[0];
}

function buildNoteItem(type, label){
  const book = currentBook();
  const todayCount = (book && book.notes) ? book.notes.filter(n => n.type===type && n.date===todayKey()).length : 0;
  const doneToday = !!today.lectureDone[type];
  const expanded = lectureExpanded[type];

  const wrap = document.createElement("div");
  wrap.className = "sport-item" + (doneToday ? " done" : "");

  const header = document.createElement("button");
  header.type = "button";
  header.className = "check-item note-item-head" + (doneToday ? " done" : "");
  header.innerHTML = `
    <span class="note-check">${doneToday ? "✅" : "☐"}</span>
    <span class="txt"><span class="t">${label}</span>${todayCount ? `<span class="s">${todayCount} note${todayCount>1?"s":""} aujourd'hui</span>` : ""}</span>
    <span class="note-chevron">${expanded ? "▾" : "▸"}</span>
  `;
  header.addEventListener("click", () => {
    lectureExpanded[type] = !lectureExpanded[type];
    renderLectureCard();
  });
  wrap.appendChild(header);

  if(expanded){
    const body = document.createElement("div");
    body.className = "note-item-body";
    const textarea = document.createElement("textarea");
    textarea.rows = 2;
    textarea.placeholder = type==="idee" ? "Écris ton idée…" : "Écris la citation…";
    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.textContent = "Enregistrer";
    saveBtn.className = "note-save-btn";
    saveBtn.addEventListener("click", () => {
      const text = textarea.value.trim();
      if(!text) return;
      if(!book){ alert("Ajoute d'abord un livre dans ta bibliothèque."); return; }
      if(!book.notes) book.notes = [];
      book.notes.unshift({id:"note_"+Date.now(), type, text, date:todayKey()});
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

  const doneCount = LECTURE_TASKS.filter(t => today.lectureDone[t.id]).length;
  document.getElementById("lectureProgTxt").textContent = doneCount >= 1 ? `Objectif atteint ✓${doneCount > 1 ? ` (+${doneCount-1} bonus)` : ""}` : "Objectif : 1 tâche sur 3";
  document.getElementById("lectureProgBar").style.width = (doneCount >= 1 ? 100 : 0)+"%";
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
      el.classList.add("clickable");
      el.addEventListener("click", () => openDayModal(key));
    }
    grid.appendChild(el);
  });
}
document.getElementById("calPrev").addEventListener("click", () => { calMonth--; if(calMonth<0){calMonth=11;calYear--;} renderCalendar(); });
document.getElementById("calNext").addEventListener("click", () => { calMonth++; if(calMonth>11){calMonth=0;calYear++;} renderCalendar(); });

function openDayModal(key){
  const [y,m,d] = key.split("-").map(Number);
  const dateObj = new Date(y, m-1, d);
  document.getElementById("dayModalTitle").textContent = DAY_NAMES[dateObj.getDay()] + " " + dateObj.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});

  const rec = key === KEY ? today : history[key];
  const body = document.getElementById("dayModalBody");

  if(!rec){
    body.innerHTML = `<p class="day-empty">Aucune donnée enregistrée ce jour-là.</p>`;
  }else{
    const sections = [];

    if(rec.sport){
      const s = rec.sport;
      const items = [];
      items.push(`<li class="${s.cardioDone?"ok":"no"}">${s.cardioDone?"✅":"☐"} ${s.cardioType==="footing"?"Footing":"Marche"}${(s.cardioDistance||s.cardioDuration)?` — ${s.cardioDistance||0} km / ${s.cardioDuration||0} min`:""}</li>`);
      items.push(`<li class="${s.mobilityDone?"ok":"no"}">${s.mobilityDone?"✅":"☐"} Routine mobilité</li>`);
      items.push(`<li class="${s.gymDone?"ok":"no"}">${s.gymDone?"✅":"☐"} Séance gym${s.gymType?` (${GYM_TYPES[s.gymType]||s.gymType})`:""}</li>`);
      sections.push(`<div class="day-section"><h4>🏋️ Sport</h4><ul>${items.join("")}</ul></div>`);
    }

    if(rec.cultureTopic){
      const topic = CULTURE_TOPICS[rec.cultureTopic];
      const items = (topic ? topic.tasks : []).map(t => {
        const done = !!(rec.cultureDone && rec.cultureDone[t.id]);
        return `<li class="${done?"ok":"no"}">${done?"✅":"☐"} ${t.label}</li>`;
      });
      sections.push(`<div class="day-section"><h4>🧠 Culture — ${topic ? topic.label : rec.cultureTopic}</h4><ul>${items.join("")}</ul></div>`);
    }

    const lectureItems = LECTURE_TASKS.map(t => {
      const done = !!(rec.lectureDone && rec.lectureDone[t.id]);
      return `<li class="${done?"ok":"no"}">${done?"✅":"☐"} ${t.label}</li>`;
    });
    lectureItems.push(`<li class="ok">📄 Avancement : ${rec.lecturePages||0} pages</li>`);
    sections.push(`<div class="day-section"><h4>📖 Lecture</h4><ul>${lectureItems.join("")}</ul></div>`);

    body.innerHTML = sections.join("");
  }

  document.getElementById("dayModalOverlay").classList.add("open");
}

function closeDayModal(){
  document.getElementById("dayModalOverlay").classList.remove("open");
}
document.getElementById("dayModalClose").addEventListener("click", closeDayModal);
document.getElementById("dayModalOverlay").addEventListener("click", (e) => {
  if(e.target.id === "dayModalOverlay") closeDayModal();
});

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
  const topic = CULTURE_TOPICS[today.cultureTopic];
  const sportObjectiveMet = (today.sport.cardioDone || today.sport.mobilityDone || today.sport.gymDone) ? 1 : 0;
  const cultureObjectiveMet = topic.tasks.some(t => today.cultureDone[t.id]) ? 1 : 0;
  const lectureObjectiveMet = LECTURE_TASKS.some(t => today.lectureDone[t.id]) ? 1 : 0;
  let total = 3;
  let done = sportObjectiveMet + cultureObjectiveMet + lectureObjectiveMet;
  const pct = total ? Math.round(done/total*100) : 0;
  document.getElementById("progressPct").textContent = pct+"%";
  document.getElementById("progressBar").style.width = pct+"%";
  document.getElementById("progressSub").textContent = `${done} / ${total} objectifs atteints`;
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
  renderSportInto(document.getElementById("sportChecklist"));
  renderSportProgress();
  renderCultureCard();
  renderLectureCard();
  renderWeeklyGoal();
  renderProgress();
  renderPills();
}

/* ---------------- Render: Sport page ---------------- */

function renderSportPage(){
  renderSportInto(document.getElementById("sportPageBody"));
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
    const del = document.createElement("button");
    del.textContent = "Supprimer";
    del.addEventListener("click", () => {
      config.books = config.books.filter(x => x.id !== b.id);
      if(config.currentBookId === b.id) config.currentBookId = config.books[0] ? config.books[0].id : null;
      saveConfig(config); renderLecturePage();
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

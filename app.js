const DAY_NAMES = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];

const dailyTasks = {
  1:[{id:"lecture",label:"Lecture du jour",pillar:"Économie",sub:`<a href="https://www.lemonde.fr/economie/" target="_blank" rel="noopener">Le Monde — Économie</a>, un article lu jusqu'au bout`},
     {id:"technique",label:"Technique de conversation",pillar:"Habitude",sub:"Aujourd'hui : poser une question de relance au lieu de juste acquiescer"}],
  2:[{id:"podcast",label:"Podcast trajet",pillar:"Géopolitique",sub:`<a href="https://www.arte.tv/fr/videos/RC-014036/le-dessous-des-cartes/" target="_blank" rel="noopener">Le Dessous des Cartes</a> — un épisode`},
     {id:"technique",label:"Technique de conversation",pillar:"Habitude",sub:"Aujourd'hui : résumer une idée complexe en une phrase simple"}],
  3:[{id:"lecture",label:"Lecture du jour",pillar:"Économie",sub:`<a href="https://www.lemonde.fr/economie/" target="_blank" rel="noopener">Le Monde — Économie</a>, un article lu jusqu'au bout`},
     {id:"technique",label:"Technique de conversation",pillar:"Habitude",sub:"Aujourd'hui : reformuler ce que l'autre vient de dire avant de répondre"}],
  4:[{id:"podcast",label:"Podcast trajet",pillar:"Géopolitique",sub:`<a href="https://www.arte.tv/fr/videos/RC-014036/le-dessous-des-cartes/" target="_blank" rel="noopener">Le Dessous des Cartes</a> — un épisode`},
     {id:"technique",label:"Technique de conversation",pillar:"Habitude",sub:"Aujourd'hui : admettre un point que tu ne connais pas, avec curiosité"}],
  5:[{id:"lecture",label:"Lecture du jour",pillar:"Militaire",sub:`<a href="https://www.areion24.news/" target="_blank" rel="noopener">Areion24 / DSI</a>, un article de fond`},
     {id:"technique",label:"Technique de conversation",pillar:"Habitude",sub:"Aujourd'hui : varier le registre — parler légèrement d'un sujet sérieux"}],
  6:[{id:"veille",label:"Veille tech",pillar:"Tech",sub:`<a href="https://techcrunch.com/" target="_blank" rel="noopener">TechCrunch</a> ou podcast tech francophone (Underscore_)`},
     {id:"technique",label:"Technique de conversation",pillar:"Habitude",sub:"Aujourd'hui : creuser une couche de plus avec un 'pourquoi selon toi ?'"}],
  0:[{id:"livre",label:"Lecture livre en cours",pillar:"Fond",sub:"30–45 min sur le livre du moment (économie, géopolitique ou stratégie)"},
     {id:"bilan",label:"Bilan de la semaine",pillar:"Habitude",sub:"Qu'est-ce que tu as retenu ? Qu'est-ce que tu veux creuser la semaine prochaine ?"}]
};

const routineLabels = {
  repos:"Repos", push:"Push", pull:"Pull", legs:"Legs",
  kettlebell:"Kettlebell circuit", mobility_only:"Mobilité seule"
};

function sportTasksFor(routine){
  const tasks = [
    { id:"mobility", label:"Routine mobilité matinale", pillar:"Sport",
      sub: routine === "repos" ? "Jour de repos — mobilité seule recommandée" : "À faire au réveil, avant le reste" }
  ];
  if(routine !== "repos" && routine !== "mobility_only"){
    tasks.push({ id:"session", label:`Séance ${routineLabels[routine]}`, pillar:"Sport",
      sub:"À tracker dans Hevy (PPL + kettlebell circuit)" });
  }
  return tasks;
}

const pillarsData = [
  { rank:"01", name:"Économie", day:"Lun · Mer", resources:[
    { label:"Média", value:`<a href="https://www.lemonde.fr/economie/" target="_blank" rel="noopener">Le Monde — Économie</a>` },
    { label:"Podcast", value:`<a href="https://www.radiofrance.fr/franceculture/podcasts/entendez-vous-l-eco" target="_blank" rel="noopener">Entendez-vous l'éco ?</a> (France Culture)` },
    { label:"Livre", value:"L'Économie pour les Nuls — pour poser les bases" }
  ]},
  { rank:"02", name:"Géopolitique", day:"Mar · Jeu", resources:[
    { label:"Média", value:`<a href="https://www.courrierinternational.com/" target="_blank" rel="noopener">Courrier International</a> + <a href="https://www.jeuneafrique.com/" target="_blank" rel="noopener">Jeune Afrique</a>` },
    { label:"Podcast", value:`<a href="https://www.arte.tv/fr/videos/RC-014036/le-dessous-des-cartes/" target="_blank" rel="noopener">Le Dessous des Cartes</a> (Arte)` },
    { label:"Livre", value:"Atlas géopolitique — Pascal Boniface" }
  ]},
  { rank:"03", name:"Militaire / Stratégie", day:"Ven", resources:[
    { label:"Média", value:`<a href="https://www.areion24.news/" target="_blank" rel="noopener">Areion24 / DSI</a>` },
    { label:"Podcast", value:`<a href="https://www.irsem.fr/le-collimateur.html" target="_blank" rel="noopener">Le Collimateur</a> (IRSEM)` },
    { label:"Livre", value:"Stratégie — Lawrence Freedman" }
  ]},
  { rank:"04", name:"Technologie", day:"Weekend", resources:[
    { label:"Média", value:`<a href="https://techcrunch.com/" target="_blank" rel="noopener">TechCrunch</a>` },
    { label:"Podcast", value:"Underscore_ — tech francophone" },
    { label:"Note", value:"Ton expérience terrain (n8n, API Claude) compte comme veille active" }
  ]}
];

const STORAGE_KEY = "culture-tracker:daily";
const THEME_KEY = "culture-tracker:theme";

function todayKey(){
  const d = new Date();
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}

function loadState(){
  const key = todayKey();
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return { date:key, tasks:{}, routine:"repos" };
    const parsed = JSON.parse(raw);
    if(parsed.date !== key) return { date:key, tasks:{}, routine:"repos" };
    if(!parsed.routine) parsed.routine = "repos";
    return parsed;
  }catch(e){
    return { date:key, tasks:{}, routine:"repos" };
  }
}

function saveState(state){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch(e){ console.error("Erreur de sauvegarde", e); }
}

function renderHeaderDate(){
  const d = new Date();
  document.getElementById("todayDay").textContent = DAY_NAMES[d.getDay()];
  document.getElementById("todayDate").textContent = d.toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});
}

function buildTodoItem(task, checked, onToggle){
  const row = document.createElement("label");
  row.className = "todo-item" + (checked ? " done" : "");
  row.innerHTML = `
    <input type="checkbox" ${checked ? "checked" : ""}>
    <span class="todo-main">
      <span class="todo-label">${task.label}</span>
      <span class="todo-sub">${task.sub}</span>
    </span>
    <span class="todo-pillar">${task.pillar}</span>
  `;
  row.querySelector("input").addEventListener("change", (e) => {
    row.classList.toggle("done", e.target.checked);
    onToggle(e.target.checked);
  });
  return row;
}

let currentState = null;

function renderAll(){
  currentState = loadState();
  const d = new Date();
  const cTasks = dailyTasks[d.getDay()];
  const sTasks = sportTasksFor(currentState.routine);

  document.getElementById("routineSelect").value = currentState.routine;

  const cList = document.getElementById("cultureList");
  cList.innerHTML = "";
  cTasks.forEach(t => {
    cList.appendChild(buildTodoItem(t, !!currentState.tasks[t.id], (checked) => {
      currentState.tasks[t.id] = checked;
      currentState.date = todayKey();
      saveState(currentState);
      updateStatus(cTasks, sTasks);
    }));
  });

  const sList = document.getElementById("sportList");
  sList.innerHTML = "";
  sTasks.forEach(t => {
    sList.appendChild(buildTodoItem(t, !!currentState.tasks[t.id], (checked) => {
      currentState.tasks[t.id] = checked;
      currentState.date = todayKey();
      saveState(currentState);
      updateStatus(cTasks, sTasks);
    }));
  });

  updateStatus(cTasks, sTasks);
}

function updateStatus(cTasks, sTasks){
  const all = [...cTasks, ...sTasks];
  const done = all.filter(t => currentState.tasks[t.id]).length;
  document.getElementById("todayStatus").textContent = `${done} / ${all.length} tâches faites aujourd'hui`;
}

document.getElementById("routineSelect").addEventListener("change", (e) => {
  currentState = currentState || loadState();
  currentState.routine = e.target.value;
  currentState.date = todayKey();
  saveState(currentState);
  renderAll();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  saveState({ date: todayKey(), tasks:{}, routine:"repos" });
  renderAll();
});

function renderPillars(){
  const container = document.getElementById("pillars");
  container.innerHTML = "";
  pillarsData.forEach(p => {
    const el = document.createElement("div");
    el.className = "pillar";
    el.innerHTML = `
      <button class="pillar-head" aria-expanded="false">
        <span class="rank">${p.rank}</span>
        <span class="pillar-title">${p.name}</span>
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
      inner.style.maxHeight = isOpen ? inner.scrollHeight + "px" : "0px";
    });
    container.appendChild(el);
  });
}

function wireRefSection(id){
  const section = document.getElementById(id);
  const toggle = section.querySelector(".ref-toggle");
  const body = section.querySelector(".ref-body");
  toggle.addEventListener("click", () => {
    const isOpen = section.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    body.style.maxHeight = isOpen ? body.scrollHeight + "px" : "0px";
  });
}

function initTheme(){
  const btn = document.getElementById("themeToggle");
  let theme = "dark";
  try{
    const stored = localStorage.getItem(THEME_KEY);
    if(stored) theme = JSON.parse(stored);
  }catch(e){ /* pas de thème enregistré encore */ }
  applyTheme(theme);
  btn.addEventListener("click", () => {
    const next = document.body.classList.contains("light") ? "dark" : "light";
    applyTheme(next);
    try{ localStorage.setItem(THEME_KEY, JSON.stringify(next)); }
    catch(e){ console.error("Erreur de sauvegarde du thème", e); }
  });
}

function applyTheme(theme){
  document.body.classList.toggle("light", theme === "light");
  document.getElementById("themeToggle").textContent = theme === "light" ? "Mode sombre" : "Mode clair";
}

renderHeaderDate();
renderAll();
renderPillars();
wireRefSection("rosterSection");
wireRefSection("pillarsSection");
initTheme();

if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(e => console.error("Échec d'enregistrement du service worker", e));
  });
}

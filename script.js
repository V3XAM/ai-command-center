function loadGeminiNativeTheme(){
  if(document.querySelector('link[href^="gemini-native.css"]')) return;
  const link=document.createElement("link");
  link.rel="stylesheet";
  link.href="gemini-native.css?v=4";
  document.head.appendChild(link);
}
loadGeminiNativeTheme();

let screens=[...document.querySelectorAll(".screen")];
let bottom=[...document.querySelectorAll(".nav-btn")];
const screenTitle=document.getElementById("screenTitle");
const drawer=document.getElementById("drawer");
const toast=document.getElementById("toast");
const titles={start:"AI Command Center",ai:"AI Workspace",agents:"Agenci i moduły",labs:"Google Skills",admin:"OpenAI Admin",linux:"Linux Terminal",notes:"Knowledge Base"};

function refreshDomRefs(){
  screens=[...document.querySelectorAll(".screen")];
  bottom=[...document.querySelectorAll(".nav-btn")];
}

function injectAgentsModule(){
  const drawerNav=document.querySelector(".drawer-nav");
  const bottomNav=document.querySelector(".bottom-nav");
  const main=document.querySelector(".content");

  if(drawerNav&&!drawerNav.querySelector('[data-tab="agents"]')){
    const btn=document.createElement("button");
    btn.dataset.tab="agents";
    btn.textContent="Agenci";
    const labsBtn=drawerNav.querySelector('[data-tab="labs"]');
    drawerNav.insertBefore(btn,labsBtn||null);
  }

  if(bottomNav&&!bottomNav.querySelector('[data-tab="agents"]')){
    const btn=document.createElement("button");
    btn.className="nav-btn";
    btn.dataset.tab="agents";
    btn.textContent="Agenci";
    const labsBtn=bottomNav.querySelector('[data-tab="labs"]');
    bottomNav.insertBefore(btn,labsBtn||null);
  }

  if(main&&!document.getElementById("agents")){
    const section=document.createElement("section");
    section.className="screen";
    section.id="agents";
    section.innerHTML=`
      <div class="hero-card compact"><div><p class="eyebrow">agent layer</p><h2>Agenci i moduły</h2><p>Lokalne moduły workflow teraz. Autonomiczne agenty później przez backend, żeby nie ujawniać kluczy API we frontendzie.</p></div><span class="status-pill violet">AGENTS</span></div>
      <div class="agent-grid">
        <article class="agent-card"><h4>AI Quality Agent</h4><p>Kontrola jakości odpowiedzi, założeń, zakresu i ryzyka halucynacji.</p><div class="agent-meta"><span>Prompt-based</span><span>Local</span></div></article>
        <article class="agent-card"><h4>Google Skills Agent</h4><p>Prowadzenie przez laby, checklisty zaliczenia i komendy do Cloud Shell.</p><div class="agent-meta"><span>Google Cloud</span><span>Labs</span></div></article>
        <article class="agent-card"><h4>Android Skills Agent</h4><p>Dobór skillów: AGP 9, R8, CameraX, Compose, Navigation, edge-to-edge.</p><div class="agent-meta"><span>Android</span><span>Gemini CLI</span></div></article>
        <article class="agent-card"><h4>Codex / GitHub Agent</h4><p>Planowanie zmian, PR-y, code review, dokumentacja i porządkowanie repozytorium.</p><div class="agent-meta"><span>Codex</span><span>GitHub</span></div></article>
        <article class="agent-card"><h4>Linux Bridge Agent</h4><p>Most do CLI: Gemini CLI, git, npm, Python, testy i narzędzia dev. Antigravity wymaga pełnego środowiska desktop/GUI Linux.</p><div class="agent-meta"><span>CLI</span><span>Cloud Shell</span></div></article>
        <article class="agent-card"><h4>Notes Agent</h4><p>Lokalne notatki, błędy, prompty, procedury i szybkie kopiowanie materiałów roboczych.</p><div class="agent-meta"><span>localStorage</span><span>PWA</span></div></article>
      </div>
      <article class="warning-panel"><strong>Architektura</strong><p>PWA zostaje szybkim panelem mobilnym. Natywna aplikacja Android ma sens jako etap 2: WebView/TWA + lokalny storage + backend Cloud Run/Firebase Functions dla prawdziwych agentów i sekretów.</p></article>`;
    const labs=document.getElementById("labs");
    main.insertBefore(section,labs||null);
  }

  refreshDomRefs();
}
injectAgentsModule();

function showToast(m="Gotowe"){
  toast.textContent=m;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1600);
}

function setTab(id){
  refreshDomRefs();
  screens.forEach(s=>s.classList.toggle("active",s.id===id));
  bottom.forEach(b=>b.classList.toggle("active",b.dataset.tab===id));
  screenTitle.textContent=titles[id]||"AI Command Center";
  drawer.classList.remove("open");
  localStorage.setItem("lastTab",id);
  window.scrollTo({top:0,behavior:"smooth"});
}

document.addEventListener("click",async e=>{
  const tab=e.target.closest("[data-tab]");
  if(tab)setTab(tab.dataset.tab);
  const open=e.target.closest("[data-open]");
  if(open)window.open(open.dataset.open,"_blank","noopener,noreferrer");
  const copy=e.target.closest("[data-copy]");
  if(copy){await navigator.clipboard.writeText(copy.dataset.copy);showToast("Skopiowano komendę")}
});

document.getElementById("menuButton").addEventListener("click",()=>drawer.classList.add("open"));
drawer.addEventListener("click",e=>{if(e.target===drawer)drawer.classList.remove("open")});
document.getElementById("fabButton").addEventListener("click",()=>{setTab("notes");showToast("Otwieram notatki")});

const aiPrompt=`Sprawdź jakość swojej odpowiedzi:
1. Czy dokładnie odpowiadasz na moje pytanie?
2. Jakie założenia przyjąłeś?
3. Gdzie możesz się mylić?
4. Czy to fakt, hipoteza czy interpretacja?
5. Czy nie zmieniłeś zakresu tematu?
6. Podaj wersję bardziej precyzyjną i techniczną.`;
document.getElementById("copyAiPrompt").addEventListener("click",async()=>{await navigator.clipboard.writeText(aiPrompt);showToast("Skopiowano prompt")});

const noteTitle=document.getElementById("noteTitle");
const quickNote=document.getElementById("quickNote");
const noteList=document.getElementById("noteList");
const noteCount=document.getElementById("noteCount");
const notesKey="aiCommandCenter.notes.v2";

function readNotes(){try{return JSON.parse(localStorage.getItem(notesKey)||"[]")}catch{return[]}}
function writeNotes(notes){localStorage.setItem(notesKey,JSON.stringify(notes))}
function formatNoteDate(value){return new Intl.DateTimeFormat("pl-PL",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"}).format(new Date(value))}
function migrateLegacyNotes(){
  const current=readNotes();
  if(current.length)return;
  const oldV1=JSON.parse(localStorage.getItem("aiCommandCenter.notes.v1")||"[]");
  const legacy=localStorage.getItem("quickNote");
  const migrated=[];
  if(Array.isArray(oldV1))oldV1.forEach(n=>migrated.push({...n,id:n.id||crypto.randomUUID()}));
  if(legacy)migrated.push({id:crypto.randomUUID(),title:"Zaimportowana notatka",body:legacy,createdAt:new Date().toISOString()});
  if(migrated.length){writeNotes(migrated);localStorage.removeItem("quickNote")}
}
function renderNotes(){
  const notes=readNotes();
  noteList.innerHTML="";
  noteCount.textContent=String(notes.length);
  if(!notes.length){const empty=document.createElement("p");empty.className="muted";empty.textContent="Brak zapisanych notatek.";noteList.appendChild(empty);return}
  notes.forEach(note=>{
    const card=document.createElement("article");card.className="note-card";
    const head=document.createElement("div");head.className="note-card-head";
    const title=document.createElement("h4");title.textContent=note.title||"Notatka";
    const date=document.createElement("span");date.className="status-pill blue";date.textContent=formatNoteDate(note.createdAt||new Date());
    head.append(title,date);
    const body=document.createElement("p");body.className="muted note-body";body.textContent=note.body||"";
    const actions=document.createElement("div");actions.className="note-actions";
    const copy=document.createElement("button");copy.className="note-action-btn";copy.type="button";copy.dataset.noteCopy=note.id;copy.textContent="Kopiuj";
    const del=document.createElement("button");del.className="note-action-btn danger";del.type="button";del.dataset.noteDelete=note.id;del.textContent="Usuń";
    actions.append(copy,del);card.append(head,body,actions);noteList.appendChild(card);
  });
}
migrateLegacyNotes();
renderNotes();

document.getElementById("saveNote").addEventListener("click",()=>{
  const body=quickNote.value.trim();
  if(!body){showToast("Notatka jest pusta");return}
  const title=noteTitle.value.trim()||body.split("\n")[0].slice(0,42)||"Notatka";
  const notes=readNotes();
  notes.unshift({id:crypto.randomUUID(),title,body,createdAt:new Date().toISOString()});
  writeNotes(notes);noteTitle.value="";quickNote.value="";renderNotes();showToast("Dodano notatkę");
});

document.addEventListener("click",async e=>{
  const copy=e.target.closest("[data-note-copy]");
  if(copy){const note=readNotes().find(n=>n.id===copy.dataset.noteCopy);if(note){await navigator.clipboard.writeText(`${note.title}\n\n${note.body}`);showToast("Skopiowano notatkę")}}
  const del=e.target.closest("[data-note-delete]");
  if(del){writeNotes(readNotes().filter(n=>n.id!==del.dataset.noteDelete));renderNotes();showToast("Usunięto notatkę")}
});

function checklistKey(input,index){const label=input.closest(".check-row")?.textContent.trim().replace(/\s+/g," ")||`check-${index}`;return `aiCommandCenter.checklist.${index}.${label}`}
function loadPersistentChecklists(){document.querySelectorAll(".check-row input[type='checkbox']").forEach((input,index)=>{const key=checklistKey(input,index);const saved=localStorage.getItem(key);if(saved!==null)input.checked=saved==="true";input.addEventListener("change",()=>{localStorage.setItem(key,String(input.checked));showToast(input.checked?"Zaznaczono i zapisano":"Odznaczono i zapisano")})})}
loadPersistentChecklists();

const lastTab=localStorage.getItem("lastTab");
if(lastTab&&document.getElementById(lastTab))setTab(lastTab);
if("serviceWorker"in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js?v=4").catch(()=>{}))}
let deferredPrompt;const installButton=document.getElementById("installButton");
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;installButton.textContent="↓";showToast("Aplikację można zainstalować")});
installButton.addEventListener("click",async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installButton.textContent="+"}else showToast("W Chrome wybierz: Dodaj do ekranu głównego")});

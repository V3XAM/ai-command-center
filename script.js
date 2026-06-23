const screens=[...document.querySelectorAll(".screen")];
const bottom=[...document.querySelectorAll(".nav-btn")];
const screenTitle=document.getElementById("screenTitle");
const drawer=document.getElementById("drawer");
const toast=document.getElementById("toast");
const titles={start:"AI Command Center",ai:"AI Workspace",labs:"Google Skills",admin:"OpenAI Admin",linux:"Linux Terminal",notes:"Knowledge Base"};
function injectMultiNoteStyles(){const style=document.createElement("style");style.textContent=`.note-title-input{width:100%;min-height:48px;padding:0 14px;border:1px solid var(--stroke);border-radius:18px;outline:none;color:var(--text);background:rgba(2,6,23,.55);margin-bottom:12px}.note-list{display:grid;gap:12px}.note-card{border:1px solid var(--stroke);border-radius:22px;padding:16px;background:rgba(17,24,39,.74)}.note-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px}.note-card-head h4{margin:0;font-size:15px;letter-spacing:-.03em;line-height:1.2}.note-body{white-space:pre-wrap;margin:0 0 12px}.note-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}.note-action-btn{min-height:42px;border:1px solid var(--stroke);border-radius:16px;background:rgba(15,23,42,.72);color:var(--cyan);font-weight:800}.note-action-btn.danger{color:#fb7185}.note-action-btn:active{transform:scale(.985)}`;document.head.appendChild(style)}
injectMultiNoteStyles();
function showToast(m="Gotowe"){toast.textContent=m;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1600)}
function setTab(id){screens.forEach(s=>s.classList.toggle("active",s.id===id));bottom.forEach(b=>b.classList.toggle("active",b.dataset.tab===id));screenTitle.textContent=titles[id]||"AI Command Center";drawer.classList.remove("open");localStorage.setItem("lastTab",id);window.scrollTo({top:0,behavior:"smooth"})}
document.addEventListener("click",async e=>{const tab=e.target.closest("[data-tab]");if(tab)setTab(tab.dataset.tab);const open=e.target.closest("[data-open]");if(open)window.open(open.dataset.open,"_blank","noopener,noreferrer");const copy=e.target.closest("[data-copy]");if(copy){await navigator.clipboard.writeText(copy.dataset.copy);showToast("Skopiowano komendę")}});
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
const notesKey="aiCommandCenter.notes.v1";
function readNotes(){try{return JSON.parse(localStorage.getItem(notesKey)||"[]")}catch{return[]}}
function writeNotes(notes){localStorage.setItem(notesKey,JSON.stringify(notes))}
function formatNoteDate(value){return new Intl.DateTimeFormat("pl-PL",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"}).format(new Date(value))}
function migrateLegacyNote(){const notes=readNotes();const legacy=localStorage.getItem("quickNote");if(!notes.length&&legacy){writeNotes([{id:String(Date.now()),title:"Zaimportowana notatka",body:legacy,createdAt:new Date().toISOString()}]);localStorage.removeItem("quickNote")}}
function renderNotes(){const notes=readNotes();noteList.innerHTML="";noteCount.textContent=String(notes.length);if(!notes.length){const empty=document.createElement("p");empty.className="muted";empty.textContent="Brak zapisanych notatek.";noteList.appendChild(empty);return}notes.forEach(note=>{const card=document.createElement("article");card.className="note-card";const head=document.createElement("div");head.className="note-card-head";const title=document.createElement("h4");title.textContent=note.title;const date=document.createElement("span");date.className="status-pill blue";date.textContent=formatNoteDate(note.createdAt);head.append(title,date);const body=document.createElement("p");body.className="muted note-body";body.textContent=note.body;const actions=document.createElement("div");actions.className="note-actions";const copy=document.createElement("button");copy.className="note-action-btn";copy.type="button";copy.dataset.noteCopy=note.id;copy.textContent="Kopiuj";const del=document.createElement("button");del.className="note-action-btn danger";del.type="button";del.dataset.noteDelete=note.id;del.textContent="Usuń";actions.append(copy,del);card.append(head,body,actions);noteList.appendChild(card)})}
migrateLegacyNote();
renderNotes();
document.getElementById("saveNote").addEventListener("click",()=>{const body=quickNote.value.trim();if(!body){showToast("Notatka jest pusta");return}const title=noteTitle.value.trim()||body.split("\n")[0].slice(0,42)||"Notatka";const notes=readNotes();notes.unshift({id:String(Date.now()),title,body,createdAt:new Date().toISOString()});writeNotes(notes);noteTitle.value="";quickNote.value="";renderNotes();showToast("Dodano notatkę")});
document.addEventListener("click",async e=>{const copy=e.target.closest("[data-note-copy]");if(copy){const note=readNotes().find(n=>n.id===copy.dataset.noteCopy);if(note){await navigator.clipboard.writeText(`${note.title}\n\n${note.body}`);showToast("Skopiowano notatkę")}}const del=e.target.closest("[data-note-delete]");if(del){writeNotes(readNotes().filter(n=>n.id!==del.dataset.noteDelete));renderNotes();showToast("Usunięto notatkę")}});
function checklistKey(input,index){const label=input.closest(".check-row")?.textContent.trim().replace(/\s+/g," ")||`check-${index}`;return `aiCommandCenter.checklist.${index}.${label}`}
function loadPersistentChecklists(){document.querySelectorAll(".check-row input[type='checkbox']").forEach((input,index)=>{const key=checklistKey(input,index);const saved=localStorage.getItem(key);if(saved!==null)input.checked=saved==="true";input.addEventListener("change",()=>{localStorage.setItem(key,String(input.checked));showToast(input.checked?"Zaznaczono i zapisano":"Odznaczono i zapisano")})})}
loadPersistentChecklists();
const lastTab=localStorage.getItem("lastTab");if(lastTab&&document.getElementById(lastTab))setTab(lastTab);
if("serviceWorker"in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}))}
let deferredPrompt;const installButton=document.getElementById("installButton");
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;installButton.textContent="↓";showToast("Aplikację można zainstalować")});
installButton.addEventListener("click",async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installButton.textContent="+"}else showToast("W Chrome wybierz: Dodaj do ekranu głównego")});
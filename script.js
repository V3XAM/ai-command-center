const screens=[...document.querySelectorAll(".screen")];
const bottom=[...document.querySelectorAll(".nav-btn")];
const screenTitle=document.getElementById("screenTitle");
const drawer=document.getElementById("drawer");
const toast=document.getElementById("toast");
const titles={start:"AI Command Center",ai:"AI Workspace",labs:"Google Skills",admin:"OpenAI Admin",linux:"Linux Terminal",notes:"Knowledge Base"};
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
const quickNote=document.getElementById("quickNote");
const savedNote=document.getElementById("savedNote");
function loadNote(){const n=localStorage.getItem("quickNote");if(n){quickNote.value=n;savedNote.textContent=n}}
loadNote();
document.getElementById("saveNote").addEventListener("click",()=>{const v=quickNote.value.trim();if(!v){showToast("Notatka jest pusta");return}localStorage.setItem("quickNote",v);savedNote.textContent=v;showToast("Zapisano lokalnie")});
const lastTab=localStorage.getItem("lastTab");if(lastTab&&document.getElementById(lastTab))setTab(lastTab);
if("serviceWorker"in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}))}
let deferredPrompt;const installButton=document.getElementById("installButton");
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;installButton.textContent="↓";showToast("Aplikację można zainstalować")});
installButton.addEventListener("click",async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installButton.textContent="+"}else showToast("W Chrome wybierz: Dodaj do ekranu głównego")});

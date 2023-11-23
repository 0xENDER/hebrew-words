/**
 * 
 * Manage the context menu
 * 
 **/

// Get needed elements and variables
const focusZone = document.getElementById("focus_zone"),
    pageCM = document.getElementById("menu_page"),
    rowCM = document.getElementById("menu_row");

// Hide all context menus when the 'focus zone' gains focus
focusZone.onmousedown = hideContextMenus;

// Wait for the context menu event
window.oncontextmenu = function(e){
    // Disable default context menu
    e.preventDefault();
    // Get source element (element the cursor is within)
    let srcElm = e.srcElement;
    if(![...srcElm.classList].includes("no-context-menu")){
        if(srcElm.tagName == "TD"){
            showContextMenu(e, rowCM);
        }else{
            showContextMenu(e, pageCM);
        }
    }
}
window.onclick = function(e){
    if([...e.srcElement.classList].includes("no-context-menu")){
        hideContextMenus();
    }
}
window.onblur = hideContextMenus;

// Hide all context menus
let activeCooldownIntrvs = [];
function hideContextMenus(){
    // Clear active cooldown intervals
    while(activeCooldownIntrvs.length != 0){
        clearInterval(activeCooldownIntrvs.pop());
    }
    // Hide menus
    focusZone.style.display = "none";
    let elms = document.getElementsByClassName("menu");
    for(let elm of elms){
        elm.style.display = "none";
    }
}

// Manage buttons cooldown
const cooldownedButtons = document.querySelectorAll("[cooldown]");
function activateCooldown(elm, i){
    // Disable element
    elm.setAttribute("disabled", "");
    let text = elm.getAttribute("cooldown"),
        tC = 3, t = -1;
    elm.textContent = `${text} (${tC}s)`;
    activeCooldownIntrvs.push(
        t = setInterval(function(){
            elm.textContent = `${text} (${--tC}s)`;
            if(tC <= 0){
                elm.removeAttribute("disabled", "");
                elm.textContent = text;
                clearInterval(t);
            }
        }, 1000)
    );
}
function activateCooldownAll(){
    for(let i = 0; i < cooldownedButtons.length; i++) {
        activateCooldown(cooldownedButtons[i]);
    }
}

// Show a context menu
function showContextMenu(e, elm){
    // Start countdown for buttons with "cooldown"
    activateCooldownAll();
    // Show context menu
    focusZone.style.display = null;
    elm.style.display = null;
    // Keep track of the saved elm
    elm.TARGET_ROW = e.srcElement.parentElement;
    // Change the position of the context menu
    setTimeout(() => {
        let x = (e.x + elm.clientWidth < window.innerWidth) ? e.x : e.x - elm.clientWidth;
        elm.style.top = e.y + "px";
        elm.style.left = x + "px";
    }, 0);
}

// Manage row status
// MOVE THIS CODE TO INTERFACE.JS
const redRowButton = document.getElementById("row-colour-red"),
    yellowRowButton = document.getElementById("row-colour-yellow"),
    greenRowButton = document.getElementById("row-colour-green"),
    blueRowButton = document.getElementById("row-colour-blue"),
    coloursList = ["none", "yellow", "red", "green", "blue"];
function replaceRowColour(rowElm, status){
    for (let c in coloursList){
        rowElm.classList.remove(coloursList[c]);
    }
    rowElm.classList.add(coloursList[status]);
}
function replaceRowsColour(rowElm, status){
    if(rowElm.id.includes("_")){
        replaceRowsColour(document.getElementById(rowElm.dataset.rank), status);
    }else{
        let l = Number(rowElm.dataset.rankC);
        replaceRowColour(rowElm, status);
        if(l > 1){
            let rank = rowElm.dataset.rank;
            for (let i = 0; i < l - 1; i++){
                console.log(`${rank}_${i + 1}`);
                replaceRowColour(document.getElementById(`${rank}_${i + 1}`), status);
            }
        }
    }
}
async function setRowColourStt(status){
    let rank = Number(rowCM.TARGET_ROW.dataset.rank)
    let r = await updateWrdIDB({rank, status});
    if(r != null){
        replaceRowsColour(rowCM.TARGET_ROW, status);
    }
}
yellowRowButton.onclick = () => setRowColourStt(1);
redRowButton.onclick = () => setRowColourStt(2);
greenRowButton.onclick = () => setRowColourStt(3);
blueRowButton.onclick = () => setRowColourStt(4);
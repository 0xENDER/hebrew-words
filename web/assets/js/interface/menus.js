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
function activateCooldown(elm){
    // Disable element
    elm.setAttribute("disabled", "");
    let text = elm.getAttribute("cooldown"),
        tC = Number(elm.getAttribute("cooldown-d")), t = -1;
    tC = (tC != 0) ? tC : 30;
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


// Get all rank rows
function getRankRows(rowElm, callback){
    if(rowElm.id.includes("_")){
        getRankRows(document.getElementById(rowElm.dataset.rank), callback);
    }else{
        let l = Number(rowElm.dataset.rankC);
        callback(rowElm);
        if(l > 1){
            let rank = rowElm.dataset.rank;
            for (let i = 0; i < l - 1; i++){
                callback(document.getElementById(`${rank}_${i + 1}`));
            }
        }
    }
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
    getRankRows(rowElm, function(row){
        replaceRowColour(row, status);
    });
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

// Reset list
const resetListButton = document.getElementById("reset-list");
resetListButton.onclick = function(){
    showPrompt("Reset List", "Would you like to reset the list completely, or just empty it?",
        ["Reset (Reload Required)", () => {
            deleteWrdsIDB(function(success, code){
                // For now, treat the `blocked` response as successful!
                if(success || code == 2){ // Dunno why dis keeps happening <(._.)>
                    window.location.reload();
                }else{
                    showPrompt("Reset Error!", `We couldn't reset your list! (${(code == 1) ? "Error" : "Blocked"})`,
                        ["Reload List", () => window.location.reload()]);
                }
            });
        }],
        ["Empty", async () => {
            let r = await removeAllWrdIDB();
            if(r){
                // Stop list updates
                terminateHeldListUpdates = true;
                // Empty the list on screen!
                let rows = document.getElementsByClassName("row");
                while(rows.length > 0){
                    rows[0].remove();
                }
                delete rows;
            }
        }]);
};

// Remove word from list
const removeWordButton = document.getElementById("remove-word-row");
function removeWordRowsFromList(rank){
    getRankRows(document.getElementById(rank + ""), function(row){
        row.remove();
    });
}
removeWordButton.onclick = async function(){
    let rank = rowCM.TARGET_ROW.dataset.rank;
    let r = await deleteWrdFromIDB(rank);
    if(r){
        removeWordRowsFromList(rank);
    }else{
        showPrompt("Error!", "We couldn't remove this word from your list!", ["Reload", () => window.location.reload()])
    }
};
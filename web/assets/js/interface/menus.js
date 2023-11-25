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
        if(srcElm.tagName == "TD" || srcElm.hasAttribute("row-menu")){
            // Fix target
            if(srcElm.hasAttribute("row-menu")){
                e = {...e, srcElement: srcElm.parentElement, y: e.y, x: e.x};
            }
            showContextMenu(e, rowCM);
            updateContextMenuColour();
            updateRowContextMenuMode();
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
        let y = (e.y + elm.clientHeight < window.innerHeight) ? e.y : e.y - elm.clientHeight;
        elm.style.top = y + "px";
        elm.style.left = x + "px";
    }, 0);
}

// Update context menu colour selector
const rowContextMenuColoursCon = document.getElementById("row-colour-container");
function updateContextMenuColour(){
    // Remove previous selection
    for(let i = 0; i < rowContextMenuColoursCon.children.length; i++){
        rowContextMenuColoursCon.children[i].classList.remove("selected");
    }
    //Add current selection
    let n = Number(rowCM.TARGET_ROW.dataset.status);
    if(n != 0){
        rowContextMenuColoursCon.children[n - 1].classList.add("selected");
    }
}

// Update the shown elements inside context menu (for input mode)
function updateRowContextMenuMode(){
    if(Number(rowCM.TARGET_ROW.dataset.rank) != 0){
        removeWordButton.style.display = null;
        readWordRowButton.style.display = null;
        copyWordRowButton.style.display = null;
    }else{
        removeWordButton.style.display = "none";
        readWordRowButton.style.display = "none";
        copyWordRowButton.style.display = "none";
    }
}

// Manage row status
// MOVE THIS CODE TO INTERFACE.JS
const redRowButton = document.getElementById("row-colour-red"),
    yellowRowButton = document.getElementById("row-colour-yellow"),
    greenRowButton = document.getElementById("row-colour-green"),
    blueRowButton = document.getElementById("row-colour-blue");
function isColourAlreadySelected(elm){
    return elm.classList.contains("selected");
}
async function setRowColourStt(elm, status){
    if(isColourAlreadySelected(elm)){
        status = 0;
    }
    let rank = Number(rowCM.TARGET_ROW.dataset.rank)
    // Exclude the input row!
    let r;
    if(rank != 0){
        r = await updateWrdIDB({rank, status});
    }else{
        r = true;
    }
    // Update row colour on screen
    if(r != null){
        replaceRowsColour(rowCM.TARGET_ROW, status);
    }
}
yellowRowButton.onclick = () => setRowColourStt(yellowRowButton, 1);
redRowButton.onclick = () => setRowColourStt(redRowButton, 2);
greenRowButton.onclick = () => setRowColourStt(greenRowButton, 3);
blueRowButton.onclick = () => setRowColourStt(blueRowButton, 4);

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
                let rows = TABLE_ELM.getElementsByClassName("ranked-row");
                while(rows.length > 0){
                    rows[0].remove();
                }
                delete rows;
            }
        }]);
};

// Remove word from list
const removeWordButton = document.getElementById("remove-word-row");
removeWordButton.onclick = async function(){
    let rank = rowCM.TARGET_ROW.dataset.rank;
    let r = await deleteWrdFromIDB(rank);
    if(r){
        removeWordRowsFromList(rank);
    }else{
        showPrompt("Error!", "We couldn't remove this word from your list!", ["Reload", () => window.location.reload()])
    }
};

// Import/Export list
const importExportListButton = document.getElementById("import-export-list");
importExportListButton.onclick = function(){
    showPrompt("Export/Import list!", "Note that newly imported lists will be combined with your current list!",
        ["Export", exportWrdsLst, true], ["Import", () => importWrdsLstFile(createWordRows), true], ["Cancel", () => {}, false]);
};

// Toggle words cover (English)
const toggleWordsCoverEngButton = document.getElementById("toggle-words-cover-enbglish");
toggleWordsCoverEngButton.onclick = function(){
    toggleWordsCoverEng();
};

// Read word
const readWordRowButton = document.getElementById("read-word-row");
readWordRowButton.onclick = function(){
    readText(getRowPValue(rowCM.TARGET_ROW, 3));
};

// Copy word
const copyWordRowButton = document.getElementById("copy-word-row");
copyWordRowButton.onclick = function(){
    copyText(getRowPValue(rowCM.TARGET_ROW, 3));
};
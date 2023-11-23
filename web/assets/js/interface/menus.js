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

// Show Row context menu
function showRowContextMenu(e, rowElm){
    showContextMenu();
}
// Show Page context menu
function showPageContextMenu(e) {
    //
}

// Hide all context menus
function hideContextMenus(){
    focusZone.style.display = "none";
    let elms = document.getElementsByClassName("menu");
    for(let elm of elms){
        elm.style.display = "none";
    }
}

// Show a context menu
function showContextMenu(e, elm){
    console.log(e.y, e.x);
    focusZone.style.display = null;
    elm.style.display = null;
    setTimeout(() => {
        let x = (e.x + elm.clientWidth < window.innerWidth) ? e.x : e.x - elm.clientWidth;
        elm.style.top = e.y + "px";
        elm.style.left = x + "px";
    }, 0);
}
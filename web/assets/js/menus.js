/**
 * 
 * Manage the context menu
 * 
 **/

// Wait for event
window.oncontextmenu = function(e){
    // Disable default context menu
    e.preventDefault();
    // Get source element (element the cursor is within)
    let srcElm = e.srcElement;
    if(srcElm.tagName == "TD"){
        showRowContextMenu(e, srcElm);
    }else{
        showPageContextMenu(e);
    }
}

// Show Row context menu
function showRowContextMenu(e, rowElm){
    //
}
// Show Page context menu
function showPageContextMenu(e) {
    //
}
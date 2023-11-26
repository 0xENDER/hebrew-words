/**
 * 
 * Manage dialogs
 * 
 ***/

// Show a prompt
function showPrompt(title, message, ...args){
    if(args.length == 0){
        // [(text)<String>, (callback)<Function>, (isPrimary)<Boolean>, (isDisabled)<Boolean>]
        args = [["Ok", () => {}]];
    }
    createDialogElement(title, message, ...args);
}

// Create dialog element
const DIALOG_ZONE = document.getElementById("dialog_zone");
let dialogC = 0;
function addDialogButton(inp){
    const buttonElm = document.createElement("button");
    buttonElm.textContent = inp[0]
    buttonElm.onclick = function(){
        let dialogId = buttonElm.parentElement.dataset.dialogId;
        closeDialog(dialogId);
        inp[1]();
    };
    buttonElm.classList.add("no-context-menu");
    if(inp[2]){
        buttonElm.classList.add("primary", "no-context-menu");
    }
    if(inp[3]){
        buttonElm.setAttribute("disabled", "");
    }
    return buttonElm;
}
function createDialogElement(title, description, ...args){
    let con = document.createElement("div"),
        titleElm = document.createElement("text"),
        descriptionElm = document.createElement("text"),
        buttonsCon = document.createElement("div");
    // Add info
    titleElm.textContent = title;
    descriptionElm.textContent = description;
    // Add classes
    con.id ="dialog-" + ++dialogC;
    con.classList.add("dialog", "no-context-menu");
    titleElm.classList.add("title", "no-context-menu");
    descriptionElm.classList.add("description", "no-context-menu");
    buttonsCon.classList.add("buttons", "no-context-menu");
    buttonsCon.dataset.dialogId = dialogC;
    // Append children
    con.appendChild(titleElm);
    con.appendChild(descriptionElm);
    con.appendChild(buttonsCon);
    // Add buttons
    for (let i = 0; i < args.length; i++) {
        buttonsCon.appendChild(addDialogButton(args[i]));
    }
    // Add dialog to screen
    DIALOG_ZONE.style.display = null;
    DIALOG_ZONE.appendChild(con);
    delete con, titleElm, descriptionElm, buttonsCon;
}

// Close dialog
function closeDialog(id){
    let dialog = document.getElementById("dialog-" + id);
    dialog.remove();
    if(DIALOG_ZONE.childNodes.length == 0){
        DIALOG_ZONE.style.display = "none";
    }
}
/**
 * 
 * Manage dialogs
 * 
 ***/

// Show a prompt
// Tmp code
// Example:
function showPrompt(title, message, ...args){
    if(args.length == 0){
        args = [["Ok", () => {}]];
    }
    alert(`${title}\n${message}`);
    args[0][1]();
}
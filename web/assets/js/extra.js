/**
 * 
 * Used to share shared code!
 * 
 **/


// Sleep inside async function!
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
},
DATA_SLEEP = 10, RENDER_SLEEP = 0;

// Block row rendering when not needed!
function updateRenderBlock(){
    window.onscroll();
}
const renderBlock = () => {
    return new Promise(function(resolve, reject){
        // Change this part if you want to use this more than once per page
        window.onscroll = function(e) {
            if ((Math.round(window.scrollY) >= document.body.offsetHeight - 4 * window.innerHeight) ||
                terminateHeldListUpdates) {
                // you're at the bottom of the page
                resolve(true);
            }
        };
        window.onscroll();
    });
};

// Prompt file download
function download(str, name){
    let file = new File([str], name);
    // Create a link and set the URL using `createObjectURL`
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = URL.createObjectURL(file);
    link.download = file.name;

    // It needs to be added to the DOM so it can be clicked
    document.body.appendChild(link);
    link.click();

    // To make this work on Firefox we need to wait
    // a little while before removing it.
    setTimeout(() => {
        URL.revokeObjectURL(link.href);
        link.parentNode.removeChild(link);
    }, 0);
}
function downloadJSON(json, name){
    let str = JSON.stringify(json);
    return download(str, name + ".json");
}

// Import a file
function importFile(callback, types = []){
    // Create file input element
    let input = document.createElement('input');
    input.type = 'file';
    input.style.display = "none";
    // Set file types
    if(typeof types == "object" || typeof types == "string"){
        input.accept = types.toString();
    }
    input.onchange = (e) => { 
        // getting a hold of the file reference
        var file = e.target.files[0]; 
        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');

        // here we tell the reader what to do when it's done reading...
        reader.onload = readerEvent => {
            const content = readerEvent.target.result;
            // Remove element
            setTimeout(() => {
                input.remove();
            }, 0);

            callback(content);
        }
    };
    // It needs to be added to the DOM so it can be clicked
    document.body.appendChild(input);
    input.click();
}

// Create a new SpeechSynthesisUtterance object
let utterance = new SpeechSynthesisUtterance();
// Set the text and voice of the utterance
utterance.voice = window.speechSynthesis.getVoices()[0];
utterance.lang = "he-IL";
// Read aloud text
function readText(str){
    utterance.text = str;
    // Speak the utterance
    window.speechSynthesis.speak(utterance);
}

// Copy text
function copyText(str){
    navigator.clipboard.writeText(str);
}

// Create custom event hanlder
const customEventList = {};
window.addCustomEventListener = function(event, callback){
    // Add event (if new)
    if(customEventList[event] == undefined){
        customEventList[event] = [];
    }
    // Add callback
    customEventList[event].push(callback);
};

// Fire custom event
// Input: Event name(<Srring>), ... (<Any> - callback input)
window.dispatchCustomEvent = function(event, ...args){
    // Execute callbacks
    for(let i = 0; i < (customEventList[event] || []).length; i++){
        customEventList[event][i](...args);
    }
};

// Filter all but numbers (no dots allowed)
function filterKOnlyNumbers(str){
    let all = str.split("");
    for(let i = 0; i < all.length; i++){
        if(isNaN(Number(all[i])) || all[i] == ' '){
            all[i] = '';
        }
    }
    let r = all.join('');
    delete all;
    return r;
}

// Trim the content of an array
function trimArray(array){
    let r = [];
    for(let i = 0; i < array.length; i++){
        r.push(array[i].trim())
    }
    return r;
}

// Reload page
const RELOAD_UNKNOWN = 0, RELOAD_UPDATE = 1, RELOAD_FATAL = 2;
function reloadContentUI(cause = RELOAD_UNKNOWN, callback = () => {}){
    if(cause == RELOAD_UPDATE){
        // Empty list on screen
        emptyWordsListUI();
        // Start loading the page as if it was a normal visit
        setTimeout(() => {
            isNew().then(callback);
        }, 0);
    }else{ // RELOAD_UNKNOWN & RELOAD_FATAL
        // Reload all code
        window.location.reload();
    }
}
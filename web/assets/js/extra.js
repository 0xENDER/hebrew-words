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
const renderBlock = () => {
    return new Promise(function(resolve, reject){
        // Change this part if you want to use this more than once per page
        window.onscroll = function(e) {
            if (Math.round(window.scrollY) >= document.body.offsetHeight - 4 * window.innerHeight) {
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
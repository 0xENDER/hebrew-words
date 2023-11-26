/**
 * 
 * Manage word input
 * 
 **/

// Get the needed elements
const rowInputContainerElm = document.getElementById("row-input-container"),
    rowInputRankElm = document.getElementById("row-input-rank"),
    rowInputEnglishElm = document.getElementById("row-input-english"),
    rowInputTransliterationElm = document.getElementById("row-input-transliteration"),
    rowInputHebrewElm = document.getElementById("row-input-hebrew");

// Empty all input fields
function emptyRowInputsUI(){
    rowInputRankElm.value = "";
    rowInputEnglishElm.value = "";
    rowInputTransliterationElm.value = "";
    rowInputHebrewElm.value = "";
}

// Keep trimming input
function trimInput(elm){
    elm.addEventListener("keyup", function(){
        // Wait a bit so you can get the value!
        setTimeout(() => {
            if(elm.value[elm.value.length-2] == ' '){
                elm.value = elm.value.trim().replaceAll('  ', '');
            }
        }, 0);
    });
}
trimInput(rowInputEnglishElm);
trimInput(rowInputTransliterationElm);
trimInput(rowInputHebrewElm);

// Keep the rank input limited to numbers!
rowInputRankElm.onkeyup = () => {
    // Wait a bit so you can get the value!
    setTimeout(() => {
        console.log(rowInputRankElm.value);
        rowInputRankElm.value = filterKOnlyNumbers(rowInputRankElm.value);
    }, 0);
};

// Check if the input row if filled
function inputNotEmpty(){
    return (rowInputEnglishElm.value != "" &&
        rowInputTransliterationElm.value != "" &&
        rowInputHebrewElm.value != "");
}

// Get next rank
async function getInputIDBRank(){
    // You can write a better code that can guess a proper reasonable rank
    const r =  await getHighestRankIDB();
    return r.rank + 1;
}

// Create word object from input data
async function createWordObj(){
    // Get input!
    let input = [
        Number(rowInputRankElm.value),
        trimArray(rowInputEnglishElm.value.split("~")),
        trimArray(rowInputTransliterationElm.value.split("~")),
        rowInputHebrewElm.value
    ], word = {};
    
    // Create word object
    if(input[0] != 0){
        word.rank = input[0];
    }else{
        word.rank = await getInputIDBRank();
    }
    word.eng = input[1];
    word.hb = input[3];
    word.phn = input[2];
    word.status = Number(rowInputContainerElm.dataset.status);

    return word;
}

// Reset input row colour
function resetInputRowStt(){
    if(rowInputContainerElm.dataset.reset != "off"){
        replaceRowColour(rowInputContainerElm, 0);
    }
}

// Detect when the user uses the "enter" button
window.onkeydown = async function(e){
    if(e.key == 'Enter' && !e.shiftKey && inputNotEmpty()){
        // Wait a bit to make sure the input has been fitlered
        setTimeout(async () => {
            // Create word object
            let word = await createWordObj();

            // Add data to IDB
            let r = await addWordIDB(word);
            console.log(r);

            // Add row to screen
            createWordRows(r[1], null, true, true);

            // Clean up
            emptyRowInputsUI();
            resetInputRowStt();
        }, 0);
    }
};
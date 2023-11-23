/**
 * 
 * Manage the initiation of the website
 * 
 **/

// Check if the user is new!
checkWrdsIDB().then(function(r){
    if(!r){
        // Prompt the user for options!
        showPrompt("Hello!", "Looks like you're new here!",
            ["Start", initFirstVisit],
            ["Import Data", initFirstImport]
        );
    }else{
        // Load the data from the IDB
        initNormalVisit();
    }
})

// Initiation functions
function initFirstVisit(){
    importWrdsLst(getDefaultList(), createWordRows);
}
function initFirstImport(){
    showPrompt("Import Data Error!", "Oops! This option is not available yet!",);
}
function initNormalVisit(){
    getWrdsIDB(createWordRows);
}
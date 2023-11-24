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
            ["Import Data", initImport]
        );
    }else{
        // Load the data from the IDB
        initNormalVisit();
    }
})

// Initiation functions
function initFirstVisit(){
    let defaultList = getDefaultList();
    importWrdsLst(defaultList, createWordRows);
    delete defaultList;
}
function initImport(){
    importWrdsLstFile(createWordRows);
}
function initNormalVisit(){
    getWrdsIDB(createWordRows);
}
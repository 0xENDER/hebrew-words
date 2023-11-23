/**
 * 
 * Manage the initiation of the website
 * 
 **/

// Check if the user is new!
checkWrdsIDB().then(function(){
    // Prompt the user for options!
    showPrompt("Hello!", "Looks like you're new here!",
        ["Start", initFirstVisit],
        ["Import Data", initFirstImport]
    );
})

// Initiation functions
function initFirstVisit(){
    importWrdsLst(getDefaultList(), function(word){
        addWordToListUI();
    });
}
function initFirstImport(){
    showPrompt("Import Data Error!", "Oops! This option is not available yet!",);
}
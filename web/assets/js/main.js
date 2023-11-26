/**
 * 
 * Manage the initiation of the website
 * 
 **/

// Check if the user is new!
function isNew(){
    return new Promise(function(resolve){
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
            resolve(true);
        });    
    });
}

// Initiation functions
function initFirstVisit(){
    function wrds(n){
        let defaultList = getDefaultList(),
            newList;
        newList = defaultList.slice(0, n);
        importWrdsLst(newList, createWordRows);
        delete defaultList, newList;
    }
    showPrompt("Default List Import",
        "We are going to import a list Hebrew words that are ranked according to the feaquency of their use in written text. Please choose your threshold!",
        ["790 words (~1 Month)", () => wrds(790)],
        ["1,580 words (~2 Months)", () => wrds(1580)],
        ["2,370 words (~3 Months)", () => wrds(2370)],
        ["3,160 words (~4 Months)", () => wrds(3160)],
        ["3,555 words (~4.5 Months)", () => wrds(3555)],
        ["4,740 words (~6 Months)", () => wrds(4740)],
        ["10,000 words (~12.5 Months)", () => wrds(10000)]);
}
function initImport(){
    importWrdsLstFile(createWordRows);
}
function initNormalVisit(){
    getWrdsIDB(createWordRows);
}

// Start
isNew();
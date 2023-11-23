/**
 * 
 * Data management
 * 
 **/


// Add a word to IDB
async function createIDBWrd(data){
    const db = await openWrdsIDB();
    return addWrdtoIDB(db, data);
}

// Add words list to IDB
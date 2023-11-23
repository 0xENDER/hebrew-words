/**
 * 
 * Data management
 * 
 **/


// Add a word to IDB
/*async function createIDBWrd(data){
    const db = await openWrdsIDB();
    return addWrdtoIDB(db, data);
}*/

// Get words from IDB
async function getWrdsIDB(callback){
    const db = await openWrdsIDB();
    const data = await getAllWrdIDB(db);
    console.table(data);
    for(let i = 0; i < data.length; i++){
        callback(data[i], false);
        await sleep(RENDER_SLEEP);
        await renderBlock();
    }
    return data;
}
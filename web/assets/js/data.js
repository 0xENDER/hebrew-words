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
    for(let i = 0; i < data.length; i++){
        callback(data[i], false);
        await sleep(RENDER_SLEEP);
        await renderBlock();
    }
    return data;
}

// Update the status of a word in IDB
async function updWrdStt(rnk){
    const db = await openWrdsIDB();
    //store.put
}

// Update an existing word
// Returns [response, newData]
// On error, returns null
async function updateWrdIDB(obj){
    const db = await openWrdsIDB();
    const r = await uptWrdtoIDB(db, obj);
    return (r[1] != null) ? r : null;
}
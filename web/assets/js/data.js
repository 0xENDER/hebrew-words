/**
 * 
 * Data management
 * 
 **/


// Get words from IDB
let terminateHeldListUpdates = false;
async function getWrdsIDB(callback){
    const db = await openWrdsIDB();
    const data = await getAllWrdIDB(db);
    for(let i = 0; i < data.length; i++){
        if(terminateHeldListUpdates){
            terminateHeldListUpdates = false;
            break;
        }
        callback(data[i], false);
        await sleep(RENDER_SLEEP);
        await renderBlock();
    }
    db.close();
    return data;
}

// Update the status of a word in IDB
// NOT USED!
async function updWrdStt(rnk){
    const db = await openWrdsIDB();
    db.close();
    //store.put
}

// Add a new word
async function addWordIDB(obj){
    const db = await openWrdsIDB();
    const r = await addWrdtoIDB(db, obj);
    db.close();
    return r;
}

// Update an existing word
// Returns [response, newData]
// On error, returns null
async function updateWrdIDB(obj){
    const db = await openWrdsIDB();
    const r = await uptWrdtoIDB(db, obj);
    db.close();
    return (r[1] != null) ? r : null;
}

// Remove all data from object store
async function removeAllWrdIDB(){
    const db = await openWrdsIDB();
    const r = await clrAllWrdIDB(db);
    db.close();
    return r;
}

// Delete the IndexedDB
async function deleteWrdsIDB(callback) {
    const r = await dltWrdsIDB();
    if(r == 0){
        callback(true, null);
    }else{
        callback(false, r);
    }
}

// Delete a word from IndexedDB
// Input: JSON Object | <Number> (rank)
async function deleteWrdFromIDB(inp){
    const db = await openWrdsIDB();
    const r = await dltWrdRowIDB(db, (typeof inp == "object") ? inp : {rank: Number(inp)});
    db.close();
    return r;
}

// Update all data count
async function updateWrdSttCntIDB(){
    const db = await openWrdsIDB();
    return [
        await getWrdLstSttCnt(db, {status: 0}),
        await getWrdLstSttCnt(db, {status: 1}),
        await getWrdLstSttCnt(db, {status: 2}),
        await getWrdLstSttCnt(db, {status: 3}),
        await getWrdLstSttCnt(db, {status: 4})
    ];
}
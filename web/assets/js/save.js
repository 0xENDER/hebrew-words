/**
 * 
 * Import/Export management
 * 
 **/

// Get the default words list
// getDefaultList();

// Import list
// Input: <Array> of <JSON> objects (the list of words)
//        <Function> for a callback for each successful import! (every word)
async function importWrdsLst(wrdsLstObj, callback){
    const db = await openWrdsIDB();
    for (let i = 0; i < wrdsLstObj.length; i++){
        let r = await addWrdtoIDB(db, wrdsLstObj[i]);
        callback(r[1]);
        await sleep(RENDER_SLEEP);
    }
}

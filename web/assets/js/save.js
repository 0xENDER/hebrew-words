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
        if(r[2]){
            callback(r[1]);
        }else{
            showPrompt("An error occurred!", "We couldn't save the imported list! Your list could be corrupted, or your storage could be full. Please try again!")
            db.close();
            break;
        }
        await sleep(RENDER_SLEEP);
    }
    db.close();
}

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

// Get current time string
// YYYYMMDD-HHMM
function getTimeStr(){
    let date = new Date(),
        year = date.getFullYear(),
        month = ((date.getMonth() + 1) + '').padStart(2, '0'),
        day = (date.getDate() + '').padStart(2, '0'),
        hours = (date.getHours() + '').padStart(2, '0'),
        minutes = (date.getMinutes() + '').padStart(2, '0');
    let r = `${year}${month}${day}-${hours}${minutes}`
    delete date, year, month, day, hours, minutes;
    return r;
}

// Export IDB list
async function exportWrdsLst(){
    const db = await openWrdsIDB();
    let list = await getAllWrdIDB(db);
    // Remove "rank" value
    for (let i = 0; i < list.length; i++){
        delete list[i]["rank"];
    }
    //Download list
    downloadJSON(list, `WORDS_LIST_EXPORT-${getTimeStr()}`);
    db.close();
}

// Import list from file
function importWrdsLstFile(callback){
    importFile(async function(file){
        let wrdsLst = JSON.parse(file);
        await importWrdsLst(wrdsLst, callback);
        delete wrdsLst;
    }, "json");
}
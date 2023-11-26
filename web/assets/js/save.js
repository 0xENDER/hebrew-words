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
async function importWrdsLst(wrdsLstObj, callback, allowSleep = true){
    const db = await openWrdsIDB();
    for (let i = 0; i < wrdsLstObj.length; i++){
        let r = await addWrdtoIDB(db, wrdsLstObj[i]);
        if(r[2]){
            callback(r[1], [wrdsLstObj.length, i + 1]);
        }else{
            showPrompt("An error occurred!", "We couldn't save the imported list! Your list could be corrupted, or your storage could be full. Please try again!")
            db.close();
            break;
        }
        if(allowSleep){
            await sleep(RENDER_SLEEP);
        }
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
    db.close();
    // Remove "rank" value
    for (let i = 0; i < list.length; i++){
        delete list[i]["rank"];
    }
    //Download list
    downloadJSON(list, `WORDS_LIST_EXPORT-${getTimeStr()}`);
}

// Import list from file
function importWrdsLstFile(callback, delay = true){
    importFile(async function(file){
        let wrdsLst = JSON.parse(file);
        await importWrdsLst(wrdsLst, callback, delay);
        delete wrdsLst;
    }, "json");
}

// Import list from file (without delay)
function startInstantFileImport(){
    // Wrap the progress bar update
    let progressBarOn = false;
    const wrapCallback = (word, prog) => {
        if(!progressBarOn) {
            // Show a progress bar
            showProgressBarUI(1, 0, false);
            progressBarOn = true;
        }
        updateProgressBarUI(prog[0], prog[1]);
        delete word;
        if(prog[1] == prog[0]){
            reloadContentUI(RELOAD_UPDATE, hideProgressBarUI);
        }
    };
    // Start import from file
    importWrdsLstFile(wrapCallback, false);
}
/**
 * 
 * Manage local IndexedDB!
 * 
 **/

// Check for compatibility with browser
if (!('indexedDB' in window)) {
    alert("This browser doesn't support IndexedDB");
}

// Default Data
// rank: <Number> (unique)
// status: <Number> (0 - unassigned, 1 - yellow, 2 - red, 3 - green, 4 - blue)
// ...

// Create needed variables
const IDB = window.indexedDB,
    IDBName = "wordslistidb";
var IDB_COUNT = -1;

// get "words_list" object
function getWrdLstObj(db){
    return db.transaction(IDBName, "readwrite").objectStore(IDBName);
}

// Check if a database exists
async function checkWrdsIDB(){
    return (await window.indexedDB.databases()).map(db => db.name).includes(IDBName);
}

// Get count of IDB rows
function getWrdLstCnt(db){
    return new Promise((resolve) => {
        const countRequest = getWrdLstObj(db).count();
        countRequest.onsuccess = () => {
            resolve(countRequest.result);
        };
    });
}

// Count words that share a status
function getWrdLstSttCnt(db, obj){
    return new Promise((resolve) => {
        const countRequest = getWrdLstObj(db).index("status").count(obj.status);
        countRequest.onsuccess = () => {
            resolve(countRequest.result);
        };
    });
}

// Get the row with the highest rank
function getHghWrdRnk(db){
    return new Promise((resolve) => {
        const index = getWrdLstObj(db).index("rank");
        const openCursorRequest = index.openCursor(null, 'prev');
        openCursorRequest.onsuccess = (e) => {
            resolve(e.target.result.value);
        };
    });
}

// Open a database
// Returns <IDBObjectStore> read to hold the user's data
function openWrdsIDB(){
    // Return a promise
    return new Promise((resolve) => {
        // Open the database
        const req = IDB.open(IDBName); // This name is interchangable..
        req.onerror = function(e){
            alert("Couldn't open a local database!");
            resolve(null);
        };
        // Keep track of the IDB_COUNT value!
        async function done(db){
            IDB_COUNT = await getWrdLstCnt(db);
            resolve(db);
        }
        // This event is only implemented in recent browsers
        req.onupgradeneeded = (event) => {
            console.log("IDB upgrade!");
            // Save the IDBDatabase interface
            const db = event.target.result;
  
            // Create an objectStore for this database
            const objStore = db.createObjectStore(IDBName, { keyPath: "rank" });

            // Create the needed Indexes
            objStore.createIndex("rank", "rank", { unique: true });
            objStore.createIndex("status", "status", { unique: false });

            // Wait for the end of obj creation
            objStore.transaction.oncomplete = (e) => {
                // const wordsObjStore = getWrdLstObj(db)
                done(db);
            };
        };    
        // Return callback if the ready IDB if it doesn't need an upgrade
        req.onsuccess = function(e){
            const db = e.target.result;
            done(db);
        }
    });
}

// Add a new word to the IDBObj
// Returns <Array> -> [IDBResponse, newly inserted JSON data, <Boolean> - change in rows number]
let prvIDBCnt = -1;
async function addWrdtoIDB(db, obj){
    prvIDBCnt = IDB_COUNT;
    let fObj = {rank: IDB_COUNT + 1, status: 0, ...obj};
    let r = getWrdLstObj(db).add(fObj);
    // Keep track of the IDB_COUNT value!
    IDB_COUNT = await getWrdLstCnt(db);
    window.dispatchCustomEvent("idb-input", {action: "add"});
    return [r, fObj, IDB_COUNT != prvIDBCnt];
}

// Update an existing word
function uptWrdtoIDB(db, obj){
    return new Promise(async (resolve) => {
        const objSt = getWrdLstObj(db);
        // Get already saved data and combine it with the new data
        let nData;
        const rq = objSt.get(obj.rank);    
        rq.onsuccess = async () => {
            nData = {...rq.result, ...obj}
            // Save the combined new data
            let r = objSt.put(nData);
            // Keep track of the IDB_COUNT value!
            IDB_COUNT = await getWrdLstCnt(db);
            window.dispatchCustomEvent("idb-input", {action: "update"});
            resolve([r, nData]);
        }
        rq.onerror = () => {
            resolve([r, null]);
        };
    });
}

// Get all words from IDB
function getAllWrdIDB(db){
    // Return a promise
    return new Promise((resolve) => {
        const req = getWrdLstObj(db).getAll();
        req.onsuccess = ()=> {
            const wrds = req.result;
            window.dispatchCustomEvent("idb-load-all", undefined);
            resolve(wrds);
        }
        req.onerror = (err)=> {
            showPrompt("Something went wrong!", "We couldn't retrieve your data!",);
            throw err;
        }
    });
}

// Clear all data from IDBObjectStore
function clrAllWrdIDB(db){
    // Return a promise
    return new Promise((resolve) => {
        const req = getWrdLstObj(db).clear();
        req.onsuccess = async () => {
            IDB_COUNT = await getWrdLstCnt(db);
            window.dispatchCustomEvent("idb-input", {action: "clear-all"});
            resolve(true);
        }
        req.onerror = async (err) => {
            showPrompt("Something went wrong!", "We couldn't delete all your data!",);
            IDB_COUNT = await getWrdLstCnt(db);
            resolve(false)
        }
    });
}

// Delete words IDB
// 0 - success, 1 - error, 2 - blocked
function dltWrdsIDB(){
    // Return a promise
    return new Promise((resolve) => {
        // Delete IDB
        const req = IDB.deleteDatabase(IDBName);
        IDB_COUNT = -1;
        req.onsuccess = function () {
            window.dispatchCustomEvent("idb-input", {action: "delete-idb"});
            resolve(0);
        };
        req.onerror = function () {
            resolve(1);
        };
        req.onblocked = function () {
            window.dispatchCustomEvent("idb-input", {action: "delete-idb"});
            resolve(2);
        };
    });
}

// Delete word from IDB
// 0 - success, 1 - error, 2 - blocked
function dltWrdRowIDB(db, obj){
    // Return a promise
    return new Promise((resolve) => {
        // Delete IDB
        const req = getWrdLstObj(db).delete(obj.rank);
        req.onsuccess = async () => {
            IDB_COUNT = await getWrdLstCnt(db);
            window.dispatchCustomEvent("idb-input", {action: "delete"});
            resolve(true);
        };
        req.onerror = async () => {
            IDB_COUNT = await getWrdLstCnt(db);
            resolve(false);
        };
    });
}
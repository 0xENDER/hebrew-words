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
        async function done(r, db){
            IDB_COUNT = await getWrdLstCnt(db);
            resolve(r);
        }
        // This event is only implemented in recent browsers
        req.onupgradeneeded = (event) => {
            //
            console.log("AAAAAAAAAAAAAAAAAA");
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
                done(db, db);
            };
        };    
        // Return callback if the ready IDB if it doesn't need an upgrade
        req.onsuccess = function(e){
            const db = e.target.result;
            done(db, db);
        }
    });
}

// Add a new word to the IDBObj
async function addWrdtoIDB(db, obj){
    let fObj = {rank: IDB_COUNT + 1, status: 0, ...obj};
    let r = getWrdLstObj(db).add(fObj);
    // Keep track of the IDB_COUNT value!
    IDB_COUNT = await getWrdLstCnt(db);
    return [r, fObj];
}

// Get all words from IDB
function getAllWrdIDB(db){
    // Return a promise
    return new Promise((resolve) => {
        const req = getWrdLstObj(db).getAll();
        req.onsuccess = ()=> {
            const wrds = req.result;
            resolve(wrds);
        }
        req.onerror = (err)=> {
            showPrompt("Something went wrong!", "We couldn't retrieve your data!",);
            console.error(`Error to get all students: ${err}`)
        }
    });
}
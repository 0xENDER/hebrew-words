/**
 * 
 * Manage local IndexedDB!
 * 
 **/

// Check for compatibility with browser
if (!('indexedDB' in window)) {
    alert("This browser doesn't support IndexedDB");
}

// Get IndexedDB API object
const IDB = window.indexedDB;

// get "words_list" object
function getWrdLstObj(db){
    return db.transaction("words_list", "readwrite").objectStore("words_list");
}

// Open a database
// Returns <IDBObjectStore> read to hold the user's data
function openWrdsIDB(callback){
    // Open the database
    const req = IDB.open("WordsList");
    req.onerror = function(e){
        alert("Couldn't open a local database!");
        throw e;
    };
    // This event is only implemented in recent browsers
    req.onupgradeneeded = (event) => {
        // Save the IDBDatabase interface
        const db = event.target.result;
  
        // Create an objectStore for this database
        const objStore = db.createObjectStore("words_list", { keyPath: "rank" });

        // Create the needed Indexes
        objStore.createIndex("rank", "rank", { unique: true });
        objStore.createIndex("status", "status", { unique: false });

        // Wait for the end of obj creation
        objStore.transaction.oncomplete = (e) => {
            // const wordsObjStore = getWrdLstObj(db)
            callback(db);
        };
    };    
    // Return callback if the ready IDB if it doesn't need an upgrade
    req.onsuccess = function(e){
        const db = e.target.result;
        callback(db);
    }
}

// Add a new word to the IDBObj
function addWrdtoIDB(db, obj){
    return getWrdLstObj(db).add({rank: 0, status: 0, ...obj});
}
/**
 * 
 * Manage page interactions
 * 
 **/

// Get all the needed variables
const TABLE_ELM = document.getElementById('words');

// Create a row for the list
// <tr class="row odd">
//      <td> 0 </td>
//      <td> sadas feasf </td>
//      <td> saaaa </td>
//      <td class="alt3"> שלום </td>
//  </tr>
let previousRank = -1,
    previousRankC = 1,
    rowStatus = ["grey", "yellow", "red", "green", "blue"];
function createWordRowDOM(scrollToView, hebrew, transliteration, english, status, rank = ""){
    let con = document.createElement('tr'),
        rankElm = document.createElement('td'),
        engElm = document.createElement('td'),
        translitElm = document.createElement('td'),
        hebElm = document.createElement('td');
    // Get row info
    let isOdd = (typeof rank == "number" && rank % 2) ||
                (typeof rank == "string" && previousRank % 2);
    con.setAttribute("class", `row ${rowStatus[status]}`);
    con.setAttribute("id", (typeof rank == "number") ? rank : `${previousRank}_${previousRankC}`)
    con.setAttribute("tabindex", "0");
    // Add info
    rankElm.innerText = rank;
    engElm.innerText = english;
    translitElm.innerText = transliteration;
    hebElm.innerText = (typeof rank == "number") ? hebrew : "";
    // Append children
    con.appendChild(rankElm);
    con.appendChild(engElm);
    con.appendChild(translitElm);
    con.appendChild(hebElm);
    // Group the words in the same rank
    let tbody;
    if(typeof rank == "number"){
        //
        tbody = document.createElement("tbody");
        tbody.id = "t-" + rank;
        tbody.classList.add("ranked-row");
        TABLE_ELM.appendChild(tbody);
    }else{
        tbody = document.getElementById("t-" + previousRank);
    }
    // Append row to the list
    tbody.appendChild(con);
    if(scrollToView){
        con.scrollIntoView();
    }
    // Keep track of previousRank
    if(typeof rank == "number"){
        // Keep track of the number of meanings in a ranked word
        if(previousRank != -1){
            document.getElementById(previousRank).dataset.rankC = previousRankC;
        }
        con.dataset.rank = rank;
        previousRank = rank;
        previousRankC = 1;
    }else{
        con.dataset.rank = previousRank;
        previousRankC++;
    }
    // Delete used variables
    delete con, rankElm, engElm, translitElm, hebElm, isOdd;
}

// Create word row
async function createWordRows(word, scrollToView = true){
    for(let i = 0; i < word.eng.length; i++){
        createWordRowDOM(scrollToView, word.hb, word.phn[i], word.eng[i], word.status, (i == 0) ? word.rank : "");
    }
}

// Get all rank rows
function getRankRows(rowElm, callback){
    if(rowElm.id.includes("_")){
        getRankRows(document.getElementById(rowElm.dataset.rank), callback);
    }else{
        let l = Number(rowElm.dataset.rankC);
        callback(rowElm);
        if(l > 1){
            let rank = rowElm.dataset.rank;
            for (let i = 0; i < l - 1; i++){
                callback(document.getElementById(`${rank}_${i + 1}`));
            }
        }
    }
}

// set row status
function replaceRowColour(rowElm, status){
    for (let c in rowStatus){
        rowElm.classList.remove(rowStatus[c]);
    }
    rowElm.classList.add(rowStatus[status]);
}
function replaceRowsColour(rowElm, status){
    getRankRows(rowElm, function(row){
        replaceRowColour(row, status);
    });
}

// Remove word from list
function removeWordRowsFromList(rank){
    let tbody = document.getElementById("t-" + rank)
    tbody.remove();
}
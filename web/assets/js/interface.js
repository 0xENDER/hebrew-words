/**
 * 
 * Manage page interactions
 * 
 **/

// Get all the needed variables
const TABLE_ELM = document.getElementById('words');

// Show a prompt
// Tmp code
// Example:
function showPrompt(title, message, ...args){
    if(args.length == 0){
        args = ["Ok", () => {}];
    }
    alert(`${title}\n${message}`);
    args[0][1]();
}

// Create a row for the list
// <tr class="row odd">
//      <td> 0 </td>
//      <td> sadas feasf </td>
//      <td> saaaa </td>
//      <td class="alt3"> שלום </td>
//  </tr>
let previousRank = -1,
    rowStatus = ["", "yellow", "red", "green", "blue"];
function createWordRowDOM(hebrew, transliteration, english, status, rank = ""){
    let con = document.createElement('tr'),
        rankElm = document.createElement('td'),
        engElm = document.createElement('td'),
        translitElm = document.createElement('td'),
        hebElm = document.createElement('td');
    // Get row info
    let isOdd = (typeof rank == "number" && rank % 2) ||
                (typeof rank == "string" && previousRank % 2);
    con.setAttribute("class",
        `row ${isOdd ? "odd" : "even"} ${rowStatus[status]}`);
    // Add info
    rankElm.innerText = rank;
    engElm.innerText = english;
    translitElm.innerText = transliteration;
    hebElm.innerText = hebrew;
    // Append children
    con.appendChild(rankElm);
    con.appendChild(engElm);
    con.appendChild(translitElm);
    con.appendChild(hebElm);
    // Append row to the list
    TABLE_ELM.appendChild(con);
    // Keep track of previousRank
    if(typeof rank == "number"){
        con.rank = rank;
        previousRank = rank;
    }else{
        con.rank = previousRank;
    }
}

// Add a word to the list
// Input: {
//    "rank": <Number>,
//    "status": <Number>,
//    "hb": <String>,
//    "phn": [
//        <String>, ...
//    ], "eng": [
//        <String>, ...
//    ]
// }
//
function addWordToListUI(){
    TABLE_ELM.appendChild();    
}
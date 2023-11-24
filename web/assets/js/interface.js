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
        args = [["Ok", () => {}]];
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
    previousRankC = 1,
    rowStatus = ["", "yellow", "red", "green", "blue"];
function createWordRowDOM(scrollToView, hebrew, transliteration, english, status, rank = ""){
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
    // Append row to the list
    TABLE_ELM.appendChild(con);
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

async function createWordRows(word, scrollToView = true){
    for(let i = 0; i < word.eng.length; i++){
        createWordRowDOM(scrollToView, word.hb, word.phn[i], word.eng[i], word.status, (i == 0) ? word.rank : "");
    }
}
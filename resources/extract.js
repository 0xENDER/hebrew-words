/**
 * 
 * This file contains code to extract all the data from `wrds.html`!
 * 
 **/

// Wrd data
function Wrd(hb, phn, eng){
    return {
        hb,
        phn: [phn],
        eng: [eng]
    };
}

// This object is used to hold the final data
const wrds = [];

// Get the rank of the current element
function wrdElmRnk(elm){
    return Number(elm.children[0].innerHTML.replaceAll(" ", ""));
}

// Get the "Hebrew" field of the current element
function wrdElmHb(elm){
    return elm.children[3].innerText;
}

// Get the "Transliteration" field of the current element
function wrdElmPhn(elm){
    return elm.children[2].innerText;
}

// Get the "English" field of the current element
function wrdElmEng(elm){
    return elm.children[1].innerText;
}

// Extract info from normal/start row
let t = new Date(),
    cE = 0, eE;
function wrdElmRow(elm){
    cE++;
    console.log(`${((cE/eE)*100).toFixed(3)}% progress! (#${cE} - ${-1*(t - (t = new Date()))}ms)`);
    return Wrd(
        wrdElmHb(elm),
        wrdElmPhn(elm),
        wrdElmEng(elm)
    );
}

// Extract info from an 'extra' row
function wrdElmExtRow(r, elm){
    wrds[r].phn.push(wrdElmPhn(elm));
    wrds[r].eng.push(wrdElmEng(elm));
}

// Interact with element
// This is done for a faster processing time!
// Note that you will have to manually click on the page when the sorting process becomes slower!
function intrElm(elm){
    document.body.focus();
    document.body.click();
    elm.focus();
    elm.click();
    elm.scrollIntoView();
}

// Sort all word elements according to their rank!
function wrdElmsSrt(){
    let alt1 = document.querySelectorAll("tr.alt1"),
        alt2 = document.querySelectorAll("tr.alt2"),
        n1 = 0, n2 = 0,
        pa1 = false, pa2 = false,
        r = -1, prvRnk = r,
        scallc = 10;

    // set the number of expected words\
    eE = alt1.length; + alt2.length;

    // Continue sorting `alt1`
    function srt1(){
        pa2 = false;
        let brk = false,
            rnk;
        // console.log(r);
        for (;!brk && n1 < alt1.length; n1++) {
            intrElm(alt1[n1]);
            rnk = wrdElmRnk(alt1[n1]);
            if(rnk != 0){
                if((!pa1 && Math.abs(prvRnk % 2) != rnk % 2) || r == -1){
                    prvRnk = r;
                    wrds[++r] = wrdElmRow(alt1[n1]);
                }else{
                    --n1;
                    brk = true;
                    setTimeout(srt2, scallc);
                }
            }else{
                pa1 = true;
                wrdElmExtRow(r, alt1[n1]);
            }
        }
    }

    // Continue sorting `alt2`
    function srt2(){
        pa1 = false;
        let brk = false,
            rnk;
        for (; !brk && n2 < alt2.length; n2++) {
            intrElm(alt2[n2]);
            rnk = wrdElmRnk(alt2[n2]);
            if(rnk != 0){
                if(!pa2 && Math.abs(prvRnk % 2) != rnk % 2){
                    prvRnk = r;
                    wrds[++r] = wrdElmRow(alt2[n2]);
                }else{
                    --n2;
                    brk = true;
                    setTimeout(srt1, scallc);
                }
            }else{
                pa2 = true;
                wrdElmExtRow(r, alt2[n2]);
            }
        }
        if(n2 >= alt2.length){
            setTimeout(srt1, scallc);
        }
    }

    // Start sorting
    srt1();

    console.log(wrds);
}

// Start extracting data
wrdElmsSrt();

// Convert data into a string for use
function out(){
    window.open("data:application/octet-stream," + encodeURIComponent(JSON.stringify(wrds)));
}
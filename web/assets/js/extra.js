/**
 * 
 * Used to share shared code!
 * 
 **/


// Sleep inside async function!
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
},
DATA_SLEEP = 0, RENDER_SLEEP = 0;

// Block row rendering when not needed!
const renderBlock = () => {
    return new Promise(function(resolve, reject){
        window.onscroll = function(e) {
            if (Math.round(window.scrollY) >= document.body.offsetHeight - 4 * window.innerHeight) {
                // you're at the bottom of the page
                resolve(true);
            }
        };
        window.onscroll();
    });
};
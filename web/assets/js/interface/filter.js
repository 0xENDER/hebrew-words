/**
 * 
 * Manage list filter
 * 
 **/

// Get needed elements
const filterNoneButton = document.getElementById("filter-none"),
    filterYellowButton = document.getElementById("filter-yellow"),
    filterRedButton = document.getElementById("filter-red"),
    filterGreenButton = document.getElementById("filter-green"),
    filterBlueButton = document.getElementById("filter-blue");

// Toggle filter bottom
function toggleFilterOption(buttonElm, status){
    // Get new status
    let toggleStt = buttonElm.dataset.off == "true";
    buttonElm.dataset.off = (toggleStt) ? "" : "true";
    // You need to take a more JS-oriented approach for proper even/odd row display!
    if(toggleStt){
        // On
        TABLE_ELM.classList.remove("hide-" + rowStatus[status]);
    }else{
        // Off
        TABLE_ELM.classList.add("hide-" + rowStatus[status]);
    }
}
filterNoneButton.onclick = () => toggleFilterOption(filterNoneButton, 0);
filterYellowButton.onclick = () => toggleFilterOption(filterYellowButton, 1);
filterRedButton.onclick = () => toggleFilterOption(filterRedButton, 2);
filterGreenButton.onclick = () => toggleFilterOption(filterGreenButton, 3);
filterBlueButton.onclick = () => toggleFilterOption(filterBlueButton, 4);

// Update count for a filter
function updateFilterCountNumber(elm, n){
    elm.children[0].textContent = n;
}

// Update filters count
async function updateFiltersCountUI(){
    let c = await updateWrdSttCntIDB();
    updateFilterCountNumber(filterNoneButton, c[0]);
    updateFilterCountNumber(filterYellowButton, c[1]);
    updateFilterCountNumber(filterRedButton, c[2]);
    updateFilterCountNumber(filterGreenButton, c[3]);
    updateFilterCountNumber(filterBlueButton, c[4]);
}
window.addCustomEventListener("idb-input", updateFiltersCountUI);
window.addCustomEventListener("idb-load-all", updateFiltersCountUI);
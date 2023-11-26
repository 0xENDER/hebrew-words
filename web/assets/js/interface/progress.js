/**
 * 
 * Manage the progress bar
 * 
 **/

// Get needed elements
const progressBarCon = document.getElementById("progress_bar_zone"),
    progressBarElm = document.getElementById("progress-bar");

// Show progress bar on screen
function showProgressBarUI(quota, progress, cover = true){
    // Update cover
    progressBarCon.dataset.disableCover = cover;
    // Block unwanted imports
    importExportListButton.setAttribute("disabled", "");
    // Update progress bar
    updateProgressBarUI(quota, progress);
    // Show progress bar
    progressBarCon.style.display = null;
}

// Update progress bar info
function updateProgressBarUI(quota, progress){
    progressBarElm.style.width = (100*(progress/quota)).toFixed(2) + "%";
}

// Hide progress bar
function hideProgressBarUI(){
    // Hide progress bar
    progressBarCon.style.display = "none";
    updateProgressBarUI(1, 0);
    // Allow other imports
    importExportListButton.removeAttribute("disabled");
}

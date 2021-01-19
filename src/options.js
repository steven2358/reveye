// define all possible services
const allServices = ['google', 'bing', 'yandex', 'tineye'];

function saveOptions() {
  // init as empty options
  var services = [];
  
  // retrieve all checked services
  for (var i = 0; i < allServices.length; i++) {
    if (document.getElementById(allServices[i]).checked) {
      services.push(allServices[i]);
    }
  }
  
  // store or complain
  if (services.length > 0) {
    localStorage.services = services;

    var status = document.getElementById("status");
    status.innerHTML = "Options saved.";
    setTimeout(function() { status.innerHTML = ""; }, 800);
    
    chrome.extension.sendRequest({action:"updateContextMenu"});
    
  } else {
    alert('Select at least one service.');
  }
}

// activate the checkboxes for the active services
function activateCheckboxes() {
  var myServices = localStorage.services.split(',');
  
  for (var i = 0; i < allServices.length; i++) {
    if (myServices.includes(allServices[i])) {
      document.getElementById(allServices[i]).checked = true;
    } else {
      document.getElementById(allServices[i]).checked = false;
    }
  }
}

// upgrade from pre v1.5: remove old stored variables, save new 
// ones with all options
function upgradeOptions() {
  if (localStorage.menutype){
    // remove old variable
    localStorage.removeItem("menutype");
    
    // save "services" variable with all options
    localStorage.services = allServices;
  }
  if (localStorage.service){
    // remove old variable
    localStorage.removeItem("service");
    
    // save "services" variable with all options
    localStorage.services = allServices;
  }
}

// set the options for a clean install
function initializeOptions() {
  // if clean install
  if (localStorage.getItem("services") === null) {
    // save "services" variable with all options
    localStorage.services = allServices;
  }
}

function closeWindow() {
  window.close();
}

// run on loading options or popup window
function initialize() {
  initializeOptions();
  upgradeOptions();
  activateCheckboxes();
  
  document.getElementById("save_button").addEventListener("click",saveOptions);
  
  if (document.getElementById("close_button")){
    document.getElementById("close_button").addEventListener("click",closeWindow);
  }
}

window.addEventListener("load", initialize);

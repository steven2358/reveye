// define all possible services
const allServices = ['google', 'bing', 'yandex', 'tineye'];

function save_options() {
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
function restore_options() {
  var myServices = localStorage.services.split(',');
  
  for (var i = 0; i < allServices.length; i++) {
    if (myServices.includes(allServices[i])) {
      document.getElementById(allServices[i]).checked = true;
    } else {
      document.getElementById(allServices[i]).checked = false;
    }
  }
}

// upgrade from pre v1.5: Remove old stored variables, save new ones with all options
function upgrade_options() {
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

function close_window() {
  window.close();
}

// run on loading options or popup window
function initialize() {
  upgrade_options();
  restore_options();
  
  document.getElementById("save_button").addEventListener("click",save_options);
  
  if (document.getElementById("close_button")){
    document.getElementById("close_button").addEventListener("click",close_window);
  }
}

window.addEventListener("load", initialize);

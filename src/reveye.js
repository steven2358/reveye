// define all possible services
const allServices = ['google', 'bing', 'yandex', 'tineye'];

var services = {
  "all": ["all", "All search engines", "", "image"],
  "google": ["Google", "Google search", "https://www.google.com/searchbyimage?image_url=", "image"],
  "bing": ["Bing", "Bing image match", "https://www.bing.com/images/searchbyimage?cbir=ssbi&pageurl=http%3A%2F%2Fwww.squobble.com&imgurl=", "image"],
  "yandex": ["Yandex", "Yandex search", "https://yandex.com/images/search?rpt=imageview&url=", "image"],
  //"baidu": ["Baidu", "Baidu search", "http://image.baidu.com/n/pc_search?queryImageUrl=","image"],
  "tineye": ["TinEye", "TinEye search", "https://www.tineye.com/search/?url=", "image","page"],
};

function contextClick(info, tab){
  console.log('contextClick')
  
  var query = info.pageUrl;
  if(info.mediaType=="image"){
    var query = info.srcUrl;
  }
  imageSearch(menus[info.menuItemId], query);
}

function imageSearch(service, query){
  var myServices = localStorage.services.split(',');
  
  if (service=="all"){
    for (var i = 0; i < myServices.length; i++) {
      openService(myServices[i],query);
    }
  } else {
    openService(service,query);
  }
}

// Open a new tab with a query on a service
function openService(service,query){
  // create url for search query
  var url = services[service][2] + encodeURIComponent(query);

  // open new tab with search query
  chrome.tabs.create({url: url, selected: false});
}

function create_submenu() {
  // create main menu item
  var rootmenu = chrome.contextMenus.create({
    "title" : "Reverse image search",
    "type" : "normal",
    "contexts" : ["image","page"]
  });
  
  var myServices = localStorage.services.split(',');
  
  // add option to open queries on all selected services at once
  myServices.unshift('all');
  
  // create submenu items
  for (var i = 0; i < myServices.length; i++) {
    var mymenu = chrome.contextMenus.create({
      title: services[myServices[i]][1],
      type: "normal",
      contexts: services[myServices[i]].slice(3),
      parentId: rootmenu,
      onclick: contextClick
    })
    menus[mymenu] = myServices[i];
  }
}

// Create a single search option
function create_singleoption() {
  var myServices = localStorage.services.split(',');
  var service = services[myServices[0]];
  var imageMenu = chrome.contextMenus.create({
    "title" : "Reverse image search ("+service[0]+")",
    "type" : "normal",
    "contexts" : service.slice(3),
    "onclick" : contextClick
  });
  menus[imageMenu] = myServices[0];
}

// upgrade from pre v1.5
function upgradeOptions() {
  // remove old stored variables, save new ones with all options
  if (localStorage.menutype){
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

function updateContextMenu() {
  chrome.contextMenus.removeAll();
  
  var myServices = localStorage.services.split(',');
  if (myServices.length > 1) {
    create_submenu();
  } else {
    create_singleoption();
  }
}

// variable to store IDs of menu items (as values)
var menus = {};

initializeOptions();
upgradeOptions();
updateContextMenu();

chrome.extension.onRequest.addListener(
  function(request) {
  switch(request.action){
    case "updateContextMenu" : 
      updateContextMenu();
      break;
  }
});

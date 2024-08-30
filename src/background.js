const CURRENT_VERSION = '2.0.0';

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    initializeStorage();
    showWhatsNewPage();
  } else if (details.reason === 'update') {
    checkForMigration(details.previousVersion);
    showWhatsNewPage();
  }
});

function initializeStorage() {
  const defaultSearchEngines = {
    google: {
      name: 'Google',
      url: 'https://lens.google.com/uploadbyurl?url=%s'
    },
    bing: {
      name: 'Bing',
      url: 'https://www.bing.com/images/searchbyimage?cbir=ssbi&imgurl=%s'
    },
    yandex: {
      name: 'Yandex',
      url: 'https://yandex.com/images/search?rpt=imageview&url=%s'
    },
    tineye: {
      name: 'TinEye',
      url: 'https://www.tineye.com/search/?url=%s'
    }
  };

  chrome.storage.local.set({
    version: CURRENT_VERSION,
    searchEngines: defaultSearchEngines,
    selectedEngines: ['google', 'bing', 'yandex', 'tineye']
  }, updateContextMenu);
}

function checkForMigration(previousVersion) {
  chrome.storage.local.get(['version', 'searchEngines', 'selectedEngines'], (data) => {
    if (!data.version || data.version !== CURRENT_VERSION) {
      // Perform migration if necessary
      // For now, we'll just update the version
      chrome.storage.local.set({ version: CURRENT_VERSION });
    }
    
    // Ensure we always have default values
    if (!data.searchEngines || !data.selectedEngines) {
      initializeStorage();
    } else {
      updateContextMenu();
    }
  });
}

function showWhatsNewPage() {
  chrome.tabs.create({ url: 'whatsnew.html' });
}

function updateContextMenu() {
  chrome.contextMenus.removeAll(function() {
    chrome.storage.local.get(['searchEngines', 'selectedEngines'], function(items) {
      const { searchEngines, selectedEngines } = items;
      
      if (selectedEngines && selectedEngines.length > 0) {
        if (selectedEngines.length === 1) {
          chrome.contextMenus.create({
            id: "reverseImageSearch",
            title: `Reverse image search (${searchEngines[selectedEngines[0]].name})`,
            contexts: ["image"]
          });
        } else {
          chrome.contextMenus.create({
            id: "reverseImageSearch",
            title: "Reverse image search",
            contexts: ["image"]
          });

          chrome.contextMenus.create({
            parentId: "reverseImageSearch",
            id: "allEngines",
            title: "All search engines",
            contexts: ["image"]
          });

          const orderedEngineIds = ['google', 'bing', 'yandex', 'tineye']
            .concat(selectedEngines.filter(id => !['google', 'bing', 'yandex', 'tineye'].includes(id)));

          orderedEngineIds.forEach(engineId => {
            if (selectedEngines.includes(engineId) && searchEngines[engineId]) {
              chrome.contextMenus.create({
                parentId: "reverseImageSearch",
                id: engineId,
                title: searchEngines[engineId].name,
                contexts: ["image"]
              });
            }
          });
        }
      }
    });
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "updateContextMenu") {
    updateContextMenu();
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.storage.local.get(['searchEngines', 'selectedEngines'], function(items) {
    const { searchEngines, selectedEngines } = items;

    // open search engine tab at specific tab index
    function openSearchTab(engineId, index) {
      const searchUrl = searchEngines[engineId].url.replace('%s', encodeURIComponent(info.srcUrl));
      chrome.tabs.create({ url: searchUrl, index: index });
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // get index of current tab
      const currentIndex = tabs[0].index;

      if (info.menuItemId === "allEngines" || (info.menuItemId === "reverseImageSearch" && selectedEngines.length === 1)) {
        const enginesToSearch = info.menuItemId === "allEngines" ? selectedEngines : [selectedEngines[0]];
        enginesToSearch.forEach((engineId, i) => {
          openSearchTab(engineId, currentIndex + i + 1);
        });
      } else if (selectedEngines.includes(info.menuItemId)) {
        openSearchTab(info.menuItemId, currentIndex + 1);
      }
    });
  });
});

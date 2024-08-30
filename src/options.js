let searchEngines = {
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

const defaultOrder = ['google', 'bing', 'yandex', 'tineye'];

function saveOptions() {
  const orderedEngineIds = defaultOrder.concat(
    Object.keys(searchEngines).filter(id => !defaultOrder.includes(id))
  );

  const selectedEngines = orderedEngineIds.filter(engineId => 
    document.getElementById(engineId) && document.getElementById(engineId).checked
  );

  const orderedSearchEngines = {};
  orderedEngineIds.forEach(engineId => {
    if (searchEngines[engineId]) {
      orderedSearchEngines[engineId] = searchEngines[engineId];
    }
  });

  chrome.storage.local.set({
    searchEngines: orderedSearchEngines,
    selectedEngines: selectedEngines
  }, function() {
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
    chrome.runtime.sendMessage({action: "updateContextMenu"});
  });
}

function restoreOptions() {
  chrome.storage.local.get({
    searchEngines: searchEngines,
    selectedEngines: ['google']
  }, function(items) {
    searchEngines = items.searchEngines;
    const enginesDiv = document.getElementById('searchEngines');
    enginesDiv.innerHTML = '';

    defaultOrder.forEach(engineId => {
      if (searchEngines[engineId]) {
        const engine = searchEngines[engineId];
        const engineElement = createEngineElement(engineId, engine, items.selectedEngines.includes(engineId));
        enginesDiv.appendChild(engineElement);
      }
    });

    Object.keys(searchEngines)
      .filter(engineId => !defaultOrder.includes(engineId))
      .forEach(engineId => {
        const engine = searchEngines[engineId];
        const engineElement = createEngineElement(engineId, engine, items.selectedEngines.includes(engineId));
        enginesDiv.appendChild(engineElement);
      });
  });
}

function createEngineElement(engineId, engine, isChecked) {
  const div = document.createElement('div');
  div.className = 'search-engine';
  const isCustom = !defaultOrder.includes(engineId);
  
  div.innerHTML = `
    <input type="checkbox" id="${engineId}" ${isChecked ? 'checked' : ''}>
    ${isCustom ? `
      <input type="text" class="engine-name" value="${engine.name}" placeholder="Engine name">
      <input type="text" class="engine-url" value="${engine.url}" placeholder="Search URL with %s for image URL">
      <button class="remove-engine">Remove</button>
    ` : `
      <label for="${engineId}">${engine.name}</label>
    `}
  `;

  if (isCustom) {
    const removeButton = div.querySelector('.remove-engine');
    removeButton.addEventListener('click', () => {
      delete searchEngines[engineId];
      div.remove();
      saveOptions();
    });

    const nameInput = div.querySelector('.engine-name');
    const urlInput = div.querySelector('.engine-url');
    [nameInput, urlInput].forEach(input => {
      input.addEventListener('change', () => {
        searchEngines[engineId] = {
          name: nameInput.value,
          url: urlInput.value
        };
      });
    });
  }

  return div;
}

function addCustomEngine() {
  const enginesDiv = document.getElementById('searchEngines');
  const newId = 'custom_' + Date.now();
  searchEngines[newId] = { name: '', url: '' };
  const newEngine = createEngineElement(newId, searchEngines[newId], true);
  enginesDiv.appendChild(newEngine);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('addCustomEngine').addEventListener('click', addCustomEngine);

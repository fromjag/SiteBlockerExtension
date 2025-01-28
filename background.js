chrome.action.onClicked.addListener(function() {
  // First check if options page is already open
  chrome.tabs.query({ url: chrome.runtime.getURL('options.html') }, function(tabs) {
    if (tabs.length > 0) {
      // If options page exists, activate that tab
      chrome.tabs.update(tabs[0].id, { active: true });
      // If the tab is in another window, focus that window
      chrome.windows.update(tabs[0].windowId, { focused: true });
    } else {
      // If no options page exists, create new tab
      chrome.tabs.create({
        url: 'options.html'
      });
    }
  });
});

function checkUrl(url, blockedUrls) {
  return blockedUrls.some(blockedUrl => {
    const trimmedUrl = blockedUrl.trim();
    return trimmedUrl && url.includes(trimmedUrl);
  });
}

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
  if (details.url.includes('options.html')) {
    return;
  }

  chrome.storage.local.get(['permaBanList', 'focusList', 'mode'], function(data) {
    const permaBanUrls = data.permaBanList ? data.permaBanList.split('\n') : [];
    const focusUrls = data.focusList ? data.focusList.split('\n') : [];
     
    if (checkUrl(details.url, permaBanUrls)) {
      chrome.tabs.update(details.tabId, { url: 'blocked.html' });
      return;
    }
    
    if (data.mode === 'focus' && checkUrl(details.url, focusUrls)) {
      chrome.tabs.update(details.tabId, { url: 'blocked.html' });
    }
  });
});
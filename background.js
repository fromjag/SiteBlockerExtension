chrome.action.onClicked.addListener(function() {
    chrome.tabs.create({
      url: 'options.html'
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
  
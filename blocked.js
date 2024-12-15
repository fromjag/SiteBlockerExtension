function setBlockedPageTheme() {
    chrome.storage.local.get('theme', function(data) {
      const theme = data.theme || 'system';
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.dataset.theme = systemTheme;
      } else {
        document.documentElement.dataset.theme = theme;
      }
    });
  }
  
  setBlockedPageTheme();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setBlockedPageTheme);
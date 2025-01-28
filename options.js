function setTheme(theme) {
  // Save to localStorage for immediate access
  localStorage.setItem('theme', theme);
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = systemTheme;
  } else {
    document.documentElement.dataset.theme = theme;
  }

  // Sync with chrome.storage
  chrome.storage.local.set({ theme: theme });
}

function initTheme() {
  chrome.storage.local.get('theme', function(data) {
    const theme = data.theme || 'system';
    document.getElementById('themeSelector').value = theme;
    setTheme(theme);
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    chrome.storage.local.get('theme', function(data) {
      if (data.theme === 'system') {
        setTheme('system');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme
  initTheme();

  // Load saved lists
  chrome.storage.local.get(['permaBanList', 'focusList', 'mode'], function(data) {
    document.getElementById('permaBanList').value = data.permaBanList || '';
    document.getElementById('focusList').value = data.focusList || '';
    
    const toggle = document.getElementById('modeToggle');
    toggle.checked = data.mode === 'focus';
  });

  // Auto-save lists on change
  let saveTimeout;
  ['permaBanList', 'focusList'].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', function() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          const data = {
            [id]: this.value
          };
          chrome.storage.local.set(data);
        }, 500);
      });
    }
  });

  // Mode toggle handler
  const modeToggle = document.getElementById('modeToggle');
  if (modeToggle) {
    modeToggle.addEventListener('change', function() {
      const mode = this.checked ? 'focus' : 'normal';
      chrome.storage.local.set({ mode: mode });
    });
  }

  // Theme change handler
  const themeSelector = document.getElementById('themeSelector');
  if (themeSelector) {
    themeSelector.addEventListener('change', function() {
      setTheme(this.value);
    });
  }
});
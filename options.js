function setTheme(theme) {
  localStorage.setItem('theme', theme);
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = systemTheme;
  } else {
    document.documentElement.dataset.theme = theme;
  }

  // Update theme button UI
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  
  // Update icon based on current theme
  if (theme === 'system') {
    themeIcon.innerHTML = '<path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"/>';
  } else if (theme === 'dark') {
    themeIcon.innerHTML = '<path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19Z"/>';
  } else {
    themeIcon.innerHTML = '<path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8V16ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20Z"/>';
  }
  
  themeText.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);

  chrome.storage.local.set({ theme: theme });
}

function initTheme() {
  chrome.storage.local.get('theme', function(data) {
    const theme = data.theme || 'system';
    setTheme(theme);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    chrome.storage.local.get('theme', function(data) {
      if (data.theme === 'system') {
        setTheme('system');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initTheme();

  // Load saved data
  chrome.storage.local.get(['permaBanList', 'focusList', 'mode'], function(data) {
    document.getElementById('permaBanList').value = data.permaBanList || '';
    document.getElementById('focusList').value = data.focusList || '';
    
    // Set toggle state based on mode
    const toggle = document.getElementById('modeToggle');
    toggle.checked = data.mode === 'focus';
  });

  // Auto-save lists on change
  let saveTimeout;
  ['permaBanList', 'focusList'].forEach(id => {
    document.getElementById(id).addEventListener('input', function() {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        const data = {
          [id]: this.value
        };
        chrome.storage.local.set(data);
      }, 500);
    });
  });

  // Mode toggle handler
  document.getElementById('modeToggle').addEventListener('change', function() {
    const mode = this.checked ? 'focus' : 'normal';
    chrome.storage.local.set({ mode: mode });
  });

  // Theme change handler
  document.getElementById('themeSelector').addEventListener('change', function() {
    const theme = this.value;
    setTheme(theme);
  });
});
function setTheme(theme) {
  // Guardar en localStorage para acceso inmediato
  localStorage.setItem('theme', theme);
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = systemTheme;
  } else {
    document.documentElement.dataset.theme = theme;
  }

  // Sincronizar con chrome.storage
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
  initTheme();

  // Load saved lists
  chrome.storage.local.get(['permaBanList', 'focusList', 'mode'], function(data) {
    document.getElementById('permaBanList').value = data.permaBanList || '';
    document.getElementById('focusList').value = data.focusList || '';
    
    if (data.mode) {
      document.querySelector(`input[value="${data.mode}"]`).checked = true;
    }
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

  // Mode change handler
  document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener('change', function() {
      chrome.storage.local.set({ mode: this.value });
    });
  });

  // Theme change handler
  document.getElementById('themeSelector').addEventListener('change', function() {
    const theme = this.value;
    setTheme(theme);
  });
});
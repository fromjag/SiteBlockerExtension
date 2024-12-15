// theme-loader.js
(function() {
    const theme = localStorage.getItem('theme') || 'system';
    if (theme === 'system') {
      document.documentElement.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      document.documentElement.dataset.theme = theme;
    }
  })();
(function () {
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');

  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) { /* 隐私模式下不可用 */ }

  if (saved === 'dark' || saved === 'light') {
    root.setAttribute('data-theme', saved);
  }

  function currentTheme() {
    var attr = root.getAttribute('data-theme');
    if (attr) return attr;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function syncLabel() {
    var dark = currentTheme() === 'dark';
    toggle.setAttribute('aria-label', dark ? '切换浅色模式' : '切换深色模式');
    toggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
  }

  toggle.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) { /* 忽略 */ }
    syncLabel();
  });

  syncLabel();
})();

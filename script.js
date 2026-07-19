(function () {
  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var repoCount = document.getElementById('public-repo-count');

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

  if (repoCount && typeof fetch === 'function') {
    fetch('https://api.github.com/users/AliceLJY', {
      headers: { Accept: 'application/vnd.github+json' }
    })
      .then(function (response) {
        if (!response.ok) throw new Error('GitHub API ' + response.status);
        return response.json();
      })
      .then(function (profile) {
        if (Number.isInteger(profile.public_repos) && profile.public_repos >= 0) {
          repoCount.textContent = String(profile.public_repos);
        }
      })
      .catch(function () {
        repoCount.textContent = '—';
        repoCount.title = 'GitHub 暂时未返回公开仓库数';
      });
  }
})();

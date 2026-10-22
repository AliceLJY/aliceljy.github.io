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
    /* 公开仓库数：按仓库列表数非 fork 的，与 GitHub 首页口径一致（users 接口的 public_repos 会把 fork 算进去） */
    var countOwnRepos = function (page, acc) {
      return fetch('https://api.github.com/users/AliceLJY/repos?type=owner&per_page=100&page=' + page, {
        headers: { Accept: 'application/vnd.github+json' }
      })
        .then(function (response) {
          if (!response.ok) throw new Error('GitHub API ' + response.status);
          return response.json();
        })
        .then(function (repos) {
          if (!Array.isArray(repos)) throw new Error('GitHub API shape');
          var next = acc + repos.filter(function (r) { return !r.fork; }).length;
          return repos.length === 100 && page < 5 ? countOwnRepos(page + 1, next) : next;
        });
    };
    countOwnRepos(1, 0)
      .then(function (count) {
        repoCount.textContent = String(count);
      })
      .catch(function () {
        repoCount.textContent = '—';
        repoCount.title = 'GitHub 暂时未返回公开仓库数';
      });
  }
})();

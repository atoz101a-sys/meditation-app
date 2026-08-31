(function () {
  function initNav(activePage) {
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      if (link.dataset.nav === activePage) link.classList.add('active');
    });
  }
  window.MeditationApp = window.MeditationApp || {};
  window.MeditationApp.nav = { initNav: initNav };
})();

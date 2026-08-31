(function () {
  var time = window.MeditationApp.time;
  var data = window.MeditationApp.data;
  var nav = window.MeditationApp.nav;
  var TIME_LABELS = time.TIME_LABELS;

  function renderBackground(timeOfDay) {
    var assets = data.timePeriods[timeOfDay];
    var layer = document.getElementById('background-layer');
    if (!layer || !assets) return;
    layer.innerHTML =
      '<video autoplay muted loop playsinline preload="metadata" poster="' + assets.image + '">' +
      '<source src="' + assets.video + '" type="video/mp4"></video>' +
      '<img src="' + assets.image + '" alt="' + TIME_LABELS[timeOfDay] + ' 배경" loading="lazy">';
    var video = layer.querySelector('video');
    if (video) video.addEventListener('error', function () { video.style.display = 'none'; });
  }

  function createCard(m) {
    return '<article class="card">' +
      '<div class="card-meta"><span>' + TIME_LABELS[m.timeOfDay] + '</span><span>' + m.duration + '분</span></div>' +
      '<h3>' + m.titleKo + '</h3><p>' + m.description + '</p>' +
      '<a class="btn" href="meditate.html?id=' + m.id + '">명상 시작</a></article>';
  }

  nav.initNav('home');
  var timeOfDay = time.getTimeOfDay();
  renderBackground(timeOfDay);
  document.getElementById('time-label').textContent = TIME_LABELS[timeOfDay];
  document.getElementById('greeting').textContent = time.getGreeting(timeOfDay);
  document.getElementById('sub-message').textContent = time.getSubMessage(timeOfDay);
  document.getElementById('recommendations').innerHTML =
    data.getMeditationsByTimeOfDay(timeOfDay).slice(0, 2).map(createCard).join('');
})();

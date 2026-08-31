(function () {
  var time = window.MeditationApp.time;
  var data = window.MeditationApp.data;
  var storage = window.MeditationApp.storage;
  var nav = window.MeditationApp.nav;
  var TIME_LABELS = time.TIME_LABELS;
  var params = new URLSearchParams(window.location.search);
  var meditationId = params.get('id');
  var isFileProtocol = window.location.protocol === 'file:';

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

  function createListCard(m) {
    return '<article class="card">' +
      '<div class="card-meta"><span>' + TIME_LABELS[m.timeOfDay] + '</span><span>' + m.duration + '분</span></div>' +
      '<h3>' + m.titleKo + '</h3><p>' + m.description + '</p>' +
      '<a class="btn" href="meditate.html?id=' + m.id + '">시작</a></article>';
  }

  function renderList(filter) {
    filter = filter || 'current';
    document.getElementById('list-view').hidden = false;
    document.getElementById('player-view').hidden = true;
    var currentTime = time.getTimeOfDay();
    var items = filter === 'all' ? data.meditations :
      filter === 'current' ? data.getMeditationsByTimeOfDay(currentTime) :
      data.getMeditationsByTimeOfDay(filter);
    document.getElementById('meditation-list').innerHTML = items.map(createListCard).join('');
    renderBackground(currentTime);
  }

  function formatTime(totalSeconds) {
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  }

  function loadYouTubeApi(callback) {
    if (window.YT && window.YT.Player) {
      callback();
      return;
    }
    var previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      if (previousReady) previousReady();
      callback();
    };
    if (!document.getElementById('youtube-iframe-api')) {
      var tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  }

  function initVideoResize(box) {
    var handle = box.querySelector('.video-resize-handle');
    if (!handle) return;

    handle.addEventListener('mousedown', function (event) {
      event.preventDefault();
      var startX = event.clientX;
      var startY = event.clientY;
      var startWidth = box.offsetWidth;
      var startHeight = box.offsetHeight;

      function onMove(moveEvent) {
        var nextWidth = Math.max(240, startWidth + moveEvent.clientX - startX);
        var nextHeight = Math.max(135, startHeight + moveEvent.clientY - startY);
        box.style.width = nextWidth + 'px';
        box.style.height = nextHeight + 'px';
      }

      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  function initPlayer(meditation) {
    document.getElementById('list-view').hidden = true;
    document.getElementById('player-view').hidden = false;
    renderBackground(meditation.timeOfDay);
    document.getElementById('player-title').textContent = meditation.titleKo;
    document.getElementById('player-description').textContent = meditation.description;

    var timerDisplay = document.getElementById('timer-display');
    var startBtn = document.getElementById('start-btn');
    var pauseBtn = document.getElementById('pause-btn');
    var completeBtn = document.getElementById('complete-btn');
    var playerPlaceholder = document.getElementById('player-placeholder');
    var playerPlaceholderText = document.getElementById('player-placeholder-text');
    var playerThumb = document.getElementById('player-thumb');
    var youtubeLink = document.getElementById('youtube-link');
    var modal = document.getElementById('completion-modal');
    var modalMessage = document.getElementById('modal-message');
    var remainingSeconds = meditation.duration * 60;
    var timerId = null;
    var started = false;
    var completed = false;
    var ytPlayer = null;
    var ytReady = false;

    timerDisplay.textContent = formatTime(remainingSeconds);
    playerThumb.src = 'https://img.youtube.com/vi/' + meditation.youtubeId + '/hqdefault.jpg';
    youtubeLink.href = 'https://www.youtube.com/watch?v=' + meditation.youtubeId;
    initVideoResize(document.getElementById('video-resize-box'));

    if (isFileProtocol) {
      playerPlaceholder.hidden = false;
      document.getElementById('youtube-player').hidden = true;
      playerPlaceholderText.innerHTML =
        '웹페이지에서 영상 재생을 위해 <strong>열기.bat</strong>으로 실행해 주세요.<br>' +
        '(파일 더블클릭으로는 YouTube 재생이 지원되지 않습니다)';
      startBtn.disabled = true;
      return;
    }

    function showVideoArea() {
      playerPlaceholder.hidden = true;
      document.getElementById('youtube-player').hidden = false;
    }

    function createYoutubePlayer() {
      var playerVars = {
        autoplay: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        enablejsapi: 1,
      };
      if (window.location.origin && window.location.origin !== 'null') {
        playerVars.origin = window.location.origin;
      }

      ytPlayer = new YT.Player('youtube-player', {
        videoId: meditation.youtubeId,
        playerVars: playerVars,
        events: {
          onReady: function () {
            ytReady = true;
            showVideoArea();
          },
        },
      });
    }

    loadYouTubeApi(createYoutubePlayer);

    function playVideo() {
      if (ytReady && ytPlayer && ytPlayer.playVideo) {
        ytPlayer.playVideo();
      }
    }

    function pauseVideo() {
      if (ytReady && ytPlayer && ytPlayer.pauseVideo) {
        ytPlayer.pauseVideo();
      }
    }

    function stopTimer() {
      if (timerId) { clearInterval(timerId); timerId = null; }
    }

    function finishSession() {
      if (completed) return;
      completed = true;
      stopTimer();
      pauseVideo();
      var elapsedMinutes = Math.max(1, Math.ceil((meditation.duration * 60 - remainingSeconds) / 60));
      storage.addSession(meditation, elapsedMinutes);
      modalMessage.textContent = '오늘 ' + elapsedMinutes + '분 명상했습니다.';
      modal.classList.add('open');
    }

    function tick() {
      remainingSeconds -= 1;
      timerDisplay.textContent = formatTime(Math.max(0, remainingSeconds));
      if (remainingSeconds <= 0) { stopTimer(); finishSession(); }
    }

    startBtn.addEventListener('click', function () {
      if (completed) return;
      playVideo();
      if (!started) { started = true; timerId = setInterval(tick, 1000); }
      else if (!timerId) { timerId = setInterval(tick, 1000); }
    });

    pauseBtn.addEventListener('click', function () {
      pauseVideo();
      stopTimer();
    });

    completeBtn.addEventListener('click', finishSession);
    document.getElementById('modal-close').addEventListener('click', function () {
      modal.classList.remove('open');
    });
  }

  nav.initNav('meditate');
  document.querySelectorAll('[data-filter]').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('[data-filter]').forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      renderList(tab.dataset.filter);
    });
  });

  if (meditationId) {
    var meditation = data.getMeditationById(meditationId);
    if (meditation) initPlayer(meditation);
    else renderList('current');
  } else {
    renderList('current');
  }
})();

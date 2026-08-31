(function () {
  var time = window.MeditationApp.time;
  var storage = window.MeditationApp.storage;
  var nav = window.MeditationApp.nav;
  var TIME_LABELS = time.TIME_LABELS;
  var WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
  var currentMonth = new Date();
  var selectedDate = time.formatDateKey();

  function renderStats() {
    document.getElementById('total-sessions').textContent = storage.getTotalSessions();
    document.getElementById('total-minutes').textContent = storage.getTotalMinutes();
    document.getElementById('current-streak').textContent = storage.getCurrentStreak();
  }

  function renderChallenge() {
    var progress = storage.getChallengeProgress();
    var html = '';
    for (var i = 0; i < 7; i++) {
      var done = progress.completedDayIndexes.indexOf(i) !== -1;
      html += '<div class="challenge-item' + (done ? ' done' : '') + '"><span>Day ' + (i + 1) + '</span><span>' + (done ? '✓' : '○') + '</span></div>';
    }
    document.getElementById('challenge-list').innerHTML = html;
  }

  function renderSessionDetail(dateKey) {
    var panel = document.getElementById('session-detail');
    var sessions = storage.getSessionsByDate(dateKey);
    if (sessions.length === 0) {
      panel.className = 'detail-panel empty';
      panel.innerHTML = dateKey + '에는 명상 기록이 없습니다.';
      return;
    }
    var date = time.parseDateKey(dateKey);
    var label = date.getFullYear() + '년 ' + (date.getMonth() + 1) + '월 ' + date.getDate() + '일';
    panel.className = 'detail-panel';
    panel.innerHTML = '<h3>' + label + '</h3>' + sessions.map(function (s) {
      return '<p>' + s.title + ' · ' + s.duration + '분 · ' + (TIME_LABELS[s.timeOfDay] || s.timeOfDay) + '</p>';
    }).join('');
  }

  function renderCalendar() {
    var year = currentMonth.getFullYear();
    var month = currentMonth.getMonth();
    var firstDay = new Date(year, month, 1);
    var lastDay = new Date(year, month + 1, 0);
    var meditationDates = storage.getUniqueMeditationDates();
    document.getElementById('calendar-title').textContent = year + '년 ' + (month + 1) + '월';
    var grid = document.getElementById('calendar-grid');
    grid.innerHTML = WEEKDAYS.map(function (d) { return '<div class="calendar-weekday">' + d + '</div>'; }).join('');
    for (var i = 0; i < firstDay.getDay(); i++) grid.insertAdjacentHTML('beforeend', '<div class="calendar-day empty"></div>');
    for (var day = 1; day <= lastDay.getDate(); day++) {
      var date = new Date(year, month, day);
      var dateKey = time.formatDateKey(date);
      var minutes = storage.getMinutesForDate(dateKey);
      var hasSession = meditationDates.indexOf(dateKey) !== -1;
      var isSelected = selectedDate === dateKey;
      grid.insertAdjacentHTML('beforeend',
        '<div class="calendar-day' + (hasSession ? ' has-session' : '') + (isSelected ? ' selected' : '') + '">' +
        '<button type="button" data-date="' + dateKey + '"><div class="day-number">' + day + '</div>' +
        (hasSession ? '<div class="day-minutes">● ' + minutes + '분</div>' : '') + '</button></div>');
    }
    grid.querySelectorAll('[data-date]').forEach(function (button) {
      button.addEventListener('click', function () {
        selectedDate = button.dataset.date;
        renderCalendar();
        renderSessionDetail(selectedDate);
      });
    });
  }

  nav.initNav('journey');
  renderStats();
  renderChallenge();
  renderCalendar();
  renderSessionDetail(selectedDate);
  document.getElementById('prev-month').addEventListener('click', function () {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    renderCalendar();
  });
  document.getElementById('next-month').addEventListener('click', function () {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    renderCalendar();
  });
})();

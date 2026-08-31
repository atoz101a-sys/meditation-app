(function () {
  var time = window.MeditationApp.time;
  var STORAGE_KEY = 'meditation-app-data';

  function createDefaultData() {
    return {
      dataVersion: 1,
      sessions: [],
      challenge: { startDate: time.formatDateKey(), completedDayIndexes: [] },
    };
  }

  function loadData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultData();
      var parsed = JSON.parse(raw);
      var defaults = createDefaultData();
      return {
        dataVersion: parsed.dataVersion || defaults.dataVersion,
        sessions: parsed.sessions || [],
        challenge: Object.assign({}, defaults.challenge, parsed.challenge || {}),
      };
    } catch (e) {
      return createDefaultData();
    }
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function addSession(meditation, durationMinutes) {
    var data = loadData();
    var today = time.formatDateKey();
    var session = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      date: today,
      duration: durationMinutes,
      meditationId: meditation.id,
      title: meditation.titleKo,
      timeOfDay: meditation.timeOfDay,
      completedAt: new Date().toISOString(),
    };
    data.sessions.push(session);
    updateChallenge(data, today);
    saveData(data);
    return session;
  }

  function updateChallenge(data, today) {
    var start = time.parseDateKey(data.challenge.startDate);
    var current = time.parseDateKey(today);
    var diffDays = Math.floor((current - start) / (1000 * 60 * 60 * 24));
    if (diffDays < 0 || diffDays > 6) {
      data.challenge.startDate = today;
      data.challenge.completedDayIndexes = [0];
      return;
    }
    if (data.challenge.completedDayIndexes.indexOf(diffDays) === -1) {
      data.challenge.completedDayIndexes.push(diffDays);
      data.challenge.completedDayIndexes.sort(function (a, b) { return a - b; });
    }
  }

  function getTotalSessions() { return loadData().sessions.length; }
  function getTotalMinutes() {
    return loadData().sessions.reduce(function (sum, s) { return sum + s.duration; }, 0);
  }
  function getSessionsByDate(dateKey) {
    return loadData().sessions.filter(function (s) { return s.date === dateKey; });
  }
  function getUniqueMeditationDates() {
    var dates = loadData().sessions.map(function (s) { return s.date; });
    return dates.filter(function (d, i) { return dates.indexOf(d) === i; });
  }
  function getCurrentStreak() {
    var dates = getUniqueMeditationDates().sort();
    if (dates.length === 0) return 0;
    var today = time.formatDateKey();
    var yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    var yesterday = time.formatDateKey(yesterdayDate);
    var startDate = today;
    if (dates.indexOf(today) === -1) {
      if (dates.indexOf(yesterday) === -1) return 0;
      startDate = yesterday;
    }
    var streak = 0;
    var cursor = time.parseDateKey(startDate);
    while (true) {
      var key = time.formatDateKey(cursor);
      if (dates.indexOf(key) === -1) break;
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }
  function getChallengeProgress() {
    var challenge = loadData().challenge;
    return {
      startDate: challenge.startDate,
      completedDayIndexes: challenge.completedDayIndexes.slice().sort(function (a, b) { return a - b; }),
    };
  }
  function getMinutesForDate(dateKey) {
    return getSessionsByDate(dateKey).reduce(function (sum, s) { return sum + s.duration; }, 0);
  }

  window.MeditationApp = window.MeditationApp || {};
  window.MeditationApp.storage = {
    addSession: addSession,
    getTotalSessions: getTotalSessions,
    getTotalMinutes: getTotalMinutes,
    getSessionsByDate: getSessionsByDate,
    getUniqueMeditationDates: getUniqueMeditationDates,
    getCurrentStreak: getCurrentStreak,
    getChallengeProgress: getChallengeProgress,
    getMinutesForDate: getMinutesForDate,
  };
})();

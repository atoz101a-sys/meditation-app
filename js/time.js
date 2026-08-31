(function () {
  const TIME_LABELS = {
    dawn: '새벽',
    morning: '아침',
    day: '낮',
    sunset: '노을',
    night: '밤',
  };

  function getTimeOfDay(date) {
    const d = date || new Date();
    const hour = d.getHours();
    if (hour >= 5 && hour < 7) return 'dawn';
    if (hour >= 7 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'sunset';
    return 'night';
  }

  function getGreeting(timeOfDay) {
    const greetings = {
      dawn: '고요한 새벽이에요',
      morning: '좋은 아침이에요',
      day: '잠시, 쉬어가세요',
      sunset: '하루를 마무리할 시간이에요',
      night: '편안한 밤 되세요',
    };
    return greetings[timeOfDay] || greetings.day;
  }

  function getSubMessage(timeOfDay) {
    const messages = {
      dawn: '새로운 하루를 위해 마음을 정리해보세요.',
      morning: '차분한 마음으로 하루를 시작해보세요.',
      day: '잠시 멈추고 숨을 고르세요.',
      sunset: '하루의 긴장을 내려놓을 시간이에요.',
      night: '편안히 쉬며 하루를 마무리하세요.',
    };
    return messages[timeOfDay] || messages.day;
  }

  function formatDateKey(date) {
    const d = date || new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  function parseDateKey(dateKey) {
    const parts = dateKey.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  window.MeditationApp = window.MeditationApp || {};
  window.MeditationApp.time = {
    TIME_LABELS: TIME_LABELS,
    getTimeOfDay: getTimeOfDay,
    getGreeting: getGreeting,
    getSubMessage: getSubMessage,
    formatDateKey: formatDateKey,
    parseDateKey: parseDateKey,
  };
})();

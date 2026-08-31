(function () {
  const timePeriods = {
    dawn: { image: 'assets/images/새벽.jpg', video: 'assets/videos/새벽.mp4' },
    morning: { image: 'assets/images/아침.jpg', video: 'assets/videos/아침.mp4' },
    day: { image: 'assets/images/낮.jpg', video: 'assets/videos/낮.mp4' },
    sunset: { image: 'assets/images/노을.jpg', video: 'assets/videos/노을.mp4' },
    night: { image: 'assets/images/밤.jpg', video: 'assets/videos/밤.mp4' },
  };

  const meditations = [
    {
      id: 1,
      titleKo: '10분 마음 비우기 & 새 습관',
      description: '마음을 정리하고 긍정적인 하루를 시작해요.',
      timeOfDay: 'dawn',
      duration: 10,
      youtubeId: 'uTN29kj7e-w',
      category: 'mindfulness',
    },
    {
      id: 2,
      titleKo: '10분 스트레스 완화 명상',
      description: '호흡에 집중하며 차분하게 하루를 시작해요.',
      timeOfDay: 'morning',
      duration: 10,
      youtubeId: 'tuPW7oOudVc',
      category: 'stress',
    },
    {
      id: 3,
      titleKo: '10분 마음 이완 명상',
      description: '긴장을 풀고 마음을 가볍게 만들어요.',
      timeOfDay: 'morning',
      duration: 10,
      youtubeId: 'C8FetUZN5RQ',
      category: 'relax',
    },
    {
      id: 4,
      titleKo: '10분 집중 리셋 명상',
      description: '잠시 멈추고, 숨 쉬고, 다시 시작해요.',
      timeOfDay: 'day',
      duration: 10,
      youtubeId: 'ez3GgRqhNvA',
      category: 'focus',
    },
    {
      id: 5,
      titleKo: '18분 스트레스 해소 명상',
      description: '호흡과 함께 쌓인 스트레스를 천천히 내려놓아요.',
      timeOfDay: 'day',
      duration: 18,
      youtubeId: 'U3fCYUwVHIE',
      category: 'stress',
    },
    {
      id: 6,
      titleKo: '깊은 평온 & 이완 명상',
      description: '하루를 내려놓고 평온함을 느껴보세요.',
      timeOfDay: 'sunset',
      duration: 13,
      youtubeId: '6ct9ryEaAbU',
      category: 'relax',
    },
    {
      id: 7,
      titleKo: '20분 수면 명상',
      description: '천천히, 편안히 잠들 준비를 해요.',
      timeOfDay: 'night',
      duration: 20,
      youtubeId: 'g0jfhRcXtLQ',
      category: 'sleep',
    },
    {
      id: 8,
      titleKo: '20분 깊은 수면 명상',
      description: '몸의 긴장을 풀며 휴식을 준비해요.',
      timeOfDay: 'night',
      duration: 20,
      youtubeId: 'DBhadQTCBeo',
      category: 'sleep',
    },
  ];

  function getMeditationById(id) {
    return meditations.find(function (item) { return item.id === Number(id); });
  }

  function getMeditationsByTimeOfDay(timeOfDay) {
    return meditations.filter(function (item) { return item.timeOfDay === timeOfDay; });
  }

  window.MeditationApp = window.MeditationApp || {};
  window.MeditationApp.data = {
    timePeriods: timePeriods,
    meditations: meditations,
    getMeditationById: getMeditationById,
    getMeditationsByTimeOfDay: getMeditationsByTimeOfDay,
  };
})();

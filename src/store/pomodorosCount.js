// store/pomodorosCount.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { usePomodoroSetup } from "./pomodoroSetup";

import { computed } from "vue";
// NOTE: move to state
let initialPomodorosCount = {
  passedPomodoros: 0,
  passedSessions: 0,
  incompleteSection: false,
};
const { pomodoroSetup } = usePomodoroSetup();
const {
  timersInSession,
  sessionsAmount,
  timersPause,
  sessionsPause,
  timerDuration: initialDuration,
} = pomodoroSetup;

// const {
//   timerDuration: initialDuration,
//   sessionsAmount,
//   timersInSession,
// } = pomodoroSetup.value;

// NOTE: added now on bottom
let lastTime;
let handle;
let remainedSeconds;

// const timerDuration = ref(initialDuration * 60 * 1000); // NOTE: for prod
const timerDuration = ref(initialDuration * 1000); // NOTE: for dev
// const changePauseDisplay = 1000 * 60; // NOTE: for prod
const changePauseDisplay = 1000; // NOTE: for dev

// NOTE: added now on top
//
//
//
//
export const usePomodorosCount = defineStore("pomodorosCount", () => {
  const pomodorosCount = ref(initialPomodorosCount);
  // NOTE: added now on top
  let passedPause = ref(0);
  const timerDuration = ref(initialDuration * 1000); // NOTE: for dev
  const reminded = ref(initialDuration);
  const remindedMinuteSecondsValue = ref(0);
  const remindedMinutesValue = ref(initialDuration);
  const isCounting = ref(false);
  const inPauseState = ref(false);
  const readyToContinue = ref(false);
  const passedPomodoros = computed(() => countData.value.passedPomodoros);
  const passedSessions = computed(() => countData.value.passedSessions);
  const pauseOnDisplay = computed(() =>
    pomodorosPause.value - passedPause.value
  );
  // NOTE: added now on top
  //
  //
  //
  // NOTE: pomodoros count
  const countData = computed(() => pomodorosCount.value);
  const inPause = computed(() => inPauseState.value);
  const remindedMinuteSeconds = computed(() =>
    remindedMinuteSecondsValue.value
  );
  const remindedMinutes = computed(() => remindedMinutesValue.value);

  // NOTE: added now on bottom

  //
  // NOTE: added now on top

  const isCountingComplete = computed(() => {
    console.log(
      "iiii",
      pomodorosCount.value.passedPomodoros !== 0 &&
        pomodorosCount.value.passedPomodoros %
              timersInSession === 0,
    );
    return pomodorosCount.value.passedPomodoros !== 0 &&
      pomodorosCount.value.passedPomodoros %
            timersInSession === 0 &&
      pomodorosCount.value.passedSessions === sessionsAmount;
  });

  const pomodorosPause = computed(() => {
    return pomodorosCount.value.passedPomodoros %
          timersInSession !== 0
      ? timersPause
      : sessionsPause;
  });
  // NOTE: added now on bottom

  //
  // NOTE: added now on top

  function addPomodoro() {
    // const setup = usePomodoroSetup();

    pomodorosCount.value.passedPomodoros += 1;

    console.log(
      "is session passed",
      pomodorosCount.value.passedPomodoros,
      timersInSession,
      // pomodorosCount.value.passedSessions !== 0 &&
      pomodorosCount.value.passedPomodoros %
          timersInSession === 0,
    );
    if (
      //pomodorosCount.value.passedSessions !== 0 &&
      pomodorosCount.value.passedPomodoros %
          timersInSession === 0
    ) {
      pomodorosCount.value.passedSessions += 1;
    }
  }
  // NOTE: added now on bottom

  function update() {
    if (!isCounting.value) return;

    const timerCount = timerDuration.value - (performance.now() - lastTime);
    remainedSeconds = Math.abs(timerCount / 1000).toFixed(0);
    remindedMinutesValue.value = Math.floor(remainedSeconds / 60);
    remindedMinuteSecondsValue.value = remainedSeconds -
      remindedMinutesValue.value * 60;

    // TODO: delete
    console.log(
      remainedSeconds,
      remindedMinuteSecondsValue.value,
      remindedMinutesValue.value,
      timerDuration.value,
      reminded.value,
      "...",
      isCounting.value,
      "---",
      countData.value.passedPomodoros,
      // handle,
    );

    if (remainedSeconds <= 0) {
      // console.log("timer end", "is complete session value:", isCountingComplete);
      handle = null;
      isCounting.value = false;
      cancelAnimationFrame(handle);
      addPomodoro();
      console.log(" isCountingComplete value:", isCountingComplete.value);
      console.log("pomodoros pause:", pomodorosPause.value);
      if (!isCountingComplete.value) {
        console.log("sessoin is incomplete");
        startInSessionPause();
      } else {
        console.log("session is complete");
        reset();
      }
    } else {
      handle = requestAnimationFrame(update);
    }
  }

  function onTimerClick() {
    console.log("CLICK on timer", isCounting.value, handle);
    if (!isCounting.value && !handle) {
      console.log("start");
      lastTime = performance.now();
      startCountdown();
    } else if (isCounting.value && handle) {
      console.log("pause");
      pauseTimer();
    }
  }

  function restart() {
    console.log("NO CLICK", isCounting.value, handle);
    stop();
    readyToContinue.value = false;
    lastTime = performance.now();
    startCountdown();
    update();
  }

  function reset() {
    isCounting.value = false;
    reminded.value = initialDuration;
    remindedMinuteSecondsValue.value = 0;
    remindedMinutesValue.value = initialDuration;
    lastTime = null;
    handle = null;
    readyToContinue.value = false;
  }

  function pauseTimer() {
    isCounting.value = false;
    handle = null;
    timerDuration.value = remainedSeconds * 1000;
  }

  function startInSessionPause() {
    console.log(pomodorosPause.value, "pause, now count as seconds");

    const pauseInterval = setInterval(() => {
      passedPause.value += 1;
      console.log("pauseOnDisplay decreased:", passedPause.value);
    }, changePauseDisplay);
    // pauseInterval;

    inPauseState.value = true;

    setTimeout(() => {
      console.log("pause end");
      // }, pomodorosPause.value * 60 * 1000); // count as minutes
      inPauseState.value = false;
      clearInterval(pauseInterval);
      passedPause.value = 0;
      readyToContinue.value = true;
      //NOTE: ;;;
      isCounting.value = null;
      handle = null;
      reminded.value = initialDuration;
      remindedMinuteSecondsValue.value = 0;
      remindedMinutesValue.value = initialDuration;
      console.log("lll ll l");
      // restart();
    }, pomodorosPause.value * 1000); // NOTE: count as seconds to test on dev
    //   },
    //   pomodorosPause.value * 1000 * 60,
    // ); // NOTE: count as minuetes on prod
  }

  function startCountdown() {
    //   //  reminded.value = initialDuration;
    //   //  remindedMinuteSecondsValue.value = 0;
    //   //  remindedMinutesValue.value = initialDuration;
    //   //  lastTime = performance.now();
    isCounting.value = true; // Set the flag to start counting
    update(); // Initial call to start the countdown
  }

  //
  // NOTE: added now on top
  return {
    addPomodoro,
    countData,
    isCountingComplete,
    pomodorosPause,
    update,
    onTimerClick,
    restart,
    reset,
    pauseTimer,
    startInSessionPause,
    startCountdown,
    //
    inPause,
    remindedMinuteSeconds,
    remindedMinutes,
    pauseOnDisplay,
    passedPomodoros,
    passedSessions,
  };
  //  return { addPomodoro, countData };
});

import { defineStore } from "pinia";
import { ref } from "vue";
import { usePomodoroSetup } from "./pomodoroSetup";
import { useRecordsStore } from "./records";
import { useUserStore } from "./user";
import { useAudioStore } from "./audio";

import { computed } from "vue";
// NOTE: move to state
let initialPomodorosCount = {
  passedPomodoros: 0,
  passedSessions: 0,
};
const { pomodoroSetup } = usePomodoroSetup();
const {
  timersInSession,
  sessionsAmount,
  timersPause,
  sessionsPause,
  timerDuration: initialDuration,
} = pomodoroSetup;

const { savePomodoroRecordToDb } = useRecordsStore();
const userStore = useUserStore();

// NOTE: initial:
// lastTime = undefined
// handle = undefined
// remainedSeconds = undefined
// timerStartAt = undefined
// passedPause = ref 0
// timerDuration = ref(initialDuration * 1000 * 60)
// reminded = ref initialDuration
// remindedMinuteSecondsValue = ref 0
// remindedMinutesValue = ref initialDuration
// isCounting = ref(false);
// inPauseState = ref(false);
// readyToContinue = ref(false);
let lastTime;
let handle;
let remainedSeconds;
let timerStartAt;
const date = () => {
  const day = new Date();
  day.setHours(0, 0, 0, 0);
  return day.getTime();
};

// const changePauseDisplay = 1000; // NOTE: for dev
const changePauseDisplay = 1000 * 60;

export const usePomodorosCount = defineStore("pomodorosCount", () => {
  const pomodorosCount = ref(initialPomodorosCount);
  // NOTE: added now on top
  let passedPause = ref(0);
  // const timerDuration = ref(initialDuration * 1000); // NOTE: for dev
  const timerDuration = ref(initialDuration * 1000 * 60);
  const reminded = ref(initialDuration);
  const remindedMinuteSecondsValue = ref(0);
  const remindedMinutesValue = ref(initialDuration);
  const isCounting = ref(false);
  const inPauseState = ref(false);
  const readyToContinue = ref(false);
  const passedPomodoros = computed(() => countData.value.passedPomodoros);
  const passedSessions = computed(() => countData.value.passedSessions);
  const pauseOnDisplay = computed(
    () => pomodorosPause.value - passedPause.value,
  );
  const countData = computed(() => pomodorosCount.value);
  const inPause = computed(() => inPauseState.value);
  const remindedMinuteSeconds = computed(
    () => remindedMinuteSecondsValue.value,
  );
  const remindedMinutes = computed(() => remindedMinutesValue.value);
  const isCountingComplete = computed(() => {
    return (
      pomodorosCount.value.passedPomodoros !== 0 &&
      pomodorosCount.value.passedPomodoros % timersInSession === 0 &&
      pomodorosCount.value.passedSessions === sessionsAmount
    );
  });

  const pomodorosPause = computed(() => {
    return pomodorosCount.value.passedPomodoros % timersInSession !== 0
      ? timersPause
      : sessionsPause;
  });

  const isLoggedIn = computed(() => userStore.isLoggedIn);

  function update() {
    if (!isCounting.value) return;

    const timerCount = timerDuration.value - (performance.now() - lastTime);
    remainedSeconds = Math.abs(timerCount / 1000).toFixed(0);
    remindedMinutesValue.value = Math.floor(remainedSeconds / 60);
    remindedMinuteSecondsValue.value =
      remainedSeconds - remindedMinutesValue.value * 60;

    if (remainedSeconds <= 0) {
      handle = null;
      isCounting.value = false;
      cancelAnimationFrame(handle);
      addPomodoro();
      useAudioStore().playBeepSound();
      if (!isCountingComplete.value) {
        startInSessionPause();
      } else {
        reset();
      }
    } else {
      handle = requestAnimationFrame(update);
    }
  }

  function onTimerClick() {
    if (!timerStartAt) {
      timerStartAt = Date.now();
    }
    if (!isCounting.value && !handle) {
      lastTime = performance.now();
      startCountdown();
    } else if (isCounting.value && handle) {
      pauseTimer();
    }
  }

  function restart() {
    stop();
    readyToContinue.value = false;
    lastTime = performance.now();
    startCountdown();
    update();
  }
  // FIX: when on pause, on stop button click no resetted
  function reset() {
    lastTime = null;
    handle = null;
    remainedSeconds = null;
    timerStartAt = null;
    timerDuration.value = initialDuration * 1000 * 60;
    passedPause.value = 0;
    reminded.value = initialDuration;
    remindedMinuteSecondsValue.value = 0;
    remindedMinutesValue.value = initialDuration;
    isCounting.value = false;
    inPauseState.value = false;
    readyToContinue.value = false;
  }

  function pauseTimer() {
    isCounting.value = false;
    handle = null;
    timerDuration.value = remainedSeconds * 1000;
  }

  function startInSessionPause() {
    const pauseInterval = setInterval(() => {
      passedPause.value += 1;
    }, changePauseDisplay);

    inPauseState.value = true;

    setTimeout(
      () => {
        inPauseState.value = false;
        clearInterval(pauseInterval);
        passedPause.value = 0;
        readyToContinue.value = true;
        isCounting.value = null;
        handle = null;
        reminded.value = initialDuration;
        remindedMinuteSecondsValue.value = 0;
        remindedMinutesValue.value = initialDuration;
        useAudioStore().playBeepSound();
        // }, pomodorosPause.value * 1000); // NOTE: count as seconds to test on dev
      },
      pomodorosPause.value * 1000 * 60,
    );
  }

  function startCountdown() {
    isCounting.value = true;
    update();
  }

  // TODO: move to service
  async function addPomodoro() {
    pomodorosCount.value.passedPomodoros += 1;

    if (pomodorosCount.value.passedPomodoros % timersInSession === 0) {
      pomodorosCount.value.passedSessions += 1;
    }

    if (isLoggedIn.value) {
      const payload = {
        pomodoroDate: date(),
        pomororoStartTime: timerStartAt,
        pomodoroEndTime: timerStartAt + timerDuration.value,
      };

      await savePomodoroRecordToDb(payload);
    }

    timerStartAt = null;
  }

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
    inPause,
    remindedMinuteSeconds,
    remindedMinutes,
    pauseOnDisplay,
    passedPomodoros,
    passedSessions,
  };
});

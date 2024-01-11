import { defineStore } from "pinia";
import { ref } from "vue";
import { usePomodoroSetup } from "./pomodoroSetup";
import { useRecordsStore } from "./records";
import { useUserStore } from "./user";

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

const { savePomodoroRecordToDb } = useRecordsStore();
const userStore = useUserStore();

// NOTE: added now on bottom
let lastTime;
let handle;
let remainedSeconds;
let timerStartAt;
const date = () => {
  const day = new Date();
  day.setHours(0, 0, 0, 0);
  return day.getTime();
};

const changePauseDisplay = 1000; // NOTE: for dev

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
  const countData = computed(() => pomodorosCount.value);
  const inPause = computed(() => inPauseState.value);
  const remindedMinuteSeconds = computed(() =>
    remindedMinuteSecondsValue.value
  );
  const remindedMinutes = computed(() => remindedMinutesValue.value);
  const isCountingComplete = computed(() => {
    console.log(
      "iiii i",
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

  const isLoggedIn = computed(() => userStore.isLoggedIn);

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
    if (!timerStartAt) {
      timerStartAt = Date.now();
      console.log("timer started at: ", timerStartAt);
    }
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

    inPauseState.value = true;

    setTimeout(() => {
      console.log("pause end");
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
    }, pomodorosPause.value * 1000); // NOTE: count as seconds to test on dev
  }

  function startCountdown() {
    isCounting.value = true; // Set the flag to start counting
    update(); // Initial call to start the countdown
  }

  function addPomodoro() {
    // console.log(isLoggedIn.value, "auth data in addPomodoro");

    pomodorosCount.value.passedPomodoros += 1;

    console.log(
      "is session passed",
      pomodorosCount.value.passedPomodoros,
      timersInSession,
      pomodorosCount.value.passedPomodoros %
          timersInSession === 0,
    );
    if (
      pomodorosCount.value.passedPomodoros %
          timersInSession === 0
    ) {
      pomodorosCount.value.passedSessions += 1;
    }

    if (isLoggedIn.value) {
      const payload = {
        pomodoroDate: date(),
        pomororoStartTime: timerStartAt,
        pomodoroEndTime: timerStartAt + timerDuration.value,
      };
      //
      savePomodoroRecordToDb(payload);
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
    //
    inPause,
    remindedMinuteSeconds,
    remindedMinutes,
    pauseOnDisplay,
    passedPomodoros,
    passedSessions,
  };
});

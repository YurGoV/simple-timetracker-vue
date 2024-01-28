import { defineStore } from "pinia";
import { ref } from "vue";
import { useRecordsStore } from "./records";
import { useUserStore } from "./user";
import { useAudioStore } from "./audio";

import { computed } from "vue";
// NOTE: move to state

// const { savePomodoroRecordToDb } = useRecordsStore();
const userStore = useUserStore();
let countedSeconds;
let handle;
let timeOnPause = 0;

// const lastUpdate = ref(performance.now());
const date = () => {
  const day = new Date();
  day.setHours(0, 0, 0, 0);
  return day.getTime();
};

export const useTimer = defineStore("timer", () => {
  const timerData = ref(0);
  const initialTimerValue = ref(0);
  // const timerDuration = ref(initialDuration * 1000 * 60);
  const isCounting = ref(false);
  const inPause = ref(false);
  // const passedTime = computed(() => timerData.value);
  const passedMinutes = computed(() =>
    Math.floor((timeOnPause + timerData.value) / 60),
  );
  const passedSeconds = computed(
    () => timeOnPause + timerData.value - passedMinutes.value * 60,
  );
  // const inPause = computed(() => inPauseState.value);

  const isLoggedIn = computed(() => userStore.isLoggedIn);

  function update() {
    if (!isCounting.value) return;
    const timerCount = performance.now() - initialTimerValue.value;

    countedSeconds = Math.abs(timerCount / 1000).toFixed(0);
    timerData.value = Math.floor(countedSeconds);

    handle = requestAnimationFrame(update);
  }

  function onTimerClick() {
    console.log("clicked on timer", isCounting.value, handle, timerData.value);

    if (!isCounting.value && handle && timerData.value > 0) {
      console.log("resume");
      initialTimerValue.value = performance.now();
      startCountdown();
    } else if (!isCounting.value && !handle) {
      initialTimerValue.value = performance.now();
      console.log("start", initialTimerValue.value);
      startCountdown();
    } else if (isCounting.value && handle) {
      console.log("pause");
      timeOnPause = timeOnPause + timerData.value;
      pauseTimer();
    }
  }

  function resetTimer() {
    console.log("click on resetTimer");
    initialTimerValue.value = 0;
    isCounting.value = false;
    inPause.value = false;
    handle = null;
    timeOnPause = 0;
    timerData.value = 0;
    // isCounting.value = false;
    // reminded.value = initialDuration;
    // remindedMinuteSecondsValue.value = 0;
    // remindedMinutesValue.value = initialDuration;
    // lastTime = null;
    // handle = null;
    // readyToContinue.value = false;
  }

  function pauseTimer() {
    isCounting.value = false;
    inPause.value = true;
  }

  function startCountdown() {
    isCounting.value = true;
    inPause.value = false;
    update();
  }

  // TODO: move to service
  async function addTimer() {
    console.log("click on adTimer store");
    // pomodorosCount.value.passedPomodoros += 1;
    //
    // if (pomodorosCount.value.passedPomodoros % timersInSession === 0) {
    //   pomodorosCount.value.passedSessions += 1;
    // }
    //
    // if (isLoggedIn.value) {
    //   const payload = {
    //     pomodoroDate: date(),
    //     pomororoStartTime: timerStartAt,
    //     pomodoroEndTime: timerStartAt + timerDuration.value,
    //   };
    //
    //   await savePomodoroRecordToDb(payload);
    // }
    //
    // timerStartAt = null;
  }

  return {
    // passedTime,
    passedMinutes,
    passedSeconds,
    // update,
    onTimerClick,
    resetTimer,
    addTimer,
    // startCountdown,
    inPause,
  };
});

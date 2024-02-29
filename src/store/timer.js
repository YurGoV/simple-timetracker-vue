import { defineStore } from "pinia";
import { ref } from "vue";
import { useRecordsStore } from "./records";
import { useUserStore } from "./user";

import { computed } from "vue";
// NOTE: move to state

const { savePomodoroRecordToDb } = useRecordsStore();
const userStore = useUserStore();

// NOTE: initial values:
// countedSeconds = undefined
// handle = undefined
// timeOnPause = 0
// timerStartAt = undefined
// timerData = ref 0
// initialTimerValue = ref 0
// isCounting = ref false
// inPause = ref false

let countedSeconds;
let handle;
let timeOnPause = 0;
let timerStartAt;

const date = () => {
  const day = new Date();
  day.setHours(0, 0, 0, 0);
  return day.getTime();
};

export const useTimer = defineStore("timer", () => {
  const isLoggedIn = computed(() => userStore.isLoggedIn);

  const timerData = ref(0);
  const initialTimerValue = ref(0);
  // const timerDuration = ref(initialDuration * 1000 * 60);
  const isCounting = ref(false);
  const inPause = ref(false);

  const passedMinutes = computed(() =>
    Math.floor((timeOnPause + timerData.value) / 60),
  );
  const passedSeconds = computed(
    () => timeOnPause + timerData.value - passedMinutes.value * 60,
  );

  function update() {
    if (!isCounting.value) return;
    const timerCount = performance.now() - initialTimerValue.value;

    countedSeconds = Number(Math.abs(timerCount / 1000).toFixed(0));
    timerData.value = Math.floor(countedSeconds);

    handle = requestAnimationFrame(update);
  }

  function onTimerClick() {
    if (!isCounting.value && handle && timerData.value > 0) {
      // NOTE: resume on click
      initialTimerValue.value = performance.now();
    } else if (!isCounting.value && !handle) {
      // NOTE: first (start) on click,
      initialTimerValue.value = performance.now();
      timerStartAt = Date.now();
      startCountdown();
    } else if (isCounting.value && handle) {
      // NOTE: on pause click
      timeOnPause = timeOnPause + timerData.value;
      pauseTimer();
    }
  }

  function resetTimer() {
    // NOTE: new
    countedSeconds = null;
    handle = null;
    timeOnPause = 0;
    timerStartAt = null;
    timerData.value = 0;
    initialTimerValue.value = 0;
    isCounting.value = false;
    inPause.value = false;
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
    if (isLoggedIn.value) {
      const endTime = timerStartAt + timeOnPause * 1000;
      const payload = {
        pomodoroDate: date(),
        pomororoStartTime: timerStartAt,
        pomodoroEndTime: endTime,
      };

      const result = await savePomodoroRecordToDb(payload);
      if (result) {
        timerStartAt = null;
        resetTimer();
        return true;
      }
      return false;
    }
    return false;
  }

  return {
    passedMinutes,
    passedSeconds,
    onTimerClick,
    resetTimer,
    addTimer,
    inPause,
  };
});

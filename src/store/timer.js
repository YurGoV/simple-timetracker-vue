import { defineStore } from "pinia";
import { ref } from "vue";
import { useRecordsStore } from "./records";
import { useUserStore } from "./user";

import { computed } from "vue";
// NOTE: move to state

const { savePomodoroRecordToDb } = useRecordsStore();
const userStore = useUserStore();
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
  // const passedTime = computed(() => timerData.value);
  const passedMinutes = computed(() =>
    Math.floor((timeOnPause + timerData.value) / 60),
  );
  const passedSeconds = computed(
    () => timeOnPause + timerData.value - passedMinutes.value * 60,
  );
  // const inPause = computed(() => inPauseState.value);
  const timerEndAt = computed(() => {
    return timerStartAt + timeOnPause * 1000;
  });

  function update() {
    if (!isCounting.value) return;
    const timerCount = performance.now() - initialTimerValue.value;

    countedSeconds = Math.abs(timerCount / 1000).toFixed(0);
    timerData.value = Math.floor(countedSeconds);

    handle = requestAnimationFrame(update);
  }

  function onTimerClick() {

    if (!isCounting.value && handle && timerData.value > 0) {
      initialTimerValue.value = performance.now();
      startCountdown();
    } else if (!isCounting.value && !handle) {
      initialTimerValue.value = performance.now();
      timerStartAt = Date.now();
      startCountdown();
    } else if (isCounting.value && handle) {
      timeOnPause = timeOnPause + timerData.value;
      pauseTimer();
    }
  }

  function resetTimer() {
    initialTimerValue.value = 0;
    isCounting.value = false;
    inPause.value = false;
    handle = null;
    timeOnPause = 0;
    timerData.value = 0;
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
      const payload = {
        pomodoroDate: date(),
        pomororoStartTime: timerStartAt,
        // pomodoroEndTime: timerStartAt + timerDuration.value,
        pomodoroEndTime: timerEndAt.value,
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

// store/pomodoroSetup.js
import { defineStore } from "pinia";
import { computed, ref } from "vue";
// NOTE: move to state
let initialPomodoroSetup = {
  // NOTE: for dev-nt
  // timerDuration: 2,
  // timersPause: 1,
  // timersInSession: 3,
  // sessionsPause: 2,
  // sessionsAmount: 2,
  timerDuration: 25,
  timersPause: 5,
  timersInSession: 3,
  sessionsPause: 15,
  sessionsAmount: 2,
};

// TODO: setup in back for registered users
export const usePomodoroSetup = defineStore("pomodoroSetup", () => {
  const setupStore = ref(initialPomodoroSetup);

  // NOTE: pomodoro setup
  const pomodoroSetup = computed(() => setupStore.value || null);

  return { pomodoroSetup };
});

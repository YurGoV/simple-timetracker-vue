// store/pomodoroSetup.js
import { defineStore } from "pinia";
import { computed, ref } from "vue";
// NOTE: move to state
let initialPomodoroSetup = {
  timerDuration: 5, // on test used as seconds
  timersPause: 1, // on test use as seconds
  timersInSession: 3,
  sessionsPause: 2,
  sessionsAmount: 2,
};

// TODO: setup in back for registered users
export const usePomodoroSetup = defineStore("pomodoroSetup", () => {
  const setupStore = ref(initialPomodoroSetup);

  // NOTE: pomodoro setup
  const pomodoroSetup = computed(() => setupStore.value || null);

  return { pomodoroSetup };
});

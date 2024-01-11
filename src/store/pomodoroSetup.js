// store/pomodoroSetup.js
import { defineStore } from "pinia";
import { computed, ref } from "vue";
// NOTE: move to state
let initialPomodoroSetup = {
  timerDuration: 5, // on test used as seconds
  timersPause: 2, // on test use as seconds
  timersInSession: 3,
  sessionsPause: 4,
  sessionsAmount: 2,
};

export const usePomodoroSetup = defineStore("pomodoroSetup", () => {
  const setupStore = ref(initialPomodoroSetup);

  // NOTE: pomodoro setup
  const pomodoroSetup = computed(() => setupStore.value || null);

  return { pomodoroSetup };
});

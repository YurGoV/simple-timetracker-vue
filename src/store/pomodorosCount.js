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
const { timersInSession, sessionsAmount, timersPause, sessionsPause } =
  pomodoroSetup;

export const usePomodorosCount = defineStore("pomodorosCount", () => {
  // const { timersInSession } = pomodoroSetup;
  // state: () => ({
  const pomodorosCount = ref(initialPomodorosCount);
  // }),

  // NOTE: pomodoros count
  const countData = computed(() => pomodorosCount.value);

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
  return { addPomodoro, countData, isCountingComplete, pomodorosPause };
  //  return { addPomodoro, countData };
});

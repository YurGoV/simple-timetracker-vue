<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <!-- <v-navigation-drawer v-model="drawerVisible" location="bottom" temporary> -->

      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <h1>Pomodoro</h1>
          <v-sheet
            @click="onTimerClick"
            :elevation="8"
            :height="400"
            :width="400"
            border
            rounded="xl"
            class="main-button"
          >
            <div>
              <div>Setup:</div>
              <div>
                <p>
                  sessions: {{ sessionsAmount }}, pomodoros at session:
                  {{ timersInSession }}
                </p>
              </div>
            </div>
            <!-- <p>session: {{ passedSessions + 1 }}lll</p> -->
            <p v-if="!inPause" class="timer">
              {{ remindedMinutes.toString().padStart(2, "0") }}
              :
              {{ remindedMinuteSeconds.toString().padStart(2, "0") }}
            </p>
            <!-- <p v-else-if="readyToContinue" class="pause"> -->
            <!--   <v-btn @click="onContinueClick"> Continue </v-btn> -->
            <!-- </p> -->
            <p v-else class="pause">
              PAUSE ON <br />
              {{ pauseOnDisplay.toString() }} <br />
              MINUTES
            </p>
            <div>
              <div>Passed (total):</div>
              <div>
                <p>
                  {{ passedPomodoros }} pomodoros, {{ passedSessions }} sessions
                </p>
              </div>
            </div>
          </v-sheet>
          <br />
          <!-- <v-btn @click="restart"> Restart </v-btn> -->
          <v-btn @click="reset"> Stop </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { usePomodoroSetup } from "@/store/pomodoroSetup";
import { usePomodorosCount } from "@/store/pomodorosCount";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";

const setup = usePomodoroSetup();
const { pomodoroSetup } = storeToRefs(setup);

const {
  timerDuration: initialDuration,
  sessionsAmount,
  timersInSession,
} = pomodoroSetup.value;
console.log("iiiddd", initialDuration);
const pomodorosCount = usePomodorosCount();
const { isCountingComplete, countData, pomodorosPause } =
  storeToRefs(pomodorosCount);
const { addPomodoro } = pomodorosCount;

let lastTime;
let handle;
let remainedSeconds;

// const timerDuration = ref(initialDuration * 60 * 1000);
const timerDuration = ref(initialDuration * 1000);
const changePauseDisplay = 1000; // TODO: for dev. on prod 1000 * 60

let passedPause = ref(0);
const reminded = ref(initialDuration);
const remindedMinuteSeconds = ref(0);
let remindedMinutes = initialDuration;
const isCounting = ref(false);
const inPause = ref(false);
const readyToContinue = ref(false);
const passedPomodoros = computed(() => countData.value.passedPomodoros);
const passedSessions = computed(() => countData.value.passedSessions);
const pauseOnDisplay = computed(() => pomodorosPause.value - passedPause.value);

const update = () => {
  if (!isCounting.value) return;

  const timerCount = timerDuration.value - (performance.now() - lastTime);
  remainedSeconds = Math.abs(timerCount / 1000).toFixed(0);
  remindedMinutes = Math.floor(remainedSeconds / 60);
  remindedMinuteSeconds.value = remainedSeconds - remindedMinutes * 60;

  // TODO: delete
  console.log(
    remainedSeconds,
    remindedMinuteSeconds.value,
    remindedMinutes,
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
};

const onTimerClick = () => {
  console.log("CLICK on timer", isCounting.value, handle);
  if (!isCounting.value && !handle) {
    console.log("start");
    lastTime = performance.now();
    startCountdown();
  } else if (isCounting.value && handle) {
    console.log("pause");
    pauseTimer();
  }
};

const onContinueClick = () => {
  restart();
  // readyToContinue.value = false;
  // lastTime = performance.now();
  // startCountdown();
  // update();
  // stop();
  // readyToContinue.value = false;
  // lastTime = performance.now();
  // startCountdown();
  // update();
};

const restart = () => {
  console.log("NO CLICK", isCounting.value, handle);
  stop();
  readyToContinue.value = false;
  lastTime = performance.now();
  startCountdown();
  update();
};

const reset = () => {
  isCounting.value = false;
  reminded.value = initialDuration;
  remindedMinuteSeconds.value = 0;
  remindedMinutes = initialDuration;
  lastTime = null;
  handle = null;
  readyToContinue.value = false;
};

const pauseTimer = () => {
  isCounting.value = false;
  handle = null;
  timerDuration.value = remainedSeconds * 1000;
};

const startInSessionPause = () => {
  console.log(pomodorosPause.value, "pause, now count as seconds");

  const pauseInterval = setInterval(() => {
    passedPause.value += 1;
    console.log("pauseOnDisplay decreased:", passedPause.value);
  }, changePauseDisplay);
  // pauseInterval;

  inPause.value = true;

  setTimeout(() => {
    console.log("pause end");
    // }, pomodorosPause.value * 60 * 1000); // count as minutes
    inPause.value = false;
    clearInterval(pauseInterval);
    passedPause.value = 0;
    readyToContinue.value = true;
    //NOTE: ;;;
    isCounting.value = null;
    handle = null;
    reminded.value = initialDuration;
    remindedMinuteSeconds.value = 0;
    remindedMinutes = initialDuration;
    console.log("lll ll l");
    // restart();
  }, pomodorosPause.value * 1000); // count as seconds to test
};

// const resume = () => {
//   if (isCounting.value) return;
//   isCounting.value = true;
//   lastTime = performance.now();
//   update();
// };

const startCountdown = () => {
  //  reminded.value = initialDuration;
  //  remindedMinuteSeconds.value = 0;
  //  remindedMinutes.value = initialDuration;
  //  lastTime = performance.now();
  isCounting.value = true; // Set the flag to start counting
  update(); // Initial call to start the countdown
};
</script>

<style scoped>
.main-button {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.timer {
  font-size: 6rem;
  margin: auto;
}
.pause {
  font-size: 2rem;
  margin: auto;
}
</style>

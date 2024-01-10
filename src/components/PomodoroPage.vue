<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <!-- <v-navigation-drawer v-model="drawerVisible" location="bottom" temporary> -->

      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <h1>Pomodoro</h1>
          <v-sheet :elevation="0" :height="900" :width="500" rounded>
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
              <!-- !!!! -->
              <p v-if="!inPause" class="timer">
                {{ remindedMinutes.toString().padStart(2, "0") }}
                :
                {{ remindedMinuteSeconds.toString().padStart(2, "0") }}
              </p>
              <!-- !!!! -->
              <!-- <p v-else-if="readyToContinue" class="pause"> -->
              <!--   <v-btn @click="onContinueClick"> Continue </v-btn> -->
              <!-- </p> -->
              <p v-else class="pause">
                PAUSE<br />
                {{ pauseOnDisplay.toString() }} <br />
                MINUTES LEFT
              </p>
              <div>
                <div>Passed (total):</div>
                <div>
                  <p>
                    {{ passedPomodoros }} pomodoros,
                    {{ passedSessions }} sessions
                  </p>
                </div>
              </div>
            </v-sheet>
            <properties-selector class="properties" />
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

import PropertiesSelector from "@/components/records/PropertiesSelector.vue";

const setup = usePomodoroSetup();
const { pomodoroSetup } = storeToRefs(setup);

const {
  // timerDuration: initialDuration,
  sessionsAmount,
  timersInSession,
} = pomodoroSetup.value;
// console.log("iiiddd", initialDuration);
const pomodorosCount = usePomodorosCount();
// NOTE: just now
const {
  inPause,
  remindedMinuteSeconds,
  remindedMinutes,
  pauseOnDisplay,
  passedSessions,
  passedPomodoros,
} = storeToRefs(pomodorosCount);
const { reset, onTimerClick } = pomodorosCount;
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
.properties {
  margin-top: 30px;
}
</style>


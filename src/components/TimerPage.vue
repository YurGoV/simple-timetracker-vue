<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-row class="main-pomodoro">
            <v-col>
              <v-sheet
                @click="onTimerClick"
                :elevation="8"
                :height="400"
                :width="400"
                border
                rounded="circle"
                class="main-button"
              >
                <div></div>
                <!-- <p v-if="!inPause" class="timer"> -->
                <p  class="timer">
                  {{ passedMinutes.toString().padStart(2, "0") }}
                  :
                  {{ passedSeconds.toString().padStart(2, "0") }}
                </p>
                <!-- <p v-else class="pause"> -->
                <!--   {{ $t(`pomodoroPage.pause`) }}<br /> -->
                <!--   {{ pauseOnDisplay.toString() }} <br /> -->
                <!--   {{ $t(`pomodoroPage.minutesLeft`) }} -->
                <!-- </p> -->
              </v-sheet>

              <v-btn :disabled='disabled' @click="clickOnReset" class="stop-btn">
                Reset
                <!-- {{ $t(`pomodoroPage.stop`) }} -->
              </v-btn>
              <v-btn :disabled="disabled" @click="clickOnSave" class="stop-btn">
                Save
                <!-- {{ $t(`pomodoroPage.stop`) }} -->
              </v-btn>
            </v-col>
            <properties-selector v-if="isLoggedIn" class="properties" />
            <!-- </v-sheet> -->
          </v-row>
          <br />
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { useTimer } from "@/store/timer";
import { storeToRefs } from "pinia";

import PropertiesSelector from "@/components/records/PropertiesSelector.vue";
import { computed } from "vue";

const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);

const timer = useTimer();
const disabled = computed(() => !inPause.value);

const {
  // passedTime,
  passedMinutes,
  passedSeconds,
  inPause,
} = storeToRefs(timer);
const { resetTimer, onTimerClick, addTimer } = timer;

function clickOnReset() {
  resetTimer();
}
function clickOnSave() {
  addTimer();
}
</script>
<style scoped>
.main-pomodoro {
  align-items: center;
  justify-content: center;
}
.pomodoro {
  margin: auto;
}
.main-button {
  display: flex;
  margin: auto;
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
.stop-btn {
  margin-top: 30px;
}
</style>

<template>
  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    location="top"
    :close-on-content-click="true"
    timeout="2500"
  >
    {{ snackbarText }}</v-snackbar
  >
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
                <p class="timer">
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
              <v-btn
                :disabled="disabled"
                @click="clickOnReset"
                class="stop-btn"
              >
                {{ $t(`timerPage.reset`) }}
                <!-- {{ $t(`pomodoroPage.stop`) }} -->
              </v-btn>
              <v-btn
                v-if="isLoggedIn"
                :disabled="disabled"
                @click="clickOnSave"
                class="stop-btn"
              >
                {{ $t(`timerPage.save`) }}
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

import { useSnackbar } from "@/utils/useSnackbar";
const { snackbar, snackbarText, snackbarColor, showSnackbar } = useSnackbar();

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
async function clickOnSave() {
  const result = await addTimer();
  showSnackbar({ isSuccess: result });
}
</script>
<style scoped>
v-btn {
  margin: 10px;
}
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

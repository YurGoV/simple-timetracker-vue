<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-row class="main-pomodoro">
        <v-col cols="12" md="4">
          <v-sheet
            :elevation="1"
            :height="250"
            :width="180"
            rounded="xl"
            class="main-button"
          >
            <!-- TODO: add pomodoro time, pomodoros interval, sessions interval -->
            <h2>{{ $t(`pomodoroPage.subTitleSetup`) }}:</h2>
            <p>{{ sessionsAmount }} {{ $t(`pomodoroPage.sessions`) }}</p>
            <p>{{ timersInSession }} {{ $t(`pomodoroPage.pomAtSession`) }}:</p>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="4">
          <v-sheet
            @click="onTimerClick"
            :elevation="8"
            :height="300"
            :width="300"
            border
            rounded="circle"
            class="main-button"
          >
            <div></div>
            <p v-if="!inPause" class="timer">
              {{ remindedMinutes.toString().padStart(2, "0") }}
              :
              {{ remindedMinuteSeconds.toString().padStart(2, "0") }}
            </p>
            <p v-else class="pause">
              {{ $t(`pomodoroPage.pause`) }}<br />
              {{ pauseOnDisplay.toString() }} <br />
              {{ $t(`pomodoroPage.minutesLeft`) }}
            </p>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="4">
          <v-sheet
            :elevation="1"
            :height="250"
            :width="180"
            rounded="xl"
            class="main-button"
          >
            <h2>{{ $t(`pomodoroPage.subTitlePassed`) }}:</h2>
            <p>{{ passedPomodoros }} {{ $t(`pomodoroPage.pomodoros`) }},</p>
            <p>{{ passedSessions }} {{ $t(`pomodoroPage.sessions`) }}</p>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row class="main-pomodoro">
        <v-col cols="auto">
          <v-btn @click="reset" class="stop-btn">
            {{ $t(`pomodoroPage.stop`) }}
          </v-btn>
          <properties-selector v-if="isLoggedIn" class="properties" />
        </v-col>
      </v-row>
      <br />
    </v-responsive>
  </v-container>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { usePomodoroSetup } from "@/store/pomodoroSetup";
import { usePomodorosCount } from "@/store/pomodorosCount";
import { storeToRefs } from "pinia";

import PropertiesSelector from "@/components/records/PropertiesSelector.vue";
import { computed } from "vue";

// import { useDisplay } from "vuetify";
// const { name } = useDisplay();
// const diameter = computed(() => {
//   switch (name.value) {
//     case "xs":
//       return 300;
//     case "sm":
//       return 300;
//     case "md":
//       return 350;
//     case "lg":
//       return 350;
//     case "xl":
//       return 350;
//     case "xxl":
//       return 350;
//   }
//
//   return undefined;
// });
//
const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);

const setup = usePomodoroSetup();
const { pomodoroSetup } = storeToRefs(setup);

const { sessionsAmount, timersInSession } = pomodoroSetup.value;

const pomodorosCount = usePomodorosCount();

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
  font-size: 5rem;
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

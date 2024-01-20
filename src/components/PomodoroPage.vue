<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <!-- <v-navigation-drawer v-model="drawerVisible" location="bottom" temporary> -->

      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <h1>{{$t(`pomodoroPage.title`)}}</h1>
          <v-row class="main-pomodoro">
            <!-- <v-sheet :elevation="0" :height="900" :width="500" rounded> -->
            <v-sheet :elevation="1" :height="300" :width="200" rounded="xl">
              <!-- TODO: add pomodoro time, pomodoros interval, sessions interval -->
              <h2>{{$t(`pomodoroPage.subTitleSetup`)}}:</h2>
              <p>{{ sessionsAmount }} {{ $t(`pomodoroPage.sessions`) }}</p>
              <p>
                {{ timersInSession }} {{ $t(`pomodoroPage.pomAtSession`) }}:
              </p>
            </v-sheet>
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

              <v-btn @click="reset" class="stop-btn">
                {{ $t(`pomodoroPage.stop`) }}
              </v-btn>
            </v-col>
            <v-sheet
              :elevation="1"
              :height="300"
              :width="200"
              rounded="xl"
              class="main-button"
            >
              <h2>{{$t(`pomodoroPage.subTitlePassed`)}}:</h2>
              <p>{{ passedPomodoros }} {{ $t(`pomodoroPage.pomodoros`) }},</p>
              <p>{{ passedSessions }} {{ $t(`pomodoroPage.sessions`) }}</p>
            </v-sheet>
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
import { usePomodoroSetup } from "@/store/pomodoroSetup";
import { usePomodorosCount } from "@/store/pomodorosCount";
import { storeToRefs } from "pinia";
// import { ref } from "vue";

import PropertiesSelector from "@/components/records/PropertiesSelector.vue";
import { computed } from "vue";

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

// user.$subscribe(setIsAuth);
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

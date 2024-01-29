<template>
  <div class="page-title" @click="switchView">
    <h1 v-if="pomodoroView">{{ $t(`homePage.titlePomodoro`) }}</h1>
    <h1 v-else>{{ $t(`homePage.titleTimer`) }}</h1>
  </div>
  <PomodoroPage v-if="pomodoroView"/>
  <TimerPage v-else />
</template>

<script setup>
import { ref } from "vue";
import PomodoroPage from "@/components/PomodoroPage.vue";
import TimerPage from "@/components/TimerPage.vue";

const pomodoroView = ref(true);

function switchView() {
  pomodoroView.value = !pomodoroView.value;
}
</script>

<style scoped>
.page-title {
  display: flex;
  justify-content: center;
  cursor: pointer;
}
</style>

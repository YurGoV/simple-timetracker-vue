<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <!-- <v-navigation-drawer v-model="drawerVisible" location="bottom" temporary> -->

      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-sheet
            @click="reset"
            :elevation="8"
            :height="200"
            :width="200"
            border
            rounded
            class="main-button"
            ><p class="timer">
              <!-- {{ duration - (elapsed / 1000).toFixed(0) }} -->
              <!-- {{ (elapsed / 1000).toFixed(0) }} -->
              {{ Math.abs(remained / 1000).toFixed(0) }}
            </p></v-sheet
          >
          <v-btn @click="pause"> Pause </v-btn>
          <v-btn @click="resume"> Resume </v-btn>
          <v-btn @click="stop"> Stop </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, onUnmounted, computed } from "vue";

// const duration = ref(15 * 1000);
// let duration = 25;
const duration = ref(15 * 1000);

// const elapsed = ref(0);
const remained = ref(15 * 1000);
let isCounting = ref(true);

let lastTime;
let handle;

const update = () => {
  //  elapsed.value = performance.now() - lastTime;
  if (!isCounting.value) return;
  remained.value = duration.value - (performance.now() - lastTime);
  console.log(remained.value, duration.value);
  // if (remained.value >= duration.value) {
  if (remained.value <= 0) {
    console.log("ifff");
    //if (elapsed.value >= duration) {
    cancelAnimationFrame(handle);
  } else {
    handle = requestAnimationFrame(update);
  }
};

const reset = () => {
  // elapsed.value = 0;
  remained.value = duration.value;
  lastTime = performance.now();
  startCountdown();
  update();
};

const stop = () => {
  isCounting.value = false;
  duration.value = 15000;
  remained.value = 15000;
  lastTime = null;
  handle = null;
};

const pause = () => {
  isCounting.value = false;
  duration.value = remained.value;
};

const resume = () => {
  isCounting.value = true;
  lastTime = performance.now();
  update();
};

const startCountdown = () => {
  isCounting.value = true; // Set the flag to start counting
  update(); // Initial call to start the countdown
};

//reset()

//
</script>

<style scoped>
.main-button {
  display: flex;
  cursor: pointer;
}
.timer {
  font-size: 3rem;
  margin: auto;
}
</style>

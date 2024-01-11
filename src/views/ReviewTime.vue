<template>
  <v-sheet
    :elevation="0"
    :height="40"
    :width="800"
    rounded
    class="buttons-section"
  >
    <v-btn @click="selectSection('add-time')" color="primary">Add Time</v-btn>
    <v-btn @click="selectSection('daily-review')" color="primary"
      >Daily Review</v-btn
    >
    <!-- </v-col> -->
  </v-sheet>
  <AddTime v-if="section === 'add-time'" />
</template>

<script setup>
import { ref } from "vue";
import AddTime from "@/components/AddTime.vue";

const section = ref("add-time");

function selectSection(selectedSection) {
  section.value = selectedSection;
}
</script>

<style scoped>
.buttons-section {
  margin-top: 16px;
  display: flex;
  justify-content: space-around;
}
</style>

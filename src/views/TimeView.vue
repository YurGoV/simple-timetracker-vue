<template>
  <v-sheet
    :elevation="0"
    :height="40"
    :width="800"
    rounded
    class="buttons-section"
  >
    <v-btn @click="selectSection('add-time')" color="primary">Add Time</v-btn>
    <v-btn @click="selectSection('review-time')" color="primary"
      >Review Time</v-btn
    >
    <!-- </v-col> -->
  </v-sheet>
  <AddTime v-if="section === 'add-time'" />
  <ReviwTime v-if="section === 'review-time'" />
</template>

<script setup>
import { ref } from "vue";
import AddTime from "@/components/AddTime.vue";
import ReviwTime from "@/components/ReviewTime.vue";

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

<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <h1>time review</h1>
          <h2>daily:</h2>
          <v-row>
            <v-radio-group v-model="statCategory" inline>
              <v-radio label="Importance" default value="importance"></v-radio>
              <v-radio label="life spheres" value="life"></v-radio>
            </v-radio-group>
            <v-checkbox
              v-model="includeWholeDay"
              label="include untracked time"
            ></v-checkbox>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <Doughnut :data="dailyStatToDisplay" :options="options" />
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, watchEffect, onMounted } from "vue";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

const statCategory = ref("importance");
const includeWholeDay = ref(false);

const options = {
  responsive: true,
  maintainAspectRatio: false,
};

import { computed } from "vue";
import { useRecordsStore } from "@/store/records";
const recordsStore = useRecordsStore();

const dailyStat = ref(
  recordsStore.getStatByDay({ includeWholeDay: includeWholeDay.value }),
);

const dailyStatToDisplay = computed(() => {
  return dailyStat.value[statCategory.value];
});

watchEffect(() => {
  const stat = recordsStore.getStatByDay({
    includeWholeDay: includeWholeDay.value,
  });
  dailyStat.value = stat;
});

onMounted(() => {
  console.log("ReviewTime onMounted triggered");
});
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
.choose-context-capition {
  margin-top: 30px;
  margin-bottom: 40px;
}
</style>

<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-center text-center fill-height"
    >
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <h1>{{ $t(`reviewTime.title`) }}</h1>
          <p><br /></p>
          <v-row class="d-flex align-center justify-center">
            <v-radio-group v-model="statPeriod" inline>
              <v-radio
                :label="$t(`reviewTime.today`)"
                default
                value="today"
              ></v-radio>
              <v-radio
                :label="$t(`reviewTime.currentWeek`)"
                value="current_week"
              ></v-radio>
              <v-radio
                :label="$t(`reviewTime.prevWeek`)"
                value="previous_week"
              ></v-radio>
              <v-radio
                :label="$t(`reviewTime.currentMonth`)"
                value="current_month"
              ></v-radio>
            </v-radio-group>
          </v-row>
          <v-row class="d-flex align-center justify-center">
            <v-radio-group v-model="statCategory" inline>
              <v-radio
                :label="$t(`reviewTime.importance`)"
                default
                value="importance"
              ></v-radio>
              <v-radio
                :label="$t(`reviewTime.lifeSpheres`)"
                value="life"
              ></v-radio>
            </v-radio-group>
            <v-checkbox
              v-model="includeWholeDay"
              :label="$t(`reviewTime.untracked`)"
            ></v-checkbox>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <Doughnut :data="dailyStatToDisplay" :options="options" />
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, watchEffect, onMounted } from "vue";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

const statPeriod = ref("today");
const statCategory = ref("importance");
const includeWholeDay = ref(false);

const options = {
  responsive: true,
  maintainAspectRatio: false,
};

import { computed } from "vue";
import { useRecordsStore } from "@/store/records";
const recordsStore = useRecordsStore();

const statByPeriod = ref(
  recordsStore.getStatByPeriod({
    period: statPeriod.value,
    includeWholeDay: includeWholeDay.value,
  }),
);

const dailyStatToDisplay = computed(() => {
  return statByPeriod.value[statCategory.value];
});

watchEffect(() => {
  const stat = recordsStore.getStatByPeriod({
    period: statPeriod.value,
    includeWholeDay: includeWholeDay.value,
  });
  statByPeriod.value = stat;
});

onMounted(() => {
  // console.log("ReviewTime onMounted triggered");
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

<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <!-- <v-navigation-drawer v-model="drawerVisible" location="bottom" temporary> -->

      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <!-- TODO: make template -->

          <!-- <div v-if="!getLifeSpheres || !getImportances || !getTags"> -->
          <!--   Loading... -->
          <!-- </div> -->
          <!-- <v-sheet v-else :elevation="0" :height="900" :width="500" rounded> -->
          <v-sheet :elevation="0" :height="900" :width="500" rounded>
            <h1>Add time page</h1>

            <VueDatePicker v-model="startTime"></VueDatePicker>
            <v-text-field
              v-model="duration"
              type="number"
              label="Duration in min"
            ></v-text-field>
            <properties-selector />

            <v-btn @click="save" color="primary">Save</v-btn>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row> </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
// import { storeToRefs } from "pinia";
// import { saveRecord } from "@/services/records.service";

import PropertiesSelector from "@/components/records/PropertiesSelector.vue";

import { useRecordsStore } from "@/store/records";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const recordsStore = useRecordsStore();

const currentDate = new Date();

const startTime = ref(currentDate);
const duration = ref(30);

const date = computed(() => {
  const day = new Date(startTime.value);
  day.setHours(0, 0, 0, 0);
  return day.getTime();
});

function save() {
  console.log("save");
  recordsStore.saveRecordToDb();
}

watchEffect(() => {
  console.log("watchEffect triggered");

  recordsStore.setManualDate(date.value);
  recordsStore.setManualStartTime(startTime.value.getTime());
  recordsStore.setManualEndTime(
    startTime.value.getTime() + duration.value * 60 * 1000,
  );
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

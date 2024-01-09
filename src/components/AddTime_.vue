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
            <!-- <v-date-picker v-model="date" show-adjacent-months></v-date-picker> -->
            <VueDatePicker v-model="startTime"></VueDatePicker>
            <!-- <p>{{ day }}</p> -->
            <v-text-field
              v-model="duration"
              type="number"
              label="Duration in min"
            ></v-text-field>
            <v-row>
              <v-col>
                <v-select
                  v-model="selectedLifeSphere"
                  :items="getLifeSpheres"
                  item-title="value"
                  item-value="_id"
                  density="compact"
                  label="Life Sphere"
                ></v-select>
              </v-col>
              <v-col>
                <v-select
                  v-model="selectedImportance"
                  :items="getImportances"
                  item-title="value"
                  item-value="_id"
                  density="compact"
                  label="Importance"
                ></v-select>
              </v-col>
              <!-- <v-col> -->
              <!-- </v-col> -->
            </v-row>
            <h2 class="choose-context-capition">Choose context</h2>
            <v-row>
              <v-checkbox
                v-model="selectedTags"
                v-for="tag in getTags"
                :label="tag.value"
                :value="tag._id"
                :key="tag._id"
              ></v-checkbox>
            </v-row>
            <v-row>
              <v-text-field
                v-model="comment"
                type="text"
                label="Comment"
              ></v-text-field>
            </v-row>
            <!-- <v-col class="d-flex justify-end"> -->
            <v-btn @click="save" color="primary">Save</v-btn>
            <!-- </v-col> -->
          </v-sheet>
        </v-col>
      </v-row>
      <v-row> </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { saveRecord } from "@/services/records.service";

import { useUserStore } from "@/store/user";
import { useRecordsStore } from "@/store/records";
// import { useContextsStore } from "@/store/contexts";
// const { setupContexts } = useContextsStore();

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useContextsStore } from "@/store/contexts";

const testItems = ["ldld", "sjsjs", "icici"];
const userStore = useUserStore();

const recordsStore = useRecordsStore();
const contextsStore = useContextsStore();
const { getLifeSpheres, getImportances, getTags } = storeToRefs(contextsStore);
// const {
//   setManualDate,
//   setManualStartTime,
//   setManualEndTime,
//   setLifeSphere,
//   setImportance,
//   setTags,
//   setComment,
// } = storeToRefs(recordsStore);

const currentDate = new Date();

const startTime = ref(currentDate);
const duration = ref(30);
const comment = ref("");
const selectedLifeSphere = ref(
  // getLifeSpheres.value ? getLifeSpheres.value[0]._id : null,
  getLifeSpheres.value[0]._id,
);
const selectedImportance = ref(
  // getImportances.value ? getImportances.value[0]._id : null,
  getImportances.value[0]._id,
);
const selectedTags = ref([]);

const date = computed(() => {
  const day = new Date(startTime.value);
  day.setHours(0, 0, 0, 0);
  return day.getTime();
});

function save() {
  console.log("save");
  // const payload = {
  //   date: date.value,
  //   startTime: startTime.value.getTime(),
  //   endTime: startTime.value.getTime() + duration.value * 60 * 1000,
  //   lifeSphere: selectedLifeSphere.value,
  //   importance: selectedImportance.value,
  //   tags: selectedTags.value,
  //   comment: comment.value,
  // };
  // saveRecord(payload);
  recordsStore.saveRecordToDb();
}
watchEffect(() => {
  console.log("watchEffect triggered");

  recordsStore.setManualDate(date.value);
  recordsStore.setLifeSphere(selectedLifeSphere.value);
  recordsStore.setManualStartTime(startTime.value.getTime());
  recordsStore.setManualEndTime(
    startTime.value.getTime() + duration.value * 60 * 1000,
  ),
    recordsStore.setLifeSphere(selectedLifeSphere.value);
  recordsStore.setImportance(selectedImportance.value);
  recordsStore.setTags(selectedTags.value);
  recordsStore.setComment(comment.value);
});
// watchEffect(() => {
//   setManualDate(date.value);
// });
// watchEffect(() => {
//   setManualStartTime(startTime.value.getTime());
// });
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

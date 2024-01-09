<template>
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
    <v-text-field v-model="comment" type="text" label="Comment"></v-text-field>
  </v-row>
  <!-- <v-col class="d-flex justify-end"> -->
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { saveRecord } from "@/services/records.service";

import { useUserStore } from "@/store/user";
// import { useContextsStore } from "@/store/contexts";
// const { setupContexts } = useContextsStore();

import "@vuepic/vue-datepicker/dist/main.css";
import { useContextsStore } from "@/store/contexts";

// const userStore = useUserStore();
const contextsStore = useContextsStore();
const { getLifeSpheres, getImportances, getTags } = storeToRefs(contextsStore);

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
  const payload = {
    // date: date.value,
    startTime: startTime.value.getTime(),
    endTime: startTime.value.getTime() + duration.value * 60 * 1000,
    lifeSphere: selectedLifeSphere.value,
    importance: selectedImportance.value,
    tags: selectedTags.value,
    comment: comment.value,
  };
  saveRecord(payload);
}
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

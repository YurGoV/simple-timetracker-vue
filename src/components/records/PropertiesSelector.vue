<template>
  <div
    v-if="
      !getLifeSpheres ||
      !getImportances ||
      !getTags
      // ||
      // !selectedLifeSphere ||
      // !selectedTags ||
      // !selectedImportance
    "
  >
    Loading...
  </div>
  <div v-else>
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
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";

import "@vuepic/vue-datepicker/dist/main.css";
import { useContextsStore } from "@/store/contexts";
import { useRecordsStore } from "@/store/records";

const contextsStore = useContextsStore();
const recordsStore = useRecordsStore();
const { getLifeSpheres, getImportances, getTags } = storeToRefs(contextsStore);

const comment = ref("");
const selectedLifeSphere = ref(
  getLifeSpheres.value ? getLifeSpheres.value[0]._id : null,
  // getLifeSpheres.value[0]._id,
);
const selectedImportance = ref(
  getImportances.value ? getImportances.value[0]._id : null,
  // getImportances.value[0]._id,
);
const selectedTags = ref([]);

watchEffect(() => {
  console.log("watchEffect triggered");

  recordsStore.setLifeSphere(selectedLifeSphere.value);
  recordsStore.setImportance(selectedImportance.value);
  recordsStore.setTags(selectedTags.value);
  recordsStore.setComment(comment.value);
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

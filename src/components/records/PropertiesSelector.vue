<template>
  <v-container v-if="!getLifeSpheres || !getImportances || !getTags">
    Loading...
  </v-container>
  <v-container v-else>
    <v-row class="tags-section">
      <v-col>
        <v-select
          v-model="selectedLifeSphere"
          :items="getLifeSpheres"
          item-title="value"
          item-value="_id"
          density="compact"
          :label="$t(`propsSelector.lifeSphere`)"
        ></v-select>
      </v-col>
      <v-col>
        <v-select
          v-model="selectedImportance"
          :items="getImportances"
          item-title="value"
          item-value="_id"
          density="compact"
          :label="$t(`propsSelector.importance`)"
        ></v-select>
      </v-col>
    </v-row>
    <h2 class="choose-context-capition">
      {{ $t(`propsSelector.contextChoose`) }}
    </h2>
    <v-row class="tags-section">
      <v-checkbox
        v-model="selectedTags"
        v-for="tag in getTags"
        :label="tag.value"
        :value="tag._id"
        :key="tag._id"
      ></v-checkbox>
    </v-row>
    <v-row class="tags-section">
      <v-text-field
        v-model="selectedComment"
        type="text"
        :label="$t(`propsSelector.comment`)"
      ></v-text-field>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { storeToRefs } from "pinia";

import "@vuepic/vue-datepicker/dist/main.css";
import { useContextsStore } from "@/store/contexts";
import { useRecordsStore } from "@/store/records";

const contextsStore = useContextsStore();
const recordsStore = useRecordsStore();
const {
  getSelectedTags,
  getSelectedImportance,
  getSelectedLifeSphere,
  getSelectedComment,
} = recordsStore;
const { getLifeSpheres, getImportances, getTags } = storeToRefs(contextsStore);

const importance = getSelectedImportance;
const lifeSphere = getSelectedLifeSphere;
const tags = getSelectedTags;
const comment = getSelectedComment;

// TODO: last choise for default
const selectedLifeSphere = ref(
  lifeSphere ? lifeSphere : getLifeSpheres.value[0]._id,
);
const selectedImportance = ref(
  importance ? importance : getImportances.value[0]._id,
);
const selectedTags = ref(tags ? tags : []);
const selectedComment = ref(comment ? comment : "");

watchEffect(() => {
  recordsStore.setLifeSphere(selectedLifeSphere.value);
  recordsStore.setImportance(selectedImportance.value);
  recordsStore.setTags(selectedTags.value);
  recordsStore.setComment(selectedComment.value);
});
</script>

<style scoped>
.main-button {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.tags-checkbox-section {
  padding: 5px;
}
.tags-section {
  padding: 5px;
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

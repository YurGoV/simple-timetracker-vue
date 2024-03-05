<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <!-- <v-navigation-drawer v-model="drawerVisible" location="bottom" temporary> -->

      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <!-- <v-sheet :elevation="0" :height="900" :width="500" rounded> -->
          <v-sheet :elevation="0" rounded>
            <h1>{{ $t(`addTime.title`) }}</h1>

            <VueDatePicker v-model="startTime"></VueDatePicker>
            <v-text-field
              v-model="duration"
              type="number"
              :label="$t(`addTime.duration`)"
            ></v-text-field>
            <properties-selector />

            <v-btn @click="save" color="secondary" variant="outlined">{{
              $t(`addTime.save`)
            }}</v-btn>
          </v-sheet>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, computed, watchEffect, inject } from "vue";

import PropertiesSelector from "@/components/records/PropertiesSelector.vue";

import { useRecordsStore } from "@/store/records";

import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import { useI18n } from "vue-i18n";
const { t } = useI18n();
const { show } = inject("snackbar");

const recordsStore = useRecordsStore();

const currentDate = new Date();

const startTime = ref(currentDate);
const duration = ref(30);

const date = computed(() => {
  const day = new Date(startTime.value);
  day.setHours(0, 0, 0, 0);
  return day.getTime();
});

async function save() {
  const saveResult = await recordsStore.saveRecordToDb();
  // TODO: refactor all snackbars to if-else inside snackbarProfider
  if (saveResult) {
    show({ message: t("addTime.saveSuccess"), color: "green" });
  } else {
    show({ message: t("addTime.saveFail"), color: "red" });
  }
}

watchEffect(() => {
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

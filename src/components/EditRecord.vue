<template>
  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    location="top"
    :close-on-content-click="true"
    timeout="2500"
  >
    {{ snackbarText }}</v-snackbar
  >
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <!-- TODO: make template -->
          <v-sheet :elevation="0" :height="900" :width="500" rounded>
            <h1>{{ $t(`editRecord.title`) }}</h1>
            <VueDatePicker v-model="startTime"></VueDatePicker>
            <v-text-field
              v-model="duration"
              type="number"
              :label="$t(`editRecord.duration`)"
            ></v-text-field>
            <PropertiesSelector />

            <v-btn @click="save" color="secondary" variant="outlined">{{
              $t(`editRecord.save`)
            }}</v-btn>
          </v-sheet>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
// TODO: rename to TimeList
import { ref, computed, watchEffect, onMounted, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useRecordsStore } from "@/store/records";

import VueDatePicker from "@vuepic/vue-datepicker";
import PropertiesSelector from "@/components/records/PropertiesSelector.vue";

import { useSnackbar } from "@/utils/useSnackbar";
const { snackbar, snackbarText, snackbarColor, showSnackbar } = useSnackbar();

const recordsStore = useRecordsStore();
const router = useRouter();

const { identifier } = defineProps(["identifier"]);
const identity = ref(identifier);

// NOTE: unneeded?
const record = ref(recordsStore.getRecordById(identity.value));
const startTime = ref(new Date(record.value.startTime));
const duration = ref(
  Math.ceil((record.value.endTime - record.value.startTime) / 1000 / 60),
);
const date = computed(() => {
  const day = new Date(startTime.value);
  day.setHours(0, 0, 0, 0);
  return day.getTime();
});

async function save() {
  const saveResult = await recordsStore.updateRecordInDb(record.value._id);
  showSnackbar({ isSuccess: saveResult });
}

watchEffect(() => {
  recordsStore.setManualDate(date.value);
  recordsStore.setManualStartTime(startTime.value.getTime());
  recordsStore.setManualEndTime(
    startTime.value.getTime() + duration.value * 60 * 1000,
  );
  if (identifier) {
    record.value = recordsStore.getRecordById(identifier);
  } else {
    record.value = recordsStore.getRecordById(identity.value);
  }
});

onMounted(() => {
  const routeSection = router.currentRoute.value;

  const identifierProp = routeSection.params.identifier || null;

  identity.value = identifierProp;
});
onBeforeMount(() => {
  recordsStore.setLifeSphere(record.value.lifeSphere);
  recordsStore.setImportance(record.value.importance);
  recordsStore.setTags(record.value.tags);
  recordsStore.setComment(record.value.comment);
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

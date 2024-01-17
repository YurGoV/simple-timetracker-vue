<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">

      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <!-- TODO: make template -->
          <v-sheet :elevation="0" :height="900" :width="500" rounded>
            <h1>Edit record page</h1>
            <VueDatePicker v-model="startTime"></VueDatePicker>
            <v-text-field
              v-model="duration"
              type="number"
              label="Duration in min"
            ></v-text-field>
            <p>
              current record values: <br />
              Life Sphere: {{ oldTags.lifeSphere }} <br />
              Importance: {{ oldTags.importance }} <br />
              Tags: {{ oldTags.tags }} <br />
              select new values below to edit...
            </p>
            <PropertiesSelector />
            <v-btn @click="save" color="primary">Save</v-btn>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row> </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
// TODO: rename to TimeList
import { ref, computed, watchEffect, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRecordsStore } from "@/store/records";
import { useContextsStore } from "@/store/contexts";
import VueDatePicker from "@vuepic/vue-datepicker";
import PropertiesSelector from "@/components/records/PropertiesSelector.vue";

const recordsStore = useRecordsStore();
const contextsStore = useContextsStore();
const contexts = contextsStore.getAllContexts;
const router = useRouter();

const { identifier } = defineProps(["identifier"]);
const identity = ref(identifier);

// TODO: unneeded?
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

const oldTags = computed(() => {
  const importance = contexts.find(
    (context) => context._id === record.value.importance,
  ).value;
  const lifeSphere = contexts.find(
    (context) => context._id === record.value.lifeSphere,
  ).value;

  let tags = "";
  record.value.tags.forEach((id) => {
    const tagName = contexts.find((context) => context._id === id).value;
    tags += `${tagName} `;
  });

  return { importance, lifeSphere, tags };
});

function save() {
  recordsStore.updateRecordInDb(record.value._id);
}

watchEffect(() => {
  console.log('sE start time', startTime.value)
  recordsStore.setManualDate(date.value);
  recordsStore.setManualStartTime(startTime.value.getTime());
  recordsStore.setManualEndTime(
    startTime.value.getTime() + duration.value * 60 * 1000,
  );
  console.log(
    "watchEffect triggered in edit record",
    identity.value,
    identifier,
  );
  if (identifier) {
    record.value = recordsStore.getRecordById(identifier);
  } else {
    record.value = recordsStore.getRecordById(identity.value);
  }
});

onMounted(() => {
  console.log("EditRecord onMounted triggered");
  const routeSection = router.currentRoute.value;

  const identifierProp = routeSection.params.identifier || null;
  console.log(identifierProp, "RS identity in edit componenT");

  identity.value = identifierProp;
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
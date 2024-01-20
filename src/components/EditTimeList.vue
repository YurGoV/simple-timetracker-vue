<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <!-- TODO: make template -->

          <v-sheet :elevation="0" :height="900" :width="500" rounded>
            <div v-if="!identifier">
              <!-- TODO: move in component as EditRecord -->
              <h1>Edit time page</h1>

              <VueDatePicker v-model="startTime"></VueDatePicker>
              <v-list>
                <v-list-item
                  @click="onListClick(item.id)"
                  v-for="item in dayRecordsList"
                  :key="item.id"
                  :title="item.title"
                ></v-list-item>
              </v-list>
            </div>
            <div v-else>
              <EditRecord :identifier="identifier" />
            </div>
          </v-sheet>
        </v-col>
      </v-row>
      <v-row> </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, watchEffect, onMounted } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useRecordsStore } from "@/store/records";
import { useRouter } from "vue-router";
import EditRecord from "@/components/EditRecord.vue";
const recordsStore = useRecordsStore();
const router = useRouter();

const currentDate = new Date();
const startTime = ref(currentDate);
// route params:
const identifier = ref(null);
const name = ref(null);

const dayRecordsList = computed(() =>
  recordsStore.getRecordsByDay.map((record) => {
    const date = new Date(record.startTime);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const duration = Math.ceil((record.endTime - record.startTime) / 1000 / 60);
    return {
      id: record._id,
      title: `start at ${hours}:${minutes}; duration ${duration} min`,
    };
  }),
);

const date = computed(() => {
  const day = new Date(startTime.value);
  day.setHours(0, 0, 0, 0);
  return day.getTime();
});

function onListClick(id) {
  // console.log(id, "on list click id");

  identifier.value = id;
  router.push({
    name: name.value,
    params: { action: "edit", identifier: id },
  });
}

watchEffect(() => {
  // console.log("EditTime onMounted triggered");
  // console.log("watchEffect triggered");

  recordsStore.setManualDate(date.value);
});
onMounted(() => {
  const routeSection = router.currentRoute.value;

  watch(
    () => router.currentRoute.value.params.identifier,
    (newIdentifier) => {
      // console.log("Identifier changed:", newIdentifier);
      identifier.value = newIdentifier;
    }
  );

  // console.log(routeSection, "RS PARAMS S");

  const identifierProp = routeSection.params.identifier || null;

  identifier.value = identifierProp;
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

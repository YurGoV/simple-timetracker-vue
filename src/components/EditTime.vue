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
            <h1>Edit time page</h1>

            <VueDatePicker v-model="startTime"></VueDatePicker>
            <!-- <p>{{ dayRecordsList }}</p> -->
            <!-- <v-list :items="dayRecordsList"><p>ll</p></v-list> -->
            <v-list>
              <v-list-item
                @click='onListClick(item.id)'
                v-for="item in dayRecordsList"
                :key="item.id"
                :title="item.title"
              ></v-list-item>
            </v-list>
            <!-- <v-btn @click="save" color="primary">Save</v-btn> -->
          </v-sheet>
        </v-col>
      </v-row>
      <v-row> </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useRecordsStore } from "@/store/records";
const recordsStore = useRecordsStore();

const currentDate = new Date();
const startTime = ref(currentDate);

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
  console.log(id, "on list click id");
}

watchEffect(() => {
  console.log("watchEffect triggered");

  recordsStore.setManualDate(date.value);
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

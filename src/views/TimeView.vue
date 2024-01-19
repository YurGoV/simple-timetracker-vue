<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
  <v-sheet
    :elevation="0"
    :height="40"
    :width="800"
    rounded
    class="buttons-section"
  >
    <v-btn @click="selectSection('add')" color="brown-darken-1" variant="outlined"
      >Add</v-btn
    >
    <v-btn @click="selectSection('review')" color="brown-darken-1" variant="outlined"
      >Review</v-btn
    >
    <v-btn @click="selectSection('edit')" color="brown-darken-1" variant="outlined"
      >Edit</v-btn
    >
  </v-sheet>
  <AddTime v-if="section === 'add'" />
  <ReviewTime v-if="section === 'review'" />
  <EditTime v-if="section === 'edit'" />
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AddTime from "@/components/AddTime.vue";
import ReviewTime from "@/components/ReviewTime.vue";
import EditTime from "@/components/EditTime.vue";
import { useRouter } from "vue-router";

const section = ref("add");
const router = useRouter();

function selectSection(selectedSection) {
  // console.log("select section triggered", selectedSection);
  section.value = selectedSection;

  router.push({ name: "Time", params: { action: selectedSection } });
}

onMounted(() => {
  // console.log("TimeView onMounted triggered");
  const routeSection = router.currentRoute.value;

  // console.log(routeSection.params, "RS PARAMS");
  // console.log(routeSection, "RS");

  const action = routeSection.params.action || "review";
  const name = routeSection.name;

  section.value = action;

  const identifier = routeSection.params.identifier;
  // console.log(
  //   name,
  //   action,
  //   identifier,
  //   "RS - name, action, identifier - in TW",
  // );
  if (identifier) {
    // console.log("lll");
    router.push({ name, params: { action: section.value, identifier } });
  } else {
    router.push({ name, params: { action: section.value } });
  }
});
</script>

<style scoped>
.buttons-section {
  margin-top: 16px;
  display: flex;
  justify-content: space-around;
}
</style>

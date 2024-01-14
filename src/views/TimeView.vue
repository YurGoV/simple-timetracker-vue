<template>
  <v-sheet
    :elevation="0"
    :height="40"
    :width="800"
    rounded
    class="buttons-section"
  >
    <v-btn @click="selectSection('add')" color="primary">Add</v-btn>
    <v-btn @click="selectSection('review')" color="primary">Review</v-btn>
    <v-btn @click="selectSection('edit')" color="primary">Edit</v-btn>
  </v-sheet>
  <AddTime v-if="section === 'add'" />
  <ReviewTime v-if="section === 'review'" />
  <EditTime v-if="section === 'edit'" />
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
  section.value = selectedSection;

  router.push({ name: "Time", params: { action: section.value } });
}

onMounted(() => {
  const routeSection = router.currentRoute.value;

  console.log(routeSection.params, "RS PARAMS");

  const action = routeSection.params.action || "review";

  section.value = action;
  router.push({ name: "Time", params: { action: section.value } });
});
</script>

<style scoped>
.buttons-section {
  margin-top: 16px;
  display: flex;
  justify-content: space-around;
}
</style>

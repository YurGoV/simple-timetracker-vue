<template>
  <v-container>
    <v-responsive class="align-center text-center fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col cols="12" md="4">
          <v-btn
            @click="selectSection('review')"
            color="brown-darken-1"
            variant="outlined"
            >{{ $t(`timeView.review`) }}</v-btn
          >
        </v-col>
        <v-col cols="12" md="4">
          <v-btn
            @click="selectSection('add')"
            color="brown-darken-1"
            variant="outlined"
            >{{ $t(`timeView.add`) }}</v-btn
          >
        </v-col>
        <v-col cols="12" md="4">
          <v-btn
            @click="selectSection('edit')"
            color="brown-darken-1"
            variant="outlined"
            >{{ $t(`timeView.edit`) }}</v-btn
          >
        </v-col>
        <AddTime v-if="section === 'add'" />
        <ReviewTime v-if="section === 'review'" />
        <EditTimeList v-if="section === 'edit'" />
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AddTime from "@/components/AddTime.vue";
import ReviewTime from "@/components/ReviewTime.vue";
import EditTimeList from "@/components/EditTimeList.vue";
import { useRouter } from "vue-router";

const section = ref("add");
const router = useRouter();

function selectSection(selectedSection) {
  section.value = selectedSection;

  router.push({ name: "Time", params: { action: selectedSection } });
}

onMounted(() => {
  const routeSection = router.currentRoute.value;

  const action = routeSection.params.action || "review";
  const name = routeSection.name;

  section.value = action;

  const identifier = routeSection.params.identifier;
  if (identifier) {
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

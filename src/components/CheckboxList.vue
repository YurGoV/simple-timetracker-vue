<!-- CheckboxList.vue -->
<template>
  <v-col>
    <v-checkbox
      v-model="checkedValues"
      v-for="option in options"
      :label="option"
      :value="option"
      :key="option"
    ></v-checkbox>
  </v-col>
</template>

<script setup>
import { ref, defineProps, defineExpose } from "vue";

const checkedValues = ref([]);
const { options } = defineProps(["options"]);

defineExpose({ checkedValues });
</script>

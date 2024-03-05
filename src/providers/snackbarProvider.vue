<script setup>
import { provide, ref } from "vue";

const show = ref(false);
const message = ref("");
const color = ref("");

provide("snackbar", {
  show(options) {
    message.value = options.message;
    color.value = options.color;
    show.value = true;
  },
  hide() {
    show.value = false;
  },
});
</script>

<template>
  <slot />
  <v-snackbar v-model="show" :color="color">
    {{ message }}
    <template #actions>
      <v-btn variant="text" @click="show = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<template>
  <snackbarProvider>
    <div class="g-signin2" data-onsuccess="onSignIn"></div>
    <router-view />
  </snackbarProvider>
</template>

<script setup>
import snackbarProvider from "./providers/snackbarProvider.vue";
</script>

<template>
  <v-app-bar flat>
    <v-app-bar-title class="app-bar">
      <!-- <v-icon icon="mdi-home" /> -->
      <v-icon icon="mdi-account" />
      <GoogleAuthBtn v-if="!isLoggedIn" class="gbtn" />
      <v-btn v-else @click="logout" prepend-icon="mdi-logout">
        {{ $t(`common.logout`) }}
      </v-btn>
    </v-app-bar-title>
  </v-app-bar>
</template>

<script setup>
import { computed } from "vue";
import GoogleAuthBtn from "@/components/GoogleOAUTHButton.vue";
import { useUserStore } from "@/store/user";

const userStore = useUserStore();

async function logout() {
  await userStore.clearUser();
}
const isLoggedIn = computed(() => userStore.isLoggedIn);
</script>

<style scoped>
.app-bar {
  display: flex;
  justify-content: space-around;
}
.gbtn {
  display: flex;
}
</style>

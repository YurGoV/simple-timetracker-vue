<template>
  <div class="g-signin2" data-onsuccess="onSignIn"></div>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "@/store/user";
import { getUserByToken } from "./services/auth.service";

const userStore = useUserStore();

onMounted(async () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const user = await getUserByToken(token);
      console.log(user, "user in app");
      userStore.setUser(user);
    } catch (error) {
      // TODO: change to error component
      console.error("Error fetching user data:", error);
    }
  }
});
//
</script>

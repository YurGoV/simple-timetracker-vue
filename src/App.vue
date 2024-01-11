<template>
  <div class="g-signin2" data-onsuccess="onSignIn"></div>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "@/store/user";
import { useRecordsStore } from "@/store/records";
import { useContextsStore } from "@/store/contexts";
import { loginUserByToken } from "./services/auth.service";

const userStore = useUserStore();
const recordsStore = useRecordsStore();
const contextsStore = useContextsStore();

onMounted(async () => {
  const token = localStorage.getItem("token");

  console.log(token, "in app localstorage token");

  if (token) {
    try {
      const { user, gettedContexts, gettedRecords } =
        await loginUserByToken(token);
      userStore.setUser(user);
      contextsStore.setupContexts(gettedContexts);
      recordsStore.setupRecords(gettedRecords);
    } catch (error) {
      // TODO: change to error component
      console.error("Error fetching user data:", error);
    }
  }
});
//
</script>

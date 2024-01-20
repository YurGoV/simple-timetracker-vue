<script setup>
import { loginUserByCredential } from "@/services/auth.service.js";
import { useUserStore } from "@/store/user";
import { useRecordsStore } from "@/store/records";
import { useContextsStore } from "@/store/contexts";

const userStore = useUserStore();
const recordsStore = useRecordsStore();
const contextsStore = useContextsStore();

const callback = async (response) => {
  const { credential } = response;
  const loginResult = await loginUserByCredential({ credential });
  const { user, gettedContexts, gettedRecords } = loginResult;
  userStore.setUser(user);
  contextsStore.setupContexts(gettedContexts);
  recordsStore.setupRecords(gettedRecords);
};
const config = {
  theme: 'filled_black',
  type: "icon",
  size: "medium",
  shape: "rectangular",
};
</script>

<template>
  <GoogleLogin :callback="callback" :buttonConfig="config" />
</template>

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
  console.log(credential, "credential");
  const loginResult = await loginUserByCredential({ credential });
  // console.log(user, "user in button");
  const { user, gettedContexts, gettedRecords } = loginResult;
  userStore.setUser(user);
  contextsStore.setupContexts(gettedContexts);
  recordsStore.setupRecords(gettedRecords);
};
const config = {
  type: "icon",
  size: "medium",
  shape: "circle",
};
</script>

<template>
  <GoogleLogin :callback="callback" :buttonConfig="config" />
  <!-- <GoogleLogin :callback="callback" prompt /> -->
  <!-- <GoogleLogin :callback="callback" :buttonConfig="config" prompt auto-login /> -->
</template>

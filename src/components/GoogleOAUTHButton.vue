<script setup>
import { loginUser } from "@/services/auth.service.js";
import { useUserStore } from "@/store/user";

const userStore = useUserStore();

const callback = async (response) => {
  const { credential } = response;
  console.log(credential, "credential");
  const user = await loginUser({ credential });
  console.log(user, "user in button");
  userStore.setUser( user );
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

// store/user.js
import { logoutUser } from "@/services/auth.service";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);

  function setUser(newUser) {
    console.log(newUser, "uuuu");
    console.log(newUser.token, "uuuttt");
    user.value = newUser;
    console.log(user.value.name, "uuuvvv");
    localStorage.setItem("token", newUser.token);
  }

  async function clearUser() {
    await logoutUser();
    user.value = null;
    localStorage.removeItem("token");
  }
  const isLoggedIn = computed(() => {
    console.log(user.value, "uv isLI");
    return user.value !== null;
  });

  const getUsername = computed(() => {
    return user.value ? user.value.name : "Guest";
  });

  return {
    setUser,
    clearUser,
    isLoggedIn,
    getUsername,
  };
});

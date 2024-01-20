import { logoutUser } from "@/services/auth.service";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);

  function setUser(newUser) {
    user.value = newUser;
    localStorage.setItem("token", newUser.token);
  }

  async function clearUser() {
    await logoutUser();
    user.value = null;
    localStorage.removeItem("token");
  }
  const isLoggedIn = computed(() => {
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

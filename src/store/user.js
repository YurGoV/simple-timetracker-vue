// store/user.js
import { logoutUser } from "@/services/auth.service";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null, // Initial state for the user module, representing the user data
  }),

  // Actions: Functions that modify the state
  actions: {
    setUser(user) {
      this.user = user;
      localStorage.setItem("token", user.token);
    },
    async clearUser() {
      await logoutUser();
      this.user = null;
      localStorage.removeItem("token");
    },
  },

  // Getters: Computed properties based on the state
  getters: {
    isLoggedIn() {
      return this.user !== null;
    },
    getUsername() {
      return this.user ? this.user.name : "Guest";
    },
  },
  // Mutations: Synchronous modifications to the state (optional)
  // mutations: {
  //   setUserName(newName) {
  //     this.user.username = newName;
  //   },
  // },
});

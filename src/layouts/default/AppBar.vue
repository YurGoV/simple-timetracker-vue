<template>
  <v-app-bar :elevation="2">
    <!-- <v-app-bar-nav-icon v-if="isLoggedIn" @click.stop="drawer = !drawer"> -->
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"> </v-app-bar-nav-icon>

    <!-- <v-navigation-drawer location="bottom" temporary> -->
    <!-- </v-app-bar-nav-icon> -->

    <v-app-bar-title class="app-bar">
      {{ $t(`common.title`) }}
    </v-app-bar-title>
    <!-- <v-icon icon="mdi-home" /> -->
    <!-- <v-icon icon="mdi-account" /> -->
    <div class="button-section">
      <GoogleAuthBtn v-if="!isLoggedIn" class="gbtn" />
      <v-btn v-else @click="logout" prepend-icon="mdi-logout">
        {{ $t(`common.logout`) }}
      </v-btn>
    </div>
    <!-- </v-app-bar-title> -->
  </v-app-bar>
  <!-- <v-navigation-drawer v-model="drawer" floating permanent> -->
  <v-navigation-drawer v-model="drawer" floating temporary>
    <v-list density="compact" nav>
      <v-list-item
        :to="{ name: 'Home' }"
        link
        title="Home"
        value="1"
      ></v-list-item>
      <!-- <v-list-item -->
      <!--   :to="{ name: 'AddTime' }" -->
      <!--   link -->
      <!--   title="Time" -->
      <!--   value="2" -->
      <!-- ></v-list-item> -->
      <v-list-item
        :to="{ name: 'Time' }"
        link
        title="Time"
        value="2"
      ></v-list-item>
      <v-list-item
        :to="{ name: 'About' }"
        link
        title="About"
        value="3"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, ref } from "vue";
import GoogleAuthBtn from "@/components/GoogleOAUTHButton.vue";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();

const drawer = ref(null);

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
.button-section {
  display: flex;
  padding-left: 20px;
  margin-right: 50px;
  max-width: 60px;
}
.gbtn {
  display: flex;
}
</style>

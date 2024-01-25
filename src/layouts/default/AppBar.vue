<template>
  <v-app-bar :elevation="2">
    <v-app-bar-nav-icon v-if="isLoggedIn" @click.stop="drawer = !drawer">
    </v-app-bar-nav-icon>
    <v-btn v-else-if="isHomeRoute" @click="onAboutBtnClick">
      {{ $t(`appBar.btnAboutName`) }}
    </v-btn>
    <v-btn v-else @click="onHomeBtnClick">
      {{ $t(`appBar.btnHomeName`) }}
    </v-btn>

    <v-app-bar-title class="app-bar">
      {{ $t(`appBar.title`) }}
    </v-app-bar-title>

    <div class="button-section">
      <div class="i18n-section">
        <v-switch
          v-model='$i18n.locale'
          true-value="en"
          false-value="ua"
          :label="$i18n.locale"
        ></v-switch>
      </div>
      <GoogleAuthBtn v-if="!isLoggedIn" class="gbtn" />
      <v-btn v-else @click="logout" prepend-icon="mdi-logout">
        {{ $t(`appBar.logout`) }}
      </v-btn>
    </div>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" floating temporary>
    <v-list density="compact" nav>
      <v-list-item
        :to="{ name: 'Home' }"
        link
        :title="$t(`appBar.home`)"
        value="1"
      ></v-list-item>
      <v-list-item
        :to="{ name: 'Time' }"
        link
        :title="$t(`appBar.time`)"
        value="2"
      ></v-list-item>
      <v-list-item
        :to="{ name: 'Config' }"
        link
        :title="$t(`appBar.config`)"
        value="3"
      ></v-list-item>
      <v-list-item
        :to="{ name: 'About' }"
        link
        :title="$t(`appBar.about`)"
        value="4"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import GoogleAuthBtn from "@/components/GoogleOAUTHButton.vue";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";

import i18n from '@/plugins/i18n'

const language = ref("en");
const router = useRouter();

const userStore = useUserStore();

const drawer = ref(null);

async function logout() {
  await userStore.clearUser();
  router.push({ name: "Home" });
}
async function onAboutBtnClick() {
  router.push({ name: "About" });
}

async function onHomeBtnClick() {
  router.push({ name: "Home" });
}

const isHomeRoute = computed(() => {
  return router.currentRoute.value.name === "Home";
});

const isLoggedIn = computed(() => userStore.isLoggedIn);

watch(language, (newLanguage) => {
  i18n.locale = newLanguage
});
</script>

<style scoped>
.app-bar {
  display: flex;
  justify-content: space-around;
}

.button-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  margin-right: 50px;
  min-width: 270px;
}
.i18n-section {
  display: flex;
  align-items: center;
  min-width: 100px;
}
.v-switch {
  display: flex;
  justify-content: center;
}
.gbtn {
  display: flex;
}
</style>

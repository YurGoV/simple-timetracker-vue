/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// TODO:
import vue3GoogleLogin from "vue3-google-login";

const app = createApp(App);

// TODO:
app.use(vue3GoogleLogin, {
  // clientId: "YOUR_GOOGLE_CLIENT_ID",
  clientId:
    "634188018755-ums1tj1ch1eshs2n91272or2tbn27ini.apps.googleusercontent.com",
});

registerPlugins(app);

app.mount("#app");

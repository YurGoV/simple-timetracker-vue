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

registerPlugins(app);

// TODO:
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_OAUTH_GOOGLE_CLIENT_ID,
});

app.mount("#app");

/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import pinia from "../store";
import vuetify from "./vuetify";
import router from "../router";
import i18n from "./i18n";

export function registerPlugins(app) {
  app
    .use(pinia)
    .use(vuetify)
    .use(router)
    .use(i18n);
}

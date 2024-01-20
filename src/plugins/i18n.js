import { createI18n } from "vue-i18n";
import { ref, watch } from "vue";
import localesEN from "@/locales/en.json";
import localesUA from "@/locales/ua.json";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || "en",
  fallbackLocale: 'en',
  messages: {
    en: localesEN,
    ua: localesUA,
  },
  globalInjection: true,
});

const currentLocale = ref(i18n.global.locale);

watch(currentLocale, (newLocale) => {
  localStorage.setItem("locale", newLocale);
});

export default i18n;

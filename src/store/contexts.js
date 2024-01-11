import { computed, ref } from "vue";
import { defineStore } from "pinia";

export const useContextsStore = defineStore("contexts", () => {
  const contexts = ref(null);

  function setupContexts(gettedContexts) {
    console.log(gettedContexts);
    contexts.value = gettedContexts;
  }

  const getAllContexts = computed(() => contexts.value);
  const getLifeSpheres = computed(() => {
    if (contexts.value) {
      return contexts.value.filter((item) => {
        return item.type === "life";
      });
    }
    return null;
  });
  const getImportances = computed(() => {
    if (contexts.value) {
      return contexts.value.filter((item) => {
        return item.type === "importance";
      });
    }
    return null;
  });

  const getTags = computed(() => {
    if (contexts.value) {
      return contexts.value.filter((item) => {
        return item.type === "tag";
      });
    }
    return null;
  });

  return {
    setupContexts,
    getAllContexts,
    getLifeSpheres,
    getImportances,
    getTags,
  };
});

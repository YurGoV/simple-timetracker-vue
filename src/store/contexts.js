import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { updateContext, createTag } from "@/services/contexts.service";

export const useContextsStore = defineStore("contexts", () => {
  const contexts = ref([]);

  function setupContexts(gettedContexts) {
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

  async function updateContextInDb(payload) {
    try {
      const newContext = await updateContext(payload);
      if (newContext) {
        const contextId = contexts.value.findIndex(
          (context) => context._id === newContext._id,
        );
        contexts.value[contextId].value = newContext.value;
        return newContext;
      }
    } catch {
      return false;
    }
  }

  async function createTagInDb(payload) {
    try {
      const newTag = await createTag(payload);
      if (newTag) {
        contexts.value.push(newTag);
      }
      return newTag;
    } catch (err) {
      console.log(err, "eerr");
      return false;
    }
  }

  return {
    setupContexts,
    getAllContexts,
    getLifeSpheres,
    getImportances,
    getTags,
    updateContextInDb,
    createTagInDb,
  };
});

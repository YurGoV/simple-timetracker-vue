<template>
  <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    location="top"
    :close-on-content-click="true"
    timeout="2500"
  >
    {{ snackbarText }}</v-snackbar
  >
  <v-sheet class="section-title">
    <h1>{{ $t(`configPage.titleOne`) }}</h1>
  </v-sheet>
  <v-responsive class="mx-auto" max-width="344">
    <v-text-field
      v-model="newTag"
      :label="$t(`configPage.addLabel`)"
      hide-details="auto"
    ></v-text-field>
  </v-responsive>
  <v-sheet class="section-title">
    <v-btn
      @click="create"
      :disabled="isAddNewTagButtonDisabled"
      color="primary"
      >{{ $t(`configPage.save`) }}</v-btn
    >
  </v-sheet>
  <!-- DRY -->
  <v-sheet class="section-title">
    <h1>{{ $t(`configPage.titleTwo`) }}</h1>
  </v-sheet>
  <v-responsive class="mx-auto" max-width="344">
    <v-text-field
      v-model="tagToUpdage"
      :label="$t(`configPage.chooseLabel`)"
      hide-details="auto"
    ></v-text-field>
  </v-responsive>
  <v-sheet class="section-title">
    <v-btn @click="save" :disabled="isButtonDisabled" color="primary">{{
      $t(`configPage.save`)
    }}</v-btn>
  </v-sheet>

  <v-container>
    <v-row no-gutters>
      <v-col>
        <v-card class="mx-auto" min-width="300" max-width="500">
          <v-card-title>{{ $t(`configPage.editImprtns`) }}: </v-card-title>

          <v-divider></v-divider>

          <v-virtual-scroll :items="importances" height="220" item-height="48">
            <template v-slot:default="{ item }">
              <v-list-item
                :title="$t(`configPage.tagName`)"
                :subtitle="`${item.value}`"
              >
                <template v-slot:append>
                  <v-btn
                    @click="onListClick(item)"
                    icon="mdi-pencil"
                    size="x-small"
                    variant="tonal"
                  ></v-btn>
                </template>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-card>
        <v-card class="mx-auto" min-width="300" max-width="500">
          <v-card-title>{{ $t(`configPage.editLifeSphrs`) }}: </v-card-title>

          <v-divider></v-divider>

          <v-virtual-scroll :items="lifeSpheres" height="220" item-height="48">
            <template v-slot:default="{ item }">
              <v-list-item
                :title="$t(`configPage.tagName`)"
                :subtitle="`${item.value}`"
              >
                <template v-slot:append>
                  <v-btn
                    @click="onListClick(item)"
                    icon="mdi-pencil"
                    size="x-small"
                    variant="tonal"
                  ></v-btn>
                </template>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-card>
        <v-card class="mx-auto" min-width="300" max-width="500">
          <v-card-title>{{ $t(`configPage.editTags`) }}: </v-card-title>

          <v-divider></v-divider>

          <v-virtual-scroll :items="tags" height="220" item-height="48">
            <template v-slot:default="{ item }">
              <v-list-item :title="`Tag name:`" :subtitle="`${item.value}`">
                <template v-slot:append>
                  <v-btn
                    @click="onListClick(item)"
                    icon="mdi-pencil"
                    size="x-small"
                    variant="tonal"
                  ></v-btn>
                </template>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, ref } from "vue";
import { useContextsStore } from "@/store/contexts";

import { useSnackbar } from "@/utils/useSnackbar";
const { snackbar, snackbarText, snackbarColor, showSnackbar } = useSnackbar();

const newTag = ref("");
const oldTagName = ref(null);
const tagToUpdage = ref(null);
const tagId = ref(null);

const contextsStore = useContextsStore();
const { getImportances, getLifeSpheres, getTags } = contextsStore;
const lifeSpheres = computed(() =>
  getLifeSpheres
    .filter((context) => (context.type = "life"))
    .map((lifeSphere) => {
      return { id: lifeSphere._id, value: lifeSphere.value };
    }),
);

const importances = computed(() =>
  getImportances
    .filter((context) => (context.type = "importance"))
    .map((lifeSphere) => {
      return { id: lifeSphere._id, value: lifeSphere.value };
    }),
);

const tags = computed(() =>
  getTags.map((tag) => {
    return { id: tag._id, value: tag.value };
  }),
);

const isButtonDisabled = computed(
  () => oldTagName.value === tagToUpdage.value || !tagToUpdage.value,
);
const isAddNewTagButtonDisabled = computed(() => newTag.value.trim() === "");

function onListClick(context) {
  oldTagName.value = context.value;
  tagToUpdage.value = context.value;
  tagId.value = context.id;
}

async function create() {
  const newTagFromDb = await contextsStore.createTagInDb({
    value: newTag.value,
  });
  showSnackbar({ isSuccess: newTagFromDb });
}

async function save() {
  const savedResult = await contextsStore.updateContextInDb({
    id: tagId.value,
    value: tagToUpdage.value,
  });
  if (savedResult) {
    oldTagName.value = savedResult.value;
  }

  showSnackbar({ isSuccess: savedResult });
}
</script>

<style scoped>
.v-card {
  margin-top: 30px;
}
.v-btn {
  margin-top: 20px;
}
.section-title {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.main-button {
  display: flex;
  flex-direction: column;
}

.timer {
  font-size: 6rem;
  margin: auto;
}

.pause {
  font-size: 2rem;
  margin: auto;
}
</style>

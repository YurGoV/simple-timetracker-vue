<template>
  <h1>Config page</h1>
  <div>
    <v-text-field
      v-model="newTagName"
      label="choose tag to edit"
      hide-details="auto"
    ></v-text-field>
  </div>
  <v-btn @click="save" :disabled="isButtonDisabled" color="primary">Save</v-btn>

  <v-container class="fill-height">
    <!-- <v-responsive class="align-center text-center fill-height"> -->
    <!-- <v-navigation-drawer v-model="drawerVisible" location="bottom" temporary> -->

    <!-- <v-row class="d-flex justify-center"> -->
    <v-row no-gutters>
      <!-- <v-col cols="auto"> -->
      <!--   <v-sheet -->
      <!--     :elevation="0" -->
      <!--     :height="900" -->
      <!--     :width="500" -->
      <!--     rounded -->
      <!--     class="main-button" -->
      <!--   > -->
      <!-- <v-row width='1200px'> -->
      <!-- tags list -->
      <v-col>
        <v-card class="mx-auto" min-width="300" max-width="500">
          <v-card-title> Edit importances: </v-card-title>

          <v-divider></v-divider>

          <v-virtual-scroll :items="importances" height="220" item-height="48">
            <template v-slot:default="{ item }">
              <v-list-item :title="`Tag name:`" :subtitle="`${item.value}`">
                <!-- <template v-slot:prepend> -->
                <!--   <v-icon class="bg-primary">mdi-account</v-icon> -->
                <!-- </template> -->
                <!---->
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
      <v-col>
        <v-card class="mx-auto" min-width="300" max-width="500">
          <v-card-title> Edit life spheres: </v-card-title>

          <v-divider></v-divider>

          <v-virtual-scroll :items="lifeSpheres" height="220" item-height="48">
            <template v-slot:default="{ item }">
              <v-list-item :title="`Tag name:`" :subtitle="`${item.value}`">
                <!-- <template v-slot:prepend> -->
                <!--   <v-icon class="bg-primary">mdi-account</v-icon> -->
                <!-- </template> -->
                <!---->
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
      <v-col>
        <v-card class="mx-auto" min-width="300" max-width="500">
          <v-card-title> Edit Tags: </v-card-title>

          <v-divider></v-divider>

          <v-virtual-scroll :items="tags" height="220" item-height="48">
            <template v-slot:default="{ item }">
              <v-list-item :title="`Tag name:`" :subtitle="`${item.value}`">
                <!-- <template v-slot:prepend> -->
                <!--   <v-icon class="bg-primary">mdi-account</v-icon> -->
                <!-- </template> -->
                <!---->
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
      <!--   <v-list> -->
      <!--     <v-list-item -->
      <!--       @click="onListClick(item.id)" -->
      <!--       v-for="item in tags" -->
      <!--       :key="item.id" -->
      <!--       :title="item.title" -->
      <!--     ></v-list-item> -->
      <!--   </v-list> -->
    </v-row>
    <!--       </v-sheet> -->
    <!--     </v-col> -->
    <!--   </v-row> -->
    <!-- </v-responsive> -->
  </v-container>
</template>

<script setup>
import { computed, ref } from "vue";
import { useContextsStore } from "@/store/contexts";

const oldTagName = ref(null);
const newTagName = ref(null);
const tagId = ref(null);

const contextsStore = useContextsStore();
const { getImportances, getLifeSpheres, getTags } = contextsStore;
// const contexts = computed(() =>
//   getAllContexts.map((context) => {
//     const title = context.value;
//     const id = context._id;
//     return { title, id };
//   }),
// );
//
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
  () => oldTagName.value === newTagName.value || !newTagName.value,
);

function onListClick(context) {
  console.log(`on list click: ${context}`);
  oldTagName.value = context.value;
  newTagName.value = context.value;
  tagId.value = context.id;
}
function save() {
  console.log("click on save");
  contextsStore.updateContextInDb({
    id: tagId.value,
    value: newTagName.value
  })

}
</script>

<style scoped>
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
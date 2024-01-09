<template>
  <!-- <v-container class="fill-height"> -->
    <!-- <v-responsive class="align-center text-center fill-height"> -->
      <!-- <v-navigation-drawer v-model="drawerVisible" location="bottom" temporary> -->

      <!-- <v-row class="d-flex align-center justify-center"> -->
        <!-- <v-col cols="auto"> -->
          <!-- <v-sheet :elevation="0" :height="900" :width="500" rounded> -->
          <v-sheet :elevation="0" :height="40" :width="800" rounded class="buttons-section">
            <v-btn  color="primary">Add Time</v-btn>
            <v-btn  color="primary">Add Time</v-btn>
            <!-- </v-col> -->
          </v-sheet>
        <!-- </v-col> -->
      <!-- </v-row> -->
      <!-- <v-row> </v-row> -->
    <!-- </v-responsive> -->
  <!-- </v-container> -->
</template>

<script setup></script>

<style scoped>
.main-button {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.timer {
  font-size: 6rem;
  margin: auto;
}
.pause {
  font-size: 2rem;
  margin: auto;
}
.buttons-section {
  display: flex;
  justify-content: space-around;
}
</style>

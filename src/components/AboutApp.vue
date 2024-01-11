<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <!-- <v-navigation-drawer v-model="drawerVisible" location="bottom" temporary> -->

      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-sheet
            :elevation="0"
            :height="900"
            :width="500"
            rounded
            class="main-button"
          >
            <h1>About this app</h1>
            <p>
              For many of us, there’s a gap between the compass and the clock—
              between what’s deeply important to us and the way we spend our
              time.
              <br />
              <br />
              ― Stephen R. Covey, First Things First
              <br />
              <br />
              <br />
              the purpose of this application is to help in the analysis of
              which areas of our lives we spend time on and whether we do not
              sacrifice important things in our lives in exchange for the urgent
            </p>
          </v-sheet>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup></script>

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

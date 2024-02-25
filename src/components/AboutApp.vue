<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-sheet
            :elevation="0"
            :height="900"
            :max-width="600"
            rounded
            class="main-button"
          >
            <h1>{{ $t(`aboutApp.title`) }}</h1>
            <p>
              {{ $t(`aboutApp.quote`) }}
              <br />
              <br />
            </p>
            {{ $t(`aboutApp.quoteAuthor`) }}
            <p>
              <br />
              <br />
              {{ $t(`aboutApp.describe`) }}
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

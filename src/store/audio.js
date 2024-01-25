import { defineStore } from "pinia";
import { Howl } from "howler";

export const useAudioStore = defineStore("audio", {
  state: () => ({
    beepSound: new Howl({
      src: ["/ping.mp3"],
    }),
  }),

  actions: {
    playBeepSound() {
      this.beepSound.play();
    },
  },
});


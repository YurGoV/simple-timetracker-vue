import { ref } from "vue";

export function useSnackbar() {
  const snackbar = ref(false);
  const snackbarText = ref("");
  const snackbarColor = ref("");

  function showSnackbar({
    isSuccess,
    onSuccessText = "Success!! )",
    onErrorText = "error!! (",
  }) {
    snackbar.value = true;
    if (isSuccess) {
    snackbarText.value = onSuccessText;
    snackbarColor.value = 'green';
    } else {
    snackbarText.value = onErrorText;
    snackbarColor.value = 'red';
    }
  }

  return {
    snackbar,
    snackbarText,
    snackbarColor,
    showSnackbar,
  };
}

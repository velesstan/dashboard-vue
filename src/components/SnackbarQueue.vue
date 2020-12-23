<template>
  <v-snackbars color="red" bottom right :objects.sync="messages"></v-snackbars>
</template>

<script>
import VSnackbars from "v-snackbars";
export default {
  name: "SnackbarQueue",
  components: {
    "v-snackbars": VSnackbars,
  },
  computed: {
    messages: {
      get() {
        return this.$store.state.APP.notifications;
      },
      set() {},
    },
  },
};
</script>

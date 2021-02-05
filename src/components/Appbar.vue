<template>
  <v-app-bar color="primary" dark app clipped-left>
    <v-app-bar-nav-icon></v-app-bar-nav-icon>
    <v-toolbar-title color="primary" class="ml-0 pl-3">
      <span id="brand">VELES ERP</span>
    </v-toolbar-title>
    <v-spacer />
    <v-btn text>5.5</v-btn>
    <v-btn text @click.stop="signOut">Выход</v-btn>
  </v-app-bar>
</template>

<script>
import { USER_LOGOUT } from "@/store/auth/action-types";
export default {
  name: "Appbar",
  methods: {
    signOut() {
      this.$store.dispatch(USER_LOGOUT);
    },
  },
};
</script>

<style scoped>
#brand {
  user-select: none;
}
</style>

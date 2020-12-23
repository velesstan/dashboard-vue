<template>
  <div class="dashboard">
    <Appbar />
    <Sidenav />
    <v-main class="content">
      <router-view></router-view>
      <SnackbarQueue />
    </v-main>
  </div>
</template>

<script>
import Sidenav from "@/components/Sidenav";
import Appbar from "@/components/Appbar";
import SnackbarQueue from "@/components/SnackbarQueue";
import { APP_INIT } from "@/store/app/action-types";
import { GET_USERS } from "@/store/auth/action-types";
import { USER_LOGOUT } from "@/store/auth/action-types";
export default {
  name: "Dashboard",
  components: {
    Sidenav,
    Appbar,
    SnackbarQueue,
  },
  mounted() {
    this.$store.dispatch(APP_INIT);
    this.$store.dispatch(GET_USERS);
  },
  methods: {
    signOut() {
      this.$store.dispatch(USER_LOGOUT);
    },
  },
};
</script>

<style lang="less" scoped>
.dashboard {
  background-color: #eee;
  min-height: 100%;
}
</style>

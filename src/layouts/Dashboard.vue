<template>
  <div class="dashboard">
    <Appbar />
    <Sidenav />
    <v-main class="content">
      <router-view></router-view>
      <SnackbarQueue :objects.sync="notifications" />
    </v-main>
  </div>
</template>

<script>
import Sidenav from "@/components/Sidenav";
import Appbar from "@/components/Appbar";
import SnackbarQueue from "@/components/SnackbarQueue";
import { APP_INIT } from "@/store/app/action-types";
import { NOTIFY_DISMISS } from "@/store/app/mutation-types";
import { GET_USERS } from "@/store/auth/action-types";
export default {
  name: "Dashboard",
  components: {
    Sidenav,
    Appbar,
    SnackbarQueue,
  },
  computed: {
    notifications: {
      get() {
        return this.$store.state.APP.notifications;
      },
      set(n) {
        this.$store.commit(NOTIFY_DISMISS, n);
      },
    },
  },
  mounted() {
    this.$store.dispatch(APP_INIT);
    this.$store.dispatch(GET_USERS);
  },
};
</script>

<style lang="less" scoped>
.dashboard {
  background-color: #eee;
  min-height: 100%;
}
</style>

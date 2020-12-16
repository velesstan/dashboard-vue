<template>
  <div class="dashboard">
    <v-app-bar color="primary" dark app clipped-left id="toolbar">
      <v-app-bar-nav-icon @click.stop="sideNav = !sideNav"></v-app-bar-nav-icon>
      <v-toolbar-title color="primary" class="ml-0 pl-3">
        <span id="brand">VELES ERP</span>
      </v-toolbar-title>
      <v-spacer />
      <v-btn text>2.4</v-btn>
      <v-btn text @click.stop="signOut">Выход</v-btn>
    </v-app-bar>
    <v-navigation-drawer app clipped :value="sideNav">
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar>
            <v-avatar color="primary" size="64">
              <span class="white--text headline">НК</span>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>Наталья Калкутина</v-list-item-title>
            <v-list-item-subtitle>Администратор</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-divider></v-divider>
      <v-list>
        <v-list-item exact to="/dashboard">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Главная</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item exact to="/dashboard/residues">
          <v-list-item-icon>
            <v-icon>mdi-database-search</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Остатки</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item exact to="/dashboard/waybills">
          <v-list-item-icon>
            <v-icon>mdi-book-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Накладные</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/dashboard/settings">
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Настройки</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/dashboard/users">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Пользователи</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main class="content">
      <router-view></router-view>
    </v-main>
  </div>
</template>

<script>
import { ERP_INIT } from "@/store/erp/action-types";
import { GET_USERS } from "@/store/auth/action-types";
import { USER_LOGOUT } from "@/store/auth/action-types";
export default {
  name: "Dashboard",
  data() {
    return {
      sideNav: true,
    };
  },
  mounted() {
    this.$store.dispatch(ERP_INIT);
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
#brand {
  user-select: none;
}
.dashboard {
  background-color: #eee;
  min-height: 100%;
}
</style>

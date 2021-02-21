<template>
  <v-navigation-drawer app clipped>
    <template v-slot:prepend>
      <v-list-item two-line>
        <v-list-item-avatar>
          <v-avatar color="primary" size="64">
            <span class="white--text headline">НК</span>
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            >{{ user.firstName }} {{ user.lastName }}</v-list-item-title
          >
          <v-list-item-subtitle>Пользователь</v-list-item-subtitle>
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
</template>

<script>
export default {
  name: "Sidenav",
  computed: {
    user() {
      return this.$store.state.AUTH.user;
    },
  },
};
</script>

<style></style>

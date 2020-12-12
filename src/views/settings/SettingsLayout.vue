<template>
  <div>
    <v-sheet class="navigator" tile dark color="primary">
      <h2 class="display-1 font-weight-light">Настройки</h2>
      <v-tabs :show-arrows="false" background-color="primary" dark color="primary">
        <v-tab to="/dashboard/settings/erp/categories">Категории</v-tab>
        <v-tab to="/dashboard/settings/erp/products">Продукция</v-tab>
        <v-tab to="/dashboard/settings/erp/stocks">Склады</v-tab>
      </v-tabs>
    </v-sheet>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "SettingsLayout"
};
</script>

<style lang="less" >
.navigator {
  padding: 3em 2em 0;
  h2 {
    padding-bottom: 0.75em;
  }
}
.v-slide-group__prev {
  display: none !important;
}
</style>
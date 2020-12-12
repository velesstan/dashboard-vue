<template>
  <v-container id="bg" class="text-center" fluid fill-height>
    <v-row align="center">
      <v-col>
        <h1 class="display-3 white--text">Упс, 404</h1>
        <p class="white--text">Вы запросили страницу, которая не существует</p>
        <v-btn :to="`/`" color="white" dark outlined>Уйти от сюда</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "NotFound",
  data() {
    return {};
  }
};
</script>
<style lang="less" scoped>
.full-height {
  min-height: 100%;
}
#bg {
  background-image: url("~@/assets/sign-in-background.png");
  background-size: cover;
}
</style>
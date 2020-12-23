<template>
  <v-container fluid id="bg" fill-height>
    <v-row class="full-height" justify="center" align-content="center">
      <v-col cols="12" sm="6" md="5" lg="4">
        <v-card>
          <v-toolbar elevation="1">
            <v-toolbar-title>Авторизация</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-container>
              <v-form>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      :disabled="loading"
                      v-model="email"
                      type="text"
                      prepend-icon="mdi-account"
                      label="Почта"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      :disabled="loading"
                      v-model="password"
                      type="password"
                      prepend-icon="mdi-lock"
                      label="Пароль"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-alert
                      v-if="error.isError"
                      dark
                      dense
                      transition
                      color="red"
                      >Неверные данные</v-alert
                    >
                  </v-col>
                  <v-col cols="12">
                    <v-row>
                      <v-col>
                        <v-btn text :disabled="loading">Забыли пароль?</v-btn>
                      </v-col>
                      <v-col cols="auto">
                        <v-btn
                          :disabled="loading"
                          :loading="loading"
                          tile
                          color="primary"
                          @click="signIn"
                          >Войти</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { USER_LOGIN } from "@/store/auth/action-types";
export default {
  name: "SignIn",
  data() {
    return {
      email: "",
      password: "",
      error: {
        isError: false,
      },
      loading: false,
    };
  },
  methods: {
    async signIn() {
      try {
        this.loading = true;
        this.error.isError = false;
        await this.$store.dispatch(USER_LOGIN, {
          email: this.email,
          password: this.password,
        });
      } catch (e) {
        this.error.isError = true;
        this.password = "";
        this.loading = false;
      }
    },
  },
};
</script>
<style lang="less" scoped>
#bg {
  background-image: url("~@/assets/sign-in-background.png");
  background-size: cover;
}
</style>

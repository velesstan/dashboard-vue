<template>
  <div>
    <v-sheet class="navigator" tile dark color="primary">
      <h2 class="display-1 font-weight-light">Пользователи</h2>
    </v-sheet>
    <v-container fluid>
      <v-card>
        <v-toolbar elevation="1">
          <v-row align="center">
            <v-spacer />
            <v-col cols="auto">
              <v-dialog persistent v-model="crudDialog" max-width="500">
                <template v-slot:activator="{ on }">
                  <v-btn text v-on="on">Добавить пользователя</v-btn>
                </template>
                <v-card>
                  <v-toolbar elevation="0" dark color="primary">
                    <span>Пользователь</span>
                  </v-toolbar>
                  <v-card-text>
                    <v-form ref="form">
                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            v-model="editedItem.email"
                            prepend-icon="mdi-account"
                            type="text"
                            label="Имя пользователя"
                          />
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            v-model="editedItem.password"
                            prepend-icon="mdi-lock"
                            type="password"
                            label="Пароль"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.firstName"
                            type="text"
                            label="Имя"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.lastName"
                            type="text"
                            label="Фамилия"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.patronymic"
                            type="text"
                            label="Отчество"
                          />
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn text @click.stop="closeCrudDialog()">Отмена</v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click.stop="$refs.form.validate() && save()"
                      >Сохранить</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-toolbar>
        <v-card-text></v-card-text>
        <v-data-table :headers="headers" :items="users">
          <template v-slot:body>
            <tbody>
              <tr v-for="item in users" :key="item._id">
                <td>{{ item.email }}</td>
                <td>{{ item.lastName }}</td>
                <td>{{ item.firstName }}</td>
                <td>{{ item.patronymic }}</td>
                <td></td>
                <td>{{ item.updatedAt | moment("HH:mm DD/MM/YYYY") }}</td>
                <td>{{ item.createdAt | moment("HH:mm DD/MM/YYYY") }}</td>
                <td class="text-right">
                  <v-btn icon small @click="openCrudDialog(item, 'update')">
                    <v-icon small>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon small @click="remove(item)">
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import api from "@/plugins/api";
import {
  CREATE_USER,
  UPDATE_USER,
  REMOVE_USER,
} from "@/store/auth/action-types";
export default {
  name: "Users",
  data() {
    return {
      crudDialog: false,
      formValid: true,
      crudMode: "create",
      editedItem: {
        _id: "",
        email: "",
        password: "",
        patronymic: "",
        firstName: "",
        lastName: "",
      },
      defaultItem: {
        email: "",
        password: "",
        patronymic: "",
        firstName: "",
        lastName: "",
      },
      headers: [
        {
          text: "Email",
          align: "start",
          value: "email",
        },
        {
          text: "Фамилия",
          value: "lastName",
        },
        {
          text: "Имя",
          value: "firstName",
        },
        {
          text: "Отчество",
          value: "patronymic",
        },
        {
          text: "Password",
          value: "password",
        },
        {
          text: "Обновлено",
          value: "updatedAt",
        },
        {
          text: "Создано",
          value: "createdAt",
        },
        { text: "Действия", align: "end" },
      ],
    };
  },
  computed: {
    users() {
      return this.$store.state.AUTH.users;
    },
  },

  mounted() {},
  methods: {
    openCrudDialog(item = this.defaultItem, mode = "create") {
      this.crudMode = mode;
      this.editedItem = Object.assign({}, item);
      this.crudDialog = true;
      setImmediate(() => {
        this.$refs.form.resetValidation();
      });
    },
    closeCrudDialog() {
      this.crudDialog = false;
      this.editedItem = Object.assign({}, this.defaultItem);
    },
    async save() {
      if (this.crudMode === "create") {
        const { _id, ...user } = this.editedItem;
        this.$store.dispatch(CREATE_USER, user);
      } else if (this.crudMode === "update") {
        this.$store.dispatch(UPDATE_USER, this.editedItem);
      }
      this.closeCrudDialog();
    },
    async remove(item) {
      this.$store.dispatch(REMOVE_USER, item._id);
    },
  },
};
</script>
<style lang="less" scoped>
.navigator {
  padding: 3em 2em 0;
  h2 {
    padding-bottom: 0.75em;
  }
}
</style>

<template>
  <div>
    <v-row no-gutters>
      <v-col>
        <v-card>
          <v-toolbar elevation="1">
            <v-text-field
              v-model="search"
              hide-details
              solo
              flat
              prepend-icon="mdi-magnify"
              label="Поиск"
            />
            <v-btn color="primary" @click="openCrudDialog()">Добавить</v-btn>
            <v-dialog persistent v-model="crudDialog" max-width="500px">
              <v-card>
                <v-toolbar dark elevation="0" color="primary">
                  <span>{{`${crudMode === 'create' ? 'Добавить склад' : 'Редактировать'}`}}</span>
                  <v-spacer />
                  <v-btn icon @click="closeCrudDialog()">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <v-container>
                    <v-form ref="form" v-model="formValid" lazy-validation>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.title"
                            :counter="15"
                            :rules="nameRules"
                            validate-on-blur
                            error-count="3"
                            label="Название"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="editedItem.waybillPrefix"
                            :rules="waybillPrefixRules"
                            :counter="10"
                            validate-on-blur
                            error-count="2"
                            label="Префикс накладной"
                          />
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    @click="$refs.form.validate() && save()"
                    text
                    color="green"
                  >{{`${crudMode === 'create' ? 'Создать': 'Обновить'}`}}</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn icon class="ml-3" @click="refresh">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-data-table :search="search" :headers="headers" :items="items">
              <template v-slot:body="{items}">
                <tbody>
                  <tr v-for="item in items" :key="item._id">
                    <td>{{item.title}}</td>
                    <td>{{item.createdAt | moment('HH:mm DD/MM/YYYY')}}</td>
                    <td>{{item.updatedAt | moment('HH:mm DD/MM/YYYY')}}</td>
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  GET_STOCKS,
  CREATE_STOCK,
  UPDATE_STOCK,
  REMOVE_STOCK
} from "@/store/erp/action-types";
export default {
  name: "Stocks",
  data() {
    return {
      search: "",
      crudDialog: false,
      formValid: true,
      crudMode: "create",
      editedItem: {
        _id: "",
        title: "",
        waybillPrefix: ""
      },
      defaultItem: {
        title: "",
        waybillPrefix: ""
      },
      headers: [
        {
          text: "Название",
          align: "start",
          value: "title"
        },
        {
          text: "Создано",
          value: "createdAt"
        },
        {
          text: "Обновлено",
          value: "updatedAt"
        },
        { text: "Действия", align: "end" }
      ],
      waybillPrefixRules: [
        v => !!v || "Это поле необходимо",
        v => (v && v.length <= 10) || "Максимум 10 символов"
      ],
      nameRules: [
        v => !!v || "Это поле необходимо",
        v => (v && v.length >= 4) || "Минимум 4 символа",
        v => (v && v.length <= 15) || "Максимум 10 символов"
      ]
    };
  },
  computed: {
    items() {
      return this.$store.state.ERP.stocks.items;
    }
  },

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
        this.$store.dispatch(CREATE_STOCK, this.editedItem);
      } else if (this.crudMode === "update") {
        const { _id, createdAt, updatedAt, ...item } = this.editedItem;
        this.$store.dispatch(UPDATE_STOCK, this.editedItem);
      }
      this.closeCrudDialog();
    },
    async remove(item) {
      this.$store.dispatch(REMOVE_STOCK, item._id);
    },
    refresh() {
      this.$store.dispatch(GET_STOCKS);
    }
  }
};
</script>
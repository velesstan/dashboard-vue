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
                  <span>{{
                    `${
                      crudMode === "create"
                        ? "Добавить категорию"
                        : "Редактировать"
                    }`
                  }}</span>
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
                            :rules="categoryRules"
                            :counter="15"
                            validate-on-blur
                            error-count="3"
                            label="Название категории"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-select
                            v-model="editedItem.unit"
                            :items="units"
                            :rules="unitRules"
                            label="Единица измерения"
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
                    >{{
                      `${crudMode === "create" ? "Создать" : "Обновить"}`
                    }}</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn icon class="ml-3" @click="refresh">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn icon class="ml-3" @click="exportCategories()">
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-data-table
              :loading="tableLoading"
              :search="search"
              :headers="headers"
              :items="items"
            >
              <template v-slot:body="{ items }">
                <tbody>
                  <tr v-for="item in items" :key="item._id">
                    <td>{{ item.title }}</td>
                    <td>{{ item.unit }}</td>
                    <td>{{ item.createdAt | moment("HH:mm DD/MM/YYYY") }}</td>
                    <td>{{ item.updatedAt | moment("HH:mm DD/MM/YYYY") }}</td>
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
import api from "@/plugins/api";
import {
  CREATE_CATEGORY,
  READ_CATEGORIES,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
} from "@/store/categories/action-types";
export default {
  name: "Categories",
  data() {
    return {
      search: "",
      crudDialog: false,
      formValid: true,
      crudMode: "create",
      editedItem: {
        _id: "",
        title: "",
        unit: "",
      },
      defaultItem: {
        title: "",
        unit: "",
      },
      headers: [
        {
          text: "Название",
          align: "start",
          value: "title",
        },
        {
          text: "СИ",
          value: "unit",
        },
        {
          text: "Создано",
          value: "createdAt",
        },
        {
          text: "Обновлено",
          value: "updatedAt",
        },
        { text: "Действия", align: "end", sortable: false },
      ],
      units: [
        { text: "шт" },
        { text: "л" },
        { text: "кг" },
        { text: "м" },
        { text: "м²" },
        { text: "м³" },
      ],
      categoryRules: [
        (v) => !!v || "Это поле необходимо",
        (v) => (v && v.length >= 4) || "Минимум 4 символа",
        (v) => (v && v.length <= 15) || "Максимум 15 символов",
      ],
      unitRules: [(v) => !!v || "Это поле необходимо"],
    };
  },
  computed: {
    items() {
      return this.$store.state.CATEGORIES.categories.items;
    },
    tableLoading() {
      return this.$store.state.CATEGORIES.categories.table.loading;
    },
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
    async exportCategories() {
      const { data } = await api.get(`/api/export/categories/`, {
        responseType: "arraybuffer",
      });
      saveAs(new Blob([data]), "Продукция.xlsx");
    },
    async save() {
      if (this.crudMode === "create") {
        this.$store.dispatch(CREATE_CATEGORY, this.editedItem);
      } else if (this.crudMode === "update") {
        const { _id, updatedAt, createdAt, ...item } = this.editedItem;
        this.$store.dispatch(UPDATE_CATEGORY, this.editedItem);
      }
      this.closeCrudDialog();
    },
    async remove(item) {
      this.$store.dispatch(DELETE_CATEGORY, item._id);
    },
    refresh() {
      this.$store.dispatch(READ_CATEGORIES, {});
    },
  },
};
</script>

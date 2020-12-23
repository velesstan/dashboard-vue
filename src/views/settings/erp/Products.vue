<template>
  <div>
    <v-row no-gutters>
      <v-col>
        <v-card>
          <v-toolbar
            elevation="1"
            :extended="filtersExtended"
            extension-height="100"
          >
            <v-row align="center">
              <v-col>
                <v-text-field
                  v-model="search"
                  hide-details
                  solo
                  flat
                  prepend-icon="mdi-magnify"
                  label="Поиск"
                />
              </v-col>
              <v-col cols="auto">
                <v-btn color="primary" @click="openCrudDialog()"
                  >Добавить</v-btn
                >
                <v-dialog persistent v-model="crudDialog" max-width="500px">
                  <v-card>
                    <v-toolbar dark elevation="0" color="primary">
                      <span>{{
                        `${
                          crudMode === "create"
                            ? "Добавить продукт"
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
                              <v-autocomplete
                                :rules="categoryRules"
                                :items="categories"
                                v-model="editedItem.category"
                                label="Категория"
                                item-text="title"
                                return-object
                              />
                            </v-col>
                            <v-col cols="12">
                              <v-text-field
                                v-model="editedItem.code"
                                :rules="codeRules"
                                :counter="10"
                                validate-on-blur
                                error-count="3"
                                label="Код"
                              />
                            </v-col>
                            <v-col cols="12">
                              <v-text-field
                                v-model="editedItem.title"
                                :rules="nameRules"
                                :counter="50"
                                validate-on-blur
                                error-count="3"
                                label="Название"
                              />
                            </v-col>
                            <v-col cols="6">
                              <v-text-field
                                type="number"
                                v-model="editedItem.price"
                                :rules="priceRules"
                                validate-on-blur
                                error-count="1"
                                label="Цена"
                              />
                            </v-col>
                            <!-- <v-col cols="6">
                          <v-text-field
                            type="number"
                            v-model="editedItem.discount"
                            :rules="discountRules"
                            validate-on-blur
                            error-count="1"
                            label="Скидка"
                          />
                        </v-col> -->
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
              </v-col>
              <v-col cols="auto">
                <v-btn text @click="filtersExtended = !filtersExtended"
                  >Фильтры</v-btn
                >
              </v-col>
              <v-col cols="auto">
                <v-btn icon class="ml-3" @click="refresh">
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <template v-if="filtersExtended" v-slot:extension>
              <v-row>
                <v-col cols="auto">
                  <v-select
                    label="Категория"
                    placeholder="Выбрать"
                    clearable
                    hide-details
                    item-text="title"
                    item-value="_id"
                    :items="categories"
                    v-model="categorySelected"
                    @change="refresh()"
                  ></v-select>
                </v-col>
              </v-row>
            </template>
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
                    <td>{{ item.category.title }}</td>
                    <td>{{ item.category.unit }}</td>
                    <td>{{ item.code }}</td>
                    <td>{{ item.title }}</td>
                    <td>{{ item.price.toFixed(2) }} л.</td>
                    <!-- <td>{{item.discount}} %</td> -->
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
import {
  CREATE_PRODUCT,
  READ_PRODUCTS,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} from "@/store/products/action-types";
export default {
  name: "Products",
  data() {
    return {
      search: "",
      filtersExtended: true,
      categorySelected: "",
      crudDialog: false,
      formValid: true,
      crudMode: "create",
      editedItem: {
        _id: "",
        code: "",
        title: "",
        category: "",
        price: 0,
        // discount: 0
      },
      defaultItem: {
        code: "",
        title: "",
        category: "",
        price: 0,
        // discount: 0
      },
      headers: [
        {
          text: "Категория",
          value: "category.title",
          align: "start",
        },
        {
          text: "СИ",
          value: "category.unit",
        },
        {
          text: "Код",
          value: "code",
        },
        {
          text: "Название",
          value: "title",
        },
        {
          text: "Цена",
          value: "price",
        },
        // {
        //   text: "Скидка",
        //   value: "discount"
        // },
        {
          text: "Создано",
          value: "createdAt",
        },
        {
          text: "Обновлено",
          value: "updatedAt",
        },
        { text: "Действия", align: "end" },
      ],
      codeRules: [
        (v) => !!v || "Это поле необходимо",
        (v) => (v && v.length >= 3) || "Минимум 3 символа",
        (v) => (v && v.length <= 10) || "Максимум 10 символов",
      ],
      nameRules: [
        (v) => !!v || "Это поле необходимо",
        (v) => (v && v.length >= 3) || "Минимум 3 символа",
        (v) => (v && v.length <= 50) || "Максимум 10 символов",
      ],
      priceRules: [
        (v) =>
          /^(([1-9]\d{0,7}(?:\.\d{1,2})?)|(0\.\d{1,2}))$/.test(v) ||
          "Введите правильное значение",
      ],
      discountRules: [
        (v) =>
          /^0(\.\d{1,2})?$|^[1-9][0-9]?(\.\d{1,2})?$|^100$/.test(v) ||
          "Неверный формат",
      ],
      categoryRules: [(v) => !!v || "Это поле необходимо"],
    };
  },
  computed: {
    items() {
      return this.$store.state.PRODUCTS.products.items;
    },
    categories() {
      return this.$store.state.CATEGORIES.categories.items;
    },
    tableLoading() {
      return this.$store.state.PRODUCTS.products.table.loading;
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
    async save() {
      this.editedItem.category = this.editedItem.category._id;
      if (this.crudMode === "create") {
        this.$store.dispatch(CREATE_PRODUCT, this.editedItem);
      } else if (this.crudMode === "update") {
        const { _id, createdAt, updatedAt, ...item } = this.editedItem;
        this.$store.dispatch(UPDATE_PRODUCT, this.editedItem);
      }
      this.closeCrudDialog();
    },
    async remove(item) {
      this.$store.dispatch(REMOVE_PRODUCT, item._id);
    },
    refresh() {
      this.$store.dispatch(READ_PRODUCTS, {
        category: this.categorySelected || null,
      });
    },
  },
};
</script>

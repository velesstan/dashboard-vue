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
                <v-dialog persistent v-model="crudDialog" max-width="800px">
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
                            <v-col :cols="showProductRequires ? 6 : 12">
                              <h3 class="heading">Продукт</h3>
                              <v-row
                                ><v-col cols="4">
                                  <v-autocomplete
                                    :rules="categoryRules"
                                    :items="categories"
                                    v-model="editedItem.category"
                                    label="Категория"
                                    item-text="title"
                                    return-object
                                  />
                                </v-col>
                                <v-col cols="4">
                                  <v-text-field
                                    v-model="editedItem.code"
                                    :rules="codeRules"
                                    :counter="10"
                                    validate-on-blur
                                    error-count="3"
                                    label="Код"
                                  />
                                </v-col>
                                <v-col cols="4">
                                   <v-select
                                    v-model="editedItem.unit"
                                    :items="units"
                                    :rules="unitRules"
                                    label="Единица измерения"
                                  />
                                </v-col>
                                <v-col cols="6">
                                  <v-text-field
                                    v-model="editedItem.title"
                                    :rules="nameRules"
                                    :counter="50"
                                    validate-on-blur
                                    error-count="3"
                                    label="Название"
                                  />
                                </v-col>
                                <v-col cols="3">
                                  <v-text-field
                                    type="number"
                                    v-model="editedItem.price_retail"
                                    :rules="price_retailRules"
                                    validate-on-blur
                                    error-count="1"
                                    label="Цена розн."
                                  />
                                </v-col>
                                <v-col cols="3">
                                  <v-text-field
                                    type="number"
                                    v-model="editedItem.price_wholesale"
                                    :rules="price_wholesaleRules"
                                    validate-on-blur
                                    error-count="1"
                                    label="Цена отп."
                                  />
                                </v-col>
                                <v-col cols="12">
                                  <v-switch
                                    label="Показать требуемое сырье"
                                    v-model="showProductRequires"
                                  />
                                </v-col>
                              </v-row>
                            </v-col>
                            <v-col v-if="showProductRequires" cols="6">
                              <h3 class="heading">Сырье</h3>
                              <v-row>
                                <v-col cols="12">
                                  <v-simple-table>
                                    <template v-slot:default>
                                      <thead>
                                        <tr>
                                          <th>№</th>
                                          <th>Код</th>
                                          <th>Количество</th>
                                          <th></th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr
                                          v-for="(item,
                                          index) in editedItem.requires"
                                          :key="index"
                                        >
                                          <td>{{ index + 1 }}</td>
                                          <td>
                                            {{ item.product.code || item.code }}
                                          </td>
                                          <td>{{ item.quantity }}</td>
                                          <td>
                                            <v-btn
                                              icon
                                              small
                                              @click="removeRequiredItem(index)"
                                            >
                                              <v-icon small>mdi-delete</v-icon>
                                            </v-btn>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </template>
                                  </v-simple-table>
                                </v-col>
                                <v-dialog
                                  persistent
                                  v-model="add_items_dialog"
                                  max-width="500"
                                >
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      color="green"
                                      v-on="on"
                                      small
                                      dark
                                      depressed
                                      tile
                                      >Добавить позиции</v-btn
                                    >
                                  </template>
                                  <v-card>
                                    <v-toolbar dark color="primary"
                                      >Добавить позицию</v-toolbar
                                    >
                                    <v-card-text>
                                      <v-form ref="itemsForm" lazy-validation>
                                        <v-row>
                                          <v-col>
                                            <v-autocomplete
                                              :items="items"
                                              return-object
                                              v-model="itemToAdd.product"
                                              :rules="addItemProductRules"
                                              item-text="code"
                                              item-value="_id"
                                              placeholder="Выбрать"
                                            />
                                          </v-col>
                                          <v-col cols="auto">
                                            <v-text-field
                                              type="number"
                                              v-model="itemToAdd.quantity"
                                              :rules="addItemQuantityRules"
                                              label="Количество"
                                            />
                                          </v-col>
                                          <v-col cols="12">
                                            <v-checkbox
                                              v-model="itemToAdd.reduce"
                                              label="Скидка"
                                            />
                                          </v-col>
                                        </v-row>
                                      </v-form>
                                    </v-card-text>
                                    <v-card-actions>
                                      <v-spacer />
                                      <v-btn
                                        text
                                        @click.stop="closeAddItemsDialog()"
                                        >Отмена</v-btn
                                      >
                                      <v-btn
                                        text
                                        @click.stop="
                                          $refs.itemsForm.validate() &&
                                            addItem()
                                        "
                                        >Добавить</v-btn
                                      >
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                              </v-row>
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
                    <td>{{ item.unit }}</td>
                    <td>{{ item.code }}</td>
                    <td>{{ item.title }}</td>
                    <td>{{ item.price_retail.toFixed(2) }} л.</td>
                    <td>{{ item.price_wholesale.toFixed(2) }} л.</td>
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
      showProductRequires: false,
      filtersExtended: true,
      categorySelected: "",
      crudDialog: false,
      formValid: true,
      crudMode: "create",
      add_items_dialog: false,
      editedItem: {
        _id: "",
        code: "",
        title: "",
        category: "",
        unit: "",
        price_retail: 0,
        price_wholesale: 0,
        requires: [],
      },
      defaultItem: {
        code: "",
        title: "",
        category: "",
        unit: "",
        price_retail: 0,
        price_wholesale: 0,
        requires: [],
      },
      headers: [
        {
          text: "Категория",
          value: "category.title",
          align: "start",
        },
        {
          text: "СИ",
          value: "unit",
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
          text: "Цена розн.",
          value: "price_retail",
        },
        {
          text: "Цена отп.",
          value: "price_wholesale",
        },
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
      units: [
        { text: "шт" },
        { text: "л" },
        { text: "кг" },
        { text: "м" },
        { text: "м²" },
        { text: "м³" },
      ],
      codeRules: [
        (v) => !!v || "Это поле необходимо",
        (v) => (v && v.length >= 3) || "Минимум 3 символа",
        (v) => (v && v.length <= 15) || "Максимум 15 символов",
      ],
      nameRules: [
        (v) => !!v || "Это поле необходимо",
        (v) => (v && v.length >= 3) || "Минимум 3 символа",
        (v) => (v && v.length <= 50) || "Максимум 50 символов",
      ],
      price_retailRules: [
        (v) =>
          /^(([1-9]\d{0,7}(?:\.\d{1,2})?)|(0\.\d{1,2}))$/.test(v) ||
          "Введите правильное значение",
      ],
      price_wholesaleRules: [
        (v) => (v && !!v) || "Введите правильное значение",
      ],
      categoryRules: [(v) => !!v || "Это поле необходимо"],
      unitRules: [(v) => !!v || "Выберите единицу изм."],
      addItemProductRules: [(v) => !!v._id || "Выберите продукт"],
      addItemQuantityRules: [
        (v) => !!v || "Укажите количество",
        (v) => v >= 0 || "Количество должно быть положительным",
      ],
      itemToAdd: {
        product: {},
        quantity: 0,
        reduce: false,
      },
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
    removeRequiredItem(index) {
      this.editedItem.requires.splice(index, 1);
    },
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
      this.$store.dispatch(DELETE_PRODUCT, item._id);
    },
    addItem() {
      const item = {
        product: this.itemToAdd.product._id,
        quantity: Number(this.itemToAdd.quantity),
        title: this.itemToAdd.product.title,
        code: this.itemToAdd.product.code,
        unit: this.itemToAdd.product.unit,
        category: this.itemToAdd.product.category.title,
      };
      this.editedItem.requires.push(item);
      this.itemToAdd = {
        product: {},
        quantity: 0,
      };
      this.closeAddItemsDialog();
    },
    closeAddItemsDialog() {
      this.add_items_dialog = false;
    },
    refresh() {
      this.$store.dispatch(READ_PRODUCTS, {
        category: this.categorySelected || null,
      });
    },
  },
};
</script>

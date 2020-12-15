<template>
  <div>
    <v-sheet class="navigator" tile dark color="primary">
      <h2 class="display-1 font-weight-light">Накладные</h2>
    </v-sheet>
    <v-container fluid>
      <v-toolbar elevation="1">
        <v-row align="center">
          <v-col>
            <v-text-field
              prepend-icon="mdi-magnify"
              label="Поиск по номеру накладной"
              hide-details
              flat
              solo
            />
          </v-col>
          <v-col cols="auto">
            <v-dialog persistent v-model="add_waybill_dialog" max-width="900">
              <template v-slot:activator="{ on }">
                <v-btn text v-on="on">Добавить</v-btn>
              </template>
              <v-card>
                <v-toolbar elevation="0" dark color="primary">
                  <span>Накладная</span>
                  <v-spacer />
                  <span>{{ new Date() | moment("DD MMM, YYYY") }}</span>
                </v-toolbar>
                <v-card-text>
                  <v-form ref="waybillForm">
                    <v-row>
                      <v-col>
                        <v-select
                          :items="waybillTypes"
                          :rules="waybillTypeRules"
                          v-model="waybillAction"
                          @change="waybill.action = waybillAction.value"
                          return-object
                          item-text="title"
                          item-value="value"
                          label="Тип накладной"
                        />
                      </v-col>
                      <v-col v-if="waybillAction.source">
                        <v-select
                          :items="stocks"
                          :rules="stockRules"
                          v-model="waybill.source"
                          item-text="title"
                          item-value="_id"
                          label="Расход"
                        />
                      </v-col>
                      <v-col v-if="waybillAction.destination">
                        <v-select
                          :items="stocks"
                          :rules="stockRules"
                          v-model="waybill.destination"
                          item-text="title"
                          item-value="_id"
                          label="Приход"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                  <v-dialog
                    persistent
                    v-model="add_items_dialog"
                    max-width="500"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn color="green" v-on="on" small dark depressed tile
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
                                :items="products"
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
                        <v-btn text @click.stop="closeAddItemsDialog()"
                          >Отмена</v-btn
                        >
                        <v-btn
                          text
                          @click.stop="$refs.itemsForm.validate() && addItem()"
                          >Добавить</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class="text-left">Категория</th>
                          <th class="text-left">Артикул</th>
                          <th class="text-left">Количество</th>
                          <th class="text-left">Цена</th>
                          <th class="text-left">Скидка</th>
                          <th class="text-left">Итого</th>
                          <th class="text-right">Удалить</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="item in waybill.items"
                          :key="item.product_id"
                        >
                          <td>{{ item.category }}</td>
                          <td>{{ item.title }}</td>
                          <td>{{ item.quantity }} {{ item.unit }}</td>
                          <td>{{ item.price }}</td>
                          <td>{{ `${item.reduce ? item.discount : 0}%` }}</td>
                          <td>
                            {{
                              item.reduce
                                ? percentage(
                                    item.quantity * item.price,
                                    item.discount
                                  )
                                : item.quantity * item.price
                            }}
                          </td>
                          <td class="text-right">
                            <v-btn
                              icon
                              small
                              @click="removeItem(item.product_id)"
                            >
                              <v-icon small>mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn text @click.stop="closeWaybillDialog()">Отмена</v-btn>
                  <v-btn
                    color="primary"
                    text
                    @click.stop="$refs.waybillForm.validate() && makeWaybill()"
                    >Сохранить</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </v-row>
      </v-toolbar>
      <v-data-iterator :items="waybills">
        <template v-slot:default="props">
          <v-row>
            <v-col
              :key="item._id.waybill + item._id.type"
              v-for="item in props.items"
              cols="12"
            >
              <v-card class="subheading font-weight-bold">
                <v-card-title>{{
                  item._id.type === "OUTCOME"
                    ? "Расходная накладная " + item._id.waybill
                    : "Приходная накладная " + item._id.waybill
                }}</v-card-title>
                <v-divider />
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th>Артикул</th>
                        <th>Название</th>
                        <th>Количество</th>
                        <th>Цена</th>
                        <th>Всего</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(product, index) in item.items" :key="index">
                        <td>{{ product.code }}</td>
                        <td>{{ product.product }}</td>
                        <td>{{ product.quantity }}</td>
                        <td>{{ product.price }}</td>
                        <td>{{ product.price * product.quantity }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>
  </div>
</template>

<script>
import api from "@/plugins/api";
import waybillTypes from "./waybilltypes.js";
export default {
  name: "Waybills",
  data() {
    return {
      // WAYBILLS MOVE TO STORE
      waybills: [],
      //
      add_items_dialog: false,
      add_waybill_dialog: false,
      waybillTypes: waybillTypes,
      waybillAction: {},
      waybill: {
        action: "",
        source: "",
        destination: "",
        items: [],
      },
      itemToAdd: {
        product: {},
        quantity: 0,
        reduce: false,
      },
      waybillTypeRules: [(v) => !!v.value || "Это поле необходимо"],
      stockRules: [(v) => !!v || "Это поле необходимо"],
      addItemProductRules: [(v) => !!v._id || "Выберите продукт"],
      addItemQuantityRules: [
        (v) => !!v || "Укажите количество",
        (v) => v >= 0 || "Количество должно быть положительным",
      ],
    };
  },
  computed: {
    stocks() {
      return this.$store.state.ERP.stocks.items;
    },
    products() {
      return this.$store.state.ERP.products.items;
    },
  },

  mounted() {
    this.fetchWaybills();
  },
  methods: {
    async makeWaybill() {
      const waybill = {
        action: this.waybill.action,
        source: this.waybill.source,
        destination: this.waybill.destination,
        products: this.waybill.items.map((i) => ({
          product: i.product,
          quantity: i.quantity,
          snapshot: {
            price: i.price,
            reduce: i.reduce,
            discount: i.discount,
          },
        })),
      };
      try {
        const response = await api.post(`/api/erp/waybill`, waybill);
        this.closeWaybillDialog();
      } catch (e) {
        console.error(e);
      }
    },
    closeWaybillDialog() {
      this.waybillAction = {};
      this.waybill = {
        action: "",
        source: "",
        destination: "",
        items: [],
      };
      this.$refs.waybillForm.resetValidation();
      this.add_waybill_dialog = false;
    },
    closeAddItemsDialog() {
      this.itemToAdd = {
        product: {},
        quantity: 0,
        reduce: false,
      };
      this.$refs.itemsForm.resetValidation();
      this.add_items_dialog = false;
    },
    addItem() {
      const item = {
        reduce: this.itemToAdd.reduce,
        discount: this.itemToAdd.product.discount,
        quantity: Number(this.itemToAdd.quantity),
        product: this.itemToAdd.product._id,
        title: this.itemToAdd.product.title,
        unit: this.itemToAdd.product.category.unit,
        category: this.itemToAdd.product.category.title,
        price: this.itemToAdd.product.price,
      };
      this.waybill.items.push(item);
      this.itemToAdd = {
        product: {},
        quantity: 0,
        reduce: false,
      };
      this.closeAddItemsDialog();
    },
    removeItem(id) {
      const index = this.waybill.items.findIndex((i) => i.product_id === id);
      this.waybill.items.splice(index, 1);
    },
    async fetchWaybills() {
      const { data } = await api.get(`/api/erp/waybills`);
      this.waybills = data;
      console.log(data);
    },
    percentage(amount, reduce) {
      return parseFloat(amount - (amount * reduce) / 100);
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

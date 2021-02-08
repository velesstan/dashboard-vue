<template>
  <div>
    <v-sheet class="navigator" tile dark color="primary">
      <h2 class="display-1 font-weight-light">Накладные</h2>
    </v-sheet>
    <v-container fluid>
      <v-toolbar
        elevation="1"
        :extended="filtersExtended"
        extension-height="100"
      >
        <template v-if="filtersExtended" v-slot:extension>
          <v-row>
            <v-col cols="auto">
              <v-menu
                ref="dateRangeMenu"
                v-model="dateRangeMenu"
                :close-on-content-click="false"
                :return-value.sync="dateRange"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    label="Выбрать дату"
                    hide-details
                    outlined
                    v-model="dateRangeText"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker range v-model="dateRange" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="dateRangeMenu = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="
                      fetchWaybills() && $refs.dateRangeMenu.save(dateRange)
                    "
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="auto">
              <v-select
                label="Выбрать склад"
                hide-details
                outlined
                item-text="title"
                item-value="_id"
                :items="stocks"
                v-model="stock"
                @change="fetchWaybills()"
                prepend-icon="mdi-home-search"
              ></v-select>
            </v-col>
          </v-row>
        </template>
        <v-row align="center">
          <v-col>
            <v-text-field
              prepend-icon="mdi-magnify"
              label="Поиск по номеру накладной"
              v-model="searchTermText"
              hide-details
              flat
              solo
              @keyup="findBySerialNumber($event)"
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
                                v-if="waybillAction.value === 'SELL'"
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
                          <th>№</th>
                          <th class="text-left">Категория</th>
                          <th class="text-left">Артикул</th>
                          <th class="text-left">Название</th>
                          <th class="text-left">Количество</th>
                          <th class="text-left">Цена</th>
                          <th class="text-left">Итого</th>
                          <th class="text-right">Удалить</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(item, index) in waybill.items"
                          :key="item.product_id"
                        >
                          <td>{{ index + 1 }}</td>
                          <td>{{ item.category }}</td>
                          <td>{{ item.code }}</td>
                          <td>{{ item.title }}</td>
                          <td>{{ item.quantity }} {{ item.unit }}</td>
                          <td>
                            {{
                              item.reduce
                                ? item.price_wholesale.toFixed(2)
                                : item.price_retail.toFixed(2)
                            }}
                          </td>
                          <td>
                            {{
                              `${Number(
                                (item.quantity * item.reduce
                                  ? item.price_wholesale
                                  : item.price_retail) * item.quantity
                              ).toFixed(2)} л.`
                            }}
                          </td>
                          <td class="text-right">
                            <v-btn icon small @click="removeItem(item.product)">
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
      <v-data-iterator style="margin-top: 24px" :items="waybills">
        <template v-slot:default="props">
          <v-row>
            <v-col :key="index" v-for="(item, index) in props.items" cols="12">
              <v-card>
                <v-card-title>
                  <v-chip-group>
                    <v-chip>
                      {{ item.createdAt | moment("HH:mm DD/MM/YY") }}
                    </v-chip>
                    <v-chip>
                      {{ item.stock.title }}
                    </v-chip>
                    <v-chip>
                      {{ item.type === "OUTCOME" ? "Расход" : "Приход" }}
                    </v-chip>
                    <v-chip> №{{ zeroPad(item.serialNumber, 6) }} </v-chip>
                  </v-chip-group>
                  <v-spacer />
                  <v-btn
                    v-if="item.active"
                    text
                    @click="disableWaybill(item._id)"
                    >Отменить</v-btn
                  >
                  <v-btn
                    v-if="!item.active"
                    text
                    @click="deleteWaybill(item._id)"
                    >Удалить</v-btn
                  >
                  <v-btn
                    v-if="!item.active"
                    text
                    @click="enableWaybill(item._id)"
                    >Восстановить</v-btn
                  >
                  <v-btn text @click="print(item._id)">Печать</v-btn>
                </v-card-title>
                <v-divider />
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th>№</th>
                        <th>Категория</th>
                        <th>Артикул</th>
                        <th>Название</th>
                        <th>Количество</th>
                        <th>Цена</th>
                        <th>Всего</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in item.transactions"
                        :key="index"
                      >
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.product.category.title }}</td>
                        <td>{{ item.product.code }}</td>
                        <td>{{ item.product.title }}</td>
                        <td>
                          {{ Math.abs(item.quantity) }}
                          {{ item.product.unit }}
                        </td>
                        <td>
                          {{
                            item.snapshot
                              ? `${item.snapshot.price.toFixed(2)} ${
                                  item.snapshot.reduce ? "опт." : "розн."
                                }`
                              : `${item.product.price_retail.toFixed(2)} розн.`
                          }}
                        </td>
                        <td>
                          {{
                            (
                              Math.abs(item.quantity) *
                              (item.snapshot
                                ? item.snapshot.price
                                : item.product.price_retail)
                            ).toFixed(2)
                          }}
                          л.
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          colspan="6"
                          class="text-right text-uppercase font-weight-bold"
                        >
                          Итого
                        </td>
                        <td>
                          {{
                            item.transactions
                              .reduce(
                                (acc, t) =>
                                  (acc +=
                                    Math.abs(t.quantity) *
                                    (t.snapshot
                                      ? t.snapshot.price
                                      : t.product.price_retail)),
                                0
                              )
                              .toFixed(2)
                          }}
                          л.
                        </td>
                      </tr>
                    </tfoot>
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
import { BehaviorSubject } from "rxjs";
import { switchMap } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import moment from "moment";
import { saveAs } from "file-saver";
import qs from "querystring";
import { READ_WAYBILLS } from "@/store/waybills/action-types";
import { READ_WAYBILLS_SUCCESS } from "@/store/waybills/mutation-types";
import api, { API_URL } from "@/plugins/api";
import waybillTypes from "./waybilltypes.js";
export default {
  name: "Waybills",
  data() {
    return {
      searchTerm$: new BehaviorSubject(""),
      searchTermText: "",
      add_items_dialog: false,
      add_waybill_dialog: false,
      waybillTypes: waybillTypes,
      waybillAction: {},
      filtersExtended: true,
      dateRangeMenu: false,
      stock: "",
      dateRange: [
        moment.utc().subtract("1", "month").format("YYYY-MM-DD"),
        moment.utc().endOf("day").format("YYYY-MM-DD"),
      ],
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
      return this.$store.state.STOCKS.stocks.items;
    },
    products() {
      return this.$store.state.PRODUCTS.products.items;
    },
    waybills() {
      return this.$store.state.WAYBILLS.waybills.items;
    },
    dateRangeText() {
      const dates = this.dateRange
        .sort()
        .map((d) => moment(d).format("DD/MM/YY"));
      return dates.join(" ~ ");
    },
  },
  beforeDestroy() {
    this.searchTerm$.unsubscribe();
  },
  mounted() {
    this.searchTerm$
      .pipe(
        switchMap((serialNumber) => {
          if (serialNumber) {
            const query = qs.stringify({
              serialNumber,
            });
            return ajax.getJSON(`${API_URL}/api/waybills?${query}`);
          } else return ajax.getJSON(`${API_URL}/api/waybills`);
        })
      )
      .subscribe((response) => {
        this.$store.commit(READ_WAYBILLS_SUCCESS, response);
      });
  },
  methods: {
    zeroPad(num, places) {
      return String(num).padStart(places, "0");
    },
    async fetchWaybills() {
      this.$store.dispatch(READ_WAYBILLS, {
        stock: this.stock,
        dateRange: this.dateRange,
      });
    },
    async makeWaybill() {
      const waybill = {
        action: this.waybill.action,
        source: this.waybill.source,
        destination: this.waybill.destination,
        products: this.waybill.items.map((i) => ({
          product: i.product,
          quantity: i.quantity,
          snapshot: {
            price: i.reduce ? i.price_wholesale : i.price_retail,
            reduce: i.reduce,
            discount: i.discount,
          },
        })),
      };
      const hasSource = this.waybillTypes.find(
        (w) => w.value === waybill.action
      ).source;
      const hasDestination = this.waybillTypes.find(
        (w) => w.value === waybill.action
      ).destination;
      if (!hasDestination) delete waybill.destination;
      if (!hasSource) delete waybill.source;
      try {
        const response = await api.post(`/api/waybills`, waybill);
        this.closeWaybillDialog();
        this.searchTermText = "";
        this.searchTerm$.next("");
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
        code: this.itemToAdd.product.code,
        unit: this.itemToAdd.product.category.unit,
        category: this.itemToAdd.product.category.title,
        price_wholesale: this.itemToAdd.product.price_wholesale,
        price_retail: this.itemToAdd.product.price_retail,
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
      const index = this.waybill.items.findIndex((i) => i.product === id);
      this.waybill.items.splice(index, 1);
    },
    async findBySerialNumber(e) {
      this.searchTerm$.next(e.target.value);
    },
    async disableWaybill(id) {
      await api.post(`/api/waybills/${id}/disable`);
    },
    async enableWaybill(id) {
      await api.post(`/api/waybills/${id}/enable`);
    },
    async deleteWaybill(id) {
      await api.delete(`/api/waybills/${id}`);
    },
    async print(waybillId) {
      const { data } = await api.get(`/api/waybills/print/${waybillId}`, {
        responseType: "arraybuffer",
      });
      saveAs(new Blob([data]), "Накладная.pdf");
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

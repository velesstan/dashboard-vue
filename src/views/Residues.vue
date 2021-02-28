<template>
  <div>
    <v-sheet class="navigator" tile dark color="primary">
      <h2 class="display-1 font-weight-light">Остатки</h2>
    </v-sheet>
    <v-container fluid>
      <v-card>
        <v-toolbar
          elevation="1"
          :extended="filtersExtended"
          extension-height="100"
        >
          <v-row align="center">
            <v-col>
              <v-text-field
                prepend-icon="mdi-magnify"
                v-model="searchTerm"
                @keyup="fetchResidues()"
                label="Поиск по модели"
                hide-details
                flat
                solo
              />
            </v-col>
            <v-col cols="auto">
              <v-btn
                text
                v-if="this.stock && this.category"
                @click="downloadResidues"
                >Скачать</v-btn
              >
              <v-btn text @click="filtersExtended = !filtersExtended"
                >Фильтры</v-btn
              >
            </v-col>
          </v-row>
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
                        fetchResidues() && $refs.dateRangeMenu.save(dateRange)
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
                  @change="fetchResidues()"
                  prepend-icon="mdi-home-search"
                ></v-select>
              </v-col>
              <v-col cols="auto">
                <v-select
                  label="Выбрать категорию"
                  hide-details
                  outlined
                  item-text="title"
                  item-value="_id"
                  :items="categories"
                  v-model="category"
                  @change="fetchResidues()"
                  prepend-icon="mdi-home-search"
                ></v-select>
              </v-col>
            </v-row>
          </template>
        </v-toolbar>
        <v-card-text></v-card-text>
        <v-data-table disable-sort :headers="headers">
          <template v-slot:body>
            <tbody>
              <tr v-for="item in residues" :key="item.title">
                <td>{{ item.product.code }}</td>
                <td>{{ item.product.title }}</td>
                <td>{{ item.category.title }}</td>
                <td>
                  {{
                    Number.isInteger(item.startBalance)
                      ? item.startBalance
                      : item.startBalance.toFixed(2)
                  }}
                  {{ item.product.unit }}
                </td>
                <td>
                  {{
                    Number.isInteger(item.totalIncome)
                      ? item.totalIncome
                      : item.totalIncome.toFixed(2)
                  }}
                  {{ item.product.unit }}
                </td>
                <td>
                  {{
                    Number.isInteger(item.totalOutcome)
                      ? item.totalOutcome
                      : item.totalOutcome.toFixed(2)
                  }}
                  {{ item.product.unit }}
                </td>
                <td>
                  {{
                    Number.isInteger(item.endBalance)
                      ? item.endBalance
                      : item.endBalance.toFixed(2)
                  }}
                  {{ item.product.unit }}
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
import qs from "querystring";
import api from "@/plugins/api";
import moment from "moment";
export default {
  name: "Residues",
  data() {
    return {
      filtersExtended: true,
      dateRangeMenu: false,
      searchTerm: "",
      dateRange: [
        moment.utc().subtract("1", "month").format("YYYY-MM-DD"),
        moment.utc().endOf("day").format("YYYY-MM-DD"),
      ],
      stock: "",
      category: "",
      residues: [],
      headers: [
        { text: "Код", value: "code" },
        { text: "Название", value: "title" },
        { text: "Категория", value: "category.title" },
        { text: "Остаток на начало", value: "startBalance" },
        { text: "Приход", value: "income" },
        { text: "Расход", value: "outcome" },
        { text: "Остаток", value: "endBalance" },
      ],
    };
  },
  computed: {
    dateRangeText() {
      const dates = this.dateRange
        .sort()
        .map((d) => moment(d).format("DD/MM/YY"));
      return dates.join(" ~ ");
    },
    stocks() {
      return this.$store.state.STOCKS.stocks.items;
    },
    categories() {
      return this.$store.state.CATEGORIES.categories.items;
    },
  },
  watch: {
    stock(newVal, oldVal) {
      // this.fetchResidues();
    },
    dateRange(newVal) {
      // if (this.stock) this.fetchResidues();
    },
  },
  methods: {
    async downloadResidues() {
      const query = {
        stock: this.stock,
        start: this.dateRange[0],
        end: this.dateRange[1] || this.dateRange[0],
        category: this.category,
      };
      if (this.searchTerm.length > 0) {
        query.code = this.searchTerm;
      }
      const { data } = await api.get(
        `/api/export/residue?${qs.stringify(query)}`,
        {
          responseType: "arraybuffer",
        }
      );
      const selectedStock = this.stocks.find((s) => s._id === this.stock);
      saveAs(new Blob([data]), `Остатки-${selectedStock.title}.xlsx`);
    },
    async fetchResidues() {
      const query = {
        stock: this.stock,
        category: this.category,
        start: this.dateRange[0],
        end: this.dateRange[1] || this.dateRange[0],
      };
      if (this.searchTerm.length > 0) {
        query.code = this.searchTerm;
      }
      const { data } = await api.get(
        `/api/transactions/residue?${qs.stringify(query)}`
      );
      this.residues = data;
    },
  },
  mounted() {},
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

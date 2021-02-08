import Vue from "vue";
import Vuex from "vuex";

import APP from "@/store/app";
import AUTH from "@/store/auth";
import PRODUCTS from "@/store/products";
import CATEGORIES from "@/store/categories";
import STOCKS from "@/store/stocks";
import WAYBILLS from "@/store/waybills";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    APP,
    AUTH,
    PRODUCTS,
    CATEGORIES,
    STOCKS,
    WAYBILLS,
  },
});

import Vue from "vue";
import Vuex from "vuex";

import APP from "@/store/app";
import ERP from "@/store/erp";
import AUTH from "@/store/auth";
import PRODUCTS from "@/store/products";
import CATEGORIES from "@/store/categories";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    APP,
    ERP,
    AUTH,
    PRODUCTS,
    CATEGORIES,
  },
});

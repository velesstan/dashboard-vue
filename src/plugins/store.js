import Vue from 'vue';
import Vuex from 'vuex';

import ERP from '@/store/erp';
import AUTH from '@/store/auth';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    ERP,
    AUTH,
  },
});

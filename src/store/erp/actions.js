import qs from "querystring";

import api from "@/plugins/api";

import * as erpActions from "./action-types";
import * as erpMutations from "./mutation-types";

export default {
  async [erpActions.ERP_INIT]({ dispatch }) {
    dispatch(erpActions.GET_CATEGORIES);
    dispatch(erpActions.GET_STOCKS);
  },

  // Categories
  async [erpActions.GET_CATEGORIES]({ commit }) {
    const response = await api.get(`/api/categories`);
    commit(erpMutations.CATEGORIES_SET, response.data);
  },
  async [erpActions.CREATE_CATEGORY]({ commit }, category) {
    const response = await api.post(`/api/categories`, category);
    commit(erpMutations.CATEGORY_CREATED, response.data);
  },
  async [erpActions.UPDATE_CATEGORY]({ commit }, updated) {
    const { _id, createdAt, updatedAt, ...category } = updated;
    const response = await api.put(`/api/categories/${_id}`, category);
    commit(erpMutations.CATEGORY_UPDATED, response.data);
  },
  async [erpActions.REMOVE_CATEGORY]({ commit }, id) {
    await api.delete(`/api/categories/${id}`);
    commit(erpMutations.CATEGORY_REMOVED, id);
  },
  // Stocks
  async [erpActions.GET_STOCKS]({ commit }) {
    const response = await api.get(`/api/stocks`);
    commit(erpMutations.STOCKS_SET, response.data);
  },
  async [erpActions.CREATE_STOCK]({ commit }, stock) {
    const response = await api.post(`/api/stocks`, stock);
    commit(erpMutations.STOCK_CREATED, response.data);
  },
  async [erpActions.UPDATE_STOCK]({ commit }, updated) {
    const { _id, createdAt, updatedAt, ...stock } = updated;
    const response = await api.put(`/api/stocks/${_id}`, stock);
    commit(erpMutations.STOCK_UPDATED, response.data);
  },
  async [erpActions.REMOVE_STOCK]({ commit }, id) {
    await api.delete(`/api/stocks/${id}`);
    commit(erpMutations.STOCK_REMOVED, id);
  },
};

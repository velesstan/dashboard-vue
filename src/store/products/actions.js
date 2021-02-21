import qs from "querystring";
import api from "@/plugins/api";

import * as appMutations from "@/store/app/mutation-types";
import * as productActions from "./action-types";
import * as productMutations from "./mutation-types";

export default {
  async [productActions.READ_PRODUCTS]({ commit }, { category }) {
    commit(productMutations.READ_PRODUCTS_REQUEST);
    const queryParams = {};
    if (category) {
      queryParams.category = category;
    }
    const response = await api.get(
      `/api/products?${qs.stringify(queryParams)}`
    );
    commit(appMutations.NOTIFY_SHOW, {
      type: appMutations.TYPES.SUCCESS,
      message: "Продукция загружена",
    });
    commit(productMutations.READ_PRODUCTS_SUCCESS, response.data);
  },
  async [productActions.CREATE_PRODUCT]({ commit }, product) {
    const response = await api.post(`/api/products`, product);
    commit(appMutations.NOTIFY_SHOW, {
      type: appMutations.TYPES.SUCCESS,
      message: "Продукт создан",
    });
    commit(productMutations.CREATE_PRODUCT_SUCCESS, response.data);
  },
  async [productActions.UPDATE_PRODUCT]({ commit, dispatch }, updated) {
    const { _id, createdAt, updatedAt, ...product } = updated;
    const response = await api.put(`/api/products/${_id}`, product);
    commit(appMutations.NOTIFY_SHOW, {
      type: appMutations.TYPES.SUCCESS,
      message: "Продукт обновлён",
    });
    commit(productMutations.UPDATE_PRODUCT_SUCCESS, response.data);
  },
  async [productActions.DELETE_PRODUCT]({ commit }, id) {
    await api.delete(`/api/products/${id}`);
    commit(appMutations.NOTIFY_SHOW, {
      type: appMutations.TYPES.SUCCESS,
      message: "Продук удалён",
    });
    commit(productMutations.DELETE_PRODUCT_SUCCESS, id);
  },
};

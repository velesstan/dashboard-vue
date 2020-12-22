import qs from "querystring";
import api from "@/plugins/api";

import * as categoryActions from "./action-types";
import * as categoryMutations from "./mutation-types";

export default {
  async [categoryActions.READ_CATEGORIES]({ commit }, { category }) {
    const queryParams = {};
    if (category) {
      queryParams.category = category;
    }
    const response = await api.get(
      `/api/categories?${qs.stringify(queryParams)}`
    );
    commit(categoryMutations.READ_CATEGORIES_SUCCESS, response.data);
  },
  async [categoryActions.CREATE_CATEGORY]({ commit }, category) {
    const response = await api.post(`/api/categories`, category);
    commit(categoryMutations.CREATE_CATEGORY_SUCCESS, response.data);
  },
  async [categoryActions.UPDATE_CATEGORY]({ commit }, updated) {
    const { _id, createdAt, updatedAt, ...category } = updated;
    const response = await api.put(`/api/categories/${_id}`, category);
    commit(categoryMutations.UPDATE_CATEGORY_SUCCESS, response.data);
  },
  async [categoryActions.DELETE_CATEGORY]({ commit }, id) {
    await api.delete(`/api/categories/${id}`);
    commit(categoryMutations.DELETE_CATEGORY_SUCCESS, id);
  },
};

import api from "@/plugins/api";

import * as stockActions from "./action-types";
import * as stockMutations from "./mutation-types";

export default {
  async [stockActions.READ_STOCKS]({ commit }) {
    commit(stockMutations.READ_STOCKS_REQUEST);
    const response = await api.get(`/api/stocks`);
    commit(stockMutations.READ_STOCKS_SUCCESS, response.data);
  },
  async [stockActions.CREATE_STOCK]({ commit }, stock) {
    const response = await api.post(`/api/stocks`, stock);
    commit(stockMutations.CREATE_STOCK_SUCCESS, response.data);
  },
  async [stockActions.UPDATE_STOCK]({ commit }, updated) {
    const { _id, createdAt, updatedAt, ...stock } = updated;
    const response = await api.put(`/api/stocks/${_id}`, stock);
    commit(stockMutations.UPDATE_STOCK_SUCCESS, response.data);
  },
  async [stockActions.DELETE_STOCK]({ commit }, id) {
    await api.delete(`/api/stocks/${id}`);
    commit(stockMutations.DELETE_STOCK_SUCCESS, id);
  },
};

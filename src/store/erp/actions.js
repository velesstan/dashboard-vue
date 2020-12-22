import api from "@/plugins/api";

import * as erpActions from "./action-types";
import * as erpMutations from "./mutation-types";

export default {
  async [erpActions.ERP_INIT]({ dispatch }) {
    dispatch(erpActions.GET_STOCKS);
  },
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

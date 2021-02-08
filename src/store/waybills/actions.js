import api from "@/plugins/api";

import * as waybillsActions from "./action-types";
import * as waybillsMutations from "./mutation-types";

export default {
  async [waybillsActions.READ_WAYBILLS]({ commit }) {
      console.log("HELLO")
    commit(waybillsMutations.READ_WAYBILLS_REQUEST);
    const response = await api.get(`/api/waybills`);
    console.log(response)
    commit(waybillsMutations.READ_WAYBILLS_SUCCESS, response.data);
  },
};

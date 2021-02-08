import * as waybillsMutations from "./mutation-types";

export default {
  [waybillsMutations.READ_WAYBILLS_REQUEST](state) {
    state.waybills.table.loading = true;
  },
  [waybillsMutations.READ_WAYBILLS_SUCCESS](state, waybills) {
    state.waybills.table.loading = false;
    state.waybills.items = waybills;
  },
};

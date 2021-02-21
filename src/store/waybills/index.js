import actions from "./actions";
import mutations from "./mutations";

export default {
  state: {
    waybills: {
      items: [],
      table: {
        loading: false,
      },
      // page
      // totalDocs
      // e.t.c
    },
  },
  actions,
  mutations,
};

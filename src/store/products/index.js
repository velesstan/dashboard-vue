import actions from "./actions";
import mutations from "./mutations";

export default {
  state: {
    products: {
      items: [],
      table: {
        loading: false,
      },
      // page
      // totalDocs
      // e.t.c
    },
    forms: {},
  },
  actions,
  mutations,
};

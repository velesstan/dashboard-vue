import actions from "./actions";
import mutations from "./mutations";

export default {
  state: {
    categories: {
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

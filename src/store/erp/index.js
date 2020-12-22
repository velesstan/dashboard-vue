import actions from './actions';
import mutations from './mutations';

export default {
  state: {
    categories: {
      items: [],
    },
    stocks: {
      items: [],
    },
  },
  actions,
  mutations,
};

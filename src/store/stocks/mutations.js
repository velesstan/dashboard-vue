import * as stockMutations from "./mutation-types";

export default {
  [stockMutations.READ_STOCKS_SUCCESS](state, stocks) {
    state.stocks.items = stocks;
  },
  [stockMutations.CREATE_STOCK_SUCCESS](state, stock) {
    state.stocks.items.push(stock);
  },
  [stockMutations.UPDATE_STOCK_SUCCESS](state, stock) {
    const foundIndex = state.stocks.items.findIndex(
      (item) => item._id === stock._id
    );
    Object.assign(state.stocks.items[foundIndex], stock);
  },
  [stockMutations.DELETE_STOCK_SUCCESS](state, id) {
    const foundIndex = state.stocks.items.findIndex((item) => item._id === id);
    state.stocks.items.splice(foundIndex, 1);
  },
};

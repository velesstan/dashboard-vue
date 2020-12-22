import * as erpMutations from "./mutation-types";
export default {

  [erpMutations.STOCKS_SET](state, stocks) {
    state.stocks.items = stocks;
  },
  [erpMutations.STOCK_CREATED](state, stock) {
    state.stocks.items.push(stock);
  },
  [erpMutations.STOCK_UPDATED](state, stock) {
    const foundIndex = state.stocks.items.findIndex(
      (item) => item._id === stock._id
    );
    Object.assign(state.stocks.items[foundIndex], stock);
  },
  [erpMutations.STOCK_REMOVED](state, id) {
    const foundIndex = state.stocks.items.findIndex((item) => item._id === id);
    state.stocks.items.splice(foundIndex, 1);
  },
};

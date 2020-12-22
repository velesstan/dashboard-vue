import * as erpMutations from "./mutation-types";
export default {
  // Categories
  [erpMutations.CATEGORIES_SET](state, categories) {
    state.categories.items = categories;
  },
  [erpMutations.CATEGORY_CREATED](state, category) {
    state.categories.items.push(category);
  },
  [erpMutations.CATEGORY_UPDATED](state, category) {
    const foundIndex = state.categories.items.findIndex(
      (item) => item._id === category._id
    );
    Object.assign(state.categories.items[foundIndex], category);
  },
  [erpMutations.CATEGORY_REMOVED](state, id) {
    const foundIndex = state.categories.items.findIndex(
      (item) => item._id === id
    );
    state.categories.items.splice(foundIndex, 1);
  },
  // Stocks
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

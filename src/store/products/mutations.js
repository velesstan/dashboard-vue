import * as productMutations from "./mutation-types";

export default {
  [productMutations.READ_PRODUCTS_SUCCESS](state, products) {
    state.products.items = products;
  },
  [productMutations.CREATE_PRODUCT_SUCCESS](state, product) {
    state.products.items.push(product);
  },
  [productMutations.UPDATE_PRODUCT_SUCCESS](state, product) {
    const foundIndex = state.products.items.findIndex(
      (item) => item._id === product._id
    );
    Object.assign(state.products.items[foundIndex], product);
  },
  [productMutations.DELETE_PRODUCT_SUCCESS](state, id) {
    const foundIndex = state.products.items.findIndex(
      (item) => item._id === id
    );
    state.products.items.splice(foundIndex, 1);
  },
};

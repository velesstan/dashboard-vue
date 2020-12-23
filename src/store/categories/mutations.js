import * as categoryMutations from "./mutation-types";

export default {
  [categoryMutations.CREATE_CATEGORY_REQUEST](state) {
    state.categories.table.loading = true;
  },
  [categoryMutations.READ_CATEGORIES_SUCCESS](state, categories) {
    state.categories.items = categories;
    state.categories.table.loading = false;
  },
  [categoryMutations.CREATE_CATEGORY_SUCCESS](state, category) {
    state.categories.items.push(category);
  },
  [categoryMutations.UPDATE_CATEGORY_SUCCESS](state, category) {
    const foundIndex = state.categories.items.findIndex(
      (item) => item._id === category._id
    );
    Object.assign(state.categories.items[foundIndex], category);
  },
  [categoryMutations.DELETE_CATEGORY_SUCCESS](state, id) {
    const foundIndex = state.categories.items.findIndex(
      (item) => item._id === id
    );
    state.categories.items.splice(foundIndex, 1);
  },
};

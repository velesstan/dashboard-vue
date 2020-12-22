import * as appActions from "./action-types";
import { READ_PRODUCTS } from "@/store/products/action-types";
import { READ_CATEGORIES } from "@/store/categories/action-types";

export default {
  async [appActions.APP_INIT]({ dispatch }) {
    dispatch(READ_PRODUCTS, {});
    dispatch(READ_CATEGORIES, {});
  },
};

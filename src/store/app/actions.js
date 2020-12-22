import * as appActions from "./action-types";
import { READ_PRODUCTS } from "@/store/products/action-types";

export default {
  async [appActions.APP_INIT]({ dispatch }) {
    dispatch(READ_PRODUCTS, {});
  },
};

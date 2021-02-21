import api from '@/plugins/api';
import { getToken } from '../../utils/auth'

import * as appActions from "./action-types";
import { READ_PRODUCTS } from "@/store/products/action-types";
import { READ_CATEGORIES } from "@/store/categories/action-types";
import { READ_STOCKS } from "@/store/stocks/action-types";

export default {
  async [appActions.APP_INIT]({ dispatch }) {
    const token = getToken();
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    dispatch(READ_PRODUCTS, {});
    dispatch(READ_CATEGORIES, {});
    dispatch(READ_STOCKS, {});
  },
};

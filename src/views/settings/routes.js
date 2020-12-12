import RouteWrapper from '@/components/RouteWrapper.vue';

import Categories from './erp/Categories.vue';
import Stocks from './erp/Stocks.vue';
import Products from './erp/Products.vue';
import SettingsLayout from './SettingsLayout';

export default {
  path: 'settings',
  component: SettingsLayout,
  children: [
    {
      path: '',
      redirect: 'erp',
    },
    {
      path: 'app',
      component: null,
    },
    {
      path: 'erp',
      component: RouteWrapper,
      children: [
        {
          path: '',
          redirect: 'categories',
        },
        {
          path: 'categories',
          component: Categories,
        },
        {
          path: 'stocks',
          component: Stocks,
        },
        {
          path: 'products',
          component: Products,
        },
      ],
    },
  ],
};

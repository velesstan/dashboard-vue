import Vue from 'vue';
import VueRouter from 'vue-router';

import { getToken } from '@/utils/auth';

import Dashboard from '@/views/Dashboard.vue';
import Residues from '@/views/Residues.vue';
import Waybills from '@/views/Waybills.vue';
import Users from '@/views/Users.vue';
import SignIn from '@/views/SignIn.vue';
import NotFound from '@/views/404.vue';

import SettingsRoutes from '@/views/settings/routes';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: null,
    beforeEnter: (to, from, next) => {
      const token = getToken();
      if (token) {
        next('/dashboard');
      } else next('/sign-in');
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      SettingsRoutes,
      {
        path: 'residues',
        component: Residues,
      },
      {
        path: 'waybills',
        component: Waybills,
      },
      {
        path: 'users',
        component: Users,
      },
    ],
    beforeEnter: (to, from, next) => {
      const token = getToken();
      if (!token) {
        next('/sign-in');
      } else next();
    },
  },
  {
    path: '/sign-in',
    component: SignIn,
    beforeEnter: (to, from, next) => {
      const token = getToken();
      if (!token) {
        next();
      } else next('/dashboard');
    },
  },
  {
    path: '/404',
    name: '404',
    component: NotFound,
  },
  {
    path: '*',
    redirect: '/404',
  },

  //   {
  //     path: '/about',
  //     name: 'About',
  //     // route level code-splitting
  //     // this generates a separate chunk (about.[hash].js) for this route
  //     // which is lazy-loaded when the route is visited.
  //     component: () =>
  //       import(/* webpackChunkName: "about" */ '../views/About.vue'),
  //   },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;

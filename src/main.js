import Vue from "vue";
import VueMoment from "vue-moment";
import App from "./App.vue";

import { router, store, vuetify } from "@/plugins";
import "@/plugins/registerServiceWorker";
import "@mdi/font/css/materialdesignicons.css";
import "roboto-fontface/css/roboto/roboto-fontface.css";

Vue.config.productionTip = false;
Vue.use(VueMoment);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

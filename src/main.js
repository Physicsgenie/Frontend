import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import axios from 'axios';
import * as MathLive from 'mathlive/dist/mathlive.min.mjs';
import VueMathfield from 'mathlive/dist/vue-mathlive';
Vue.use(VueMathfield, MathLive);

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://physicsgenie.ga/';

console.log(process.env);

if (process.env.VUE_APP_DEBUG && process.env.VUE_APP_DEBUG == 'true')
  axios.defaults.baseURL = 'https://physicsgenie.ga/staging/';
else
  axios.defaults.baseURL = 'https://physicsgenie.ga/';

console.log(axios.defaults.baseURL);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');

axios.interceptors.response.use(undefined, function (error) {
  if (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;
      store.dispatch('LogOut');
      return router.push('/login');
    }
  }
});

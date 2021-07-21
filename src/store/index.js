import Vuex from 'vuex';
import Vue from 'vue';
import createPersistedState from "vuex-persistedstate";
import auth from './modules/auth';
import store from './modules/store';

// Load Vuex
Vue.use(Vuex);
// Create store
export default new Vuex.Store({
  modules: {
    auth,
    store
  },
  plugins: [createPersistedState()]
});

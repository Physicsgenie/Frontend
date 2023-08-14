import Vuex from 'vuex';
import Vue from 'vue';
import auth from './modules/auth';
import store from './modules/store';
import largeStore from './modules/largeStore';
import VuexPersistence from 'vuex-persist'

// Load Vuex
Vue.use(Vuex);

// Functions
const Functions = store => {
  store.functions = {
    testAlgebraic: function(expression) {

      const greekChars = new RegExp(/(\\alpha)|(\\beta)|(\\[Gg]amma)|(\\[Dd]elta)|(\\epsilon)|(\\varepsilon)|(\\zeta)|(\\eta)|(\\[Tt]heta)|(\\vartheta)|(\\iota)|(\\kappa)|(\\[Ll]ambda)|(\\mu)|(\\nu)|(\\[Xx]i)|(\\[Pp]i)|(\\rho)|(\\varrho)|(\\[Ss]igma)|(\\tau)|(\\[Uu]psilon)|(\\[Pp]hi)|(\\varphi)|(\\chi)|(\\[Pp]si)|(\\[Oo]mega)/);

      if (greekChars.test(expression)) {
        return true;
      } else {
        let inCommand = false;

        for (let i = 0; i < expression.length; i++) {
          if (!inCommand && (new RegExp(/[A-Za-z]/)).test(expression.charAt(i))) {
            return true;
          } else {
            inCommand = (new RegExp(/\\|[A-Za-z]/)).test(expression.charAt(i));
          }
        }

      }

      return false;

    }
  }
};

// Create store
export default new Vuex.Store({
  modules: {
    auth,
    store,
    largeStore
  },
  plugins: [(new VuexPersistence({storage: window.localStorage, modules: ["auth", "store"]})).plugin, Functions]
});

import axios from 'axios';

const state = {
  user: null,
  email: null,
  token: null,
  contributor: null
};
const getters = {
  isAuthenticated: state => !!state.user,
  StateUser: state => state.user,
  Email: state => state.email,
  Token: state => state.token,
  Contributor: state => state.contributor
};
const actions = {
  async Register({dispatch}, form) {
    let response = await axios.post('wp-json/physics_genie/register', form);
    if (response.data.length > 0) {
      throw response.data[0];
    } else {
      let UserForm = new FormData();
      UserForm.append('username', form.username);
      UserForm.append('password', form.password);
      await dispatch('LogIn', UserForm);
    }
  },
  async LogIn({commit, dispatch}, User) {
    let response = await axios.post('wp-json/jwt-auth/v1/token', User);
    await commit('setUser', response.data);
    await Promise.allSettled([dispatch('GetUserMetadata'), dispatch('GetProblemMetadata', {root: true}), dispatch('GetUserInfo', {root: true})]);
    await dispatch('GetUserStats', {root: true});
    commit('setResult', "", {root: true});
    dispatch('GetCurrProblem', {root: true});
    dispatch('GetSubmittedProblems', {root: true});
  },
  async PasswordReset({_}, email) {
    await axios.post('wp-json/physics_genie/password-reset?email=' + email);
  },
  async GetUserMetadata({commit, getters}) {
    let response = await axios.get('wp-json/physics_genie/user-metadata', {headers: {'Authorization': 'Bearer ' + getters.Token}});
    commit('setUserMetadata', response.data);
  },
  async LogOut({commit}){
    let user = null;
    commit('logOut', user);
  },
  async SetUserName({commit, getters}, name) {
    await axios.put('wp-json/physics_genie/user-name', {name: name}, {headers: {'Authorization': 'Bearer ' + getters.Token}});
    commit('setUserName', name);
  }
};
const mutations = {
  setUser(state, data) {
    state.user = data.user_nicename;
    state.email = data.user_email;
    state.token = data.token;
  },
  setUserName(state, name) {
    state.user = name;
  },
  setUserMetadata(state, data) {
    state.contributor = data.contributor;
  },
  logOut(state){
    state.user = null;
    state.email = null;
    state.token = null;
    state.contributor = null;
  },
};
export default {
  state,
  getters,
  actions,
  mutations
};

const state = {
  pastProblems: [],
  submittedProblems: [],
};
const getters = {
  PastProblems: state => state.pastProblems,
  SubmittedProblems: state => state.submittedProblems,
};
const actions = {};
const mutations = {
  setPastProblems(state, problems) {
    state.pastProblems = problems;
  },
  setSubmittedProblems(state, problems) {
    state.submittedProblems = problems;
  },
};
export default {
  state,
  getters,
  actions,
  mutations
};

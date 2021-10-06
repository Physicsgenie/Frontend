import axios from 'axios';

const state = {
  processing: false,
  confirmations: [],
  windowHeight: null,
  windowWidth: null,
  submittedProblems: null,
  problemMetaData: null,
  userSetup: {
    difficulty: null,
    topics: [],
    foci: [],
    calculus: null
  },
  userStats: null,
  currProblem: {
    problemID: null,
    problemText: "",
    diagram: "",
    answer: "",
    mustMatch: false,
    error: 5,
    solution: "",
    hintOne: "",
    hintTwo: null,
    difficulty: null,
    topic: "",
    topicName: "",
    mainFocus: "",
    mainFocusName: "",
    otherFoci: [],
    source: "",
    problemNumber: ""
  },
  currSubmission: {
    problemID: null,
    problemText: "",
    diagram: "",
    diagramFile: null,
    diagramType: "file",
    hintOne: "",
    hintTwo: "",
    hintTwoInclude: true,
    answer: "",
    mustMatch: false,
    error: 5,
    solution: "",
    solutionDiagram: "",
    solutionDiagramFile: null,
    solutionDiagramType: "none",
    topic: "",
    mainFocus: "",
    otherFoci: [],
    source: "",
    category: "",
    author: "",
    sourceOther: "",
    problemNumber: "",
    difficulty: null,
    calculus: "None"
  },
  currSubmissionEdit: {
    problemID: null,
    problemText: "",
    diagram: "",
    diagramFile: null,
    diagramType: "file",
    hintOne: "",
    hintTwo: "",
    hintTwoInclude: true,
    answer: "",
    mustMatch: false,
    error: 5,
    solution: "",
    solutionDiagram: "",
    solutionDiagramFile: null,
    solutionDiagramType: "none",
    topic: "",
    mainFocus: "",
    otherFoci: [],
    source: "",
    category: "",
    author: "",
    sourceOther: "",
    problemNumber: "",
    difficulty: null,
    calculus: "None"
  },
  pastAnswers: [],
  result: "",
  currAnswer: ""
};
const getters = {
  Confirmations: state => state.confirmations,
  Processing: state => state.processing,
  WindowHeight: state => state.windowHeight,
  WindowWidth: state => state.windowWidth,
  UserSetup: state => state.userSetup,
  SubmittedProblems: state => state.submittedProblems,
  UserStats: state => state.userStats,
  ProblemMetaData: state => state.problemMetaData,
  CurrSubmission: state => state.currSubmission,
  CurrSubmissionEdit: state => state.currSubmissionEdit,
  CurrProblem: state => state.currProblem,
  PastAnswers: state => state.pastAnswers,
  CurrAnswer: state => state.currAnswer,
  Result: state => state.result,
};
const actions = {
  async Confirmation({commit}, message) {
    let id = Math.floor(Math.random() * 100000000);
    commit('addConfirmation', {
      id: id,
      message: message
    });
    setTimeout(function() {
      commit('removeConfirmation', id);
    }, 2000);
  },
  async GetUserInfo({commit, getters}) {
    let response = await axios.get('wp-json/physics_genie/user-info', {headers: {'Authorization': 'Bearer ' + getters.Token}});

    let data = JSON.parse(response.data);

    commit('setUserSetup', {
      difficulty: data.setup.curr_diff,
      topics: data.setup.curr_topics,
      foci: data.setup.curr_foci,
      calculus: data.setup.calculus === "1"
    });
  },
  async GetProblemMetadata({commit}) {
    let response = await axios.get('wp-json/physics_genie/submit-data');
    console.log(JSON.parse(response.data));
    commit('setProblemMetaData', JSON.parse(response.data));
  },
  async GetCurrProblem({commit, getters}) {
    let response = await axios.get('wp-json/physics_genie/problem', {headers: {'Authorization': 'Bearer ' + getters.Token}});
    if (response.data === "") {
      commit('setCurrProblem', null);
    } else {

      let data = JSON.parse(response.data);
      let source = null;

      if (getters.ProblemMetaData.sources.filter(function(source) {return source.source_id === data.source}).length > 0) {
        source = getters.ProblemMetaData.sources.filter(function(source) {return source.source_id === data.source})[0];
      }


      commit('setCurrProblem', {
        problemID: data.problem_id,
        problemText: data.problem_text.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
        diagram: (data.diagram === null) ? null : data.diagram.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
        answer: data.answer.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
        mustMatch: data.must_match === "1",
        error: data.error,
        solution: data.solution.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
        solutionDiagram: (data.solution_diagram === null) ? null : data.solution_diagram.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
        hintOne: data.hint_one.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
        hintTwo: (data.hint_two === null) ? null : data.hint_two.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
        difficulty: data.difficulty,
        topic: data.topic,
        mainFocus: data.main_focus,
        otherFoci: data.other_foci,
        source: source,
        problemNumber: data.number_in_source
      });
    }
  },
  async GetUserStats({commit, getters}) {
    let response = await axios.get('wp-json/physics_genie/user-stats', {headers: {'Authorization': 'Bearer ' + getters.Token}});

    // let overall = response.data.filter(function(row) {return row.topic === "z" && row.focus === "z"})[0];
    //
    // let stats = {
    //   topics: [],
    //   presented: parseInt(overall.num_presented),
    //   correct: parseInt(overall.num_correct),
    //   avgAttempts: parseFloat(overall.avg_attempts),
    //   xp: parseInt(overall.xp),
    //   streak: parseInt(overall.streak),
    //   longestWinstreak: parseInt(overall.longest_winstreak),
    //   longestLosestreak: parseInt(overall.longest_losestreak)
    // };
    //
    // getters.ProblemMetaData.topics.forEach(function(topic) {
    //   let topicRow = response.data.filter(function(row) {return row.topic === topic.topic && row.focus === "z"})[0];
    //   stats.topics.push({
    //     topic: topic.name,
    //     topicId: topic.topic,
    //     foci: [],
    //     presented: parseInt(topicRow.num_presented),
    //     correct: parseInt(topicRow.num_correct),
    //     avgAttempts: parseFloat(topicRow.avg_attempts),
    //     xp: parseInt(topicRow.xp),
    //     streak: parseInt(topicRow.streak),
    //     longestWinstreak: parseInt(topicRow.longest_winstreak),
    //     longestLosestreak: parseInt(topicRow.longest_losestreak)
    //   });
    //
    //   getters.ProblemMetaData.focuses.filter(function(focus) {return focus.topic === topic.topic}).forEach(function(focus) {
    //     let focusRow = response.data.filter(function(row) {return row.topic === topic.topic && row.focus === focus.focus})[0];
    //     stats.topics[stats.topics.length - 1].foci.push({
    //       focus: focus.name,
    //       focusId: focus.focus,
    //       presented: parseInt(focusRow.num_presented),
    //       correct: parseInt(focusRow.num_correct),
    //       avgAttempts: parseFloat(focusRow.avg_attempts),
    //       xp: parseInt(focusRow.xp),
    //       streak: parseInt(focusRow.streak),
    //       longestWinstreak: parseInt(focusRow.longest_winstreak),
    //       longestLosestreak: parseInt(focusRow.longest_losestreak)
    //     });
    //   });
    // });

    commit('setUserStats', JSON.parse(response.data));
  },
  async GetSubmittedProblems({commit, getters}) {
    await axios.get('wp-json/physics_genie/contributor-problems', {headers: {'Authorization': 'Bearer ' + getters.Token}}).then((response) => {
      let problems = JSON.parse(response.data);
      console.log(problems);
      for (let i = 0; i < problems.length; i++) {
        let problemTextShortened = problems[i].problem_text.replace(/\\\\/g, "\\").replace(/\\"/g, "'");

        if (problemTextShortened.length > 200) {
          problemTextShortened = problemTextShortened.slice(0, 200);
          if ((problemTextShortened.match(/\$/g)||[]).length % 2 === 1) {
            problemTextShortened = problemTextShortened.slice(0, problemTextShortened.lastIndexOf("$"));
          }

          problemTextShortened += " ...";
        }

        problems[i].problemTextShortened = problemTextShortened;

        problems[i].sourceName = null;

        if (getters.ProblemMetaData.sources.filter(function(source) {return source.source_id === problems[i].source}).length > 0) {
          problems[i].sourceName = getters.ProblemMetaData.sources.filter(function(source) {return source.source_id === problems[i].source})[0].source;
        }
      }
      commit('setSubmittedProblems', problems)
    });
  },
  async SubmitProblem({commit, getters}) {
    if (getters.CurrSubmission.source === "other") {
      await axios.post("wp-json/physics_genie/add-source", {
        category: getters.CurrSubmission.category,
        author: getters.CurrSubmission.author,
        source: getters.CurrSubmission.sourceOther
      }, {headers: {'Authorization': 'Bearer ' + getters.Token}}).then(response => {
        getters.CurrSubmission.source = response.data;
      });
    }


    await axios.post("wp-json/physics_genie/submit-problem", {
      problem_text: getters.CurrSubmission.problemText,
      diagram: (getters.CurrSubmission.diagramType === "file" ? getters.CurrSubmission.diagramFile.text : (getters.CurrSubmission.diagramType === "code" ? getters.CurrSubmission.diagram : "")),
      answer: getters.CurrSubmission.answer,
      must_match: getters.CurrSubmission.mustMatch ? "true" : "false",
      error: this.functions.testAlgebraic(getters.CurrSubmission.answer) ? 0 : getters.CurrSubmission.error,
      solution: getters.CurrSubmission.solution,
      solution_diagram: (getters.CurrSubmission.solutionDiagramType === "file" ? getters.CurrSubmission.solutionDiagramFile.text : (getters.CurrSubmission.solutionDiagramType === "code" ? getters.CurrSubmission.solutionDiagram : "")),
      hint_one: getters.CurrSubmission.hintOne,
      hint_two: getters.CurrSubmission.hintTwo,
      source: getters.CurrSubmission.source,
      number_in_source: getters.CurrSubmission.problemNumber,
      difficulty: getters.CurrSubmission.difficulty,
      calculus: getters.CurrSubmission.calculus,
      topic: getters.CurrSubmission.topic,
      main_focus: getters.CurrSubmission.mainFocus,
      other_foci: getters.CurrSubmission.otherFoci.join("")
    }, {headers: {'Authorization': 'Bearer ' + getters.Token}}).then(() => {
      commit('setCurrSubmission', {
        problemID: null,
        problemText: "",
        diagram: "",
        diagramFile: null,
        diagramType: "file",
        hintOne: "",
        hintTwo: "",
        hintTwoInclude: true,
        answer: "",
        mustMatch: false,
        error: 5,
        solution: "",
        solutionDiagram: "",
        solutionDiagramFile: null,
        solutionDiagramType: "none",
        topic: "",
        mainFocus: "",
        otherFoci: [],
        source: "",
        category: "",
        author: "",
        sourceOther: "",
        problemNumber: "",
        difficulty: null,
        calculus: "None"
      });
    });
  },
  async EditProblem({commit, getters}) {

    await axios.put("wp-json/physics_genie/edit-problem", {
      problem_id: getters.CurrSubmissionEdit.problemID,
      problem_text: getters.CurrSubmissionEdit.problemText,
      diagram: (getters.CurrSubmissionEdit.diagramType === "file" ? getters.CurrSubmissionEdit.diagramFile.text : (getters.CurrSubmissionEdit.diagramType === "code" ? getters.CurrSubmissionEdit.diagram : "")),
      answer: getters.CurrSubmissionEdit.answer,
      must_match: getters.CurrSubmissionEdit.mustMatch ? "true" : "false",
      error: this.functions.testAlgebraic(getters.CurrSubmissionEdit.answer) ? 0 : getters.CurrSubmissionEdit.error,
      solution: getters.CurrSubmissionEdit.solution,
      solution_diagram: (getters.CurrSubmissionEdit.solutionDiagramType === "file" ? getters.CurrSubmissionEdit.solutionDiagramFile.text : (getters.CurrSubmissionEdit.solutionDiagramType === "code" ? getters.CurrSubmissionEdit.solutionDiagram : "")),
      hint_one: getters.CurrSubmissionEdit.hintOne,
      hint_two: getters.CurrSubmissionEdit.hintTwo,
      source: getters.CurrSubmissionEdit.source,
      number_in_source: getters.CurrSubmissionEdit.problemNumber,
      difficulty: getters.CurrSubmissionEdit.difficulty,
      calculus: getters.CurrSubmissionEdit.calculus,
      topic: getters.CurrSubmissionEdit.topic,
      main_focus: getters.CurrSubmissionEdit.mainFocus,
      other_foci: getters.CurrSubmissionEdit.otherFoci.join("")
    }, {headers: {'Authorization': 'Bearer ' + getters.Token}}).then(() => {
      commit('setCurrSubmissionEdit', {
        problemID: null,
        problemText: "",
        diagram: "",
        diagramFile: null,
        diagramType: "file",
        hintOne: "",
        hintTwo: "",
        hintTwoInclude: true,
        answer: "",
        mustMatch: false,
        error: 5,
        solution: "",
        solutionDiagram: "",
        solutionDiagramFile: null,
        solutionDiagramType: "none",
        topic: "",
        mainFocus: "",
        otherFoci: [],
        source: "",
        category: "",
        author: "",
        sourceOther: "",
        problemNumber: "",
        difficulty: null,
        calculus: "None"
      });
    });
  },
  async SubmitAttempt({getters}, result) {
    await axios.post("wp-json/physics_genie/submit-attempt", {
      problem_id: getters.CurrProblem.problemID,
      num_attempts: getters.PastAnswers.length,
      correct: result === "correct" ? "true" : "false",
      topic: getters.CurrProblem.topic,
      focus: getters.CurrProblem.mainFocus,
      difficulty: getters.CurrProblem.difficulty,
    },  {headers: {'Authorization': 'Bearer ' + getters.Token}});
  }
};
const mutations = {
  setProcessing(state, processing) {
    state.processing = processing;
  },
  addConfirmation(state, confirmation) {
    state.confirmations.push(confirmation);
  },
  removeConfirmation(state, id) {
    for (let i = 0; i < state.confirmations.length; i++) {
      if (state.confirmations[i].id === id) {
        state.confirmations.splice(i, 1);
        break;
      }
    }
  },
  setWindowHeight(state) {
    state.windowHeight = window.innerHeight;
  },
  setWindowWidth(state) {
    state.windowWidth = window.innerWidth;
  },
  setUserSetup(state, setup) {
    state.userSetup = setup;
  },
  setProblemMetaData(state, data) {
    state.problemMetaData = data;
  },
  setCurrProblem(state, problem) {
    state.currProblem = problem;
  },
  setUserStats(state, stats) {
    state.userStats = stats;
  },
  setSubmittedProblems(state, problems) {
    state.submittedProblems = problems;
  },
  setCurrSubmission(state, currSubmission) {
    state.currSubmission = currSubmission;
  },
  setCurrSubmissionEdit(state, currSubmissionEdit) {
    state.currSubmissionEdit = currSubmissionEdit;
  },
  setPastAnswers(state, pastAnswers) {
    state.pastAnswers = pastAnswers;
  },
  setCurrAnswer(state, currAnswer) {
    state.currAnswer = currAnswer;
  },
  setResult(state, result) {
    state.result = result;
  }
};
export default {
  state,
  getters,
  actions,
  mutations
};

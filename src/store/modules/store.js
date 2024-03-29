import axios from 'axios';

const state = {
  processing: false,
  confirmations: [],
  windowHeight: null,
  windowWidth: null,
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
    hintTwo: "",
    difficulty: null,
    topic: "",
    topicName: "",
    mainFocus: "",
    mainFocusName: "",
    otherFoci: [],
    source: "",
    problemNumber: "",
    completed: false,
    problemType: "sa",
    resources: ""
  },
  currSubmission: {
    problemID: null,
    problemText: "",
    diagram: "",
    diagramFile: null,
    diagramType: "file",
    hintOne: "",
    hinOneInclude: true,
    hintTwo: "",
    hintTwoInclude: false,
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
    calculus: "None",
    problemType: "sa",
    resources: "",
    mcOptions: ["", "", "", ""]
  },
  currSubmissionEdit: {
    problemID: null,
    problemText: "",
    diagram: "",
    diagramFile: null,
    diagramType: "file",
    hintOne: "",
    hintOneInclude: true,
    hintTwo: "",
    hintTwoInclude: false,
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
    calculus: "None",
    problemType: "sa",
    resources: "",
    mcOptions: ["", "", "", ""]
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
        hintTwo: data.hint_two.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
        difficulty: data.difficulty,
        topic: data.topic,
        mainFocus: data.main_focus,
        otherFoci: data.other_foci,
        source: source,
        problemNumber: data.number_in_source,
        problemErrors: data.problem_errors,
        problemType: data.problem_type,
        resources: data.resources,
        completed: data.active
      });

      // Get past answers from current attempt
      let pastAnswers = [];

      data.attempts.sort(function(a, b) {return (new Date(b.date_attempted)).getTime() - (new Date(a.date_attempted)).getTime()});

      for (let i = 0; i < data.attempts.length; i++) {
        if (data.attempts[i].correct === "1" || data.attempts[i].give_up === "1") {
          break;
        }
        pastAnswers[i] = data.attempts[i].student_answer;
      }

      pastAnswers = pastAnswers.slice(0, 2);
      commit('setPastAnswers', pastAnswers.reverse());
    }
  },
  async GetUserStats({commit, getters}) {
    let response = await axios.get('wp-json/physics_genie/user-stats', {headers: {'Authorization': 'Bearer ' + getters.Token}});

    commit('setUserStats', JSON.parse(response.data));
  },
  async GetPastProblems({commit, getters}) {
    await axios.get('wp-json/physics_genie/user-problems', {headers: {'Authorization': 'Bearer ' + getters.Token}}).then((response) => {
      let problems = JSON.parse(response.data);
      for (let i = 0; i < problems.length; i++) {
        let problemTextShortened = problems[i].problem_text.replace(/\\\\/g, "\\").replace(/\\"/g, "'");

        if (problems[i].problem_type === "mc" || problems[i].problem_type === "ms") {
          problemTextShortened = problemTextShortened.split("||||||||||")[0];
        }

        if (problemTextShortened.length > 200) {
          problemTextShortened = problemTextShortened.slice(0, 200);
          if ((problemTextShortened.match(/\$/g)||[]).length % 2 === 1) {
            problemTextShortened = problemTextShortened.slice(0, problemTextShortened.lastIndexOf("$"));
          }

          problemTextShortened += " ...";
        }


        let sourceName = null;
        let source = null;

        if (getters.ProblemMetaData.sources.filter(function(source) {return source.source_id === problems[i].source}).length > 0) {
          source = getters.ProblemMetaData.sources.filter(function(source) {return source.source_id === problems[i].source})[0];
          sourceName = source.source;
        }

        problems[i] = {
          problemID: problems[i].problem_id,
          problemText: problems[i].problem_text.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          problemTextShortened: problemTextShortened,
          diagram: (problems[i].diagram === null) ? null : problems[i].diagram.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          answer: problems[i].answer.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          mustMatch: problems[i].must_match === "1",
          error: problems[i].error,
          solution: problems[i].solution.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          solutionDiagram: (problems[i].solution_diagram === null) ? null : problems[i].solution_diagram.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          hintOne: problems[i].hint_one.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          hintTwo: problems[i].hint_two.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          difficulty: problems[i].difficulty,
          topic: problems[i].topic,
          mainFocus: problems[i].main_focus,
          otherFoci: problems[i].other_foci,
          source: source,
          sourceName: sourceName,
          problemNumber: problems[i].number_in_source,
          calculus: problems[i].calculus,
          problemErrors: problems[i].problem_errors,
          pastAttempts: problems[i].attempts,
          problemType: problems[i].problem_type,
          resources: problems[i].resources,
          active: problems[i].active
        };
      }
      commit('setPastProblems', problems, {root: true})
    });
  },
  async GetSubmittedProblems({commit, getters}) {
    await axios.get('wp-json/physics_genie/contributor-problems', {headers: {'Authorization': 'Bearer ' + getters.Token}}).then((response) => {
      let problems = JSON.parse(response.data);
      for (let i = 0; i < problems.length; i++) {
        let problemTextShortened = problems[i].problem_text.replace(/\\\\/g, "\\").replace(/\\"/g, "'");

        if (problems[i].problem_type === "mc" || problems[i].problem_type === "ms") {
          problemTextShortened = problemTextShortened.split("||||||||||")[0];
        }

        if (problemTextShortened.length > 200) {
          problemTextShortened = problemTextShortened.slice(0, 200);
          if ((problemTextShortened.match(/\$/g)||[]).length % 2 === 1) {
            problemTextShortened = problemTextShortened.slice(0, problemTextShortened.lastIndexOf("$"));
          }

          problemTextShortened += " ...";
        }

        let sourceName = null;

        if (getters.ProblemMetaData.sources.filter(function(source) {return source.source_id === problems[i].source}).length > 0) {
          sourceName = getters.ProblemMetaData.sources.filter(function(source) {return source.source_id === problems[i].source})[0].source;
        }

        let problemText = problems[i].problem_text.replace(/\\\\/g, "\\").replace(/\\"/g, "'");

        problems[i] = {
          problemID: problems[i].problem_id,
          problemText: problemText.split("||||||||||")[0],
          problemTextShortened: problemTextShortened,
          diagram: (problems[i].diagram === null) ? null : problems[i].diagram.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          answer: problems[i].answer.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          mustMatch: problems[i].must_match === "1",
          error: problems[i].error,
          solution: problems[i].solution.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          solutionDiagram: (problems[i].solution_diagram === null) ? null : problems[i].solution_diagram.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          hintOne: problems[i].hint_one.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          hintTwo: problems[i].hint_two.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
          difficulty: problems[i].difficulty,
          topic: problems[i].topic,
          mainFocus: problems[i].main_focus,
          otherFoci: problems[i].other_foci,
          source: problems[i].source,
          sourceName: sourceName,
          problemNumber: problems[i].number_in_source,
          calculus: problems[i].calculus,
          problemErrors: problems[i].problem_errors,
          problemType: problems[i].problem_type,
          resources: problems[i].resources,
          mcOptions: problems[i].problem_type === "sa" ? ["", "", "", ""] : problemText.split("||||||||||")[1].split("|||||")
        };
      }
      commit('setSubmittedProblems', problems, {root: true})
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

    // Append multiple choice options to problem text string if relevant
    let problemText = getters.CurrSubmission.problemText;
    if (getters.CurrSubmission.problemType === "mc" || getters.CurrSubmission.problemType === "ms") {
      problemText += "|||||";
      getters.CurrSubmission.mcOptions.forEach(function(option) {
        problemText += "|||||" + option;
      });
    }

    await axios.post("wp-json/physics_genie/submit-problem", JSON.stringify({
      problem_text: problemText,
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
      other_foci: getters.CurrSubmission.otherFoci,
      problem_type: getters.CurrSubmission.problemType,
      resources: getters.CurrSubmission.resources
    }), {'Content-Type': 'application/json', headers: {'Authorization': 'Bearer ' + getters.Token}}).then(() => {
      commit('setCurrSubmission', {
        problemID: null,
        problemText: "",
        diagram: "",
        diagramFile: null,
        diagramType: "file",
        hintOne: "",
        hintOneInclude: true,
        hintTwo: "",
        hintTwoInclude: false,
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
        calculus: "None",
        problemType: "sa",
        resources: "",
        mcOptions: ["", "", "", ""]
      });
    });
  },
  async EditProblem({commit, getters}) {
    // Getting list of user-reported errors that were addressed and that were marked as "Technical Error" and putting problem_error_ids in errorsAddressed 2d array
    let errorsAddressed = [];
    for (let i = 0; i < getters.CurrSubmissionEdit.problemErrors.length; i++) {
      let error = getters.CurrSubmissionEdit.problemErrors[i];
      errorsAddressed.push([error.problem_error_id, error.addressedState]);
    }

    // Append multiple choice options to problem text string if relevant
    let problemText = getters.CurrSubmissionEdit.problemText;
    if (getters.CurrSubmissionEdit.problemType === "mc" || getters.CurrSubmissionEdit.problemType === "ms") {
      problemText += "|||||";
      getters.CurrSubmissionEdit.mcOptions.forEach(function(option) {
        problemText += "|||||" + option;
      });
    }

    await axios.put("wp-json/physics_genie/edit-problem", JSON.stringify({
      problem_id: getters.CurrSubmissionEdit.problemID,
      problem_text: problemText,
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
      other_foci: getters.CurrSubmissionEdit.otherFoci,
      problem_type: getters.CurrSubmissionEdit.problemType,
      resources: getters.CurrSubmissionEdit.resources,
      errors_addressed: errorsAddressed
    }), {'Content-Type': 'application/json', headers: {'Authorization': 'Bearer ' + getters.Token}}).then(() => {
      commit('setCurrSubmissionEdit', {
        problemID: null,
        problemText: "",
        diagram: "",
        diagramFile: null,
        diagramType: "file",
        hintOne: "",
        hintOneInclude: true,
        hintTwo: "",
        hintTwoInclude: false,
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
        calculus: "None",
        problemErrors: [],
        problemType: "sa",
        resources: "",
        mcOptions: ["", "", "", ""]
      });
    });
  },
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

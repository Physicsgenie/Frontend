/* eslint-disable */
<template>
  <div class = "container">
    <!-- Menus -->
    <Menu />
    <User />

    <!-- Problem Preview -->
    <div v-if = "problemPreview !== null" class = "preview" v-bind:style = "{height: $store.getters.WindowHeight + 'px'}">
      <div class = "preview-container">
        <!-- Reactivate Problem Button -->
        <button v-on:click = "activateProblem(problemPreview)" class = "activate" v-if = "problemPreview.active"><i class = "fa fa-minus"></i><span>Deactivate Problem</span></button>
        <button v-on:click = "activateProblem(problemPreview)" class = "activate" v-else><i class = "fa fa-plus"></i><span>Reactivate Problem</span></button>

        <div class = "view-box">
          <!-- Problem -->
          <Problem v-bind:problem = "problemPreview" class = "problem" />
        </div>

        <!-- Exit Preview Button -->
        <button v-on:click = "problemPreview = null" class = "exit"><span>Exit Practice</span><i class = "fa fa-times"></i></button>
      </div>
    </div>

    <!-- Problem Review -->
    <div v-if = "problemReview !== null" class = "review preview" v-bind:style = "{height: $store.getters.WindowHeight + 'px'}">
      <div class = "preview-container">
        <!-- Reactivate Problem Button -->
        <button v-on:click = "activateProblem(problemReview)" class = "activate" v-if = "problemReview.active"><i class = "fa fa-minus"></i><span>Deactivate Problem</span></button>
        <button v-on:click = "activateProblem(problemReview)" class = "activate" v-else><i class = "fa fa-plus"></i><span>Reactivate Problem</span></button>

        <div class = "view-box">
          <!-- Problem -->
          <ProblemReview v-bind:problem = "problemReview" class = "problem" />
        </div>

        <!-- Exit Preview Button -->
        <button v-on:click = "problemReview = null" class = "exit"><span>Exit Review</span><i class = "fa fa-times"></i></button>
      </div>
    </div>

    <!-- Outer Content -->
    <div class = "outer-content">
      <!-- Top Bar -->
      <div class = "top-bar">
        <div class = "summary">
          <div><span class = "bold">{{ problems.length }}</span> problem{{ problems.length === 1 ? "" : "s" }} attempted across <span class = "bold">{{ numberOfFoci }}</span> focus{{ numberOfFoci === 1 ? "" : "es" }}</div>
          <div class = "more-stats" v-on:click = "navigate('')">More Stats</div>
        </div>
        <div class = "play" v-on:click = "navigate('play')"><span>Play</span><i class = "fa fa-cubes"></i></div>
      </div>

      <!-- Content -->
      <div class = "content">
        <!-- Heading -->
        <div class = "heading">
          <h1>Attempted Problems</h1>
          <div class = "view-type-buttons">
            <i class = "fa fa-list" v-on:click = "changeViewType('list')" v-bind:class = "viewType === 'list' ? 'active' : ''"></i>
            <i class = "fa fa-th" v-on:click = "changeViewType('grid')" v-bind:class = "viewType === 'grid' ? 'active' : ''"></i>
          </div>
        </div>

        <!-- Filters -->
        <div class = "filters">
          <div class = "list-by filter">
            <h6>List By:</h6>
            <select name = "top" v-model = "listBy">
              <option value = "recency">Recency</option>
              <option value = "topic">Topic</option>
              <option value = "focus">Focus</option>
              <option value = "difficulty">Difficulty</option>
            </select>
          </div>
          <div class = "topic filter">
            <h6>Topic:</h6>
            <select name = "topic" v-model = "selectedTopic">
              <option value = "all">All</option>
              <option v-for = "topic in submitData.topics" v-bind:key = "topic.name" v-bind:value = "topic.name">{{ topic.name }}</option>
            </select>
          </div>
          <div class = "focus filter">
            <h6>Focus:</h6>
            <select name = "focus" v-model = "selectedFocus">
              <option value = "all">All</option>
              <option v-for = "focus in possibleFocuses" v-bind:key = "focus.name" v-bind:value = "focus.name">{{ focus.name }}</option>
            </select>
          </div>
          <div class = "difficulty filter">
            <h6>Difficulty:</h6>
            <select name = "difficulty" v-model = "selectedDifficulty">
              <option value = "all">All</option>
              <option value = "easy">Easy</option>
              <option value = "medium">Medium</option>
              <option value = "hard">Hard</option>
            </select>
          </div>
        </div>

        <!-- Past Problems -->
        <div id = "past-problems" v-bind:class = "viewType">
          <div v-for = "problem in problems" v-bind:key = "problem.problemID" class = "problem">
            <!-- Problem Buttons -->
            <div class = "buttons">
              <button class = "button" v-on:click = "previewProblem(problem)"><i class = "fa fa-cubes"></i>Practice</button>
              <button class = "button orange" v-on:click = "reviewProblem(problem)"><i class = "fa fa-retweet"></i>Review</button>
            </div>

            <!-- Problem Info -->
            <div class = "topic-focus"><span class = "topic">{{ problem.topic }}</span>><span class = "focus">{{ problem.mainFocus }}</span></div>
            <div class = "problem-text"><vue-mathjax :formula = "viewType === 'list' ? problem.problemText : problem.problemTextShortened" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></div>
            <div class = "info">
              <h6 class = "source">{{ problem.sourceName }}</h6>
              <div class = "difficulty">
                <i v-for = "_ in parseInt(problem.difficulty)" class = "fa fa-star"></i>
                <i v-for = "_ in (5 - problem.difficulty)" class = "fa fa-star-o"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

// Imports
import Menu from "../components/Menu";
import User from "../components/User";
import Problem from "../components/Problem";
import ProblemReview from "../components/ProblemReview";
import {VueMathjax} from 'vue-mathjax'
import axios from "axios";

export default {
  name: "Review",
  components: {
    Menu,
    User,
    Problem,
    ProblemReview,
    'vue-mathjax': VueMathjax
  },
  data() {
    return {
      problemPreview: null,
      problemReview: null,
      viewType: 'list',
      selectedTopic: "all",
      selectedFocus: "all",
      selectedDifficulty: "all",
      listBy: "recency"
    }
  },
  computed: {
    // problems, problem data as filtered and sorted by user inputs
    problems() {
      let self = this;
      let problems = this.$store.getters.PastProblems;
      problems = problems.filter(function(problem) {return (self.selectedTopic === "all" || problem.topic === self.selectedTopic) && (self.selectedFocus === "all" || problem.mainFocus === self.selectedFocus) && (self.selectedDifficulty === "all" || (self.selectedDifficulty === "easy" && (parseInt(problem.difficulty) <= 3)) || (self.selectedDifficulty === "medium" && (parseInt(problem.difficulty) >=2 && parseInt(problem.difficulty) <= 4)) || (self.selectedDifficulty === "hard" && (parseInt(problem.difficulty) >=3)))});

      if (self.listBy === "recency") {
        problems.sort(function(problem1, problem2) {return new Date(problem2.pastAttempts[problem2.pastAttempts.length - 1].date_attempted) - new Date(problem1.pastAttempts[problem1.pastAttempts.length - 1].date_attempted)});
      } else if (self.listBy === "topic") {
        problems.sort(function(problem1, problem2) {return problem1.topic.localeCompare(problem2.topic) === 0 ? new Date(problem2.pastAttempts[problem2.pastAttempts.length - 1].date_attempted) - new Date(problem1.pastAttempts[problem1.pastAttempts.length - 1].date_attempted) : problem1.topic.localeCompare(problem2.topic)});
      } else if (self.listBy === "focus") {
        problems.sort(function(problem1, problem2) {return problem1.mainFocus.localeCompare(problem2.mainFocus) === 0 ? new Date(problem2.pastAttempts[problem2.pastAttempts.length - 1].date_attempted) - new Date(problem1.pastAttempts[problem1.pastAttempts.length - 1].date_attempted) : problem1.mainFocus.localeCompare(problem2.mainFocus)});
      } else if (self.listBy === "difficulty") {
        problems.sort(function(problem1, problem2) {return problem2.difficulty - problem1.difficulty === 0 ? new Date(problem2.pastAttempts[problem2.pastAttempts.length - 1].date_attempted) - new Date(problem1.pastAttempts[problem1.pastAttempts.length - 1].date_attempted) : problem2.difficulty - problem1.difficulty});
      }

      return problems;
    },

    // submitData, map to "ProblemMetaData" from store (get only)
    submitData() {
      return this.$store.getters.ProblemMetaData;
    },

    // possibleFocuses, focuses that correspond to the current topic
    possibleFocuses() {
      let self = this;
      let matchingTopics = this.submitData.topics.filter(function(topic) {return topic.name === self.selectedTopic});
      let topicId = matchingTopics.length > 0 ? matchingTopics[0].topic_id : null;
      return this.submitData.focuses.filter(function(focus) {return focus.topic === topicId});
    },

    numberOfFoci() {
      let foci = [];
      for (let i = 0; i < this.problems.length; i++) {
        if (!foci.includes(this.problems[i].mainFocus)) {
          foci.push(this.problems[i].mainFocus);
        }
      }
      return foci.length;
    },

    errorStats() {
      let result = {errors: 0, problems: 0};
      for (let i = 0; i < this.problems.length; i++) {
        if (this.problems[i].problemErrors.length > 0) {
          result.errors += this.problems[i].problemErrors.length;
          result.problems++;
        }
      }
      return result;
    },
  },
  methods: {
    // changeViewType (viewType => 'list' or 'grid'), changes view type
    changeViewType: function(viewType) {
      this.viewType = viewType;
    },

    // previewProblem (problem => problem to preview), sets current previewed problem to the one passed to this function
    previewProblem: function(problem) {
      this.problemPreview = problem;
    },

    // previewProblem (problem => problem to review), sets current reviewed problem to the one passed to this function
    reviewProblem: function(problem) {
      this.problemReview = problem;
    },

    // navigate (place => page to navigate to), navigate to passed-in page
    navigate: function(place) {
      this.$router.push("/" + place);
    },

    // activateProblem (problem => problem to reactivate/deactivate), reactivate or deactivate problem according to its current activation state
    activateProblem: function(problem) {
      let self = this;
      console.log(problem);

      self.$store.commit('setProcessing', true);
      if (problem.active) {
        axios.post('wp-json/physics_genie/deactivate-problem', JSON.stringify({
          problem_id: problem.problemID
        }), {headers: {'Content-Type': 'application/json','Authorization': 'Bearer ' + this.$store.getters.Token}}).then(() => {
          // If no current problem, then set current problem with current user settings
          if (self.$store.getters.CurrProblem === null) {
            self.$store.dispatch('GetCurrProblem');
          }
          self.$store.dispatch('GetPastProblems');
          self.problemPreview = null;
          self.problemReview = null;
          self.$store.commit('setProcessing', false);
          self.$store.dispatch("Confirmation", "Problem successfully removed from the pool of possible problems")
        });
      } else {
        axios.post('wp-json/physics_genie/activate-problem', JSON.stringify({
          problem_id: problem.problemID
        }), {headers: {'Content-Type': 'application/json','Authorization': 'Bearer ' + this.$store.getters.Token}}).then(() => {
          // If no current problem, then set current problem with current user settings
          if (self.$store.getters.CurrProblem === null) {
            self.$store.dispatch('GetCurrProblem');
          }
          self.$store.dispatch('GetPastProblems');
          self.problemPreview = null;
          self.problemReview = null;
          self.$store.commit('setProcessing', false);
          self.$store.dispatch("Confirmation", "Problem successfully added back into the pool of possible problems")
        });
      }
    }
  }
}

</script>

<style scoped>

/* Preview Styling */
.preview {
  position: fixed;
  top: 0;
  left: 50px;
  width: 100%;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.3);
}

.preview .preview-container {
  width: 75%;
  border-radius: 50px;
  position: relative;
  background: white;
  padding: 80px;
  box-sizing: border-box;
  height: auto;
  max-height: 85%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 10px 2px rgba(17, 21, 33, 0.3);
}

.preview .view-box {
  width: 100%;
  height: auto;
  padding: 0 80px;
  margin: 0;
  overflow-y: auto;
}

.preview .activate {
  position: absolute;
  left: 75px;
  top: 25px;
  background: none;
  outline: none;
  font-size: 20px;
  cursor: pointer;
  color: #285380;
  border-radius: 10px;
  border: 1px solid #285380;
  transition: transform .3s ease;
  display: flex;
  padding: 0 7px;
  height: 35px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.preview .activate span {
  width: 0;
  display: inline-block;
  overflow: hidden;
  font-size: 13px;
  margin: 0;
  transition: width .3s ease, margin-right .3s ease;
}

.preview .activate:hover span {
  width: inherit;
  margin: 0 10px;
}

.preview .exit {
  position: absolute;
  right: 35px;
  top: 25px;
  background: none;
  outline: none;
  font-size: 20px;
  cursor: pointer;
  color: #ff3f49;
  border-radius: 10px;
  border: 1px solid #ff3f49;
  transition: transform .3s ease;
  display: flex;
  padding: 0 7px;
  height: 35px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.preview .exit span {
  width: 0;
  display: inline-block;
  overflow: hidden;
  font-size: 13px;
  margin: 0;
  transition: width .3s ease, margin-right .3s ease;
}

.preview .exit:hover span {
  width: inherit;
  margin: 0 5px;
}

.preview .exit:hover .fa {
  transform: rotate(90deg);
}

.preview .problem {
  height: inherit;
}

@media only screen and (max-width: 700px) {
  .preview {
    left: 0;
  }

  .preview .preview-container {
    width: 90%;
    padding: 80px 50px;
    margin-top: 75px;
  }

  .preview .view-box {
    padding: 0 50px;
  }
}

/* Outer Content Styling */
.outer-content {
  width: calc(90% - 100px);
  position: relative;
  margin: 100px 0 -50px calc(5% + 100px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media only screen and (max-width: 700px) {
  .outer-content {
    width: 90%;
    margin: 100px 0 -50px 5%;
  }
}


/* Top Bar Styling */
.top-bar {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  box-sizing: border-box;
  flex-wrap: wrap;
}

.top-bar .summary {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.top-bar .summary > div, .top-bar .play {
  background: white;
  height: 50px;
  border-radius: 17px;
  margin: 0 10px 10px 0;
  line-height: 50px;
  display: inline-block;
  padding: 0 20px;
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  box-shadow: 0 0 5px 2px rgba(17, 21, 33, 0.3);
  transition: box-shadow .3s ease;
}

.top-bar .summary > div:hover, .top-bar .play:hover {
  box-shadow: 0 0 10px 6px rgba(17, 21, 33, 0.3);
}

.top-bar .summary .bold {
  font-weight: 900;
  font-size: 18px;
}

.top-bar .summary > .more-stats, .top-bar .play {
  border-radius: 20px;
  color: #285380;
  cursor: pointer;
  padding: 0 25px;
  background: #d1e7ff;
  transition: color .3s ease, background .3s ease;
}

.top-bar .summary > .more-stats:hover {
  color: white;
  background: #4d7ead;
}

.top-bar .play {
  color: white;
  background: #ff845d;
  position: relative;
  width: 58px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  overflow: hidden;
  padding: 0;
  transition: width .3s ease;
}

.top-bar .play > span {
  position: absolute;
  width: 120px;
  padding: 0;
  left: 20px;
  display: inline-block;
  overflow: hidden;
  transition: width .3s ease;
}

.top-bar .play .fa {
  display: inline-block;
  padding: 20px;
  margin-right: -5px;
  background: #ff845d;
  z-index: 3;
  font-size: 20px;
  transform: rotate(0deg);
  transition: transform .3s ease, padding .1s ease, margin-right .1s ease;
}

.top-bar .play:hover {
  color: white;
  background: #ff845d;
  width: 100px;
}

.top-bar .play:hover .fa {
  padding: 10px;
  margin-right: 5px;
  transform: rotate(360deg);
  transition: transform .3s ease, padding .6s ease, margin-right .6s ease;
}

@media only screen and (max-width: 1250px) {
  .top-bar {
    flex-direction: column;
  }
}

/* Content Styling */
.content {
  border-radius: 40px;
  margin-bottom: 50px;
  padding-bottom: 40px;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  box-shadow: 0 0 5px 2px rgba(17, 21, 33, 0.3);
}

.heading {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 85%;
  padding: 30px 0 20px 0;
  box-sizing: border-box;
  margin: 30px 0 10px 0;
  border-bottom: 1px solid black;
}

h1 {
  font-family: "Nanum Gothic", sans-serif;
  font-size: 40px;
  color: black;
  font-weight: 500;
  position: relative;
  background: white;
}

/* View Type Buttons */
.view-type-buttons .fa {
  padding: 8px 15px;
  cursor: pointer;
  color: #ff845d;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border: 1px solid #ff845d;
  transition: color .3s ease, background .3s ease;
}

.view-type-buttons .fa:first-child {
  border-radius: 10px 0 0 10px;
  border-right: none;
}

.view-type-buttons .fa:hover, .view-type-buttons .fa.active {
  color: white;
  background: #ff845d;
}

/* Filters styling */
.filters {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  padding: 10px 0;
}

.filters .filter {
  display: flex;
  flex-direction: row;
  margin: 15px 20px;
  height: 20px;
  align-items: center;
  font-family: "Nunito", sans-serif;
}

.filters .filter h6 {
  font-size: 15px;
  margin-right: 10px;
}

.filters .filter select {
  outline: none;
  padding: 5px;
}

/* Past Problems Styling */
#past-problems {
  width: 95%;
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: column;
}

#past-problems .divider {
  margin: 35px 5%;
  width: 90%;
  height: 1px;
  background: black;
}

#past-problems.list {
  width: 85%;
}

#past-problems.grid {
  flex-direction: row;
}

#past-problems .problem {
  color: #4a4a4a;
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  background: white;
  position: relative;
  top: 0;
  transition: box-shadow .3s ease, border .3s ease, top .3s ease;
}

#past-problems .problem .buttons {
  background: rgba(255, 255, 255, 0.65);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  opacity: 0;
  border-radius: 25px;
  z-index: -1;
  transition: opacity .3s ease, z-index 0s ease .3s;
}

#past-problems .problem .buttons .button {
  background: white;
}

#past-problems .problem .buttons .button:nth-child(1) {
  margin-right: 20px;
}

#past-problems .problem:hover .buttons {
  opacity: 1;
  z-index: 1;
  transition: opacity .3s ease, z-index 0s ease 0s;
}

#past-problems .problem .topic-focus {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-style: italic;
  background: rgba(56, 100, 155, 0.1);
  box-shadow: 0 0 8px 1px rgba(56, 100, 155, 0.3);
}

#past-problems .problem .topic-focus span {
  margin: 0 5px;
}

#past-problems .problem .problem-text {
  line-height: 25px;
}


/* List Styling */
.list .problem {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  border-top: 0.5px solid rgba(17, 21, 33, 0.3);
}

.list .problem.flagged {
  border-top: 0.5px solid rgba(255, 100, 105, 0.3);
  background: rgba(255, 100, 105, 0.1) !important;
}

.list .problem:hover {
  box-shadow: 0 0 10px 2px rgba(17, 21, 33, 0.3);
  top: -5px !important;
}

#past-problems.list .problem .buttons {
  border-radius: 0;
}

.list .topic-focus {
  margin: 15px 15px 15px 15px;
  font-size: 12px;
  flex: 0 0 auto;
  padding: 5px 0;
}

.list .problem-text {
  overflow: hidden;
  max-height: 25px;
  position: relative;
  margin-right: 10px;
  padding-right: 10px;
  text-align: justify;
  flex: 1 1 100%;
}

.list .problem-text::before {
  content: "...";
  position: absolute;
  right: 0;
}

.list .problem-text::after {
  content: "";
  width: 10px;
  height: 25px;
  position: absolute;
  right: 0;
  background: white;
}

.list .problem.flagged .problem-text::after {
  /*background: rgba(255, 100, 105, .1) !important;*/
}

.list .info {
  margin: 0 20px;
  flex: 0 0 auto;
}

.list .buttons .button {
  height: 32px;
  line-height: 32px;
  font-size: 12px;
}


/* Grid Styling */
.grid .problem {
  width: 320px;
  border-radius: 25px;
  margin: 15px;
  border: 0.5px solid rgba(17, 21, 33, 0.4);
}

.grid .problem.flagged {
  border: 0.5px solid rgba(255, 100, 105, 0.3);
  background: rgba(255, 196, 198, 0.1) !important;
}

.grid .problem:hover {
  box-shadow: 0 0 10px 2px rgba(17, 21, 33, 0.3);
  border: 1px solid rgba(17, 21, 33, 0.4);
  top: -10px !important;
}

.grid .topic-focus {
  margin: 20px 20px 15px 20px;
  padding: 10px 0;
}

.grid .problem-text {
  margin: 0 20px;
  line-height: 25px;
}

.grid .info {
  border-top: 1px solid rgba(56, 100, 155, 0.3);
  margin-top: 8px;
  padding: 0 25px 15px 25px;
  position: relative;
  font-size: 21px;
  color: #111521;
  font-weight: bolder;
}

.grid .info::before {
  content: "";
  background: rgba(56, 100, 155, 0.1);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: .2;
}

.grid .source {
  margin-bottom: 5px;
  margin-top: 25px;
}


.grid .difficulty .fa {
  margin: 0 2px;
  font-size: 15px;
}

</style>

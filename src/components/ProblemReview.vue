<template>
  <div id = "problem">
    <!-- Report error -->
    <ReportError v-if = "reportError" v-bind:problemID = "problem.problemID" v-on:close = "reportErrorClose" style = "z-index: 500;" />

    <!-- Errors reported -->
    <div v-if = "problem.problemErrors !== undefined && problem.problemErrors.length > 0" class = "reported-errors"><i class = "fa fa-exclamation-circle"></i><div class = "num">{{ problem.problemErrors.length }}</div><div>error{{problem.problemErrors.length === 1 ? " has" : "s have"}} been reported on this problem</div></div>

    <!-- Progress bars -->
    <div id = "progress-bars">
      <!-- Topic progress bar (only shows if window width is greater than 850px -->
      <div class = "topic" v-if = "$store.getters.WindowWidth > 850">
        <h4>{{ problem.topic }}</h4>
        <ProgressBar class = "progress-bar" v-bind:xp = "topicStatsXP" v-bind:add = "0" />
      </div>

      <!-- Focus progress bar -->
      <div class = "focus">
        <h4>{{ problem.mainFocus }}</h4>
        <ProgressBar class = "progress-bar" v-bind:xp = "focusStatsXP" v-bind:add = "0" />
      </div>
    </div>

    <!-- Main content -->
    <div class = "content" v-bind:style = "'border: 1px solid rgba(17, 21, 33, 0.4)'">
      <!-- Problem summary -->
      <div id = "summary">
        <!-- Difficulty -->
        <div class = "difficulty">
          <span>Difficulty:</span>
          <i v-for = "i in 5" v-bind:key = "i" v-bind:class = "(i <= problem.difficulty) ? 'fa-star' : 'fa-star-o'" v-bind:style = "(i === 1) ? 'margin-left: 5px' : ''" class = "fa"></i>
        </div>

        <!-- Main focus -->
        <div class = "main-focus"><span class = "topic">{{ problem.topic }}</span>><span class = "focus">{{ problem.mainFocus }}</span></div>

        <!-- Other foci -->
        <div class = "secondary-focus" v-if = "problem.otherFoci.length > 0" v-bind:title = "otherFociList">{{ otherFociList.length > 40 ? otherFociList.substring(0, 40) + "..." : otherFociList }}</div>
      </div>

      <!-- Problem text -->
      <p id = "problem-text"><vue-mathjax :formula = "problemText" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></p>

      <!-- Diagram (only shows if diagram is non-null) -->
      <div id = "diagram" v-if = "problem.diagram !== null" v-html = "problem.diagram"></div>

      <div v-if = "!multipleOptions" class = "flex row problem">
        <div id = "answer-container">
          <span class = "expecting">Expecting: {{ algebraicAnswer ? (problem.mustMatch ? "Exact algebraic expression (must match form exactly)" : "Algebraic expression (as simplified as possible)") : (problem.mustMatch ? "Exact numerical expression (must match both form and value exactly)" : (problem.error === "0" ? "Exact numerical answer" : "Numerical answer (must match value within a " + problem.error + "% error)")) }}</span>
        </div>
      </div>

      <!-- Hints -->
      <div id = "hints" v-bind:style = "multipleOptions ? {marginBottom: '20px'} : ''">
        <!-- Hint one -->
        <p class = "hint one" v-if = "problem.hintOne !== ''">Hint: <vue-mathjax v-bind:formula = "problem.hintOne" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></p>

        <!-- Hint two -->
        <p class = "hint two" v-if = "problem.hintTwo !== ''">Hint: <vue-mathjax v-bind:formula = "problem.hintTwo" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></p>
      </div>

      <!-- Multiple choice options -->
      <div id = "mc-options">
        <div v-for = "(option, index) in mcOptions" v-bind:key = "option" class = "option">
          <div v-bind:class = "problem.problemType === 'mc' ? 'circle' : 'square'" class = "shape">{{ alphabet.charAt(index) }}</div>
          <span><vue-mathjax :formula = "option" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></span>
        </div>
      </div>

      <!-- Solution -->
      <div id = "solution">
        <!-- Student previous answers -->
        <div id = "student-answers">
          <!-- If result was "correct" then most recent answer is colored green (since it was the correct one) -->
          <div v-for = "attempt in problem.pastAttempts" v-bind:key = "attempt.user_attempt_id" v-bind:class = "attempt.student_answer === '' || attempt.student_answer === null || attempt.give_up === '1' ? 'gave-up' : (attempt.correct === '1' ? 'correct' : 'incorrect')">
            <span>{{ attempt.student_answer === "" || attempt.student_answer === null || attempt.give_up === "1" ? "Gave Up" : "Response: " }}<vue-mathjax v-if = "attempt.student_answer !== '' && attempt.student_answer !== null && attempt.give_up !== '1'" v-bind:formula = "'$' + attempt.student_answer + '$'" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></span>
            <span>{{ months[new Date(attempt.date_attempted).getMonth()] + " " + new Date(attempt.date_attempted).getDate() + " " + new Date(attempt.date_attempted).getFullYear() }}</span>
          </div>
        </div>

        <!-- Answer -->
        <div id = "answer">Answer: <vue-mathjax class = "correct"  v-bind:formula = "'$' + problem.answer + '$'" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></div>

        <!-- Solution text -->
        <div id = "solution-text">
          <vue-mathjax v-bind:formula = "problem.solution" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax>

          <!-- Solution diagram -->
          <div id = "solution-diagram" v-if = "problem.solutionDiagram !== null" v-html = "problem.solutionDiagram"></div>
        </div>
      </div>

      <!-- Solution buttons -->
      <div class = "solution buttons">
        <button id = "report" v-on:click = "reportErrorPressed" class = "button" v-if = "problem.problemID !== null"><i class = "fa fa-flag"></i>Report an Error</button>
      </div></div>

    <!-- Source -->
    <div class = "source" v-if = "problem.source != null">Source: {{ problem.source.source + " (" + problem.source.author + ") " + (problem.problemNumber !== "" ? "#" : "") + problem.problemNumber }}</div>
    <div class = "source" v-else>Source: [[COULD NOT BE FOUND]]</div>
  </div>
</template>

<script>

// Imports
import {VueMathjax} from 'vue-mathjax'
import { mapGetters } from "vuex";
import ProgressBar from './ProgressBar';
import ReportError from './ReportError';

export default {
  name: "Problem",
  components: {
    'vue-mathjax': VueMathjax,
    ProgressBar,
    ReportError
  },
  props: {
    problem: {
      type: Object
    },
    official: {
      type: Boolean
    }
  },
  data() {
    return {
      ordinalNumbers: ["First", "Second", "Third", "Fourth", "Fifth"],
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      wrong: false,
      mathInputFocusStyle: null,
      reportError: false,
      processingResult: ""
    }
  },
  computed: {
    ...mapGetters({
      userStats: 'UserStats',
      submitData: 'ProblemMetaData'
    }),

    // multipleOptions, true if problem type is mc (multiple choice) or ms (multiple select)
    multipleOptions: function() {
      return this.problem.problemType === "mc" || this.problem.problemType === "ms";
    },

    // problemText, creates problem text to be actually displayed
    problemText: function() {
      if (this.multipleOptions) {
        return this.problem.problemText.split("||||||||||")[0];
      } else {
        return this.problem.problemText;
      }
    },

    // mcOptions, creates multiple choice options from problem text
    mcOptions: function() {
      if (this.multipleOptions) {
        return this.problem.problemText.split("||||||||||")[1].split("|||||");
      } else {
        return null;
      }
    },

    // otherFociList, creates "Also Includes: ..." string from otherFoci list
    otherFociList: function() {
      // Returns null if no other foci
      if (this.problem.otherFoci.length === 0) {
        return null;
      }

      let string = "Also Includes: ";
      // Iterates through each focus and concatenates to return string, with filler words depending on where it is in the array
      for (let i = 0; i < this.problem.otherFoci.length; i++) {
        string += this.problem.otherFoci[i];
        if (i === 0 && this.problem.otherFoci.length === 2) {
          string += " and ";
        } else if (i < this.problem.otherFoci.length - 2 && this.problem.otherFoci.length > 2) {
          string += ", ";
        } else if (i === this.problem.otherFoci.length - 2) {
          string += ", and ";
        }
      }
      return string;
    },

    // algebraicAnswer, returns boolean testing whether or not the problem's answer is algebraic or not
    algebraicAnswer: function() {
      // Call testAlgebraic from store function to determine if answer is algebraic
      return this.$store.functions.testAlgebraic(this.problem.answer);
    },

    // focusStats, returns user's current stats for problem's focus
    focusStats: function() {
      let self = this;

      // Return 0s if topic does not match any user stats topics
      let topicStats = this.userStats.topic_stats.filter(function(topic) {return topic.topic === self.problem.topic});
      if (topicStats.length === 0) {
        return {xp: 0, streak: 0};
      }

      // Return 0s if focus does not match any user stats focuses
      let focusStats = topicStats[0].focus_stats.filter(function(focus) {return focus.focus === self.problem.mainFocus});
      if (focusStats.length === 0) {
        return {xp: 0, streak: 0};
      }

      // Normal return if no errors
      return focusStats[0];
    },

    // topicStatsXP, calculates xp that should be shown on topic progress bar
    topicStatsXP: function() {
      let self = this;

      // Gets user's current stats for problem's topic
      let xp = this.userStats.topic_stats.filter(function(topic) {return topic.topic === self.problem.topic});

      // Return 0 if topic does not match any user stats topics
      if (xp.length === 0) {
        return 0;
      }

      xp = xp[0].xp;

      // Logic to calculate what new xp will be when processing result to ensure progress bar updates right when result is shown (rather than being delayed to when user stats are updated)
      if (this.processingResult === "correct" && this.focusStats.streak > 0 && (this.focusStats.streak + 1) % 5 === 0) {
        return xp + Math.floor(1.2*(this.focusStats.xp+this.problem.difficulty*(4-this.pastAnswers.length))) - this.focusStats.xp;
      } else if (this.processingResult === "correct") {
        return xp + this.problem.difficulty*(4-this.pastAnswers.length);
      } else if (this.processingResult === "incorrect" && this.focusStats.streak < 0 && (this.focusStats.streak - 1) % 3 === 0) {
        return xp - this.focusStats.xp + parseInt(0.8*this.focusStats.xp);
      } else {
        return xp;
      }
    },

    // focusStatsXP, calculates xp that should be shown on focus progress bar
    focusStatsXP: function() {
      // Logic to calculate what new xp will be when processing result to ensure progress bar updates right when result is shown (rather than being delayed to when user stats are updated)
      if (this.processingResult === "correct" && this.focusStats.streak > 0 && (this.focusStats.streak + 1) % 5 === 0) {
        return this.focusStats.xp + Math.floor(1.2*(this.focusStats.xp+this.problem.difficulty*(4-this.pastAnswers.length)));
      } else if (this.processingResult === "correct") {
        return this.focusStats.xp + this.problem.difficulty*(4-this.pastAnswers.length);
      } else if (this.processingResult === "incorrect" && this.focusStats.streak < 0 && (this.focusStats.streak - 1) % 3 === 0) {
        return parseInt(0.8*this.focusStats.xp);
      } else {
        return this.focusStats.xp;
      }
    }
  },
  methods: {
    // reportErrorPressed, shows ReportError popup
    reportErrorPressed: function() {
      this.reportError = true;
    },

    // reportErrorClose, closes ReportError popup
    reportErrorClose: function() {
      this.reportError = false;
    }
  }
}

</script>

<style scoped>

  /* General styling */
  #problem {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .content {
    border: 1px solid rgba(17, 21, 33, 0.4);
    padding: 35px;
    font-size: 14px;
    color: rgb(29,34,41);
    background: white;
    position: relative;
    width: 100%;
    box-sizing: border-box;
    margin-top: 20px;
    font-family: 'Nunito', sans-serif;
  }

  /* Reported errors warning styling */
  .reported-errors {
    position: absolute;
    padding: 5px;
    z-index: 100;
    left: 0;
    top: -33px;
    font-family: "Montserrat", sans-serif;
    border-top: 1px solid black;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    height: 20px;
  }

  .reported-errors .fa {
    margin-right: 6px;
  }

  .reported-errors div {
    overflow: hidden;
    display: block;
  }

  .reported-errors div:not(.num) {
    font-size: 12px;
    margin-left: 3px;
    width: 0;
    margin-top: 2px;
    transition: width .3s ease;
  }

  .reported-errors:hover div:not(.num) {
    width: 260px;
  }

  /* Progress bars styling */
  #progress-bars {
    height: 120px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  #progress-bars > div {
    border: 1px solid #285380;
    height: 100%;
    width: 49%;
  }

  #progress-bars .focus {
    border: 1px solid rgba(56, 100, 155, 0.8);
  }

  #progress-bars h4 {
    font-family: "Antic", sans-serif;
    font-style: italic;
    background: #285380;
    color: white;
    height: 35px;
    line-height: 35px;
    padding-left: 15px;
    font-size: 19px;
    margin: 0;
  }

  #progress-bars .focus h4 {
    background: rgba(56, 100, 155, 0.8);
  }

  #progress-bars .progress-bar {
    width: 100%;
  }

  @media only screen and (max-width: 850px) {
    #progress-bars {
      flex-direction: column;
      align-items: center;
    }

    #progress-bars > div {
      width: calc(100% - 2px);
    }
  }

  /* Summary styling */
  #summary {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    padding: 7.5px 15px;
    justify-content: space-around;
    font-style: italic;
    margin-bottom: 17px;
    margin-top: -5px;
    background: rgba(56, 100, 155, 0.1);
    box-shadow: 0 0 8px 1px rgba(56, 100, 155, 0.3);
  }

  #summary > div {
    margin: 7.5px 0;
    text-align: center;
  }

  #summary .topic {
    margin-right: 8px;
  }

  #summary .focus {
    margin-left: 8px;
  }

  #summary .secondary-focus {
    font-size: 13px;
  }


  /* Hints, student previous answers, problem text and button styling */
  #hints {
    margin-top: 10px;
    margin-bottom: 50px;
  }

  #student-answers .incorrect {
    color: red;
  }

  #answer-container .expecting {
    margin: 10px 0 0 30px;
    display: inline-block;
    font-size: 10px;
    color: #285380;
    font-family: "Montserrat", sans-serif;
  }

  .flex.row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  #problem-text {
    line-height: 30px;
    color: rgb(29, 34, 41);
    font-weight: lighter;
  }

  #diagram {
    width: 100%;
    overflow: auto;
  }

  /* Multiple Choice */
  #mc-options .option {
    font-size: 13px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: #0e5481;
    cursor: pointer;
    padding: 12px 0 12px 25px;
    border-radius: 5px;
    transition: background .3s ease, padding .3s ease;
    margin: 1px 0;
  }

  #mc-options .option:hover {
    background: rgba(55, 128, 189, 0.1);
    padding-left: 35px;
  }

  #mc-options .option.active .shape {
    background: #0e5481;
    color: white;
  }

  #mc-options .shape {
    width: 20px;
    height: 20px;
    font-size: 11px;
    background: transparent;
    border: 2px solid #0e5481;
    display: inline-block;
    margin-right: 10px;
    text-align: center;
    line-height: 20px;
    vertical-align: middle;
    transition: background .3s ease, color .3s ease;
  }

  #mc-options .circle {
    border-radius: 50%;
  }

  #mc-options .square {
    border-radius: 3px;
  }

  .flex.problem .buttons {
    margin-left: 30px;
    margin-top: -16px;
    width: 250px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .flex.problem .buttons .button {
    margin-bottom: 10px;
  }

  .button.disabled {
    pointer-events: none;
    opacity: 0.3;
  }

  .hint {
    overflow: hidden;
    background: rgba(197, 210, 255, 0.6);
    color: rgba(40, 83, 128, 0.71);
    box-shadow: -0.1px 0 10px rgba(120, 120, 120, 0.5);
    padding: 12px 20px;
    box-sizing: border-box;
    margin: 20px 85px 20px 30px;
    font-size: 13px;
  }

  #previous-answers {
    font-size: 11px;
    font-style: italic;
    margin-left: 30px;
    position: relative;
    top: -10px;
    color: #ff6469;
  }

  #answer-container {
    width: 500px;
  }

  .math-input {
    border: 1px solid rgba(40, 46, 91, 0.4);
    border-radius: 5px;
    outline: none;
    padding: 3px 0 3px 12px;
    line-height: 20px;
    transition: box-shadow .3s ease;
    cursor: text;
  }

  @media only screen and (max-width: 850px) {
    #answer-container {
      width: 100%;
    }

    .flex.row {
      flex-direction: column;
    }

    .flex.problem .buttons {
      margin-top: 20px;
    }
  }

  /* Result and solution styling */
  #result div {
    width: calc(100% + 70px);
    width: -moz-calc(100% + 70px);
    width: -webkit-calc(100% + 70px);
    margin: -35px 35px 35px -35px;
    height: 60px;
    font-weight: 900;
    font-size: 20px;
    font-family: 'Nunito', sans-serif;
    font-style: italic;
    vertical-align: middle;
    line-height: 60px;
    border-bottom: 1px solid #111521;
    box-shadow: 0 0 10px rgba(39, 43, 80, 0.61) inset;
    color: #111521;
  }

  #result #correct {
    border-bottom: 1px solid rgb(5, 178, 0);
    box-shadow: 0 0 10px rgba(5, 178, 0, 0.6) inset;
    color: rgb(5, 178, 0);
  }

  #result #incorrect {
    border-bottom: 1px solid #ff6469;
    box-shadow: 0 0 10px rgb(255, 207, 209) inset;
    color: #ff6469;
  }

  #result div .fa {
    font-size: 35px;
    height: 100%;
    margin-left: 40px;
    line-height: 45px;
    vertical-align: middle;
    padding-top: 8px;
    margin-right: 15px;
  }

  #student-answers div {
    background: rgba(255, 207, 209, 0.6);
    color: #ff6469;
    font-size: 12px;
    padding: 15px;
    margin: 10px 100px 20px 50px;
    box-shadow: -0.1px 0 10px rgba(120, 120, 120, 0.5);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  #student-answers .correct {
    background: rgba(191, 218, 197, 0.6);
    color: rgb(5, 178, 0);
  }

  #student-answers .gave-up {
    background: rgba(39, 43, 80, 0.2);
    color: #111521;
  }

  #answer {
    font-style: italic;
    font-size: 16px;
    margin-top: 40px;
    color: green;
  }

  #answer .correct {
    color: green;
  }

  #solution-text {
    margin-top: 25px;
    border: 1px solid #111521;
    padding: 15px;
  }

  .solution.buttons {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  /* Next button styling */
  #next {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: right;
    border-radius: 0;
    border: none;
    background: rgba(56, 100, 155, 0.05);
    padding-right: 80px;
    padding-top: 8px;
    padding-bottom: 8px;
    cursor: pointer;
    color: #111521;
    font-size: 16px;
    font-family: 'Montserrat', sans-serif;
    font-style: italic;
    font-weight: 500;
    transition: background .4s ease;
  }

  #next .arrow {
    position: absolute;
    top: 5px;
    right: 80px;
    width: 25px;
    height: 25px;
    opacity: 0;
    transition: right .3s ease .1s, opacity .3s ease 0s;
  }

  #next .arrow div {
    position: absolute;
    background: #111521;
    height: 1.25px;
  }

  #next .arrow div:nth-child(1) {
    top: 11.5px;
    left: 0;
    width: 25px;
  }

  #next .arrow div:nth-child(2) {
    right: -0.7px;
    top: 7.5px;
    width: 15px;
    transform: rotate(35deg);
  }

  #next .arrow div:nth-child(3) {
    right: -0.7px;
    bottom: 7.8px;
    width: 15px;
    transform: rotate(-35deg);
  }

  #next:hover .arrow {
    right: 45px;
    opacity: 1;
    transition: right .3s ease, opacity .3s ease .1s;
  }

  #next:hover {
    background: rgba(56, 100, 155, 0.1);
  }

  /* Source styling */
  .source {
    color: rgb(29,34,41);
    font-family: "Montserrat", sans-serif;
    font-size: 13px;
    align-self: flex-start;
    margin-top: 8px;
  }

</style>

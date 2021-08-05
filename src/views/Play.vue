<template>
  <div class = "container">
    <!-- Menus -->
    <Menu />
    <User />

    <!-- Content -->
    <div class = "content" v-bind:style = "{minHeight: $store.getters.WindowHeight + 'px'}">
      <div class = "problem-div" ref = "problemDiv">
        <!-- Problem -->
        <Problem v-bind:problem = "problem" v-if = "problem !== null" v-bind:official = "$route.params.problem === undefined" class = "problem" />

        <!-- Null problem popup -->
        <div v-else class = "null-problem">
          <div class = "title">
            <!-- Title -->
            <h3>No Problem Available</h3>

            <!-- No problem to show (only shows if no specific problem is being requested) -->
            <p v-if = "$route.params.problem === undefined">You have completed all the problems in your current setup. To continue solving problems go to <router-link to = "/setup" class = "link">Problem Setup</router-link> and change your problem criteria.</p>

            <!-- Problem does not exist (shows if problem is being requested but could not be found) -->
            <p v-else>The problem you are trying to render could not be found. Try searching using a different problem id.</p>
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
  import axios from 'axios';

  export default {
    name: "Play",
    components: {
      Menu,
      User,
      Problem
    },
    data() {
      return {
        // problemUnofficial, stores problem if specific one requested
        problemUnofficial: {
          problemID: null,
          problemText: "",
          diagram: "",
          answer: "",
          solution: "",
          hintOne: "",
          hintTwo: null,
          difficulty: null,
          topic: "",
          topicName: "",
          mainFocus: "",
          mainFocusName: "",
          otherFoci: [],
        }
      }
    },
    computed: {
      // problem, returns "CurrProblem" from store if no problem requested (get only), otherwise returns unoffiical problem from request (get and set)
      problem: {
        get() {
          if (this.$route.params.problem === undefined) {
            return this.$store.getters.CurrProblem;
          } else {
            return this.problemUnofficial;
          }
        },
        set(value) {
          if (this.$route.params.problem !== undefined) {
            this.problemUnofficial = value;
          }
        }
      }
    },
    methods: {

    },
    mounted() {
      let self = this;

      // If problem param provided, then use it to request specific problem (based on param)
      if (this.$route.params.problem !== undefined) {

        // API GET request to /problem with problemID (from route param) as param (and then set current problem based on response data)
        axios.get('wp-json/physics_genie/problem/' + this.$route.params.problem, {headers: {'Authorization': 'Bearer ' + this.$store.getters.Token}}).then((response) => {
          // If no response, set problem to null
          if (response.data === "") {
            self.problem = null;
          } else {
            // Change other_foci character string into foci array of actual focus names (from ProblemMetaData)
            let foci = [];
            if (response.data.other_foci !== null) {
              response.data.other_foci.split("").forEach(function(otherFocus) {
                foci.push(self.$store.getters.ProblemMetaData.focuses.filter(function(focus) {return focus.focus === otherFocus})[0].name);
              });
            }

            // Change source from id to actual source name
            let source = null;
            if (self.$store.getters.ProblemMetaData.sources.filter(function(source) {return source.source_id === response.data.source}).length > 0) {
              source = self.$store.getters.ProblemMetaData.sources.filter(function(source) {return source.source_id === response.data.source})[0];
            }

            // Set problem values from GET request response data
            self.problem = {
              problemID: response.data.problem_id,
              problemText: response.data.problem_text.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
              diagram: (response.data.diagram === null) ? null : response.data.diagram.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
              answer: response.data.answer.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
              mustMatch: response.data.must_match === "1",
              error: response.data.error,
              solution: response.data.solution.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
              solutionDiagram: (response.data.solution_diagram === null) ? null : response.data.solution_diagram.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
              hintOne: response.data.hint_one.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
              hintTwo: (response.data.hint_two === null) ? null : response.data.hint_two.replace(/\\\\/g, "\\").replace(/\\"/g, "'"),
              difficulty: response.data.difficulty,
              topic: response.data.topic,
              topicName: self.$store.getters.ProblemMetaData.topics.filter(function(topic) {return topic.topic === response.data.topic})[0].name,
              mainFocus: response.data.main_focus,
              mainFocusName: self.$store.getters.ProblemMetaData.focuses.filter(function(focus) {return focus.focus === response.data.main_focus})[0].name,
              otherFoci: foci,
              source: source,
              problemNumber: response.data.number_in_source
            };
          }
        });
      }
    }
  }
</script>

<style scoped>

  /* General sytling */
  .content {
    width: 100%;
    height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 100px 0 75px 0;
    box-sizing: border-box;
  }

  @media only screen and (max-width: 700px) {
    .content {
      padding: 115px 0 75px 0;
    }
  }

  /* Problem styling */
  .problem-div {
    width: 60%;
    margin-left: 50px;
    background-color: white;
    z-index: 0;
    padding: 60px 50px;
    border-radius: 50px;
  }

  @media only screen and (max-width: 1050px) {
    .problem-div {
      width: 70%;
      margin-left: 95px;
      padding: 50px 40px;
    }
  }

  @media only screen and (max-width: 700px) {
    .problem-div {
      width: 80%;
      margin-left: 0;
    }
  }

  @media only screen and (max-width: 550px) {
    .problem-div {
      padding: 40px 35px;
    }
  }

  /* Null problem styling */
  .null-problem .title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .null-problem h3 {
    font-family: "Antic", sans-serif;
    font-size: 35px;
    padding: 0 15% 10px 15%;
    border-bottom: 1px solid black;
  }

  .null-problem p {
    font-family:"Montserrat", sans-serif;
    font-size: 15px;
    margin-top: 15px;
    text-align: center;
    width: 60%;
    line-height: 24px;
  }

  .null-problem .link {
    color: #6589ff;
    cursor: pointer;
  }

  .null-problem .link:hover {
    color: #99A1E3;
  }

  .null-problem .link::after {
    bottom: -2.5px;
  }

</style>

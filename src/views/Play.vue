<template>
  <div class = "container">
    <Menu />
    <User />
    <div class = "content" v-bind:style = "{minHeight: windowHeight + 'px'}">
      <div class = "problem-div" ref = "problemDiv">
        <Problem v-bind:problem = "problem" v-if = "problem !== null" v-bind:official = "$route.params.problem === undefined" class = "problem" />
        <div v-else class = "null-problem">
          <div class = "title">
            <h3>No Problem Available</h3>
            <p v-if = "$route.params.problem === undefined">You have completed all the problems in your current setup. To continue solving problems go to <router-link to = "/setup" class = "link">Problem Setup</router-link> and change your problem criteria.</p>
            <p v-else>The problem you are trying to render could not be found. Try searching using a different problem id.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

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
        windowHeight: window.innerHeight,
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

      if (this.$route.params.problem !== undefined) {

        axios.get('http://physicsgenie.ga/wp-json/physics_genie/problem/' + this.$route.params.problem, {headers: {'Authorization': 'Bearer ' + this.$store.getters.Token}}).then((response) => {
          if (response.data === "") {
            self.problem = null;
          } else {
            let foci = [];
            if (response.data.other_foci !== null) {
              response.data.other_foci.split("").forEach(function(otherFocus) {
                foci.push(self.$store.getters.ProblemMetaData.focuses.filter(function(focus) {return focus.focus === otherFocus})[0].name);
              });
            }

            let source = null;

            if (self.$store.getters.ProblemMetaData.sources.filter(function(source) {return source.source_id === response.data.source}).length > 0) {
              source = self.$store.getters.ProblemMetaData.sources.filter(function(source) {return source.source_id === response.data.source})[0];
            }

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


    },
    created() {

    }
  }
</script>

<style scoped>

  .container {
    /*padding: 50px 0;*/
    /*box-sizing: border-box;*/
  }

  .content {
    width: 100%;
    height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 100px 0 75px 0;
    box-sizing: border-box;
  }

  .problem-div {
    width: 55%;
    margin-left: 50px;
    background-color: white;
    z-index: 1;
    padding: 60px;
    border-radius: 50px;
  }

  .null-problem {

  }

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

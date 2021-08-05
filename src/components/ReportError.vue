<template>
  <div id = "report-error">
    <div class = "content">
      <div class = "header">
        <h2>Report Error</h2>
        <div class = "buttons">
          <button class = "button orange submit" v-on:click = "submit" v-bind:class = "(errorLocation !== '' && (errorType !== '' || errorLocation === 'Problem Repeat' || (errorLocation === 'Other' && errorMessage !== ''))) ? '' : 'disabled'">Submit</button>
          <button class = "close button" v-on:click = "close">Close</button>
        </div>
      </div>
      <div class = "inner-content">
        <div class = "location category">
          <h4>Error Location</h4>
          <div class = "options">
            <div class = "option" v-for = "location in possibleErrorTypes" v-bind:key = "location.location" v-bind:class = "errorLocation === location.location ? 'active' : ''" v-on:click = "changeLocation(location.location)">
              <div class = "circle"></div>
              <span>{{ location.location }}</span>
            </div>
          </div>
        </div>
        <div class = "type category" v-if = "possibleErrorTypes.filter(function(location) {return location.location === errorLocation}).length > 0 && errorLocation !== 'Other' && errorLocation !== 'Problem Repeat'">
          <h4>Error Type</h4>
          <div class = "options">
            <div class = "option" v-for = "type in possibleErrorTypes.filter(function(location) {return location.location === errorLocation})[0].types" v-bind:key = "type" v-bind:class = "errorType === type ? 'active' : ''" v-on:click = "changeType(type)">
              <div class = "circle"></div>
              <span>{{ type }}</span>
            </div>
          </div>
        </div>
        <div v-if = "$store.getters.WindowWidth > 990" class = "explanation">
          <h4>Error Explanation</h4>
          <textarea v-model = "errorMessage"></textarea>
        </div>
      </div>
      <div v-if = "$store.getters.WindowWidth <= 990" class = "explanation">
        <h4>Error Explanation</h4>
        <textarea v-model = "errorMessage"></textarea>
      </div>
    </div>
  </div>
</template>

<script>

  import axios from 'axios';

  export default {
    name: "ReportError",
    props: {
      problemID: null
    },
    data() {
      return {
        possibleErrorTypes: [
          {
            location: "Problem Repeat",
            types: []
          },
          {
            location: "Metadata",
            types: ["Difficulty Mismatch", "Topic Mismatch", "Focus(es) Mismatch", "Not Found/Render Issue", "Other"]
          },
          {
            location: "Problem Text",
            types: ["Unclear", "Grammatical/Spelling Error", "Diagram Issue", "LaTeX/Render Issue", "Other"]
          },
          {
            location: "Answer",
            types: ["Units Unspecified", "Evaluation Issue", "Input Issue", "Other"]
          },
          {
            location: "Solution",
            types: ["Unclear", "Grammatical/Spelling Error", "Diagram Issue", "LaTeX/Render Issue", "Other"]
          },
          {
            location: "Other",
            types: []
          }
        ],
        errorLocation: "",
        errorType: "",
        errorMessage: ""
      }
    },
    methods: {
      changeLocation: function(location) {
        this.errorLocation = location;
        this.errorType = "";
      },
      changeType: function(type) {
        this.errorType = type;
      },
      submit: async function() {

        this.$store.commit('setProcessing', true);
        await axios.post("wp-json/physics_genie/report-problem-error", {
          problem_id: this.problemID,
          error_location: this.errorLocation,
          error_type: this.errorType,
          error_message: this.errorMessage
        }, {headers: {'Authorization': 'Bearer ' + this.$store.getters.Token}});
        this.$store.commit('setProcessing', false);
        this.$store.dispatch('Confirmation', "Error successfully reported");
        this.$emit("close");

      },
      close: function() {
        if (confirm("Are you sure you would like to exit? Your current error report will be lost.")) {
          this.$emit("close");
        }
      }
    }
  }
</script>

<style scoped>

  #report-error {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 5;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 6% 0;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .content {
    position: relative;
    background: white;
    width: calc(80% - 75px);
    margin-left: 75px;
    min-width: 500px;
    max-width: 1000px;
    padding: 30px 50px 50px 50px;
    border-radius: 25px;
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    align-items: stretch;
    transition: opacity .3s ease, top .3s ease;
  }

  .content .header {
    width: 100%;
    padding: 10px 5px 0 5px;
    border-bottom: 1px solid rgba(17, 21, 33, 0.51);
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }

  h2 {
    font-size: 50px;
    font-family: "Nanum Gothic", sans-serif;
    font-weight: 500;
    margin-bottom: 15px;
  }

  .buttons {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .buttons .button {
    padding: 0 15px;
    height: 50px;
    box-sizing: border-box;
    transition: color .25s ease;
  }

  .buttons .button:nth-child(2) {
    margin-left: 25px;
  }

  .button.disabled {
    pointer-events: none;
    opacity: 0.3;
  }

  h4 {
    font-family: "Nunito", sans-serif;
    font-size: 18px;
    font-weight: lighter;
  }

  .inner-content {
    margin-left: 20px;
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .location {
    width: 21%;
  }

  .type {
    width: 28%;
  }

  .options {
    margin-left: 2px;
    margin-top: 5px;
  }

  .options .option {
    font-size: 13px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: #15233b;
    cursor: pointer;
    padding: 3px 0 3px 8px;
    border-radius: 5px;
    transition: background .3s ease, padding .3s ease;
    margin: 1px 0;
  }

  .options .option:hover {
    background: rgba(55, 128, 189, 0.1);
    padding-left: 15px;
  }

  .options .option.active .circle {
    background: #15233b;
    transition: background .3s ease;
  }

  .options .circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: transparent;
    border: 2px solid #15233b;
    display: inline-block;
    margin-right: 6px;
  }

  .explanation {
    margin-left: 5px;
    width: calc(52% - 25px);
  }

  textarea {
    border: 1px solid rgba(17, 21, 33, 0.51);
    padding: 10px;
    box-sizing: border-box;
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    height: 140px;
    width: 100%;
    color: rgb(29, 34, 41);
    margin: 0;
    resize: vertical;
    outline: none;
    transition: border .15s ease, box-shadow .15s ease;
  }

  textarea:focus {
    border: 1px solid rgba(29, 34, 41, 0.61);
    box-shadow: 0 0 10px 0 rgba(29, 34, 41, 0.61);
  }

  @media only screen and (max-width: 990px) {
    #report-error {
      padding: 100px 0;
    }

    .content {
      margin-left: 100px;
      width: calc(90% - 100px);
      min-width: 0;
    }

    .location {
      width: 45%;
    }

    .type {
      width: 55%;
    }

    .explanation {
      margin: 15px 0 0 20px;
      width: 90%;
    }
  }

  @media only screen and (max-width: 700px) {
    #report-error {
      padding: 120px 0 20px 0;
    }

    .content {
      margin: 0;
      width: 90%;
    }
  }

  @media only screen and (max-width: 500px) {
    .inner-content {
      flex-direction: column;
    }

    .type {
      margin-top: 15px;
      width: 90%;
    }

    .location {
      width: 90%;
    }
  }

</style>

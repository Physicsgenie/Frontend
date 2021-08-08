<template>
  <div class = "container">
    <!-- Menus -->
    <Menu />
    <User />

    <div class = "flex-container">
      <!-- Content -->
      <div class = "content">

        <!-- Title -->
        <h2>Problem Setup</h2>

        <!-- Inner content -->
        <div class = "inner-content">

          <!-- Selectors -->
          <div class = "selectors box">

            <!-- Topics selector -->
            <div class = "topics selector">
              <label>Topics</label>
              <v-select placeholder = "Select the topics you would like to practice" label = "name" :options = "submitData.topics" :reduce = "topic => topic.topic" v-model = "userSetup.topics" multiple></v-select>
              <button v-on:click = "addAllTopics" class = "add-all"><i class = "fa fa-plus"></i>Add All Topics</button>
              <button v-on:click = "removeAllTopics" class = "remove-all"><i class = "fa fa-minus"></i>Remove All Topics</button>
            </div>

            <!-- Foci selector -->
            <div class = "foci selector">
              <label>Focuses</label>
              <v-select placeholder = "Select the focuses you would like to practice" label = "name" :options = "submitData.focuses" :reduce = "focus => focus.focus" v-model = "userSetup.foci" multiple></v-select>
              <button v-on:click = "addAllFoci" class = "add-all"><i class = "fa fa-plus"></i>Add All Focuses</button>
              <button v-on:click = "removeAllFoci" class = "remove-all"><i class = "fa fa-minus"></i>Remove All Focuses</button>
            </div>
          </div>

          <!-- Second box (multiple choice) -->
          <div class = "box box-two">

            <!-- Difficulty -->
            <div class = "difficulty">
              <p>Difficulty</p>
              <div class = "options">
                <div class = "option" v-bind:class = "userSetup.difficulty === '0' ? 'active' : ''" v-on:click = "changeDifficulty('0')">
                  <div class = "circle"></div>
                  <span>Easy</span>
                </div>
                <div class = "option" v-bind:class = "userSetup.difficulty === '1' ? 'active' : ''" v-on:click = "changeDifficulty('1')">
                  <div class = "circle"></div>
                  <span>Medium (Default)</span>
                </div>
                <div class = "option" v-bind:class = "userSetup.difficulty === '2' ? 'active' : ''" v-on:click = "changeDifficulty('2')">
                  <div class = "circle"></div>
                  <span>Hard</span>
                </div>
              </div>
            </div>

            <!-- Calculus -->
            <div class = "calculus">
              <p>Calculus</p>
              <div class = "options">
                <div class = "option" v-bind:class = "userSetup.calculus ? 'active' : ''" v-on:click = "changeCalculus(true)">
                  <div class = "circle"></div>
                  <span>Allowed (Default)</span>
                </div>
                <div class = "option" v-bind:class = "!userSetup.calculus ? 'active' : ''" v-on:click = "changeCalculus(false)">
                  <div class = "circle"></div>
                  <span>None</span>
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class = "buttons">
              <div id = "clear" class = "button" v-on:click = "reset()">Reset Changes</div>
              <div id = "save" class = "button red" v-on:click = "push()">Apply Changes</div>
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
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import axios from 'axios';

export default {
  name: "Setup",
  components: {
    Menu,
    User,
    vSelect
  },
  computed: {
    // userSetup, map to "UserSetup" from store (get and set)
    userSetup: {
      get() {
        return this.$store.getters.UserSetup;
      },
      set(value) {
        this.$store.commit('setUserSetup', value);
      }
    },

    // submitData, map to "ProblemMetaData" from store (get only)
    submitData: {
      get() {
        return this.$store.getters.ProblemMetaData;
      }
    }
  },
  methods: {
    // addAllTopics, add all topics to current topics list
    addAllTopics: function() {
      let self = this;
      // Loops through all possible topics
      this.submitData.topics.forEach(function(topic) {
        // Tests if possible topic is already in current topics list, and if it's not, appends it to list
        if (!self.userSetup.topics.includes(topic.topic)) {
          self.userSetup.topics.push(topic.topic);
        }
      });
    },

    // removeAllTopics, remove all topics from current topics list
    removeAllTopics: function() {
      this.userSetup.topics.splice(0, this.userSetup.topics.length);
    },

    // addAllFoci, add all foci to current foci list
    addAllFoci: function() {
      let self = this;
      // Loops through all possible foci
      this.submitData.focuses.forEach(function(focus) {
        // Tests if possible focus is already in current foci list, and if it's not, appends it to list
        if (!self.userSetup.foci.includes(focus.focus)) {
          self.userSetup.foci.push(focus.focus);
        }
      });
    },

    // removeAllFoci, remove all foci from current foci list
    removeAllFoci: function() {
      this.userSetup.foci.splice(0, this.userSetup.foci.length);
    },

    // changeDifficulty (difficulty => new difficulty value), changes difficulty to new value
    changeDifficulty: function(difficulty) {
      this.userSetup.difficulty = difficulty;
    },

    // changeCalculus (calculus => new calculus value), changes calculus to new value
    changeCalculus: function(calculus) {
      this.userSetup.calculus = calculus;
    },

    // reset, resets changed user settings to what is saved in database
    reset: function() {
      // Confirm reset
      if (confirm("Are you sure you would like to reset all your current changes? This cannot be undone and will revert your settings to your previous push.")) {
        let self = this;
        this.$store.commit('setProcessing', true);
        this.$store.dispatch('GetUserInfo').then(() => {
          self.$store.commit('setProcessing', false);
          self.$store.dispatch('Confirmation', "Problem settings successfully reverted");
        });
      }
    },

    // push, pushes changed user settings to database
    push: function() {
      // Confirm push
      if (confirm("Are you sure you would like to push your current changes? This cannot be undone and will effect the types of problems you receive.")) {
        let self = this;
        this.$store.commit('setProcessing', true);

        // API PUT request to /user-setup with new user settings as params
        axios.put('wp-json/physics_genie/user-setup', {
          curr_diff: this.userSetup.difficulty,
          curr_topics: this.userSetup.topics.toString().replace(/,/g, ''),
          curr_foci: this.userSetup.foci.toString().replace(/,/g, ''),
          calculus: this.userSetup.calculus ? "true" : "false"
        }, {headers: {'Authorization': 'Bearer ' + this.$store.getters.Token}}).then(() => {
          // If no current problem, then set current problem with current user settings
          if (self.$store.getters.CurrProblem === null) {
            self.$store.dispatch('GetCurrProblem');
          }
          self.$store.commit('setProcessing', false);
          self.$store.dispatch("Confirmation", "Problem settings successfully pushed")
        });
      }
    }
  }
}

</script>

<style scoped>

/* General styling */
.flex-container {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  flex-direction: column;
  font-family: "Nunito", sans-serif;
  padding-top: 100px;
}

.content {
  width: 70%;
  box-sizing: border-box;
  margin-left: 60px;
  border: 1px solid #cccccc;
  border-radius: 20px;
  padding: 50px;
  margin-bottom: 100px;
  background: white;
  position: relative;
  top: 0;
  box-shadow: 0 0 10px 4px rgba(17, 21, 33, 0.3);
}

.content h2 {
  font-family: "Antic", sans-serif;
  font-size: 40px;
  margin-bottom: 30px;
}

@media only screen and (max-width: 700px) {
  .flex-container {
    padding-top: 115px;
  }

  .content {
    width: 90%;
    padding: 40px;
    margin-left: 0;
  }
}

/* Inner content styling */
.inner-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}

.box {
  border: 1px solid rgba(204, 204, 204, 0.8);
  width: 48.5%;
  padding: 15px 20px 25px 25px;
  box-sizing: border-box;
  border-radius: 16px;
  position: relative;
  box-shadow: 0 0 8px 0.5px rgba(17, 21, 33, 0.1);
  transition: box-shadow .3s ease;
}

@media only screen and (max-width: 990px) {
  .inner-content {
    flex-direction: column;
  }

  .box {
    width: 97%;
    margin-bottom: 35px;
  }
}

/* Selectors styling */
.selector:first-child {
  margin-bottom: 20px;
}

.selector label {
  font-size: 18px;
}

.v-select {
  margin-top: 3px;
  font-size: 14px;
}

.selected .vs__selected {
  background-color: #99A1E3;
  color: #285380;
}

.add-all {
  background: none;
  border: 1px solid #285380;
  border-radius: 15px;
  cursor: pointer;
  padding: 3px 6px;
  color: #285380;
  margin-right: 10px;
  margin-top: 8px;
  font-size: 10px;
  transition: font-weight .2s ease;
}

.add-all .fa {
  margin-right: 3px;
}

.add-all:hover {
  font-weight: 900;
}

.remove-all {
  background: none;
  border: 1px solid #ff6469;
  border-radius: 15px;
  cursor: pointer;
  padding: 3px 6px;
  color: #ff6469;
  margin-top: 8px;
  font-size: 10px;
  transition: font-weight .2s ease;
}

.remove-all .fa {
  margin-right: 3px;
}

.remove-all:hover {
  font-weight: 900;
}

/* Multiple choice styling */
.content p {
  font-size: 18px;
  margin-bottom: 6px;
}

.options {
  margin-left: 2px;
}

.options .option {
  font-size: 13px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: #285380;
  cursor: pointer;
  padding: 3px 0 3px 12px;
  border-radius: 5px;
  transition: background .3s ease, padding .3s ease;
  margin: 1px 0;
}

.options .option:hover {
  background: rgba(55, 128, 189, 0.1);
  padding-left: 15px;
}

.options .option.active .circle {
  background: #285380;
  transition: background .3s ease;
}

.options .circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: transparent;
  border: 2px solid #285380;
  display: inline-block;
  margin-right: 6px;
}

.calculus {
  margin-top: 20px;
}

.buttons {
  position: absolute;
  right: 5px;
  bottom: -70px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.box-two {
  margin-bottom: 70px;
}

.buttons .button {
  font-size: 14px;
}

#save {
  margin-left: 30px;
}

@media only screen and (max-width: 600px) {
  .box-two {
    margin-bottom: 130px;
  }

  .buttons {
    flex-direction: column;
    width: 100%;
    bottom: -130px;
  }

  .buttons .button {
    text-align: center;
    margin-left: 5px;
  }

  #save {
    margin-left: 5px;
    margin-top: 15px;
  }
}

</style>

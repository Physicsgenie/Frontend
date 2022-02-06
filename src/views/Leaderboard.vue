<template>
  <div class = "container">
    <!-- Menus -->
    <Menu />
    <User />

    <!-- Content -->
    <div class = "content">
      <!-- Selectors -->
      <div class = "selectors">
        <!-- Type selector -->
        <div class = "selector" v-bind:class = "{active: type === 0}" v-on:click = "changeType(0)"><p>XP</p></div>
        <div class = "selector" v-bind:class = "{active: type === 1}" v-on:click = "changeType(1)"><p>Problems Correct</p></div>
        <div class = "selector" v-bind:class = "{active: type === 2}" v-on:click = "changeType(2)"><p>Streaks</p></div>
        <div class = "selector submitted" v-bind:class = "{active: type === 3}" v-on:click = "changeType(3)"><p>Problems Submitted</p></div>

        <!-- Range selectors -->
        <div class = "selector range" v-bind:class = "{submittedActive: type === 3}">
          <div v-bind:class = "{active: range === 'all'}" v-on:click = "changeRange('all')">Overall</div>
          <div v-bind:class = "{active: range === 'week'}" v-on:click = "changeRange('week')">Week</div>
        </div>
      </div>

      <!-- Leaderboard -->
      <div class = "leaderboard">
        <h2>{{ type === 0 ? "XP" : (type === 1 ? "Problems Correct" : (type === 2) ? "Streaks" : "Problems Submitted") }} Leaderboard ({{ range === 'all' ? "Overall" : "Week" }})</h2>

        <!-- Filters -->
        <div class = "filters">
          <div v-if = "type === 2" class = "streak-type filter">
            <h6>Streak Type:</h6>
            <select name = "topic" v-on:change = "updateLeaderboardData" v-model = "streakType">
              <option value = "longest_streak">Longest</option>
              <option value = "current_streak">Current</option>
            </select>
          </div>
          <div class = "top filter">
            <h6>Top:</h6>
            <select name = "top" v-on:change = "updateLeaderboardData" v-model = "displayNumber">
              <option v-for = "num in displayNumberPossibilites" v-bind:key = "num" v-bind:value = "num">{{ num }}</option>
            </select>
          </div>
          <div class = "topic filter">
            <h6>Topic:</h6>
            <select name = "topic" v-on:change = "updateLeaderboardData" v-model = "selectedTopic">
              <option value = "all">All</option>
              <option v-for = "topic in submitData.topics" v-bind:key = "topic.name" v-bind:value = "topic.name">{{ topic.name }}</option>
            </select>
          </div>
          <div class = "focus filter">
            <h6>Focus:</h6>
            <select name = "focus" v-on:change = "updateLeaderboardData" v-model = "selectedFocus">
              <option value = "all">All</option>
              <option v-for = "focus in possibleFocuses" v-bind:key = "focus.name" v-bind:value = "focus.name">{{ focus.name }}</option>
            </select>
          </div>
          <div class = "difficulty filter">
            <h6>Difficulty:</h6>
            <select name = "difficulty" v-on:change = "updateLeaderboardData" v-model = "selectedDifficulty">
              <option value = "all">All</option>
              <option value = "easy">Easy</option>
              <option value = "medium">Medium</option>
              <option value = "hard">Hard</option>
            </select>
          </div>
        </div>

        <!-- Table -->
        <div v-if = "processing" class = "processing">
          <h3>Processing</h3>
          <i class = "fa fa-spinner"></i>
        </div>
        <div v-else>
          <div class = "table">
            <div v-if = "leaderboardDataFiltered.length === 0" class = "cell no-users-found">
              <h5>No Users Found</h5>
            </div>
            <div v-else class = "cell">
              <div class = "user"><h3 style = "padding-left: 50px;">User</h3></div>
              <div style = "width: 10%"><h3>Level</h3></div>
              <div style = "width: 10%"><h3>XP</h3></div>
              <div style = "width: 20%" v-if = "type === 0 || type === 1"><h3>Problems Attempted</h3></div>
              <div style = "width: 20%" v-if = "type === 0 || type === 1"><h3>Problems Correct</h3></div>
              <div style = "width: 20%" v-if = "type === 2"><h3>Streak</h3></div>
              <div style = "width: 20%" v-if = "type === 3"><h3>Problems Submitted</h3></div>
            </div>
            <div class = "cell" v-for = "(entry, index) in leaderboardDataFiltered" v-bind:key = "entry.user">
                <div class = "user"><h3><span>{{ index + 1 }}</span>{{ entry.user }}</h3></div>
                <div style = "width: 10%"><h3>{{ Math.floor(Math.sqrt(entry.xp+9))-2 }}</h3></div>
                <div style = "width: 10%"><h3>{{ entry.xp }}</h3></div>
                <div style = "width: 20%" v-if = "type === 0 || type === 1"><h3>{{ entry.num_presented }}</h3></div>
                <div style = "width: 20%" v-if = "type === 0 || type === 1"><h3>{{ entry.num_correct }}</h3></div>
                <div style = "width: 20%" v-if = "type === 2"><h3>{{ streakType === "longest_streak" ? entry.longest_winstreak : entry.streak }}</h3></div>
                <div style = "width: 20%" v-if = "type === 3"><h3>{{ entry.submitted }}</h3></div>
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
import axios from 'axios';

export default {
  name: "Leaderboard",
  components: {
    Menu,
    User
  },
  data() {
    return {
      type: 0,
      types: ["xp", "correct", "streak", "submitted"],
      displayNumberPossibilites: [10, 25, 50, 100],
      displayNumber: 25,
      streakType: "longest_streak",
      range: "all",
      selectedTopic: "all",
      selectedFocus: "all",
      selectedDifficulty: "all",
      leaderboardData: null,
      processing: true
    }
  },
  computed: {
    // submitData, map to "ProblemMetaData" from store (get only)
    submitData: {
      get() {
        return this.$store.getters.ProblemMetaData;
      }
    },

    // leaderboardDataFiltered, leaderboard data with users with no xp (or problems submitted) filtered out
    leaderboardDataFiltered: {
      get() {
        let self = this;
        return this.leaderboardData.slice(0, this.displayNumber).filter(function(entry) {return self.type === 3 ? entry.submitted > 0 : entry.xp > 0});
      }
    },

    // possibleFocuses, focuses that correspond to the current topic
    possibleFocuses: {
      get() {
        let self = this;
        let matchingTopics = this.submitData.topics.filter(function(topic) {return topic.name === self.selectedTopic});
        let topicId = matchingTopics.length > 0 ? matchingTopics[0].topic_id : null;
        return this.submitData.focuses.filter(function(focus) {return focus.topic === topicId});
      }
    }
  },
  methods: {
    // changeType (type => new type value), changes type value after click
    changeType: function(type) {
      this.type = type;
      this.updateLeaderboardData();
    },

    // changeRange (range => new range value), changes range value after click
    changeRange: function(range) {
      this.range = range;
      this.updateLeaderboardData();
    },

    // updateLeaderboardData, re-requests leaderboard data and rerenders it
    updateLeaderboardData: function() {
      let self = this;
      self.processing = true;
      axios.post("wp-json/physics_genie/leaderboard", JSON.stringify({type: self.type === 2 ? self.streakType : self.types[self.type], time: self.range, topic: self.selectedTopic, focus: self.selectedFocus, difficulty: self.selectedDifficulty}), {"Content-Type": "application/json", headers: {'Authorization': 'Bearer ' + self.$store.getters.Token}}).then((response) => {
        self.leaderboardData = JSON.parse(response.data);
        self.processing = false;
      });
    }
  },
  mounted() {
    this.updateLeaderboardData();
  }
}

</script>

<style scoped>

/* General styling */
.content {
  width: calc(80% - 100px);
  position: relative;
  margin: 80px 0 -50px calc(10% + 80px);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

/* Selectors styling */
.selectors {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: center;
}

.selector {
  background: white;
  border-radius: 20px;
  box-shadow: 0 0 10px 4px rgba(17, 21, 33, 0.3);
  border: none;
  display: flex;
  justify-content: center;
  padding: 20px;
  align-items: center;
  transition: box-shadow .3s ease, background .3s ease;
  margin: 20px 20px 0 0;
  height: 80px;
  width: 170px;
  box-sizing: border-box;
  font-size: 15px;
  font-family: "Nunito", sans-serif;
  text-align: center;
  cursor: pointer;
}

.selector.active {
  background: rgb(153, 161, 227);
}

.selector:hover {
  box-shadow: 0 0 10px 10px rgba(17, 21, 33, 0.3);
}

.selector:not(.active):not(.range):hover {
  background: #c4c8f1;
}

.selector.submitted {
  background: #ffd7c9;
}

.selector.submitted.active {
  background: #ff845d;
}

.selector.submitted:not(.active):hover {
  background: #ffb79f;
}

/* Range selectors styling */
.range {
  flex-direction: column;
  padding: 5px 0;
  font-size: 14px;
}

.range div {
  width: 100%;
  padding: 10px 0;
  box-sizing: border-box;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  transition: background .3s ease;
}

.range div:nth-child(1) {
  border-bottom: 1px solid black;
  padding: 11px 0;
  border-radius: 20px 20px 0 0;
}

.range div.active {
  background: rgb(153, 161, 227);
}

.range div:not(.active):hover {
  background: #c4c8f1;
}

.range.submittedActive div {
  background: #ffd7c9;
}

.range.submittedActive div.active {
  background: #ff845d;
}

.range.submittedActive div:not(.active):hover {
  background: #ffb79f;
}

/* Leaderboard styling */
.leaderboard {
  background: white;
  border-radius: 30px;
  box-shadow: 0 0 10px 4px rgba(17, 21, 33, 0.3);
  width: 100%;
  margin-top: 40px;
  margin-bottom: 50px;
  box-sizing: border-box;
  padding: 35px 50px;
}

.leaderboard h2 {
  font-family: "Antic", sans-serif;
  font-size: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid black;
}

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

/* Processing */
.processing {
  width: 100%;
  height: 100px;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: rgba(0, 0, 0, 0.9);
  font-family: "Antic", sans-serif;
  font-size: 30px;
}

.processing .fa {
  margin-left: 15px;
  animation: rotation 2s infinite linear;
}

/* Processing popup animation */
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

.table {
  margin: 0 20px;
  font-family: "Montserrat", sans-serif;
  font-size: 13px;
  font-weight: lighter;
}

.cell {
  width: 100%;
  height: 60px;
  border-top: 1px solid black;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}

.cell .user {
  width: 40%;
  font-size: 14px;
  text-align: left;
}

.cell .user span {
  border-radius: 50%;
  margin-right: 15px;
  border: 1px solid black;
  width: 25px;
  height: 25px;
  display: inline-block;
  font-size: 12px;
  text-align: center;
  line-height: 25px;
}

.cell.no-users-found {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.9);
  font-style: italic;
}

</style>
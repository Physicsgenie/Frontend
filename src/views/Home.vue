<template>
  <div class = "container">
    <!-- Menus -->
    <Menu />
    <User />

    <!-- Content -->
    <div class = "content">
      <!-- Beta version popup -->
      <div class = "box" id = "beta">
        <p>Welcome to the first version of Physics Genie! We have only recently released it so you are among one of the first to use our physics learning platform. We would love to hear your feedback or about any bugs/errors you may experience, which you can relay to us through <a class = "link" href = "https://docs.google.com/forms/d/e/1FAIpQLSf362PWDUIZvtOHSaWGpeSdHx2373O3upKgtgBiVWu5FzBfBQ/viewform?usp=sf_link" target = "_blank">this form</a>. Again, thanks so much and enjoy!</p>
      </div>

      <!-- Profile -->
      <div id = "profile" class = "box">
        <!-- Avatar -->
        <div class = "avatar">
          <i class = "fa fa-user-circle-o img"></i>
          <div class = "change">Change<br>Avatar</div>
        </div>

        <!-- User info -->
        <div class = "profile-info">
          <div class = "username" v-bind:style = "{'box-shadow': editingName ? '0 0 10px 1px rgba(17, 21, 33, 0.3)' : 'none'}"><input v-bind:readonly = "!editingName" v-model = "user" ref = "nameInput"><i v-if = "editingName" class = "fa fa-times cancel" v-on:click = "cancelNameEdit"></i><i class = "fa" v-bind:class = "editingName ? 'fa-check' : 'fa-pencil'" v-on:click = "editName" v-bind:style = "{color: editingName ? 'rgb(5, 178, 0)' : 'black'}"></i></div>
          <div class = "link" v-on:click = "changePassword">Change Password</div>
          <router-link to = "/setup" class = "link">Problem Setup</router-link>
        </div>
      </div>

      <!-- Stats overview -->
      <div id = "overview" class = "box">
        <!-- Level and total XP row -->
        <div class = "row">
          <div>
            <h3>Level</h3>
            <p>{{ Math.floor(Math.sqrt(userStats.xp+9))-2 }}</p>
          </div>
          <div>
            <h3>Total XP</h3>
            <p>{{ userStats.xp }}</p>
          </div>
        </div>

        <!-- Problems attempted row -->
        <div class = "row attempted">
          <div>
            <h3>Problems Attempted</h3>
            <p>{{ userStats.num_completed }}</p>
          </div>
        </div>
      </div>

      <!-- Stats summary -->
      <div id = "summary" class = "box">
        <!-- Problems correct, problems incorrect, and average attempts list -->
        <div class = "summary-info left">
          <div class = "descriptors">
            <div>Problems Correct</div>
            <div>Problems Incorrect</div>
            <div>Average Attempts</div>
          </div>
          <div class = "values">
            <div>{{ userStats.num_correct }}</div>
            <div>{{ userStats.num_incorrect }}</div>
            <div>{{ userStats.avg_attempts.toFixed(2) }}</div>
          </div>
        </div>

        <!-- Circular progress bar (level and XP) -->
        <div class = "progress-bar-div">
          <radial-progress-bar class = "progress-bar" :diamater = "100" :completed-steps = "userStats.xp-Math.pow(Math.floor(Math.sqrt(userStats.xp+9)), 2)+9" :total-steps = "2*Math.floor(Math.sqrt(userStats.xp+9))+1" start-color = "#E8D2A9" stop-color = "#000A5D" inner-stroke-color = "#08232D" :stroke-width = "30" :inner-stroke-width = "35" stroke-linecap = "butt">
            <span class = "level">{{ Math.floor(Math.sqrt(userStats.xp+9))-2 }}</span>
            <span class = "xp">{{ userStats.xp-Math.pow(Math.floor(Math.sqrt(userStats.xp+9)), 2)+9 }} / {{ 2*Math.floor(Math.sqrt(userStats.xp+9))+1 }}</span>
          </radial-progress-bar>
        </div>

        <!-- Streaks list  -->
        <div class = "summary-info right">
          <div class = "descriptors">
            <div>Longest Winstreak</div>
            <div>Longest Losestreak</div>
            <div>Current Streak</div>
          </div>
          <div class = "values">
            <div>{{ userStats.longest_winstreak }}</div>
            <div>{{ userStats.longest_losestreak }}</div>
            <div>{{ (userStats.streak === 0 ? "" : (userStats.streak > 0 ? "+" : "-")) + Math.abs(userStats.streak)}}</div>
          </div>
        </div>
      </div>

      <!-- Focus breakdown (only shows if at least one focus has at least one problem presented) -->
      <div id = "breakdown" class = "box" v-if = "userStats.topic_stats[0].focus_stats.length > 0">
        <!-- Title and breakdown toggle button -->
        <h1 v-on:click = "toggleBreakdown"><i class = "fa fa-angle-right" v-bind:style = "[{transform: breakdown ? 'rotate(90deg)' : 'rotate(0deg)'}, {marginRight: breakdown ? '12px' : '8px'}]"></i>Focus Breakdown</h1>

        <!-- Breakdown (only shows if toggled on) -->
        <div v-if = "breakdown">
          <!-- One entry for each focus with at least one problem presented (sorted by xp) -->
          <div v-for = "focus in userStats.topic_stats[0].focus_stats.filter(function(focus) {return focus.num_completed > 0}).sort(function(focus1, focus2) {return focus2.xp - focus1.xp})" v-bind:key = "focus.focus" class = "breakdown-focus">
            <!-- Initial info (unexpanded) -->
            <div class = "initial">
              <h3>{{ focus.focus }} ({{ focus.xp }})</h3>
              <ProgressBar class = "progress-bar" v-bind:xp = "focus.xp" v-bind:add = "null" />
              <i class = "fa fa-angle-down" v-on:click = "toggleFocusExpand(focus)" v-bind:style = "{transform: fociExpanded.includes(focus) ? 'rotate(180deg)' : 'rotate(0deg)'}"></i>
            </div>

            <!-- Expanded info -->
            <div class = "expanded" v-bind:style = "[{height: fociExpanded.includes(focus) ? 'inherit' : '0'}]">
              <!-- Level, total XP, and problems attempted list -->
              <div>
                <div class = "descriptors">
                  <div>Level</div>
                  <div>Total XP</div>
                  <div>Problems Attempted</div>
                </div>
                <div class = "values">
                  <div>{{ Math.floor(Math.sqrt(focus.xp+9))-2 }}</div>
                  <div>{{ focus.xp }}</div>
                  <div>{{ focus.num_completed }}</div>
                </div>
              </div>

              <!-- Problems correct, problems incorrect, and average attempts list -->
              <div>
                <div class = "descriptors">
                  <div>Problems Correct</div>
                  <div>Problems Incorrect</div>
                  <div>Average Attempts</div>
                </div>
                <div class = "values">
                  <div>{{ focus.num_correct }}</div>
                  <div>{{ focus.num_incorrect }}</div>
                  <div>{{ focus.avg_attempts.toFixed(2) }}</div>
                </div>
              </div>

              <!-- Streaks list -->
              <div>
                <div class = "descriptors">
                  <div>Longest Winstreak</div>
                  <div>Longest Losestreak</div>
                  <div>Current Streak</div>
                </div>
                <div class = "values">
                  <div>{{ focus.longest_winstreak }}</div>
                  <div>{{ focus.longest_losestreak }}</div>
                  <div>{{ (focus.streak === 0 ? "" : (focus.streak > 0 ? "+" : "-")) + Math.abs(focus.streak)}}</div>
                </div>
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
import RadialProgressBar from "vue-radial-progress/src/RadialProgressBar";
import { mapGetters } from "vuex";
import ProgressBar from '../components/ProgressBar';

export default {
  name: "Home",
  components: {
    RadialProgressBar,
    Menu,
    User,
    ProgressBar
  },
  data() {
    return {
      user: this.$store.getters.StateUser,
      editingName: false,
      breakdown: false,
      fociExpanded: []
    }
  },
  computed: {
    ...mapGetters({
      setup: 'UserSetup',
      submitData: 'ProblemMetaData',
      userStats: 'UserStats'
    })
  },
  methods: {
    // editName, change username of user to what is currently typed in
    editName: function() {
      if (this.editingName) {
        // If name input is currently focused, then dispatch change username actions
        let self = this;
        this.$store.commit('setProcessing', true);
        this.$store.dispatch('SetUserName', this.user).then(() => {
          self.$store.commit('setProcessing', false);
          self.$store.dispatch("Confirmation", "Username changed successfully");
        });
      } else {
        // Otherwise, focus it
        this.$refs.nameInput.focus();
      }

      // Change editing state
      this.editingName = !this.editingName;
    },

    // async changePassword, send reset password email to user
    changePassword: async function() {
      this.$store.commit('setProcessing', true);
      await this.$store.dispatch('PasswordReset', this.$store.getters.Email);
      this.$store.commit('setProcessing', false);
      this.$store.dispatch("Confirmation", "Password reset email successfully sent to " + this.$store.getters.Email);
    },

    // cancelNameEdit, stop editing name and reset name to what was previously saved
    cancelNameEdit: function() {
      this.user = this.$store.getters.StateUser;
      this.editingName = false;
    },

    // toggleBreakdown, toggle focus breakdown
    toggleBreakdown: function() {
      this.breakdown = !this.breakdown;
    },

    // toggleFocusExpand, expand a focus row in the breakdown section
    toggleFocusExpand: function(focusId) {
      if (this.fociExpanded.includes(focusId)) {
        // If focus is already expanded (in the expanded array), then unexpand it (remove it from array)
        this.fociExpanded.splice(this.fociExpanded.indexOf(focusId), 1);
      } else {
        // Otherwise, expand it (add it to the expanded array)
        this.fociExpanded.push(focusId);
      }
    }
  }
}

</script>

<style scoped>

/* General styling */
.content {
  width: calc(85% - 100px);
  position: relative;
  margin: 80px 0 -50px calc(7.5% + 80px);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.link {
  font-family: "Karla", sans-serif;
  font-size: 13px;
  cursor: pointer;
}

.box {
  background: white;
  max-width: 100%;
  border-radius: 40px;
  box-shadow: 0 0 10px 4px rgba(17, 21, 33, 0.3);
  border: none;
  padding: 25px 40px;
  transition: box-shadow .3s ease;
  margin: 20px 0 0 20px;
  height: 200px;
  box-sizing: border-box;
}

.box:hover {
  box-shadow: 0 0 10px 13px rgba(17, 21, 33, 0.3);
}

@media only screen and (max-width: 990px) {
  .content {
    flex-direction: column;
  }
}

@media only screen and (max-width: 700px) {
  .content {
    width: 90%;
    margin: 50px 0 -50px 5%;
  }

  .box {
    margin: 20px 0 0 0;
  }
}

/* Beta popup styling */
#beta {
  height: inherit;
  font-family: "Nunito", sans-serif;
  font-size: 13px;
  border-radius: 20px;
  background: rgb(184, 189, 227);
}

#beta .link {
  font-family: "Nunito", sans-serif;
  font-size: 13px;
}

#beta .link:hover {
  color: #6589ff;
}

#beta .link::after {
  bottom: -2.5px;
}

.box h1 {
  font-family: "Antic", sans-serif;
}

/* User profile styling */
#profile {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.avatar {
  color: rgb(29, 34, 41);
  cursor: pointer;
  border-radius: 50%;
  position: relative;
}

.avatar .img {
  font-size: 115px;
}

.avatar .change {
  font-size: 13px;
  position: absolute;
  padding-top: 5px;
  box-sizing: border-box;
  opacity: 0;
  top: 50%;
  left: 0;
  width: 100%;
  height: 50%;
  border-radius: 0 0 1000px 1000px;
  background: rgba(17, 21, 33, 0.6);
  color: #e1e1e1;
  text-align: center;
  font-family: "Montserrat", sans-serif;
  transition: opacity .3s ease;
}

/*.avatar:hover .change {*/
  /*opacity: 1;*/
/*}*/

.profile-info {
  margin-left: 30px;
  padding: 8px 15px 15px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  height: 90%;
}

.username {
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
  width: 180px;
  border: 1px solid rgba(29, 34, 41, 0.2);
  border-radius: 6px;
  padding: 8px 12px;
  position: relative;
  transition: box-shadow .3s ease;
}

.username input {
  border: none;
  padding: 0;
  outline: none;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
}

.username .fa {
  position: absolute;
  right: 10px;
  top: 9px;
  cursor: pointer;
}

.username .cancel {
  right: 30px;
  color: #ff2540;
}

@media only screen and (max-width: 990px) {
  #profile {
    width: 100%;
  }

  .username {
    width: 215px;
  }
}

@media only screen and (max-width: 500px) {
  #profile {
    flex-direction: column;
    height: inherit;
  }

  .profile-info {
    height: 165px;
    margin-left: 0;
    align-items: center;
  }

  .username {
    width: 100%;
    margin-left: 20px;
  }

  .username input {
    width: inherit;
  }
}

@media only screen and (min-width: 1200px) {
  #profile {
    width: 55%;
  }

  .username {
    width: 250px;
    margin-right: 100px;
  }
}

@media only screen and (min-width: 1100px) {
  .username {
    width: 225px;
    margin-right: 40px;
  }
}

/* Stats overview styling */
#overview {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
}

#overview .row {
  display: flex;
  flex-direction: row;
}

#overview .row div {
  margin-right: 30px;
}

#overview .row.attempted div {
  margin-right: 10px;
}

#overview h3 {
  font-family: "Nunito", sans-serif;
  font-size: 16px;
  border-bottom: 1px solid black;
  font-weight: lighter;
}

#overview p {
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  margin-top: 5px;
}

@media only screen and (max-width: 990px) {
  #overview {
    flex-direction: row;
    flex-wrap: wrap;
    height: inherit;
  }
}

/* Stats summary styling */
#summary {
  width: 100%;
  padding: 50px 0;
  box-sizing: border-box;
  display: flex;
  height: auto;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

#summary .progress-bar {
  bottom: 20px;
  font-family: "Montserrat", sans-serif;
  font-size: 40px;
  margin-bottom: -50px;
}

.xp {
  font-size: 13px;
  margin-top: -5px;
}

.summary-info {
  display: flex;
  margin-bottom: 0;
  flex-direction: row;
  justify-content: space-around;
  height: 150px;
  box-sizing: border-box;
  padding: 20px 5% 20px 8%;
  width: 35%;
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  border-radius: 0 1000px 1000px 0;
  box-shadow: 0 0 10px 4px rgba(17, 21, 33, 0.3);
}

.summary-info > div {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.summary-info .descriptors {
  margin-right: 40px;
}

.summary-info.right {
  padding: 20px 8% 20px 5%;
  border-radius: 1000px 0 0 1000px;
}

.summary-info.right .descriptors {
  text-align: right;
}

@media only screen and (max-width: 1200px) {
  .summary-info {
    font-size: 14px;
  }
}

@media only screen and (max-width: 1150px) {
  .summary-info {
    font-size: 13px;
  }
}

@media only screen and (max-width: 1100px) {
  .summary-info {
    padding: 30px 5%;
    font-size: 14px;
  }

  .summary-info.right {
    padding: 30px 5%;
  }
}

@media only screen and (max-width: 990px) {
  #summary {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .progress-bar-div {
    margin-bottom: 40px;
  }

  .progress-bar {
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .summary-info {
    width: 65%;
    min-width: 260px;
    border-radius: 20px;
  }

  .summary-info.right {
    border-radius: 20px;
  }

  .summary-info.right .descriptors {
    text-align: left;
  }
}

/* Focus breakdown styling */
#breakdown {
  height: inherit;
  width: 100%;
  padding: 40px 60px;
  margin-bottom: 50px;
}

#breakdown > div {
  margin-top: 40px;
}

#breakdown h1 {
  cursor: pointer;
  position: relative;
  display: inline-block;
}

#breakdown h1::after {
  content: "";
  position: absolute;
  bottom: -7px;
  left: 20px;
  width: 0;
  height: 2px;
  background: black;
  transition: width .3s ease;
}

#breakdown h1:hover::after {
  width: calc(100% - 20px);
}

#breakdown h1 .fa-angle-right {
  transition: transform .3s ease, margin-right .3s ease;
}

#breakdown .breakdown-focus {
  border-top: 1px solid #285380;
  background: transparent;
}

#breakdown .breakdown-focus:hover {
  background: rgba(153, 161, 227, 0.2);
}

#breakdown .initial {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

#breakdown h3 {
  font-family: "Nunito", sans-serif;
  font-size: 16px;
  font-weight: lighter;
  margin-left: 15px;
  width: 25%;
}

#breakdown .progress-bar {
  width: 60%;
}

#breakdown .fa-angle-down {
  margin-left: 3%;
  font-size: 22px;
  cursor: pointer;
  background: transparent;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  text-align: center;
  vertical-align: middle;
  line-height: 30px;
  transition: background .2s ease;
}

#breakdown .fa-angle-down:hover {
  background: rgba(153, 161, 227, 0.4);
  transition: transform .3s ease;
}

#breakdown .expanded {
  overflow: hidden;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-evenly;
  transition: height .3s ease;
  font-family: "Nunito", sans-serif;
  font-size: 13px;
  padding: 10px 0;
}

#breakdown .expanded > div {
  background: white;
  border-radius: 20px;
  box-shadow: 0 0 10px 0.5px rgba(17, 21, 33, 0.2);
  border: none;
  padding: 25px 40px;
  display: flex;
  flex-direction: row;
  margin: 10px 5px;
}

#breakdown .breakdown-focus:hover .expanded > div {
  background: #f9fbff;
}

#breakdown .expanded > div > div {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

#breakdown .expanded > div > div > div {
  margin: 5px 0;
}

#breakdown .expanded .descriptors {
  margin-right: 40px;
}

#breakdown .expanded .values {
  text-align: right;
}

@media only screen and (max-width: 600px) {
  #breakdown {
    padding: 40px 30px;
  }
}

@media only screen and (max-width: 800px) {
  #breakdown .initial {
    flex-direction: column;
    height: inherit;
    padding: 25px 0 5px 0;
  }

  #breakdown h3 {
    width: 100%;
    text-align: center;
  }

  #breakdown .progress-bar {
    width: 100%;
    margin: 5px 0;
  }
}

</style>

<template>
  <div id = "app">
    <!-- Background -->
    <div id = "app-background"></div>

    <!-- Router view -->
    <router-view/>

    <!-- Display confirmation messages -->
    <div class = "confirmation" v-for = "confirmation in $store.getters.Confirmations" v-bind:key = "confirmation.id">
      <div>
        <p>{{ confirmation.message }}</p>
      </div>
    </div>

    <!-- Display processing screen -->
    <div id = "processing" v-if = "$store.getters.Processing">
      <h3>Processing</h3>
      <i class = "fa fa-spinner"></i>
    </div>
  </div>
</template>

<script>

  export default {
    name: "App",
    methods: {
      // onResize, Calls store mutation to reset window height
      onResize: function() {
        this.$store.commit("setWindowHeight");
        this.$store.commit("setWindowWidth");
      },

      clearLocalStorage: function() {
        let allStrings = '';
        for(let key in window.localStorage){
          if(window.localStorage.hasOwnProperty(key)){
            allStrings += window.localStorage[key];
          }
        }

        let storageInKB = (3 + allStrings.length / 512);
        if (storageInKB >= 500) {
          window.localStorage.clear();
        }
      },

      // async getData, Calls store actions to retrieve current user's stats+data
      getData: async function() {
        console.log("hello");
        const getProblemMetadata = this.$store.dispatch('GetProblemMetadata');
        const getUserMetadata =  this.$store.dispatch('GetUserMetadata');
        const getUserInfo = this.$store.dispatch('GetUserInfo');
        const getUserStats = this.$store.dispatch('GetUserStats');
        const getSubmittedProblems = this.$store.dispatch('GetSubmittedProblems');
        const getPastProblems = this.$store.dispatch('GetPastProblems');
        await Promise.allSettled([getProblemMetadata, getUserMetadata, getUserInfo, getUserStats, getSubmittedProblems, getPastProblems]);
      }
    },
    mounted() {
      this.clearLocalStorage();

      // Calls onResize on app load and whenever window is resized
      this.onResize();
      window.addEventListener("resize", this.onResize);

      // Clears processing screen when app is loaded/reloaded
      this.$store.commit('setProcessing', false);

      // Gets data again on app load/reload if user is logged in (force data reload on app reload)
      if (this.$store.getters.isAuthenticated) {
        this.getData();
      }
    }
  }

</script>

<style>
  /* STYLING IS UNSCOPED */

  /* App margin/padding styling */
  #app {
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Background styling */
  #app-background {
    background: url("assets/Background.png") no-repeat center center fixed;
    background-size: cover;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    filter: brightness(50%);
    z-index: 0;
  }

  /* Confirmation popup styling */
  .confirmation {
    position: fixed;
    z-index: 100000;
    left: 0;
    top: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .confirmation > div {
    margin-top: 20px;
    background: black;
    border-radius: 13px;
    color: white;
    font-family: "Antic", sans-serif;
    font-size: 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 10px 15px;
    box-shadow: 0 0 8px 0.5px rgba(17, 21, 33, 0.1);
  }

  /* Processing popup styling */
  #processing {
    position: fixed;
    z-index: 100000;
    background: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: white;
    font-family: "Antic", sans-serif;
    font-size: 50px;
  }

  #processing .fa {
    margin-left: 25px;
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

  /* General link styling */
  .link {
    position: relative;
    color: #285380;
    text-decoration: none;
    transition: color .3s ease;
  }

  .link:hover {
    color: #99A1E3;
  }

  .link::after {
    content: "";
    width: 0;
    height: 1px;
    position: absolute;
    bottom: -5px;
    left: 50%;
    background: #99A1E3;
    transition: left .3s ease, width .3s ease;
  }

  .link:hover::after {
    width: 80%;
    left: 10%;
  }

  /* General button styling */
  .button {
    height: 44px;
    background: none;
    border: 1px solid #111521;
    border-radius: 0;
    color: #111521;
    position: relative;
    transition: color .25s ease;
    padding: 0 12px;
    z-index: 10;
    cursor: pointer;
    outline: none;
    line-height: 44px;
    vertical-align: middle;
  }

  .button::before {
    content: "";
    position: absolute;
    z-index: -1;
    background: #111521;
    width: 100%;
    height: 0;
    left: 0;
    top: 0;
    transition: height .25s ease;
  }

  .button.blue {
    border: 1px solid #285380;
    color: #285380;
  }

  .button.red {
    border: 1px solid #ff6469;
    color: #ff6469;
  }

  .button.orange {
    border: 1px solid #ff845d;
    color: #ff845d;
  }

  .button.blue::before {
    background: #285380;
  }

  .button.red::before {
    background: #ff6469;
  }

  .button.orange::before {
    background: #ff845d;
  }

  .button.bottom::before {
    bottom: 0;
  }

  .button .fa {
    margin-right: 8px;
    margin-top: 3px;
  }

  .button:hover {
    color: white;
  }

  .button:hover::before {
    height: 100%;
  }


</style>

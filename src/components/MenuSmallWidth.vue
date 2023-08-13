<template>
  <div class = "container" v-bind:style = "[{height: $store.getters.WindowHeight + 'px'}, {zIndex: open ? '10000' : '-1'}]">

    <!-- Top -->
    <div id = "top">
      <!-- Exit -->
      <div id = "exit" v-on:click = "$emit('exit')">
        <div class = "line one"></div>
        <div class = "line two"></div>
        <p>Close Menu</p>
      </div>

      <!-- User summary -->
      <div id = "user" v-on:click = "navigate('')">
        <div class = "img avatar">
          <i class = "fa fa-user-circle-o" aria-hidden = "true"></i>
        </div>
        <div class = "text">{{ user }}</div>
      </div>
    </div>

    <!-- User links -->
    <div id = "user-links" v-bind:style = "{height: $store.getters.WindowHeight*0.15 + 'px'}">
      <!-- Home button -->
      <div class = "link-button home" v-on:click = "navigate('')">
        <div class = "logo"></div>
        <div class = "text">Dashboard</div>
      </div>

      <!-- Logout button -->
      <div class = "link-button" v-on:click = "logOut">
        <i class = "fa fa-power-off" aria-hidden = "true"></i>
        <div class = "text">Logout</div>
      </div>
    </div>

    <!-- Menu links -->
    <div id = "menu-links" v-bind:style = "{height: $store.getters.WindowHeight*0.35 + 'px'}">
      <!-- Play button -->
      <div class = "link-button" v-on:click = "navigate('play')">
        <i class = "fa fa-cubes"></i>
        <div class = "text">Play</div>
      </div>

      <!-- Review button -->
      <div class = "link-button" v-on:click = "navigate('leaderboard')">
        <i class = "fa fa-star"></i>
        <div class = "text">Review</div>
      </div>

      <!-- Setup button -->
      <div class = "link-button" v-on:click = "navigate('setup')">
        <i class = "fa fa-sliders"></i>
        <div class = "text">Setup</div>
      </div>

      <!-- Leaderboard button -->
      <div class = "link-button" v-on:click = "navigate('leaderboard')">
        <i class = "fa fa-star"></i>
        <div class = "text">Leaderboard</div>
      </div>

      <!-- Submit button -->
      <div class = "link-button" v-on:click = "navigate('submit')">
        <i class = "fa fa-database" style = "color: #ff845d;"></i>
        <div class = "text" style = "color: #ff845d;">Submit</div>
      </div>

      <!-- Help (external) -->
      <a href = "https://physicsgenie.org/help" target = "_blank" class = "link-button">
        <i class = "fa fa-question" aria-hidden = "true"></i>
        <div class = "text">Help</div>
      </a>
    </div>

    <!-- Back to main site (external) -->
    <a href = "https://physicsgenie.org/" id = "back-home" class = "link-button">
      <i class = "fa fa-long-arrow-left" aria-hidden = "true"></i>
      <div class = "text">Back to Home</div>
    </a>
  </div>
</template>

<script>

  // Imports
  import { mapGetters } from "vuex";

  export default {
    name: "MenuSmallWidth",
    props: {
      open: Boolean
    },
    computed: {
      // Map "StateUser" from store to "user" component variable
      ...mapGetters({
        user: 'StateUser'
      })
    },
    methods: {
      // navigate (place => router-view location to route to when called), push new location to router stack
      navigate: function(place) {
        this.$emit("exit");
        this.$router.push("/" + place);
      },

      // async logOut, log user out (LogOut store action) and route to login page
      async logOut (){
        await this.$store.dispatch('LogOut');
        this.$router.push('/login');
      }
    }
  }
</script>

<style scoped>

  /* Container styling */
  .container {
    position: fixed;
    top: 0;
    left: 0;
    background: rgb(29, 34, 41);
    width: 100%;
    overflow: auto;
  }

  /* Top styling */
  #top {
    position: absolute;
    top: 50px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 20px;
    box-sizing: border-box;
    padding: 0 20px;
  }

  #exit {
    cursor: pointer;
    position: relative;
  }

  #exit .line {
    width: 1px;
    height: 30px;
    background: white;
    position: absolute;
    top: 0;
    left: 10px;
    transition: transform .3s ease;
  }

  #exit:hover .line.one {
    transform: rotate(45deg);
  }

  #exit:hover .line.two {
    transform: rotate(-45deg);
  }

  #exit p {
    margin-left: 20px;
    margin-top: 3px;
    font-family: "Montserrat", sans-serif;
    font-size: 19px;
    color: white;
    border-bottom: 1px dotted white;
    transition: border .3s ease, margin .3s ease;
  }

  #exit:hover p {
    border-bottom: 1px solid black;
    margin-left: 28px;
  }

  #user {
    cursor: pointer;
    color: white;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-family: "Montserrat", sans-serif;
    font-size: 19px;
  }

  #user .fa {
    margin-right: 7px;
    margin-top: 5px;
    font-size: 25px;
  }

  @media only screen and (max-width: 359px) {
    #top {
      flex-direction: column;
      height: 50px;
      margin-bottom: 20px;
    }

    #user {
      margin-top: 10px;
    }
  }

  /* Links styling */
  #user-links {
    display: flex;
    flex-direction: column;
    width: 60%;
    margin-left: 20%;
    padding: 20px 0;
    margin-top: 125px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    max-height: 120px;
    justify-content: space-around;
    align-items: center;
  }

  #menu-links {
    display: flex;
    flex-direction: column;
    width: 60%;
    margin-left: 20%;
    padding: 15px 0;
    margin-top: 10px;
    border-bottom: 1px solid white;
    max-height: 300px;
    justify-content: space-around;
    align-items: center;
  }

  .home .logo {
    position: relative;
    width: 20px;
    height: 20px;
    border-radius: 30px;
    margin-right: 7px;
    background: white;
  }

  .home .logo::after {
    content: "";
    background: url("../assets/logo.svg") no-repeat center;
    width: 80%;
    height: 90%;
    position: absolute;
    top: 5%;
    left: 13%;
  }

  .link-button {
    display: flex;
    flex-direction: row;
    font-family: "Montserrat", sans-serif;
    color: white;
    font-size: 18px;
    cursor: pointer;
    width: 100%;
    padding: 13px 0;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    text-decoration: none;
  }

  .link-button .fa {
    margin-right: 7px;
  }

  .link-button:hover {
    background: #111521;
  }

  #back-home {
    width: 60%;
    margin-left: 20%;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  #back-home .fa {
    margin-right: 12px;
  }

  @media only screen and (max-width: 359px) {
    #user-links {
      margin-top: 140px;
    }
  }

</style>

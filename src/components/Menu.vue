<template>
  <div>
    <!-- Show normal menu if window width is greater than 700 pixels -->
    <div class = "container-fluid" id = "play-menu" v-if = "$store.getters.WindowWidth > 700">
      <!-- Main links -->
      <div class = "flex" id = "links-container">
        <!-- Home -->
        <router-link to = "/" class = "router-link">
          <div class = "img logo"></div>
          <div class = "text">Home</div>
        </router-link>

        <!-- Play -->
        <router-link to = "/play" class = "router-link">
          <div class = "img problem">
            <i class = "fa fa-cubes" aria-hidden = "true"></i>
          </div>
          <div class = "text">Play</div>
        </router-link>

        <!-- Review -->
        <router-link to = "/review" class = "router-link">
          <div class = "img review">
            <i class = "fa fa-retweet" aria-hidden = "true"></i>
          </div>
          <div class = "text">Review</div>
        </router-link>

        <!-- Setup -->
        <router-link to = "/setup" class = "router-link">
          <div class = "img setup">
            <i class = "fa fa-sliders" aria-hidden = "true"></i>
          </div>
          <div class = "text">Setup</div>
        </router-link>

        <!-- Leaderboard -->
        <router-link to = "/leaderboard" class = "router-link">
          <div class = "img leaderboard">
            <i class = "fa fa-star" aria-hidden = "true"></i>
          </div>
          <div class = "text">Leaderboard</div>
        </router-link>

        <!-- Submit -->
        <router-link to = "/submit" id = "submit-link" class = "router-link" v-if = "$store.getters.Contributor">
          <div class = "img setup">
            <i class = "fa fa-database" aria-hidden = "true" style = "color: #ff845d;"></i>
          </div>
          <div class = "text" style = "color: #ff845d;">Submit</div>
        </router-link>

        <!-- Help (external) -->
        <a href = "https://physicsgenie.org/help" target = "_blank" class = "router-link">
          <div class = "img help">
            <i class = "fa fa-question" aria-hidden = "true"></i>
          </div>
          <div class = "text">Help</div>
        </a>
      </div>

      <!-- Back to main site (external) -->
      <a href = "https://physicsgenie.org/" id = "back-home" class = "router-link">
        <i class = "fa fa-long-arrow-left" aria-hidden = "true"></i>
        <div class = "text">Back to Site</div>
      </a>
    </div>

    <!-- Otherwise, show small-width toggler and menu -->
    <div v-else>
      <div id = "small-width-toggler" v-on:click = "toggleSmallWidthMenu">Menu</div>
      <MenuSmallWidth v-bind:open = "smallWidthMenuOpen" v-on:exit = "toggleSmallWidthMenu" />
    </div>
  </div>
</template>

<script>

  // Imports
  import MenuSmallWidth from "../components/MenuSmallWidth";

  export default {
    name: "Menu",
    components: {
      MenuSmallWidth
    },
    data() {
      return {
        smallWidthMenuOpen: false
      }
    },
    methods: {
      toggleSmallWidthMenu: function() {
        this.smallWidthMenuOpen = !this.smallWidthMenuOpen;
      }
    },
    mounted() {
      let self = this;
      window.addEventListener("resize", function() {
        if (self.$store.getters.WindowWidth >= 700) {
          self.smallWidthMenuOpen = false;
        }
      });
    }
  }
</script>

<style scoped>

  /* Menu styling */
  #play-menu {
    position: fixed;
    width: 100px;
    top: 0;
    left: 0;
    background: rgb(29,34,41);
    z-index: 1000;
    transition: width .3s ease .1s;
    height: 100%;
  }

  #play-menu:hover {
    width: 280px;
    transition: width .4s ease;
  }

  #play-menu .flex {
    display: flex;
    margin-top: 30px;
    flex-direction: column;
    height: 415px;
    justify-content: space-around;
    align-items: flex-start;
  }

  #play-menu .flex > .router-link {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 50px;
    width: 100%;
  }

  #play-menu .flex > .router-link:hover {
    background: #111521;
  }

  .router-link {
    text-decoration: none !important;
  }

  #play-menu .flex > .router-link:nth-child(1) {
    margin-bottom: 30px;
  }

  #play-menu .img {
    position: relative;
    width: 30px;
    height: 30px;
    margin: 0 35px 0 35px;
  }

  #play-menu .img.logo {
    width: 60px;
    height: 60px;
    border-radius: 30px;
    margin: 0 20px 0 20px;
    background: white;
  }

  #play-menu .img .fa {
    font-size: 30px;
    color: white;
  }

  #play-menu .img.logo::after {
    content: "";
    background: url("../assets/logo.svg") no-repeat center;
    width: 80%;
    height: 90%;
    position: absolute;
    top: 5%;
    left: 13%;
  }

  #play-menu .text {
    color: white;
    font-family: "Montserrat", sans-serif;
    font-size: 17px;
    width: 0;
    text-align: left;
    margin-left: -15px;
    opacity: 0;
    transition: width .3s ease .1s, opacity .2s ease;
  }

  #play-menu .flex > .link:nth-child(1) .text {
    margin-left: 0;
  }

  #play-menu:hover .text {
    width: 70px;
    opacity: 1;
    transition: width .4s ease, opacity .1s ease .3s;
  }

  /* Back to main site styling */
  #back-home {
    position: absolute;
    bottom: 100px;
    height: 60px;
    width: 100%;
    background: rgb(34,37,41);
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    cursor: pointer;
    transition: height .25s ease, bottom .25s ease;
  }

  #back-home:hover {
    height: 80px;
    bottom: 90px;
  }

  #back-home .fa {
    color: white;
    font-size: 25px;
    position: relative;
    left: 10px;
    transition: left .3s ease .1s;
  }

  #back-home .text {
    line-height: 100%;
  }

  #play-menu:hover #back-home .fa {
    left: 25px;
    transition: left .4s ease;
  }

  #play-menu:hover #back-home .text {
    width: 150px;
  }

  /* Small width menu toggler styling */
  #small-width-toggler {
    position: fixed;
    top: 40px;
    left: -10px;
    font-size: 16px;
    font-family: "Montserrat", sans-serif;
    background: rgba(29, 34, 41, 0.5);
    border-radius: 10px;
    box-shadow: 0 0 5px 2px rgba(17, 21, 33, 0.3);
    color: white;
    padding: 15px 28px;
    cursor: pointer;
    z-index: 1000;
    transition: background .3s ease, padding .3s ease, font-size .3s ease;
  }

  #small-width-toggler:hover {
    background: rgba(29, 34, 41, 1);
    padding: 15px 40px;
    font-size: 18px;
    top: 39px;
  }


</style>

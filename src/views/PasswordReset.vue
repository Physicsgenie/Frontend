<template>
  <div class = "container" v-bind:style = "{minHeight: $store.getters.WindowHeight + 'px'}">
    <div class = "content">
      <a href = "https://physicsgenie.org/" id = "back-home">
        <i class = "fa fa-caret-left" aria-hidden = "true"></i>
        <div class = "text">Back to Site</div>
      </a>
      <h2>Password Reset Form</h2>
      <div id = "errors" v-if = "error !== null">
        <p class = "error">{{ error }}</p>
      </div>
      <form @submit.prevent="submit">
        <div>
          <label for = "email">Email:</label>
          <input type = "text" name = "email" id = "email" v-model="email">
        </div>
        <button type = "submit"> Submit</button>
      </form>
      <div class = "links">
        <router-link to = "/login" id = "login" class = "link">Login</router-link>
        <router-link to = "/register" id = "register" class = "link">Register</router-link>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "PasswordReset",
    data() {
      return {
        email: "",
        error: null
      };
    },
    methods: {
      async submit() {
        try {
          if (this.email === "" || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email)) {
            this.error = "Please enter a valid email address";
          } else {
            this.error = null;
            this.$store.commit('setProcessing', true);
            await this.$store.dispatch('PasswordReset', this.email);
            this.$router.push("/login");
            this.$store.commit('setProcessing', false);
            this.$store.dispatch("Confirmation", "Password reset email successfully sent to " + this.email);
          }
        } catch (error) {
          this.error = "User with specified email could not be found";
          this.$store.commit('setProcessing', false);
        }
      },
    }
  }
</script>

<style scoped>

  .container {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    position: relative;
    flex-direction: column;
    padding: 65px 0;
    box-sizing: border-box;
  }

  .content {
    max-width: 450px;
    width: 95%;
    box-sizing: border-box;
    border: 1px solid #cccccc;
    border-radius: 16px;
    padding: 40px 50px;
    background: white;
    position: relative;
    top: 0;
    box-shadow: 0 0 10px 4px rgba(17, 21, 33, 0.3);
  }

  #back-home {
    position: absolute;
    top: -40px;
    left: 25px;
    display: flex;
    height: 40px;
    line-height: 35px;
    padding: 5px 20px 0 20px;
    box-sizing: border-box;
    vertical-align: center;
    flex-direction: row;
    align-items: center;
    text-decoration: none;
    color: white;
    background: rgba(0, 0, 0, 0.4);
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
    transition: background .3s ease;
  }

  #back-home .fa {
    margin-right: 7px;
    margin-top: 2px;
  }

  #back-home:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  #errors {
    background: rgba(255, 207, 209, 0.6);
    width: 85%;
    color: #ff6469;
    font-size: 13px;
    padding: 15px 25px;
    margin: 20px 0;
    box-shadow: -0.1px 0 10px rgba(120, 120, 120, 0.5);
  }

  #errors p {
    color: #ff6469;
    font-family: "Nunito", sans-serif;
    font-size: 13px;
  }

  .content h2 {
    font-family: "Antic", sans-serif;
    font-size: 35px;
  }

  .content form div {
    margin: 20px 0;
    width: 100%;
    font-size: 15px;
    color: rgba(64, 64, 64, 0.81);
    font-family: "Nunito", sans-serif;
    font-weight: lighter;
  }

  .content form input {
    width: 95%;
    border-radius: 0;
    border: 1px solid #ddd;
    color: #333;
    background-color: transparent;
    outline: none;
    font-family: "Montserrat", sans-serif;
    padding: 8px 10px;
    height: 20px;
    margin-top: 5px;
  }

  .content form input:focus {
    border: 1px solid #b9b9b9;
  }

  .content form input[type = "checkbox"] {
    margin-right: 10px;
    width: 15px;
    border-radius: 0 !important;
    border: 1px solid #cccccc;
  }

  #remember {
    position: relative;
    margin: 0;
    top: -5px;
  }

  .content button {
    width: 100%;
    border: 1px #285380 solid;
    color: #285380;
    padding: 10px 0;
    font-family: "Nunito", sans-serif;
    cursor: pointer;
    background: none;
    transition: color .5s ease, background .5s ease;
    margin-bottom: 15px;
  }

  .content button:hover {
    color: white;
    background: #285380;
  }

  .content .links {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .content .link {
    font-family: "Karla", sans-serif;
    font-size: 13px;
    display: inline-block;
  }

  #register {
    margin-left: 20px;
  }

</style>

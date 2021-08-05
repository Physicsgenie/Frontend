<template>
  <div id = "full-edit" v-if = "data.open">
    <div class = "content">
      <div class = "header">
        <h2 v-if = "data.type === 'problemText'">Problem <span class = "smaller">(LaTeX)</span></h2>
        <h2 v-else-if = "data.type === 'solution'">Solution <span class = "smaller">(LaTeX)</span></h2>
        <h2 v-else-if = "data.type === 'diagram' || data.type === 'diagramFile'">Diagram <span class = "smaller">(svg)</span></h2>
        <h2 v-else>Solution Diagram <span class = "smaller">(svg)</span></h2>
        <button class = "return button orange" v-on:click = "exit"><i class = "fa fa-paper-plane"></i>Save and Exit</button>
      </div>
      <textarea v-if = "data.type !== 'diagramFile' && data.type !== 'solutionDiagramFile'" type = "text" v-model = "data.text"></textarea>
      <div class = "output" v-bind:style = "(data.type === 'diagramFile' || data.type === 'solutionDiagramFile') ? {height: '100%'} : {height: showOutput ? '20%' : '0', overflow: showOutput ? 'auto' : 'hidden', borderTop: '1px solid rgb(29, 34, 41)', marginTop: '20px'}">
        <button v-if = "data.type !== 'diagramFile' && data.type !== 'solutionDiagramFile'" v-on:click = "toggleOutput">Output<i class = "fa fa-angle-down" v-bind:style = "{transform: showOutput ? 'rotate(0deg)' : 'rotate(-180deg)'}"></i></button>
        <p v-if = "data.type === 'problemText' || data.type === 'solution'"><vue-mathjax :formula = "data.text" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></p>
        <div v-else><span v-html = "data.text"></span></div>
      </div>
    </div>
  </div>
</template>

<script>

  import {VueMathjax} from 'vue-mathjax'

  export default {
    name: "FullEdit",
    components: {
      'vue-mathjax': VueMathjax
    },
    props: {
      text: String,
      open: Boolean,
      type: String
    },
    data() {
      return {
        data: {
          text: this.text,
          open: this.open,
          type: this.type
        },
        showOutput: true
      }
    },
    watch: {
      text: function(newText) {
        this.data.text = newText;
      },
      open: function(newOpen) {
        this.data.open = newOpen;
      },
      type: function(newType) {
        this.data.type = newType;
      }
    },
    methods: {
      toggleOutput: function() {
        this.showOutput = !this.showOutput;
      },
      exit: function() {
        this.fullEditOpen = false;
        this.$emit("exit", this.data.text, this.data.type);
      }
    }
  }
</script>

<style scoped>

  button {
    outline: none;
  }

  #full-edit {
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
  }

  .content {
    position: relative;
    background: white;
    width: 60%;
    min-width: 500px;
    padding: 30px 50px 50px 50px;
    border-radius: 25px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    box-sizing: border-box;
    transition: opacity .3s ease, top .3s ease;
  }

  .content:not(.diagram-preview) {
    height: 100%;
  }

  .content.diagram-preview {
    padding: 30px 50px 20px 50px;
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

  .content h2 {
    font-size: 50px;
    font-family: "Nanum Gothic", sans-serif;
    font-weight: 500;
    margin-bottom: 15px;
  }

  .content h2 .smaller {
    font-size: 30px;
    font-style: italic;
  }

  .content .return {
    font-size: 18px;
    padding: 0 15px;
    margin-bottom: 15px;
    height: 50px;
    box-sizing: border-box;
    transition: color .25s ease;
  }

  .content .return .fa {
    margin-right: 8px;
  }

  .content .return:hover {
    color: white;
  }

  .content textarea {
    border: solid 1px rgba(17, 21, 33, 0.51);
    font-family: "Montserrat", sans-serif;
    font-size: 17px;
    color: rgba(29, 34, 41, 0.7);
    padding: 10px;
    resize: none;
    width: 100%;
    flex-grow: 10;
    outline: none;
    position: relative;
    transition: border .15s ease, box-shadow .15s ease;
  }

  .content .output {
    font-family: "Nunito", sans-serif;
    font-size: 14px;
    color: rgb(29, 34, 41);
    margin-left: -50px;
    margin-right: -50px;
    padding: 45px 50px 0 50px;
    position: relative;
    transition: height .3s ease, transform .3s ease;
  }

  .content .output button {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 35px;
    overflow: hidden;
    padding-left: 50px;
    text-align: left;
    border: none;
    background: none;
    cursor: pointer;
    transition: background .2s ease;
  }

  .content .output button .fa {
    transform: rotate(0deg);
    margin-left: 10px;
    position: relative;
    top: 2px;
    font-size: 18px;
    transition: transform .3s ease;
  }

  .content .output button:hover {
    background: #e6e6e6;
  }

  .content .output p, .full-edit .output .svg-output {
    visibility: visible;
    overflow: auto;
    padding: 0;
    margin: 0;
    transition: visibility 0s ease .3s;
  }

  @media only screen and (max-width: 990px) {
    #full-edit {
      padding: 100px 0;
    }

    .content {
      margin-left: 100px;
      width: calc(90% - 100px);
      min-width: 0;
    }
  }

  @media only screen and (max-width: 700px) {
    #full-edit {
      padding: 120px 0 100px 0;
    }

    .content {
      margin: 0;
      width: 90%;
    }
  }

</style>

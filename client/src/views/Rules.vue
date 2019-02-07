<template lang="pug">
.row
  .col-sm-12.col-md-10.col-md-offset-1.col-lg-8.col-lg-offset-2
    .button-group
      button(@click="display='rules'") Read the rules
      button(v-show="!gameInProgress" @click="watchComputerGame")
        | Observe a sample game
      button(v-show="!gameInProgress" @click="playAgainstComputer")
        | Beat the computer!
      button(v-show="gameInProgress" @click="stopGame")
        | Stop game
    .section-content(v-show="display=='rules'" v-html="content")
    Game(v-show="display=='computer'" :gid-or-fen="fen"
      :mode="mode" :sub-mode="subMode" :variant="variant"
      @computer-think="gameInProgress=false" @game-over="stopGame")
</template>

<script>
import Game from "@/components/Game.vue";
import { store } from "@/store";
import { getDiagram } from "@/utils/printDiagram";
export default {
  name: 'my-rules',
  components: {
    Game,
  },
  data: function() {
    return {
      st: store.state,
      variant: {id: 0, name: "_unknown"}, //...yet
      content: "",
      display: "rules",
      mode: "computer",
      subMode: "", //'auto' for game CPU vs CPU
      gameInProgress: false,
      mycolor: "w",
      fen: "",
    };
  },
  watch: {
    $route: function(newRoute) {
      this.tryChangeVariant(newRoute.params["vname"]);
    },
  },
  created: async function() {
    // NOTE: variant cannot be set before store is initialized
    this.tryChangeVariant(this.$route.params["vname"]);
  },
  methods: {
    parseFen(fen) {
      const fenParts = fen.split(" ");
      return {
        position: fenParts[0],
        marks: fenParts[1],
        orientation: fenParts[2],
        shadow: fenParts[3],
      };
    },
    tryChangeVariant: async function(vname) {
      if (vname == "_unknown")
        return;
      if (this.st.variants.length > 0)
      {
        const idxOfVar = this.st.variants.findIndex(e => e.name == vname);
        this.variant = this.st.variants[idxOfVar];
      }
      else
        this.variant.name = vname;
      const vModule = await import("@/variants/" + vname + ".js");
      window.V = vModule.VariantRules;
      // Method to replace diagrams in loaded HTML
      const replaceByDiag = (match, p1, p2) => {
        const args = this.parseFen(p2);
        return getDiagram(args);
      };
      // (AJAX) Request to get rules content (plain text, HTML)
      this.content =
        require("raw-loader!@/rules/" + vname + "/" + this.st.lang + ".pug")
        .replace(/(fen:)([^:]*):/g, replaceByDiag);
    },
    startGame: function() {
      if (this.gameInProgress)
        return;
      this.gameInProgress = true;
      this.mode = "computer";
      this.display = "computer";
      this.fen = V.GenRandInitFen();
    },
    stopGame: function() {
      this.gameInProgress = false;
      this.mode = "analyze";
    },
    playAgainstComputer: function() {
      this.subMode = "";
      this.startGame();
    },
    watchComputerGame: function() {
      this.subMode = "auto";
      this.startGame();
    },
  },
};
</script>

<style lang="sass">
.warn
  padding: 3px
  color: red
  background-color: lightgrey
  font-weight: bold

figure.diagram-container
  margin: 15px 0 15px 0
  text-align: center
  width: 100%
  display: block
  .diagram
    display: block
    width: 40%
    min-width: 240px
    margin-left: auto
    margin-right: auto
  .diag12
    float: left
    margin-left: calc(10% - 20px)
    margin-right: 40px
    @media screen and (max-width: 630px)
      float: none
      margin: 0 auto 10px auto
  .diag22
    float: left
    margin-right: calc(10% - 20px)
    @media screen and (max-width: 630px)
      float: none
      margin: 0 auto
  figcaption
    display: block
    clear: both
    padding-top: 5px
    font-size: 0.8em

  p.boxed
    background-color: #FFCC66
    padding: 5px

  .stageDelimiter
    color: purple

  // To show (new) pieces, and/or there values...
  figure.showPieces > img
    width: 50px

  figure.showPieces > figcaption
    color: #6C6C6C

  .section-title
    padding: 0

  .section-title > h4
    padding: 5px

  ol, ul:not(.browser-default)
    padding-left: 20px

  ul:not(.browser-default)
    margin-top: 5px

  ul:not(.browser-default) > li
    list-style-type: disc

.light-square-diag
  background-color: #e5e5ca

.dark-square-diag
  background-color: #6f8f57

// TODO: following is duplicated
div.board
  float: left
  height: 0
  display: inline-block
  position: relative

div.board8
  width: 12.5%
  padding-bottom: 12.5%

div.board10
  width: 10%
  padding-bottom: 10%

div.board11
  width: 9.09%
  padding-bottom: 9.1%

img.piece
  width: 100%

img.piece, img.mark-square
  max-width: 100%
  height: auto
  display: block

img.mark-square
  opacity: 0.6
  width: 76%
  position: absolute
  top: 12%
  left: 12%
  opacity: .7

.in-shadow
  filter: brightness(50%)
</style>
<template>
  <div v-on:click="close" class="popup js-close" :class="this.PopUpClass">
    <div class="popup__content">
      <button class="popup__btn js-close"></button>
      <div v-if="ajax" class="popup__resp">
        <div class="popup__left-col">
          <div class="rating">
            <div class="rating__left-col">
              <div class="rating__stars">
                <img
                  v-for="star in stars"
                  :key="star.id"
                  class="rating__star"
                  alt="star"
                  :src="star"
                />
              </div>
              <span class="rating__votes">Votes: {{filmData.imdbVotes}}</span>
            </div>
          </div>
          <div class="poster">
            <img class="poster__image" v-if="filmData.Poster != 'N/A'" :src="filmData.Poster" />
            <img class="poster__image" v-if="filmData.Poster == 'N/A'" src="../assets/poster.png" />
          </div>
        </div>
        <h1>{{filmData.Title}}</h1>
      </div>
      <div v-if="!ajax" class="loader">
        <div class="loader__wrappeer">
          <img class="loader__popcorn" src="../assets/loader-popcorn.svg" />
          <img class="loader__crumb crumb1" src="../assets/loader-crumb1.svg" />
          <img class="loader__crumb crumb2" src="../assets/loader-crumb2.svg" />
          <img class="loader__crumb crumb3" src="../assets/loader-crumb1.svg" />
          <img class="loader__crumb crumb4" src="../assets/loader-crumb2.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "PopUp",
  props: {
    PopUpClass: String,
    filmID: String
  },
  data() {
    return {
      filmData: [],
      stars: [],
      ajax: false
    };
  },
  watch: {
    filmID: function() {
      this.ajax = false;
      axios
        .get(`https://www.omdbapi.com/?apikey=81a9086&i=${this.filmID}`)
        .then(response => {
          this.filmData = response.data;
          this.filmData.Poster = this.filmData.Poster.replace("300", "1000");
          let rating = parseFloat(this.filmData.imdbRating);
          for (let i = 0; i < 10; i++) {
            if (rating > 1) {
              rating = rating - 1;
              this.stars[i] = require("../assets/star10-10.svg");
            } else if (rating > 0) {
              this.stars[i] = require(`../assets/star${Math.round(
                rating * 10
              )}-10.svg`);
              rating = 0;
            } else {
              this.stars[i] = require("../assets/star0-10.svg");
            }
          }
          this.ajax = true;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  methods: {
    close(event) {
      event.stopPropagation();
      if (event.target.matches(".js-close")) {
        this.class = "hide";
        this.$emit("clicked", "hide");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.popup {
  position: fixed;
  background: rgba(9, 3, 49, 0.9);
  width: 100%;
  height: 100%;

  &.hide {
    visibility: hidden;
    z-index: -1000;

    & .popup__content {
      opacity: 0;
    }
  }

  &.show {
    visibility: visible;
    z-index: 1000;

    & .popup__content {
      transition: opacity 1s;
      opacity: 1;
    }
  }

  &__content {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 75%;
    height: 90%;
    background: #090331;
    border-radius: 1.7rem;
    box-shadow: 0px 0px 4rem #ffffff66;
    will-change: opacity;
    overflow: auto;
    transform: translate(-50%, -50%);
  }

  &__resp {
    display: flex;
    width: 100%;
    height: 100%;
  }

  &__btn {
    position: absolute;
    top: 4rem;
    right: 4rem;
    background: transparent;
    width: 3rem;
    height: 3rem;
    border: none;
    cursor: pointer;

    &:hover::after {
      transform: translate(-50%, -50%) rotate(225deg);
    }

    &:hover::before {
      transform: translate(-50%, -50%) rotate(-225deg);
    }

    @mixin after {
      position: absolute;
      height: 2rem;
      width: 0.2rem;
      background: white;
      top: 50%;
      left: 50%;
      will-change: transform;
      transition: transform 0.5s;
    }

    &::after {
      content: "";
      @include after();
      transform: translate(-50%, -50%) rotate(-45deg);
    }

    &::before {
      content: "";
      @include after();
      transform: translate(-50%, -50%) rotate(45deg);
    }
  }

  &__left-col {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 32%;
  }
}

.rating {
  position: absolute;
  display: flex;
  height: 16.3rem;
  width: 100%;
  padding: 0 3.5rem;
  top: 0;
  left: 0;
  background: #f40048;
  border-radius: 1.7rem;
  box-shadow: 0rem 0.3rem 0.6rem #00000029;

  &__votes {
    font-family: "Montserrat", sans-serif;
    font-size: 2.2rem;
  }

  &__star {
    width: 2.3rem;
    height: 2.3rem;
    margin: 0 0.2rem;
  }
}

.poster {
  width: 100%;
  height: calc(100% - 15rem);
  line-height: 0;

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.loader {
  position: relative;
  width: 100%;
  height: 100%;
  background: #090331;

  &__wrappeer {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  &__popcorn {
    height: 10rem;
    width: auto;
  }
  &__crumb {
    position: absolute;
    height: 1.7rem;

    @keyframes jump {
      0% {
        transform: translateY(0rem) rotate(0deg);
      }

      50% {
        transform: translateY(-3rem) rotate(180deg);
      }

      100% {
        transform: translateY(0rem) rotate(360deg);
      }
    }

    &.crumb1 {
      left: -12%;
      top: 0%;
      animation: jump 0.7s 0.5s both infinite;
    }

    &.crumb2 {
      left: 18%;
      top: -20%;
      animation: jump 0.8s 0.1s both infinite;
    }

    &.crumb3 {
      left: 55%;
      top: -23%;
      animation: jump 0.5s 0.2s both infinite;
    }

    &.crumb4 {
      left: 93%;
      top: 0%;
      animation: jump 0.5s both infinite;
    }
  }
}
</style>
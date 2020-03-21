<template>
  <div v-on:click="close" class="popup js-close" :class="PopUpClass">
    <div class="popup__content">
      <button class="popup__btn js-close"></button>
      <div v-if="ajax" class="popup__resp">
        <div class="popup__left-col">
          <div class="rating">
            <div class="rating__left-col">
              <div class="rating__stars">
                <img
                  v-for="(star, index) in stars.src"
                  :key="star.id"
                  class="rating__star"
                  :class="[`rating__star--${index + stars.class[index]}`]"
                  alt="star"
                  :src="star"
                />
              </div>
              <span class="rating__votes">Votes: {{filmData.imdbVotes}}</span>
            </div>
            <div class="rating__numbers">
              <span
                class="rating__number big"
                :class="`num${filmData.imdbRating}`"
              >{{filmData.imdbRating}}</span>
              <span class="rating__number medium">/</span>
              <span class="rating__number small">10</span>
            </div>
          </div>
          <div class="poster">
            <img class="poster__image" v-if="filmData.Poster != 'N/A'" :src="filmData.Poster" />
            <img class="poster__image" v-if="filmData.Poster == 'N/A'" src="../assets/poster.png" />
          </div>
        </div>
        <h1>{{filmData.Title}}</h1>
      </div>
      <Loader v-if="!ajax" clas="popup" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Loader from "./Loader.vue";

export default {
  name: "PopUp",
  props: {
    PopUpClass: String,
    filmID: String
  },

  components: {
    Loader
  },

  data() {
    return {
      filmData: [],
      stars: { src: [], class: [] },
      ajax: false
    };
  },
  watch: {
    filmID: function() {
      if (this.filmID) {
        this.ajax = false;
        axios
          .get(`https://www.omdbapi.com/?apikey=81a9086&i=${this.filmID}`)
          .then(response => {
            this.filmData = response.data;
            this.dataAvailable();
            this.ajax = true;
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  methods: {
    close(event) {
      event.stopPropagation();
      if (event.target.matches(".js-close")) {
        this.class = "hide";
        this.$emit("clicked", "hide");
      }
    },
    dataAvailable() {
      this.filmData.Poster = this.filmData.Poster.replace("300", "1000");

      let rating = parseFloat(this.filmData.imdbRating);
      for (let i = 0; i < 10; i++) {
        if (rating > 1) {
          rating = rating - 1;
          this.stars.src[i] = require("../assets/star10-10.svg");
          this.stars.class[i] = "-anim";
        } else if (rating > 0) {
          this.stars.src[i] = require(`../assets/star${Math.round(
            rating * 10
          )}-10.svg`);
          this.stars.class[i] = "-anim";
          rating = 0;
        } else {
          this.stars.src[i] = require("../assets/star0-10.svg");
          this.stars.class[i] = "-no-anim";
        }
      }

      if (this.filmData.imdbVotes === "N/A") this.filmData.imdbVotes = 0;
      if (this.filmData.imdbRating === "10.0") {
        this.filmData.imdbRating = "10";
      } else if (this.filmData.imdbRating === "N/A") {
        this.filmData.imdbRating = "0";
      } else {
        this.filmData.imdbRating = this.filmData.imdbRating.replace(".", ",");
      }
    },
    getAnimateStyle() {
      return {
        animation: `increase 2s infinite`
      };
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
  align-items: center;
  justify-content: space-between;
  height: 16.3rem;
  width: 100%;
  padding: 0 3rem;
  top: 0;
  left: 0;
  background: #f40048;
  border-radius: 1.7rem;
  box-shadow: 0rem 0.3rem 0.6rem #00000029;

  &__votes {
    font-family: "Montserrat", sans-serif;
    font-size: 2.2rem;
    font-weight: 200;
  }

  @keyframes star {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(2);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes number {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.3);
    }
    100% {
      transform: scale(1);
    }
  }

  &__star {
    width: 2rem;
    height: 2rem;
    margin: 0 0.2rem;

    &--0-anim {
      animation: star 0.3s 0.6s linear both;
    }
    &--1-anim {
      animation: star 0.3s 0.8s linear both;
    }
    &--2-anim {
      animation: star 0.3s 1s linear both;
    }
    &--3-anim {
      animation: star 0.3s 1.2s linear both;
    }
    &--4-anim {
      animation: star 0.3s 1.4s linear both;
    }
    &--5-anim {
      animation: star 0.3s 1.6s linear both;
    }
    &--6-anim {
      animation: star 0.3s 1.8s linear both;
    }
    &--7-anim {
      animation: star 0.3s 2s linear both;
    }
    &--8-anim {
      animation: star 0.3s 2.2s linear both;
    }
    &--9-anim {
      animation: star 0.3s 2.4s linear both;
    }
  }

  &__numbers {
    display: flex;
    align-items: center;
    font-family: "Baloo 2", cursive;
    font-weight: 400;
  }

  &__number {
    &.big {
      font-size: 5rem;
      &:not(.num0) {
        animation: number 0.6s 2.7s both;
      }
    }

    &.medium {
      font-size: 2.9rem;
      margin: 0 0.5rem;
    }

    &.small {
      font-size: 2.9rem;
    }
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
</style>
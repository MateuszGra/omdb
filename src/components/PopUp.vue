<template>
  <div v-on:click="close" class="popup js-close" :class="PopUpClass">
    <img class="popup__glass3d" src="../assets/glasses3d.png" alt="3d glasses" />
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
        <div class="content">
          <div class="content__row-1">
            <h1 class="content__title">{{filmData.Title}}</h1>
            <div class="content__box-1">
              <div class="content__box-row">
                <div class="content__row-time">
                  <div class="clock">
                    <img class="clock__layer1" src="../assets/clock-icon.svg" />
                    <img class="clock__layer2" src="../assets/clock-icon1.svg" />
                    <img class="clock__layer3" src="../assets/clock-icon2.svg" />
                  </div>
                  <span class="content__time">{{filmData.Runtime}}</span>
                </div>
                <div class="separator-vertical"></div>
                <span class="content__type">{{filmData.Type}}</span>
              </div>
              <div class="content__box-row">
                <span class="content__genre-label">Genre:</span>
                <span class="content__genre">{{filmData.Genre}}</span>
              </div>
            </div>
          </div>
          <p class="content__plot">{{filmData.Plot}}</p>
          <div class="content__box-2">
            <div class="content__box-row1">
              <h3 class="label label--big">Actors</h3>
              <ul class="content__actors">
                <li
                  class="content__actor"
                  v-for="actor in filmData.Actors"
                  :key="actor.id"
                >{{actor}}</li>
              </ul>
            </div>
            <div class="content__box-row1">
              <h3 class="label label--big">Awards</h3>
              <p class="content__awards">{{filmData.Awards}}</p>
            </div>
            <div class="content__box-row1">
              <div class="content__col">
                <h4 class="label label--small">Year</h4>
                <p class="content__text">{{filmData.Year}}</p>
              </div>
              <div class="content__col">
                <h4 class="label label--small">Director</h4>
                <p class="content__text">{{filmData.Director}}</p>
              </div>
              <div class="content__col">
                <h4 class="label label--small">Writer</h4>
                <p class="content__text">{{filmData.Writer}}</p>
              </div>
              <div class="content__col">
                <h4 class="label label--small">Production</h4>
                <p class="content__text">{{filmData.Production}}</p>
              </div>
              <div class="content__col">
                <h4 class="label label--small">Country</h4>
                <p class="content__text">{{filmData.Country}}</p>
              </div>
              <div class="content__col">
                <h4 class="label label--small">Language</h4>
                <p class="content__text">{{filmData.Language}}</p>
              </div>
            </div>
          </div>
          <button class="popup__back btn js-close">back</button>
        </div>
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

      this.filmData.Actors = this.filmData.Actors.split(",");
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

  &__back {
    display: none;
  }

  &__content {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 75%;
    max-width: 144rem;
    height: 90%;
    max-height: 90rem;
    background: #090331;
    border-radius: 1.7rem;
    box-shadow: 0px 0px 4rem #ffffff66;
    will-change: opacity;
    transform: translate(-50%, -50%);
  }

  &__glass3d {
    position: absolute;
    top: 67%;
    right: 3%;
    width: 35rem;
    transform: rotate(-35deg);
    z-index: 11;

    &:hover {
      opacity: 0.4;
    }
  }

  &__resp {
    display: flex;
    width: 100%;
    height: 100%;
  }

  &__btn {
    position: absolute;
    top: 2.5rem;
    right: 2.5rem;
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
    margin-left: 1rem;
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
    border-bottom-left-radius: 1.7rem;
  }
}

.content {
  display: flex;
  flex-direction: column;
  padding: 4rem 4%;
  width: 68%;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  &__row-1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-family: "Bebas Neue", cursive;
    font-weight: 400;
    font-size: 4rem;
    line-height: 100%;
    margin: 0;
    width: 43.5%;
  }
  @mixin box {
    display: flex;
    flex-direction: column;
    border: 0.1rem solid rgba(250, 250, 250, 0.2);
    border-radius: 1.7rem;
  }

  &__box-1 {
    padding: 3rem;
    @include box();
    font-family: "Montserrat", sans-serif;
    width: 55%;
  }

  &__box-row {
    display: flex;
    align-items: center;
    justify-content: space-around;

    &:first-child {
      padding-bottom: 2.5rem;
      border-bottom: 0.1rem solid rgba(250, 250, 250, 0.2);
    }

    &:last-child {
      padding-top: 2.5rem;
    }
  }

  &__row-time {
    display: flex;
    align-items: center;
  }
  &__time {
    font-size: 2.2rem;
  }

  &__type {
    font-size: 2.2rem;
    &::first-letter {
      text-transform: uppercase;
    }
  }

  &__genre {
    font-size: 1.6rem;
  }

  &__genre-label {
    font-size: 1.6rem;
    font-weight: 200;
    margin-right: 2rem;
  }

  &__plot {
    display: flex;
    align-items: center;
    font-family: "Montserrat", sans-serif;
    font-size: 1.8rem;
    font-weight: 200;
    width: 100%;
    max-height: 30rem;
    margin: 2rem 0;
    flex-grow: 1;
  }

  &__box-2 {
    @include box();
    align-items: center;
    padding: 3rem 5;
  }

  &__box-row1 {
    display: flex;
    align-items: center;
    border-bottom: 0.1rem solid rgba(250, 250, 250, 0.2);
    width: 95%;
    padding-bottom: 2rem;
    padding-top: 2rem;

    &:last-child {
      flex-direction: column;
      align-items: flex-start;
      border: none;
    }
  }

  &__col {
    display: flex;
    align-items: center;
    width: 100%;
  }

  &__actors {
    font-family: "Montserrat", sans-serif;
    font-size: 1.6rem;
    font-weight: 200;
    line-height: 150%;
    margin-left: 20%;
  }

  &__awards {
    font-family: "Montserrat", sans-serif;
    font-size: 1.6rem;
    font-weight: 200;
    margin-left: 20%;
  }

  &__text {
    font-family: "Montserrat", sans-serif;
    font-size: 1.6rem;
    font-weight: 200;
    margin: 0 0 0 20%;
  }
}

.label {
  font-family: "Bebas Neue", cursive;
  font-weight: 400;
  margin: 0 0 0 7%;
  min-width: 10rem;
}

.label--big {
  font-size: 3.2rem;
}

.label--small {
  font-size: 2.6rem;
}

.clock {
  position: relative;
  width: 4rem;
  height: 4rem;
  margin-right: 3rem;

  &__layer1 {
    width: 100%;
    height: 100%;
  }

  &__layer2 {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: -1;
    transform: translate(-1px, -1px);
  }

  &__layer3 {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: -1;
    transform: translate(1px, 1px);
  }
}

.separator-vertical {
  height: 4rem;
  width: 0.1rem;
  background: rgba(250, 250, 250, 0.2);
}

@media (max-width: 1600px) {
  .popup {
    &__content {
      width: 90%;
    }

    &__glass3d {
      top: 67%;
      right: -5%;
      width: 28rem;
    }

    &__left-col {
      width: 37%;
    }
  }

  .content {
    width: 63%;
  }
}

@media (max-width: 1440px) {
  .popup {
    &__content {
      width: 90%;
    }

    &__glass3d {
      top: 77%;
      right: -5%;
      width: 25rem;
    }
  }
}

@media (max-width: 1300px) {
  .content {
    &__box-1 {
      padding: 2rem;
    }

    &__title {
      font-size: 3.5rem;
    }

    &__time {
      font-size: 1.8rem;
    }
    &__type {
      font-size: 1.8rem;
    }

    &__box-row {
      &:first-child {
        padding-bottom: 1.5rem;
      }

      &:last-child {
        padding-top: 1.5rem;
      }
    }
  }

  .rating {
    &__votes {
      font-size: 1.8rem;
    }

    &__numbers {
      & .big {
        font-size: 4rem;
      }
    }
  }
  .clock {
    height: 3rem;
    width: 3rem;
    margin-right: 1.5rem;
  }
}

@media (max-width: 1024px) {
  body {
    overflow: hidden;
  }

  .popup {
    overflow: auto;

    &__glass3d {
      display: none;
    }

    &__content {
      position: static;
      transform: translate(0);
      margin: 3rem auto;
      height: unset;
      min-height: 90vh;
      max-height: unset;
    }

    &__resp {
      flex-direction: column;
    }

    &__left-col {
      width: 100%;
    }

    &__btn {
      background: #090331;
      z-index: 100;
      top: 0;
      right: 0;
      width: 6rem;
      height: 5.5rem;
      border-top-right-radius: 1.7rem;
    }
  }

  .poster {
    margin-top: 5.5rem;
    height: 40vh;
    &__image {
      border-radius: 0;
      object-position: top;
    }
  }

  .rating {
    height: 7rem;
    width: calc(100% - 6rem);
    border-top-right-radius: 0;

    &__votes {
      font-size: 1.2rem;
    }
  }

  .content {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .popup {
    &__content {
      width: 95%;
    }

    &__back {
      display: block;
      align-self: center;
      text-transform: none;
      font-size: 1.4rem;
      font-weight: 200;
      padding: 1rem 2.5rem 1rem 5.5rem;
      border-radius: 2rem;
      background-image: url("../assets/arrow-icon-rotated.svg");
      background-repeat: no-repeat;
      background-size: 3rem;
      background-position: 2rem center;
      margin-top: 2rem;
    }
  }

  .rating {
    padding: 0 1rem;

    &__number {
      &.big {
        font-size: 3rem;
      }

      &.medium {
        font-size: 2rem;
      }
      &.small {
        font-size: 1.8rem;
      }
    }

    &__star {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  .content {
    padding: 2rem 4%;
    &__row-1 {
      flex-direction: column;
    }

    &__title {
      width: 100%;
      text-align: center;
    }

    &__box-1 {
      width: 100%;
      margin-top: 2rem;
    }

    &__plot {
      text-align: center;
    }

    &__box-row1 {
      flex-direction: column;
      width: 90%;
    }
    &__actors {
      margin-left: 0;
      width: 100%;
      text-align: center;
    }
    &__awards {
      margin-left: 0;
      width: 100%;
      text-align: center;
    }
    &__text {
      font-size: 1.2rem;
      margin-left: 15%;
    }
  }

  .label {
    margin: 0;
    min-width: auto;

    &--big {
      font-size: 2.8rem;
    }
    &--small {
      font-size: 2rem;
      min-width: 7rem;
      margin-left: 5%;
    }
  }
}
</style>
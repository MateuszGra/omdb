<template>
  <div class="container">
    <ParticlesJS />
    <PopUp @clicked="handlePopUp" :PopUpClass="PopUpClass" :filmID="filmID" />
    <router-link class="home-link" to="/">home</router-link>
    <section class="options">
      <form form v-on:submit.prevent="getNewMovies" class="options__row">
        <div class="filters">
          <span class="filters__label">Filter</span>
          <select v-model="filmType" class="filters__option select input" @change="getNewMovies">
            <option value>Type</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="episode">Episode</option>
            <option value="game">Game</option>
          </select>
          <input
            class="filters__option input"
            type="number"
            placeholder="Year"
            min="1870"
            max="9999"
            v-model="filmYear"
          />
        </div>
        <div class="search">
          <input class="input search__input" v-model="filmName" />
          <button class="search__btn btn">SEARCH</button>
        </div>
      </form>
      <div class="results">
        <span>
          Best matched results:
          <span>{{ results }}</span>
        </span>
      </div>
    </section>
    <section class="films">
      <transition name="fade">
        <button v-if="showButton" v-on:click="scrollToTop" class="scroll btn"></button>
      </transition>
      <template v-for="list in films">
        <div
          class="films__film"
          v-for="film in list"
          :key="film.id"
          v-on:click="handleFilm"
          :data-id="film.imdbID"
        >
          <div class="films__info">
            <span class="films__year">{{ film.Year }}</span>
            <span class="films__type" :class="film.Type">{{ film.Type }}</span>
          </div>
          <div class="films__poster-wrapper">
            <img class="films__poster" v-if="film.Poster != 'N/A'" :src="film.Poster" />
            <img class="films__poster" v-if="film.Poster == 'N/A'" src="../assets/poster.png" />
          </div>
          <h2 class="films__title">{{ film.Title }}</h2>
          <span class="films__arrow">read more</span>
        </div>
      </template>
      <Loader v-if="!ajax" clas="search" />
      <img
        v-if="error && winWidth >= 800"
        class="films__no-results"
        alt="no results"
        src="../assets/no-search-result.png"
      />
      <img
        v-if="error && winWidth < 800"
        class="films__no-results"
        alt="no results"
        src="../assets/o-search-resoult-mobile.png"
      />
    </section>
  </div>
</template>

<script>
import axios from "axios";
import PopUp from "./PopUp.vue";
import Loader from "./Loader.vue";
import ParticlesJS from "./ParticlesJS.vue";

export default {
  name: "Search",
  components: {
    PopUp,
    Loader,
    ParticlesJS
  },

  data() {
    return {
      winWidth: window.innerWidth,
      showButton: false,
      prevScrollpos: window.pageYOffset,
      ajax: false,
      PopUpClass: "hide",
      filmID: "",
      cooldownAjax: false,
      films: [],
      results: 0,
      pages: 0,
      error: false,
      filmName: "",
      filmType: "",
      filmYear: null
    };
  },

  created() {
    let hash = window.location.hash.substring(1);
    if (hash) {
      hash = hash.split("&");
      this.filmName = decodeURI(hash[0]);
      this.filmYear = hash[1];
      this.filmType = hash[2];
      if (hash[3]) {
        setTimeout(() => {
          this.PopUpClass = "show";
          this.filmID = hash[3];
        }, 50);
      }
    }
    this.getMovies();
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", () => {
      this.winWidth = window.innerWidth;
    });
  },

  methods: {
    scrollToTop() {
      const targetPosition = 0;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 700;
      let start = null;
      window.requestAnimationFrame(step);

      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        window.scrollTo(
          0,
          easeInOutCubic(progress, startPosition, distance, duration)
        );
        if (progress < duration) window.requestAnimationFrame(step);
      }
      const easeInOutCubic = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t * t + b;
        t -= 2;
        return (c / 2) * (t * t * t + 2) + b;
      };
    },
    handlePopUp(value) {
      this.PopUpClass = value;
      this.filmID = "";
      window.location.hash = `${this.filmName}&${this.filmYear}&${this.filmType}&`;
    },
    handleFilm(event) {
      this.PopUpClass = "show";
      this.filmID = event.target.closest(".films__film").dataset.id;
      window.location.hash = `${this.filmName}&${this.filmYear}&${this.filmType}&${this.filmID}`;
    },
    getNewMovies() {
      this.films = [];
      this.pages = 0;
      this.getMovies();
    },
    handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200 &&
        this.cooldownAjax == false &&
        this.pages < 99 &&
        parseInt(this.results) > this.pages * 10
      ) {
        this.getMovies();
      }

      //show button scroll-to-top
      const currentScrollPos = window.pageYOffset;
      if (
        window.scrollY > window.innerHeight / 2 &&
        this.prevScrollpos > currentScrollPos
      ) {
        this.showButton = true;
      } else {
        this.showButton = false;
      }
      this.prevScrollpos = currentScrollPos;
    },
    bgAnimation() {},
    getMovies() {
      this.pages++;
      this.error = false;
      this.ajax = false;
      axios
        .get(
          `https://www.omdbapi.com/?apikey=81a9086&s=${this.filmName}&y=${this.filmYear}&type=${this.filmType}&page=${this.pages}`
        )
        .then(response => {
          if (response.data.Response === "True") {
            this.films.push(response.data.Search);
            this.results = response.data.totalResults;
          } else {
            if (this.films.length === 0) {
              this.error = true;
              this.results = 0;
            }
          }
          if (this.filmID == "") {
            window.location.hash = `${this.filmName}&${this.filmYear}&${this.filmType}&`;
          } else {
            window.location.hash = `${this.filmName}&${this.filmYear}&${this.filmType}&${this.filmID}`;
          }
          this.ajax = true;
        })
        .catch(error => {
          console.log(error);
        });
      this.cooldownAjax = true;
      setTimeout(() => {
        this.cooldownAjax = false;
      }, 500);
    }
  }
};
</script>


<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.home-link {
  position: absolute;
  top: 5.6rem;
  left: 0;
  font-family: "Montserrat", sans-serif;
  font-size: 2.2rem;
  line-height: 5.6rem;
  font-weight: 500;
  background: #f40048;
  height: 5.3rem;
  color: white;
  padding: 0 7rem 0 2rem;
  border-top-right-radius: 2.7rem;
  border-bottom-right-radius: 2.7rem;
  text-transform: uppercase;
  z-index: 10;
  background-image: url("../assets/home-icon.svg");
  background-repeat: no-repeat;
  background-position: calc(100% - 2rem);
  background-size: 2rem;
  will-change: transition;
  transition: 0.3s;
  transform: translate(-11rem);

  &:hover {
    transform: translate(0);
    box-shadow: 0px 0px 30px #f40048;
  }
}
.input {
  -webkit-appearance: none;
  background: transparent;
  color: white;
  height: 5.3rem;
  border-radius: 2.7rem;
  border: 0.1rem solid rgba(250, 250, 250, 0.3);
  font-size: 2.2rem;
}

.filters {
  &__option {
    padding-left: 3rem;
    margin-left: 2rem;
    font-family: inherit;
    width: 23.7rem;

    option {
      background: #090331;
      margin: 1rem 0;
      cursor: pointer;
    }

    &.select {
      background-image: url("../assets/option.svg");
      background-repeat: no-repeat;
      background-position: calc(100% - 2.5rem);
      background-size: 1.3rem;
      cursor: pointer;
    }

    &::placeholder {
      color: rgba(250, 250, 250, 0.5);
    }

    &:first-child {
      margin-left: 1.5rem;
    }
  }

  &__label {
    font-size: 2rem;
    font-weight: 200;
  }
}

.options {
  font-family: "Montserrat", sans-serif;
  padding: 5.6rem 13% 0 13%;

  &__row {
    display: flex;
    justify-content: space-between;
  }
}

.search {
  &__btn {
    padding: 1.4rem 3.5rem;
    border-radius: 4rem;
  }

  &__input {
    background-image: url("../assets/search1.svg");
    background-repeat: no-repeat;
    background-position: 2.5rem;
    background-size: 2rem;
    padding-left: 6rem;
    width: 30rem;
    margin-right: 1.2rem;
  }
}

.results {
  font-size: 1.7rem;
  margin-top: 1.5rem;
  font-weight: 200;
}

.films {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  padding: 0 calc(13% - 2.5rem);

  &__no-results {
    align-self: flex-end;
    justify-self: center;
    width: 70%;
    margin: 1.5rem auto 0 auto;
  }

  &__film {
    display: flex;
    flex-direction: column;
    margin-top: 6rem;
    padding: 0 2.5rem;
    width: 25%;
    cursor: pointer;

    &:hover .films__poster-wrapper::after {
      transform: scale(1);
    }
    &:hover .films__arrow {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &__poster-wrapper {
    position: relative;
    padding-bottom: 146.81528662420382%;
    width: 100%;
    line-height: 0;
    border-radius: 1.7rem;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      border-radius: 1.7rem;
      box-shadow: -0.7rem -0.7rem 0 #1ea0ef, 0.7rem 0.7rem 0 #f40048;
      transform: scale(0.95);
      will-change: transform;
      transition: transform 0.5s;
    }
  }

  &__poster {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1.7rem;
  }

  &__info {
    font-family: "Montserrat", sans-serif;
    display: flex;
    justify-content: space-between;
    padding: 0 10%;
    margin-bottom: 1.5rem;
    font-size: 2rem;
  }

  &__year {
    font-weight: 200;
  }

  &__type {
    padding-left: 3rem;
    background-repeat: no-repeat;
    background-position: left;
    background-size: 2rem;
    font-weight: 600;

    &::first-letter {
      text-transform: uppercase;
    }

    &.movie,
    &.series,
    &.episode {
      background-image: url("../assets/movie-icon.svg");
    }

    &.game {
      background-image: url("../assets/game-icon.svg");
    }
  }

  &__title {
    padding: 0 10%;
    margin-bottom: 1rem;
    font-family: "Bebas Neue", cursive;
    font-size: 3rem;
    font-weight: 400;
    line-height: 3.2rem;
  }

  &__arrow {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 200;
    padding-left: 5rem;
    margin: 0 0 0 10%;
    background-image: url("../assets/arrow-icon.svg");
    background-repeat: no-repeat;
    background-position: left;
    will-change: transform, opacity;
    transition: transform 0.5s, opacity 0.5s;
    opacity: 0;
    transform: translateY(2rem);
  }
}

.scroll {
  position: fixed;
  height: 6rem;
  width: 6rem;
  bottom: 5%;
  right: 4%;
  border-radius: 17px;
  background-image: url("../assets/scroll.svg");
  background-size: 2rem;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 10;
}

@media (max-width: 1440px) {
  .options {
    padding: 5.6rem 10% 0 10%;
  }

  .scroll {
    right: 3%;
  }

  .films {
    padding: 0 8%;

    &__title {
      font-size: 2.5rem;
      margin-top: 1.5rem;
    }

    &__year {
      font-size: 1.6rem;
    }

    &__type {
      font-size: 1.6rem;
      background-size: 1.6rem;
    }
    &__info {
      margin-bottom: 1rem;
    }
  }
}

@media (max-width: 1380px) {
  .home-link {
    height: 4rem;
    background-size: 1.6rem;
    background-position: calc(100% - 1.8rem);
    font-size: 1.6rem;
    line-height: 4rem;
    padding: 0 5rem 0 1rem;
    transform: translate(-7rem);
  }
  .input {
    height: 4rem;
    font-size: 1.6rem;
  }
  .filters {
    &__label {
      font-size: 1.6rem;
    }

    &__option {
      width: 20rem;
    }
  }

  .search {
    &__input {
      width: 25rem;
      background-size: 1.6rem;
      padding-left: 4rem;
      background-position: 1.5rem;
    }

    &__btn {
      font-size: 1.6rem;
      padding: 1.2rem 3rem;
    }
  }

  .results {
    font-size: 1.4rem;
  }

  .films {
    &__arrow {
      font-size: 1.6rem;
      background-size: 3rem;
      padding-left: 4rem;
    }
  }
}

@media (max-width: 1380px) {
  .filters {
    width: 60%;
  }

  .input {
    width: 30%;
  }

  .search {
    display: flex;
    width: 40%;

    &__input {
      flex-grow: 1;
    }
  }

  .films {
    &__poster-wrapper {
      &::after {
        box-shadow: -0.4rem -0.4rem 0 #1ea0ef, 0.4rem 0.4rem 0 #f40048;
      }
    }
  }
}

@media (max-width: 1024px) {
  .filters {
    &__option {
      padding-left: 2rem;
    }
  }
  .films {
    &__film {
      width: 33%;
    }
  }
}

@media (max-width: 1000px) {
  .home-link {
    &:hover {
      transform: translate(-7rem);
      box-shadow: none;
    }
  }
  .films {
    &__film {
      width: 33%;
    }
    &__no-results {
      width: 90%;
    }
  }

  .options {
    &__row {
      flex-direction: column;
    }
  }

  .filters {
    display: flex;
    align-items: center;
    width: 100%;

    &__option {
      flex-grow: 1;
    }
  }

  .search {
    width: 100%;
    margin-top: 2rem;
  }
}

@media (max-width: 800px) {
  .home-link {
    top: 2rem;
  }

  .search {
    margin-top: 1rem;

    &__btn {
      padding: 1.2rem 1.5rem;
    }
  }

  .options {
    padding: 7rem 5% 0 5%;
  }

  .filters {
    &__option {
      margin-left: 0.8rem;
    }
  }
  .films {
    padding: 0 3%;

    &__no-results {
      width: 100%;
    }

    &__arrow {
      display: none;
    }

    &__title {
      font-size: 2rem;
      line-height: 110%;
      margin: 1rem 0 0 0;
      padding: 0 7%;
    }

    &__year {
      font-size: 1.2rem;
    }

    &__type {
      font-size: 1.2rem;
      background-size: 1.2rem;
      padding-left: 2rem;
    }

    &__info {
      margin-bottom: 0.5rem;
      padding: 0 7%;
    }
  }
}

@media (max-width: 600px) {
  .scroll {
    width: 4.5rem;
    height: 4.5rem;
    background-size: 1.5rem;
  }

  .films {
    &__film {
      width: 50%;
      margin-top: 3rem;
      padding: 0 1.5rem;
    }
  }
}
</style>

<template>
  <div>
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
    <ul class="films">
      <template v-for="list in films">
        <li class="films__film" v-for="film in list" :key="film.imdbID">
          <div class="films__info">
            <span class="films__year">{{ film.Year }}</span>
            <span class="films__type" v-bind:class="film.Type">{{ film.Type }}</span>
          </div>
          <div class="films__poster-wrapper">
            <img class="films__poster" v-if="film.Poster != 'N/A'" :src="film.Poster" />
            <img class="films__poster" v-if="film.Poster == 'N/A'" src="../assets/poster.png" />
          </div>
          <h2 class="films__title">{{ film.Title }}</h2>
          <span class="films__arrow">read more</span>
        </li>
      </template>
      <p v-if="error">Brak wyników :(</p>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Search",
  created() {
    let hash = window.location.hash.substring(1);
    if (hash) {
      hash = hash.split("&");
      this.filmName = decodeURI(hash[0]);
      this.filmYear = hash[1];
      this.filmType = hash[2];
    }
    this.getMovies();
    window.addEventListener("scroll", this.handleScroll);
  },

  data() {
    return {
      cooldownAjax: false,
      films: [],
      results: 0,
      pages: 0,
      error: false,
      filmName: "Star Wars",
      filmType: "",
      filmYear: null
    };
  },

  methods: {
    getNewMovies() {
      this.films = [];
      this.pages = 0;
      this.getMovies();
    },
    handleScroll() {
      let windowBottom = document.documentElement.getBoundingClientRect()
        .bottom;
      console.log(this.results);
      console.log(this.pages * 20);
      if (
        windowBottom < document.documentElement.clientHeight + 100 &&
        this.cooldownAjax == false &&
        this.pages < 99 &&
        this.results > this.pages * 10
      ) {
        this.getMovies();
      }
    },
    getMovies() {
      for (let i = 1; i < 3; i++) {
        this.pages++;
        axios
          .get(
            `https://www.omdbapi.com/?apikey=81a9086&s=${this.filmName}&y=${this.filmYear}&type=${this.filmType}&page=${this.pages}`
          )
          .then(response => {
            if (response.data.Search != undefined) {
              this.films.push(response.data.Search);
              this.results = response.data.totalResults;
              this.error = false;
            } else {
              this.error = true;
              this.results = 0;
              return "stop";
            }
            window.location.hash = `${this.filmName}&${this.filmYear}&${this.filmType}`;
          })
          .catch(error => {
            console.log(error);
          });
      }
      this.cooldownAjax = true;
      setTimeout(() => {
        this.cooldownAjax = false;
      }, 500);
    }
  }
};
</script>


<style lang="scss" scoped>
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
  padding: 0 calc(13% - 2.5rem);

  &__film {
    display: flex;
    flex-direction: column;
    margin-top: 6rem;
    padding: 0 2.5rem;
    width: calc(25%);
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
</style>

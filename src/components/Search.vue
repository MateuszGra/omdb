<template>
  <div>
    <section class="options">
      <div class="options__row">
        <div class="filters">
          <span class="filters__label">Filter</span>
          <select class="filters__option select input">
            <option value="null">Type</option>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="episode">Episode</option>
          </select>
          <input class="filters__option input" type="number" placeholder="Year" v-model="year" />
        </div>
        <form v-on:submit.prevent="getMovies" class="search">
          <input class="input search__input" v-model="filmName" />
          <button class="search__btn btn">SEARCH</button>
        </form>
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
            <img class="films__poster" v-if="film.Poster == 'N/A'" src="../assets/popcorn.png" />
          </div>
          <h2 class="films__title">{{ film.Title }}</h2>
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
    if (hash) this.filmName = decodeURI(hash);
    this.getMovies();
  },

  data() {
    return {
      films: [],
      error: false,
      filmName: "Star Wars",
      year: null
    };
  },

  methods: {
    getMovies() {
      this.films = [];
      for (let i = 1; i < 3; i++) {
        axios
          .get(
            `https://www.omdbapi.com/?apikey=81a9086&s=${this.filmName}&page=${i}`
          )
          .then(response => {
            if (response.data.Search != undefined) {
              this.films.push(response.data.Search);
              this.error = false;
            } else {
              i = 3;
              this.error = true;
            }
            window.location.hash = this.filmName;
          })
          .catch(error => {
            console.log(error);
          });
      }
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
  border: 0.1rem solid white;
  font-size: 2.2rem;
}

.filters {
  &__option {
    padding-left: 3rem;
    margin-left: 2rem;
    font-family: inherit;
    width: 23.7rem;

    &.select {
      background-image: url("../assets/option.svg");
      background-repeat: no-repeat;
      background-position: calc(100% - 2.5rem);
      background-size: 1.3rem;
    }

    &::placeholder {
      color: white;
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
  padding: 5.6rem 10% 0 10%;

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

.films {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 calc(10% - 2.5rem);

  &__film {
    display: flex;
    flex-direction: column;
    margin-top: 12rem;
    padding: 0 2.5rem;
    width: calc(25%);
    cursor: pointer;

    &:hover .films__poster-wrapper {
      box-shadow: -0.7rem -0.7rem 0 #1ea0ef, 0.7rem 0.7rem 0 #f40048;
    }
  }

  &__poster-wrapper {
    position: relative;
    padding-bottom: 146.81528662420382%;
    width: 100%;
    line-height: 0;
    border-radius: 1.7rem;
    box-shadow: 0 0 0 #1ea0ef, 0 0 0 #f40048;
    will-change: box-shadow;
    transition: box-shadow 0.5s;
  }

  &__poster {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__info {
    font-family: "Montserrat", sans-serif;
    display: flex;
    justify-content: space-between;
    padding: 0 10%;
    margin-bottom: 2rem;
    font-size: 2rem;
  }

  &__type {
    padding-left: 4.5rem;
    background-repeat: no-repeat;
    background-position: left;
    background-size: 4.5rem;
    font-weight: 600;

    &::first-letter {
      text-transform: uppercase;
    }

    &.movie,
    &.series,
    &.episode {
      background-image: url("../assets/movie-icon.svg");
    }
  }

  &__title {
    padding: 0 10%;
    font-family: "Bebas Neue", cursive;
    font-size: 3rem;
    font-weight: 400;
  }
}
</style>

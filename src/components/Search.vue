<template>
  <div>
    <input v-model="filmName" />
    <button v-on:click="test">TEST</button>
    <ul>
      <template v-for="list in films">
        <li v-for="film in list" :key="film">
          <h2>{{ film.Title }}</h2>
          <div class="img-wrapper">
            <img v-if="film.Poster != 'N/A'" :src="film.Poster" />
          </div>
        </li>
      </template>
      <p v-if="error">Brak wyników :(</p>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "Search",
  computed: mapState(["filmName"]),

  data() {
    return {
      films: [],
      error: false
    };
  },

  methods: {
    test() {
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
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>


<style scoped>
</style>

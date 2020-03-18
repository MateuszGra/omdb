import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        filmName: 'Star Wars'
    },
    mutations: {
        increment(state, string) {
            state.filmName = string;
        }
    }
});
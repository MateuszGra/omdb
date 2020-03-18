import Vue from "vue";
import Router from "vue-router";
import Search from "./components/Search.vue";
import Header from "./components/Header.vue";
Vue.use(Router);


const routes = {
    '/': Header,
    '/search': Search
}

new Vue({
    el: '#app',
    data: {
        currentRoute: window.location.pathname
    },
    computed: {
        ViewComponent() {
            return routes[this.currentRoute]
        }
    },
    render(h) {
        return h(this.ViewComponent)
    }
})
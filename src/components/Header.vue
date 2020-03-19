<template>
  <header class="header">
    <img class="header__bg-title" src="../assets/movie.svg" />
    <div class="header__images">
      <div class="header__popcorn">
        <img class="header__image" src="../assets/popcorn.png" alt="popcorn" />
        <img class="header__shadow left" src="../assets/popcorn-svg-blue.svg" alt="popcorn shadow" />
        <img class="header__shadow right" src="../assets/popcorn-svg-red.svg" alt="popcorn shadow" />
        <img class="header__fall" src="../assets/popcorn1.png" alt="popcorn" />
        <img class="header__glass3d" src="../assets/glasses3d.png" alt="3d glasses" />
      </div>
    </div>
    <div class="header__content">
      <div class="header__col">
        <h2 class="header__subtitle">find movie with</h2>
        <h1 class="header__title">
          <span>Open movie</span>
          <span>database</span>
        </h1>
        <form class="search-bar" v-on:submit.prevent="changeLocation">
          <input type="text" v-model="filmName" class="search-bar__input" />
          <button class="search-bar__btn btn" to="/search">Search</button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",

  data() {
    return {
      filmName: "Star Wars"
    };
  },

  methods: {
    changeLocation() {
      if (this.filmName != "") {
        window.location = `./search#${this.filmName}`;
      } else {
        window.location = `./search`;
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.header {
  position: relative;
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;

  &__bg-title {
    position: absolute;
    opacity: 0.04;
    width: 100%;
    z-index: -1;
    top: 7%;
  }

  &__images {
    position: relative;
    width: 38%;
  }
  &__popcorn {
    width: 107%;
    position: absolute;
    left: -13.5%;
    bottom: -7%;
    animation: popcorn 0.5s 3s both linear;
  }

  &__image {
    width: 100%;
  }

  &__shadow {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;

    &.left {
      transform: translateX(-2%);
      z-index: -1;
    }
    &.right {
      transform: translateX(1.5%);
      z-index: -2;
    }
  }

  &__fall {
    width: 15%;
    top: 25%;
    left: 30%;
    height: auto;
    position: absolute;
    z-index: 3;
    animation: fall 1.3s 3.8s both;
  }

  &__glass3d {
    width: 107%;
    position: absolute;
    bottom: 23%;
    left: 20%;
    transform: rotate(-58deg);
    z-index: 2;
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-left: 8%;
    animation: show-right 1s 0.6s both linear;
  }

  &__title {
    font-family: "Bebas Neue", cursive;
    font-size: 20rem;
    font-weight: 400;
    text-shadow: -0.5rem 0 0 #1ea0ef, 0.5rem 0 0 #f40048;
    letter-spacing: 0.2rem;
    line-height: 100%;
    margin: 2rem 0;
    transition: 0.3s;

    & span {
      display: block;
    }
  }

  &__subtitle {
    font-family: "Montserrat", sans-serif;
    text-transform: uppercase;
    font-size: 3.5rem;
    margin: 0;
  }
}

.search-bar {
  width: 100%;

  &__input {
    height: 8.2rem;
    width: 70%;
    border-radius: 4rem;
    background: transparent;
    border: 1px solid white;
    background-image: url("../assets/search1.svg");
    background-repeat: no-repeat;
    background-position: 2.5rem;
    background-size: 3rem;
    padding-left: 8rem;
    font-family: "Montserrat", sans-serif;
    font-size: 2.2rem;
    animation: show-input 1s 1s both linear;
    color: white;
  }
  &__btn {
    margin-left: 2rem;
    border-radius: 4.1rem;
    animation: show-btn 1s 2s both linear;
    padding: 2.8rem 5.4rem;
  }
}

@keyframes show-input {
  0% {
    max-width: 8.2rem;
  }
  100% {
    max-width: 100%;
  }
}

@keyframes show-btn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes show-right {
  0% {
    transform: translateX(2rem);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes popcorn {
  0% {
    transform: rotate(0deg);
  }
  20% {
    transform: rotate(5deg);
  }
  40% {
    transform: rotate(-5deg);
  }
  60% {
    transform: rotate(3deg);
  }
  80% {
    transform: rotate(-3deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes fall {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100vh);
  }
}
</style>

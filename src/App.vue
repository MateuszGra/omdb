<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>


<style lang="scss">
* {
  box-sizing: border-box;
}

html {
  font-size: 62.5%;
}

body {
  background: #090331;
  margin: 0;
}

h1,
h2,
h3,
h4,
h5,
p,
span {
  color: white;
}

input,
button,
a {
  outline: none;
}

.btn {
  font-family: "Montserrat", sans-serif;
  font-size: 2.2rem;
  font-weight: 500;
  color: white;
  background: #f40048;
  text-transform: uppercase;
  border: none;
  cursor: pointer;

  &:hover {
    box-shadow: 0px 0px 30px #f40048;
  }
}
</style>

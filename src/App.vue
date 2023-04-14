<template>
  <div id="app">
    <testing-entry/>
  </div>
</template>

<script>
import TestingEntry from './testing/TestingEntry.vue'

export default {
  name: 'App',
  components: {
    TestingEntry
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

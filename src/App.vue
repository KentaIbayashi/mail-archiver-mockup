<template>
  <div id="app">
    <mail-archiver />
  </div>
</template>

<script>
import MailArchiver from './components/MailArchiver.vue'

export default {
  name: 'App',
  components: {
    MailArchiver
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<template>
  <FlowChart />
</template>

<script>
import FlowChart from './components/flowChart.vue'

export default {
  name: 'App',
  components: {
    FlowChart
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
  margin-top: 60px;
}
p{
  margin: 0;
}
</style>

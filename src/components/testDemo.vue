<template>
    <!-- <div :class="{'toolDefault': true,'toolDisabeld':title === true}">属性区 -->
    <div :class="title ? 'toolDisabeld' : 'toolDefault'">属性区
        <button @click="change()">切换</button>
    </div>
</template>
<script>
export default {
    name:'TestDemo',
    data(){
        return {
            title: false
        }
    },
    methods:{
        change(){
            this.title = !this.title
            console.log('this.title', this.title)
        },
    }
}
</script>
<style lang="scss" scoped>
.toolDisabeld{
    color: blue;
  }
  .toolDefault{
    color: red;
  }
</style>
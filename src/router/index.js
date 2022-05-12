import {createRouter,createWebHistory} from 'vue-router'

let routerArr = []
function importAll(r, list) {
    r.keys().forEach((key) => list.push(r(key).default))
}
  
importAll(require.context('./module', true, /router\.js/), routerArr)

export default createRouter({
  history: createWebHistory(), // createWebHistory注意要用方法不能用变量
  routes: routerArr
})
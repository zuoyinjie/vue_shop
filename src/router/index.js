import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Right from '../components/rights/Rights.vue'
import Roles from '../components/rights/Roles.vue'
import Cate from '../components/goods/Cate.vue'

Vue.use(VueRouter)

const routes = [
  {path:'/',redirect:'/login'},
  {path:'/login',component:Login},
  {path:'/home',component:Home,redirect:'/welcome',
  children:[{path:'/welcome',component:Welcome},
  {path:"/users",component:Users},
  {path:"/rights",component:Right},
  {path:"/roles",component:Roles},
  {path:"/categories",component:Cate},
]}
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.path==='/login'){
    return next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if(tokenStr){
    return next()
  }else{
    return next('/login')
  }
})

export default router

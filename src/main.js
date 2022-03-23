import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'



Vue.config.productionTip = false
// 设置基本url与挂载axios到vue原型
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
// 设置axios拦截器 给请求头添加Autorization token 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须返回config
  return config
})
Vue.prototype.$http = axios
Vue.component('tree-table',TreeTable)
//定义全局时间过滤器
Vue.filter('dateFormat',function(dateVal){
    const date = new Date(dateVal)

    const y = date.getFullYear()
    const m = (date.getMonth() + 1 + '').padStart(2,'0')
    const d = (date.getDate()  + '').padStart(2,'0')

    const hh = (date.getHours() + '').padStart(2,'0')
    const mm = (date.getMinutes() + '').padStart(2,'0')
    const ss = (date.getSeconds() + '').padStart(2,'0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 注册全局富文本编辑器
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

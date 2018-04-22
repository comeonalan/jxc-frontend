// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
// css文件需手动引入 
import 'element-ui/lib/theme-chalk/index.css'
import Vuex from 'Vuex'
import 'font-awesome/css/font-awesome.min.css'
import VueRouter from 'vue-router'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
 
//设置 Vue.config.productionTip = false 来关闭生产模式下给出的提示
Vue.config.productionTip = false
Vue.prototype.$ajax = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import addShop from '../views/addShop.vue'
import view2 from '../views/view2.vue'
import home from '../views/home.vue'
import addProduct from '../views/addProduct.vue'

//厂家管理
 
import displayVender from '../views/vender/displayVender.vue'

Vue.use(Router)

export default new Router({
  linkActiveClass:'active',
  routes: [
//     {
//       path: '/addShop',
//       component:addShop

//   },
//   {
//       path:'/view2',
//       component:view2
//   },
//https://9iphp.com/fa-icons  找icon
  {
      path:'/',
      component:home,
      name:'厂家管理',
      iconCls:'fa fa-id-card-o', //图片样式class
      leaf: true,
      children:[
         
        { path: '/displayVender', component: displayVender, name: '厂家管理' }
        
      ]
  },
  {
    path: '/',
    component: home,
    name: '商品管理',
    iconCls: 'fa fa-cube',
    children: [
        { path: '/addShop', component: addShop, name: '页面4' },
        { path: '/addShop', component: addShop, name: '页面5' }
    ]
},
{
    path: '/',
    component: home,
    name: '客户管理',
    iconCls: 'fa fa-address-card',
    // leaf: true,//只有一个节点
    children: [
        { path: '/addShop', component: addShop, name: '客户' }
    ]
},
{
    path: '/',
    component: home,
    name: '订单管理',
    iconCls: 'fa fa-file-text-o',
    // leaf: true,//只有一个节点
    children: [
        { path: '/addShop', component: addShop, name: '客户' }
    ]
},
{
    path: '/',
    component: home,
    name: '店铺管理',
    iconCls: 'fa fa-bank',
    // leaf: true,//只有一个节点
    children: [
        { path: '/addShop', component: addShop, name: '客户' }
    ]
},
{
    path: '/',
    component: home,
    name: '图表分析',
    iconCls: 'fa fa-bar-chart',
    children: [
        { path: '/addShop', component: addShop, name: 'echarts' }
    ]
},
  ]
})

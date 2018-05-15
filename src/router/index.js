import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
 
import home from '../views/home.vue'

//厂家管理
import displayVender from '../views/vender/displayVender.vue'
//商品管理
import product from '../views/product/product.vue'
//店铺管理
import shop from '../views/shop/shop.vue'
//客户管理
import customer from '../views/customer/customer.vue'
//订单管理
import order from '../views/order/order.vue'
import addOrder from '../views/order/addOrder.vue'
//import orderDetail from '../views/orderItem/orderDetail.vue'
import orderDetail2 from '../views/orderItem/orderDetail2.vue'
//电子图表分析
import echart from '../views/echart/echart.vue'

Vue.use(Router)

export default new Router({
  linkActiveClass:'active',
  routes: [
  
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
    leaf: true,
    children: [
        { path: '/product', component: product, name: '商品管理' }
         
    ]
},
{
    path: '/',
    component: home,
    name: '客户管理',
    iconCls: 'fa fa-address-card',
    leaf: true,//只有一个节点
    children: [
        { path: '/customer', component: customer, name: '客户管理' }
    ]
},
{
    path: '/',
    component: home,
    name: '订单管理',
    iconCls: 'fa fa-file-text-o',
    //leaf: true,//只有一个节点
    children: [
        { path: '/order', component: order, name: '查询订单' },
        { path: '/addOrder', component: addOrder, name: '新增订单' },
        { path: '/orderDetail', component: orderDetail2, name: '添加订单商品',hidden:true}
         
    ]
},
{
    path: '/',
    component: home,
    name: '店铺管理',
    iconCls: 'fa fa-bank',
    leaf: true,//只有一个节点
    children: [
        { path: '/shop', component: shop, name: '店铺管理' }
    ]
},
{
    path: '/',
    component: home,
    name: '图表分析',
    iconCls: 'fa fa-bar-chart',
    children: [
        { path: '/echart', component: echart, name: 'echart' }
    ]
}

 
 
  ]
})

<template>
　　<div id="firstcomponent">

<!-- 　　　　<a href="/view3"> 页面1 </a>  -->
<!-- 路由出口 -->
<!-- 路由匹配到的组件将渲染在这里 -->
<router-link to="/addShop">Go to view1</router-link>
<router-link to="/view2">Go to view2</router-link>

　　<div id="nav">
    <ul>
     <li v-for="(relation,index) in relations" v-bind:key="relation.id" v-bind:class="{checked:index==nowIndex}"
      v-on:click="relationClick(index)">
     <i></i>
     <span class="">{{relation.text}}</span>  
     </li>

    </ul>

　　</div>



<router-view></router-view>
　　</div>
</template>
 
 
  <script type="text/javascript">  

    export default {
      name:'nav',  
      data:{  
        relations: [  
          {text:'项目',id:'program'},  
          {text:'人员',id:'person'},  
          {text:'机构',id:'organization'},  
          {text:'技术',id:'tech'},  
          {text:'地区',id:'location'},  
          {text:'国家',id:'country'}  
        ],  
        nowIndex:-1,  
        methods:{  
        relationClick:function(index){  
          this.nowIndex=index;  
        }  
      }  
    }
    }
 </script>


<style>
*{  
    margin:0;  
    padding: 0;  
  }  
  ul li{  
    list-style: none;  
  }  
  .navul{  
    margin:100px auto 20px;  
    overflow: hidden;  
  }  
  .navul li{  
    background-color: #5597b4;  
    padding:18px 30px;  
    float:left;  
    color: #fff;  
    font-size: 18px;  
    cursor: pointer;  
  }  
  .active{  
    background-color: #5597b4;  
  }  
  .home .home,.new .new,.contact .contact,.service .service{  
    background-color: skyblue;  
  }  
  .checked{  
       background: #eff4f7;  
   } 
</style>
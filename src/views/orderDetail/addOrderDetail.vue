<template>
<section>
<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" style="margin:20px;width:60%;min-width:600px;">
				 
			
				<el-form-item label="店铺名称">
					 
        <el-select v-model="addForm.shopName"  filterable placeholder="请选择店铺">
            <el-option
           v-for="item in shops"
           :key="item.id"
          :label="item.name"
           :value="item.name">
         </el-option>
            </el-select>

				</el-form-item>

                <el-form-item label="客户姓名" >
                    <el-select v-model="addForm.customerId"  filterable placeholder="请选择客户">
       <el-option
      v-for="item in customers"
      :key="item.id"
      :label="item.name"
      :value="item.id">
         </el-option>
              </el-select>
					 
				</el-form-item>


                <el-form-item label="下单日期">
   <el-date-picker type="date" placeholder="选择日期" v-model="addForm.orderDate" style="width: 100%;"></el-date-picker>
                </el-form-item>
			 
				<el-form-item label="商品型号" >
				<el-select v-model="addForm.productType"  filterable placeholder="选择商品型号">
       <el-option
      v-for="item in products"
      :key="item.id"
      :label="item.name"
      :value="item.id">
         </el-option>
              </el-select>
				</el-form-item>

                <el-form-item label="进货单价">
                   <el-input   v-model="addForm.venderUnitPrice"></el-input>
 
                </el-form-item>

                 <el-form-item label="出售单价">
                   <el-input   v-model="addForm.sellUnitPrice"></el-input>
 
                </el-form-item>

                 <el-form-item label="出售数量">
                   
 <el-input-number v-model="addForm.quantity" @change="handleChange" :min="1" ></el-input-number>
                </el-form-item>

               <el-form-item >
			<el-button type="primary" @click.native="addSubmit" :loading="addLoading">立即创建</el-button>
			<el-button @click.native.prevent>取消</el-button>
               </el-form-item>
			</el-form>
		 

			 
</section>
</template>

<<script>
import axios from "axios";
export default {
  data() {
    return {
  addLoading: false,
      addFormRules: {
		name: [{ required: true, message: "请输入店铺名称", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {  
        name: "",
        address: "",
        quantity:1
      },
      shops:[],
      customers:[],
      products:[]
    };
},
methods: {
    getShops() {
        this.shops = [{"id":122,"name":"aaa",type:"1223","venderName":"aaaas"},
        {"id":123,"name":"bbb",type:"122311223","venderName":"aaaas"}]
    //   let para = { name: ""};
      
    //   let that = this;
    //   axios
    //     .get("/shop/getShopsByName", { params: para })
    //     .then(function(e) {
    //       console.log(e);
    //       that.shops = e.data.shops;
           
    //     })
    //     .catch(function() {
           
    //     });
    },

      getCustomers() {
        this.customers = [{"id":122,"name":"aaa",type:"1223","venderName":"aaaas"},
        {"id":123,"name":"bbb",type:"122311223","venderName":"aaaas"}]
    //   let para = { name: "" };
      
    //   let that = this;
    //   axios
    //     .get("/customer/getCustomersByName", { params: para })
    //     .then(function(e) {
    //       console.log(e);
    //       that.customers = e.data.customers;
       
    //     });
        
    },

      getProducts() {
        this.products = [{"id":122,"name":"aaa",type:"1223","venderName":"aaaas"},
        {"id":123,"name":"bbb",type:"122311223","venderName":"aaaas"}]
    //   let para = { type: this.filters.type };
    //   this.listLoading = true;
    //   let that = this;
    //   axios
    //     .get("/product/getProductsByType", { params: para })
    //     .then(function(e) {
    //       console.log(e);
    //       that.products = e.data.products;
    //     })
    //     .catch(function() { 
    //     });
    },



},

 mounted() {
  this.getShops();
  this.getCustomers();
  this.getProducts(); 	 
  }


}
</script>

  
 

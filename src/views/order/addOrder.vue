<template>
<section>
<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm" style="margin:20px;width:60%;min-width:600px;">
				 
			
		<el-form-item label="店铺名称" prop="shopName">
					 
        <el-select v-model="addForm.shopName"  filterable placeholder="请选择店铺">
            <el-option
           v-for="item in shops"
           :key="item.id"
          :label="item.name"
           :value="item.name">
         </el-option>
            </el-select>

				</el-form-item>

                <el-form-item label="客户姓名" prop="customerId">
                    <el-select v-model="addForm.customerId"  filterable placeholder="请选择客户">
       <el-option
      v-for="item in customers"
      :key="item.id"
      :label="item.name"
      :value="item.id">
         </el-option>
              </el-select>
					 
				</el-form-item>


                <el-form-item label="下单日期" prop="orderDate">
   <el-date-picker type="date" placeholder="选择日期" v-model="addForm.orderDate" style="width: 100%;"></el-date-picker>
                </el-form-item>
          

                 <el-form-item label="定金(元)" prop="deposit">
                   <el-input   v-model="addForm.deposit"></el-input>
 
                </el-form-item>

         

               <el-form-item >
			<el-button type="primary" @click.native="addSubmit" :loading="addLoading">立即创建</el-button>
			 <el-button  @click="resetForm">重置</el-button>
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
        shopName: [{ required: true, message: "请选择店铺名称", trigger: "change" }],
        orderDate:[{ required: true, message: "请选择日期", trigger: "change" }],
        deposit:[{ required: true, message: "请输入定金", trigger: "blur" }],
        customerId:[{ required: true, message: "请选择客户", trigger: "change" }]
      },
      //新增界面数据
      addForm: {  
        shopName: "",
        customerId: "",
        orderDate:"",
        deposit:""
      },
      shops:[],
      customers:[]
    
    };
},
methods: {
    getShops() {
        // this.shops = [{"id":122,"name":"aaa",type:"1223","venderName":"aaaas"},
        // {"id":123,"name":"bbb",type:"122311223","venderName":"aaaas"}]
      let para = { name: ""};  
      let that = this;
      axios
        .get("/shop/getShopsByName", { params: para })
        .then(function(e) {
          console.log(e);
          that.shops = e.data.shops;
           
        })
        .catch(function() {
           
        });
    },

      getCustomers() {
        // this.customers = [{"id":122,"name":"aaa",type:"1223","venderName":"aaaas"},
        // {"id":123,"name":"bbb",type:"122311223","venderName":"aaaas"}]
      let para = { name: "" };     
      let that = this;
      axios
        .get("/customer/getCustomersByName", { params: para })
        .then(function(e) {
          console.log(e);
          that.customers = e.data.customers;
       
        });
        
    },

        //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
			let para = Object.assign({}, this.addForm);
			console.log(this.addForm);
            let that = this;
            axios
              .post("/order/addNewOrder", para)
              .then(function(res) {
                console.log(res);
                that.addLoading = false;
                that.$message({
                  message: "提交成功",
                  type: "success"
                });
                that.$refs["addForm"].resetFields();
                
                 
              })
              .catch(function() {
                that.addLoading = false;
                that.$message({
                  message: "提交失败",
                  type: "error"
                });
                that.$refs["addForm"].resetFields();
                 
                 
              });
          });
        }
      });
    },

     resetForm: function(){
        this.$refs["addForm"].resetFields();
      },

 



},

 mounted() {
  this.getShops();
  this.getCustomers();
  }


}
</script>

  
 

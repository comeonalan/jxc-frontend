<template>
<section>
<div class="orderInfo">	
<pre>
  <label class="header">店铺名称: </label>{{currentOrder.shopName}} <label class="header">客户姓名: </label>{{currentOrder.customerName}} <label class="header">下单日期：</label>{{currentOrder.orderDate}}
</pre>
			</div>

		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
                    <el-select v-model="filters.type"  filterable placeholder="请选择商品型号">
       <el-option
      v-for="item in filterProducts"
      :key="item.id"
      :label="item.type"
      :value="item.type">
         </el-option>
              </el-select>
 					 
                     
				</el-form-item>
                
				<el-form-item>
					<el-button type="primary" v-on:click="getOrderItemsByType">查询</el-button>
				</el-form-item>

        <el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orderItems" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
		 <!-- <el-table-column prop="id" v-if=false width="180" >
			</el-table-column> -->
			 <el-table-column prop="venderName" label="厂家名称"  width="100" sortable>
			</el-table-column>
		 
             <el-table-column prop="productType" label="商品型号"  width="120" sortable>
			</el-table-column>

             <el-table-column prop="venderUnitPrice" label="进货单价"  width="100" sortable>
			</el-table-column>

              <el-table-column prop="sellUnitPrice" label="出售单价"  width="100" sortable>
			</el-table-column>
       
        <el-table-column prop="quantity" label="出售数量"  width="100" sortable>
			</el-table-column>

            <el-table-column prop="sellTotalPrice" label="出售总价"  width="100" sortable>
			</el-table-column>

            <el-table-column prop="profit" label="利润"  width="100" sortable>
			</el-table-column>
            

			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<!-- <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"  style="float:right;">
			</el-pagination> -->
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				
				 <el-form-item v-if=false  prop="id">
					<el-input v-model="editForm.id" auto-complete="off"></el-input>
				</el-form-item>

        <el-form-item label="厂家名称" prop="venderName">
					<el-input v-model="editForm.venderName" :disabled="true"  auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="商品型号" prop="productType">
					<el-input v-model="editForm.productType" :disabled="true" auto-complete="off"></el-input>
				</el-form-item>
			 
				<el-form-item label="进货单价" prop="venderUnitPrice">
					<el-input v-model="editForm.venderUnitPrice" ></el-input>
				</el-form-item>

        		<el-form-item label="出售单价" prop="sellUnitPrice">
					<el-input v-model="editForm.sellUnitPrice" ></el-input>
				</el-form-item>

        		<el-form-item label="出售数量" prop="quantity">
				 
          <el-input-number v-model="editForm.quantity"  :min="1" ></el-input-number>
				</el-form-item>
				 
			 
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>


    <!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible"  :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				 
			
				<!-- <el-form-item label="厂家" prop="venderName">
				 
        <el-select v-model="addForm.venderName" @change="onSelectVenderChange(addForm.venderName)"  filterable placeholder="请选择厂家">
       <el-option
      v-for="item in venders"
      :key="item.id"
      :label="item.name"
      :value="item.name">
         </el-option>
              </el-select>
  

				</el-form-item> -->

          <el-form-item label="商品型号" prop="productType">
			 <el-select v-model="addForm.productType" placeholder="请选择商品型号">
    <el-option-group  
      v-for="group in venders"
      :key="group.id"
      :label="group.name">
      <el-option
        v-for="item in group.products"
        :key="item.id"
        :label="item.type"
        :value="item.type">
      </el-option>
    </el-option-group>
  </el-select>

        <!-- <el-select v-model="addForm.productType" filterable placeholder="请选择型号">
       <el-option
      v-for="item in products"
      :key="item.id"
      :label="item.type"
      :value="item.type">
         </el-option>
              </el-select> -->
     
				</el-form-item>
			 
				<el-form-item label="进货单价" prop="venderUnitPrice">
					<el-input v-model="addForm.venderUnitPrice" ></el-input>
				</el-form-item>

        		<el-form-item label="出售单价" prop="sellUnitPrice">
					<el-input v-model="addForm.sellUnitPrice" ></el-input>
				</el-form-item>

        		<el-form-item label="出售数量" prop="quantity">
				<el-input-number v-model="addForm.quantity"  :min="1" ></el-input-number>
				</el-form-item>   
			 
			 

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		 

			 
</section>
</template>

<<script>
import axios from "axios";
export default {
  data() {
    return {
      //筛选条件
     filters: {
        type: ""    
      },

      //新增界面数据
      addForm: {  
        productType: "",
        venderUnitPrice: 0.00,
        sellUnitPrice:0.00,
        quantity:1,
       // venderName:""
      },
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
		  productType: [{ required: true, message: "请选择商品型号", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        id:"",
        productType: "",
        venderUnitPrice: 0.00,
        sellUnitPrice:0.00,
        quantity:1,
        venderName:""
      },
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        productType: [{ required: true, message: "请输入商品型号", trigger: "blur" }]
      },

      listLoading: false,
      sels: [], //列表选中列
      shops:[],
      customers:[],
     // products:[],
      orderItems:[],
       venders:[],
       filterProducts:[],
      currentOrder: {
       "id":"",
       "customerName":"",
       "shopName":"",
       "orderDate":"",
       "status":"",
       "deposit":""
      }
      
      
     
    };
},
methods: {

 getOrderItemsByType:function(){
   this.getOrderItems(this.currentOrder.id);
 },

  getOrderItems:function(id) {

     let para = { id: id};
     if(this.filters.type=="所有"){
       this.filters.type = "";
     }
     para.productType = this.filters.type;
       this.listLoading = true;
      let that = this;
      axios
        .get("/order/getOrderItemsByOrderId", { params: para })
        .then(function(e) {
          console.log(e);
          that.orderItems = e.data.orderItems;
          that.listLoading = false;
        })
        .catch(function() {
            that.listLoading = false;
        });

    // this.orderItems  = [
    //     {
    //         "id": 194,
    //         "productType": "C23型号",
    //         "venderName": "艾是墙布",
    //         "quantity": 20,
    //         "venderUnitPrice": 120,
    //         "sellUnitPrice": 250,
    //         "venderTotalPrice": 2400,
    //         "sellTotalPrice": 5000,
    //         "profit": 2600
    //     }
    // ]
  },

  // onSelectVenderChange:function(selectedVenderName){
  //   for(var i=0;i<this.venders.length;i++){
  //       if (this.venders[i].name == selectedVenderName) {
  //           this.products = this.venders[i].products;  
  //      }
  //   }

    

  // },
 

      getProducts() {
        // this.products = [{"id":122,"name":"aaa",type:"1223","venderName":"aaaas"},
        // {"id":123,"name":"bbb",type:"122311223","venderName":"aaaas"}]
      let para = { type: "" };
      let that = this;
      axios
        .get("/product/getProductsByType", { params: para })
        .then(function(e) {
          console.log(e);
          that.filterProducts = e.data.products;
          that.filterProducts.unshift({"id":"","type":"所有"})
        })
        .catch(function() { 
        });
    },

     getVenders(){
	 

    //  this.venders = [
    //     {
    //         "id": 135,
    //         "name": "A",
    //         "address": "武汉市江汉路",
    //         "telephone": "0281-29282",
    //         "products": [
    //             {
    //                 "id": 137,
    //                 "name": "B45墙纸",
    //                 "type": "B45"
    //             },
    //             {
    //                 "id": 136,
    //                 "name": "C13墙布",
    //                 "type": "C13"
    //             }
    //         ]
    //     },
    //     {
    //         "id": 144,
    //         "name": "B",
    //         "address": "上海市浦东新区",
    //         "telephone": "021-221e31",
    //         "products": []
    //     }
    // ]
          let para = {name: ""};
         
                let that = this; 
                axios.get('/vender/queryVendersByName',{params:para})
                     .then(function(e){
                        
                        that.venders = e.data.venders;
                       
                     })
                     

		},

    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
     this.addForm ={
       
        productType: "",
        venderUnitPrice: 0.00,
        sellUnitPrice:0.00,
        quantity:1,
        //venderName:""
	  }
    },

        //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
			let para = Object.assign({}, this.addForm);
      para.orderId = this.currentOrder.id;
			console.log(para);
            let that = this;
            axios
              .post("/order/addNewOrderItem", para)
              .then(function(res) {
                console.log(res);
                that.addLoading = false;
                if(res.data=="添加订单商品成功!"){
                  that.$message({
                  message: res.data,
                  type: "success"
                });
                }else{
                     that.$message({
                  message: res.data,
                  type: "error"
                });
                }
               
                that.$refs["addForm"].resetFields();
                that.addFormVisible = false;
                that.getOrderItems(that.currentOrder.id);
              })
              .catch(function(error) {
                  console.log(error);
                that.addLoading = false;
                that.$message({
                  message: error.message,
                  type: "error"
                });
                that.$refs["addForm"].resetFields();
                that.addFormVisible = false;
                that.getOrderItems(that.currentOrder.id);
              });
          });
        }
      });
    },

     //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;

            let para = Object.assign({}, this.editForm);
            // para.orderId = this.currentOrder.id;
            let that = this;

            axios
              .patch("/order/modifyOrderItem", para)
              .then(function(res) {
                console.log(res);
                that.editLoading = false;
                that.$message({
                  message: "提交成功",
                  type: "success"
                });
                that.$refs["editForm"].resetFields();
                that.editFormVisible = false;
               that.getOrderItems(that.currentOrder.id);
              })
              .catch(function(error) {
                console.log(error);
                that.editLoading = false;
                that.$message({
                  message: "提交失败",
                  type: "error"
                });
                that.$refs["editForm"].resetFields();
                that.editFormVisible = false;
                that.getOrderItems(that.currentOrder.id);
              });
          });
        }
      });
    },

    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该订单商品吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;

          let para = { id: row.id };
          para.orderId = this.currentOrder.id;
          let that = this;
          axios
            .delete("/order/deleteOrderItemById", { params: para })
            .then(function(res) {
              that.listLoading = false;
              that.$message({
                message: "删除成功",
                type: "success"
              });
               that.getOrderItems(that.currentOrder.id);
            })
            .catch(function(error) {
              that.listLoading = false;
              that.$message({
                message: "删除失败",
                type: "error"
              });
              that.getOrderItems(that.currentOrder.id);
            });
        })
        .catch(() => {});
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          let para = { ids: ids };
          para.orderId = this.currentOrder.id;
          let that = this;
          axios
            .delete("/order/deleteOrderItemsByIds", {
              params: para
             
            })
            .then(function(res) {
              that.listLoading = false;
              that.$message({
                message: "删除成功",
                type: "success"
              });
               that.getOrderItems(that.currentOrder.id);
            })
            .catch(function(error) {
              that.listLoading = false;
              that.$message({
                message: "删除失败",
                type: "error"
              });
               that.getOrderItems(that.currentOrder.id);
            });
        })
        .catch(() => {});
	},


},

 mounted() {
    let order = this.$route.query.order;
   
     this.currentOrder.shopName = order.shopName;
     this.currentOrder.customerName = order.customer.name;
     this.currentOrder.orderDate = order.orderDate;
     this.currentOrder.id = order.id;
  this.getProducts();
  this.getVenders(); 	
  this.getOrderItems(this.currentOrder.id); 
  },

  



}
</script>


<<style type="text/css">
.orderInfo .header{
   font-weight:bold;
}
</style>


  
 

<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
                    <el-select v-model="filters.customerIds" multiple filterable placeholder="请选择客户">
       <el-option
      v-for="item in customers"
      :key="item.id"
      :label="item.name"
      :value="item.id">
         </el-option>
              </el-select>
					 
                     
				</el-form-item>
                <el-form-item>
                    <el-select v-model="filters.shopNames" multiple filterable placeholder="请选择店铺">
       <el-option
      v-for="item in shops"
      :key="item.id"
      :label="item.name"
      :value="item.name">
         </el-option>
              </el-select>
					 
                     
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getOrders">查询</el-button>
				</el-form-item>
			
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="orders" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
		 <!-- <el-table-column prop="id" v-if=false width="180" >
			</el-table-column> -->
			<el-table-column prop="shopName" label="店铺名称" width="80" sortable>
			</el-table-column>
		  <el-table-column prop="customer.name" label="客户姓名"  width="80" sortable>
			</el-table-column>
            <el-table-column prop="venderName" label="厂家名称"  width="80" sortable>
			</el-table-column>
             <el-table-column prop="productType" label="商品型号"  width="80" sortable>
			</el-table-column>

             <el-table-column prop="venderUnitPrice" label="进货单价"  width="80" sortable>
			</el-table-column>

              <el-table-column prop="sellUnitPrice" label="出售单价"  width="80" sortable>
			</el-table-column>
       
        <el-table-column prop="quantity" label="出售数量"  width="80" sortable>
			</el-table-column>

            <el-table-column prop="sellTotalPrice" label="出售总价"  width="80" sortable>
			</el-table-column>

            <el-table-column prop="profit" label="利润"  width="80" sortable>
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
			<el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="1" :total="total"  style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				
				 <el-form-item v-if=false  prop="id">
					<el-input v-model="editForm.id" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="店铺名称" prop="name">
					<el-input v-model="editForm.name" :disabled=true auto-complete="off"></el-input>
				</el-form-item>
			 
				<el-form-item label="店铺地址" prop="address">
					<el-input v-model="editForm.address" ></el-input>
				</el-form-item>
				 
			 
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

	
	</section>
</template>

<script>
//import util from '../../common/js/util'
//import NProgress from 'nprogress'
// import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
import axios from "axios";
export default {
  data() {
    return {
      filters: {
        customerIds: "",
        shopNames:""
      },
      shops: [],
      customers:[],
      orders:[],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入店铺名称", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        name: "",
        address: "",
        
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
		 
		name: [{ required: true, message: "请输入店铺名称", trigger: "blur" }]
		
		 
      },
      //新增界面数据
      addForm: {
         
        name: "",
        address: ""
      }
    };
  },
  methods: {
    handleCurrentChange(val) {
				this.page = val;
				this.getOrders();
			},

    getOrders() {
        // this.products = [{"id":122,"name":"aaa",type:"1223","venderName":"aaaas"},
        // {"id":123,"name":"bbb",type:"122311223","venderName":"aaaas"}]
   
      let para = { customerIds: this.filters.customerIds.toString(),shopNames:this.filters.shopNames.toString(),page: this.page,};
      this.listLoading = true;
      let that = this;
      axios
        .get("/order/getOrders", { params: para })
        .then(function(e) {
          console.log(e);
          that.orders = e.data.orders;
          that.total = e.data.total;
          that.listLoading = false;
        })
        .catch(function() {
          that.listLoading = false;
        });
      // this.orders = [
     
      //   {
      //       "id": 146,
      //       "productType": "B型号",
      //       "venderName": "艾是墙布",
      //       "quantity": 100,
      //       "venderUnitPrice": 150,
      //       "sellUnitPrice": 270,
      //       "shopName": "汉阳欧亚达",
      //       "venderTotalPrice": 0,
      //       "sellTotalPrice": 0,
      //       "profit": 0,
      //       "orderDate": "2018-04-01",
      //       "customer": {
      //           "id": 7,
      //           "name": "张三",
      //           "sex": "男",
      //           "address": "上海市xxxx浦东的",
      //           "telephone": "18302174508"
      //       }
      //   },
      //   {
      //       "id": 150,
      //       "productType": "A22型号",
      //       "venderName": "艾是墙布",
      //       "quantity": 20,
      //       "venderUnitPrice": 100,
      //       "sellUnitPrice": 200,
      //       "shopName": "居然之家",
      //       "venderTotalPrice": 0,
      //       "sellTotalPrice": 0,
      //       "profit": 0,
      //       "orderDate": "2018-04-01",
      //       "customer": {
      //           "id": 7,
      //           "name": "张三",
      //           "sex": "男",
      //           "address": "上海市xxxx浦东的",
      //           "telephone": "18302174508"
      //       }
      //   }
      //    ]
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
     this.addForm ={
       
        name: "",
        address: ""
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
			console.log(this.addForm);
            let that = this;
            axios
              .post("/shop/addNewShop", para)
              .then(function(res) {
                console.log(res);
                that.addLoading = false;
                that.$message({
                  message: "提交成功",
                  type: "success"
                });
                that.$refs["addForm"].resetFields();
                that.addFormVisible = false;
                that.getOrders();
              })
              .catch(function() {
                that.$message({
                  message: "提交失败",
                  type: "error"
                });
                that.$refs["addForm"].resetFields();
                that.addFormVisible = false;
                that.getOrders();
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
            let that = this;

            axios
              .patch("/shop/modifyShop", para)
              .then(function(res) {
                console.log(res);
                that.editLoading = false;
                that.$message({
                  message: "提交成功",
                  type: "success"
                });
                that.$refs["editForm"].resetFields();
                that.editFormVisible = false;
                that.getOrders();
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
                that.getOrders();
              });
          });
        }
      });
    },

    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该厂家吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;

          let para = { id: row.id };
          let that = this;
          axios
            .delete("/shop/deleteShopById", { params: para })
            .then(function(res) {
              that.listLoading = false;
              that.$message({
                message: "删除成功",
                type: "success"
              });
              that.getOrders();
            })
            .catch(function(error) {
              that.listLoading = false;
              that.$message({
                message: "删除失败",
                type: "error"
              });
              that.getOrders();
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
          let that = this;
          axios
            .delete("/shop/deleteShopsByIds", {
              params: para
             
            })
            .then(function(res) {
              that.listLoading = false;
              that.$message({
                message: "删除成功",
                type: "success"
              });
              that.getOrders();
            })
            .catch(function(error) {
              that.listLoading = false;
              that.$message({
                message: "删除失败",
                type: "error"
              });
              that.getOrders();
            });
        })
        .catch(() => {});
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
       
        })
        
    },

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
	 
  },


  mounted() {
  this.getShops();
  this.getCustomers();
	this.getOrders();
	 
  }
};
</script>

<style >

</style>



 
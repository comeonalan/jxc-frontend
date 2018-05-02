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
			<el-table-column prop="shopName" label="店铺名称" width="120" sortable>
			</el-table-column>
		  <el-table-column prop="customer.name" label="客户姓名"  width="150" sortable>
			</el-table-column>
            <el-table-column prop="deposit" label="定金(元)"  width="120" sortable>
			</el-table-column>
             <el-table-column prop="orderDate" label="下单日期"  width="150" sortable>
			</el-table-column>
       <el-table-column prop="status" label="订单状态"  width="120" sortable>
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

				<el-form-item label="店铺名称" prop="shopName">
				  <el-select v-model="editForm.shopName"  filterable placeholder="请选择店铺">
            <el-option
           v-for="item in shops"
           :key="item.id"
          :label="item.name"
           :value="item.name">
         </el-option>
            </el-select>
				</el-form-item>
			 
				<el-form-item label="客户姓名"  prop="customerId">
				<el-select v-model="editForm.customer.id" :disabled="true"   filterable placeholder="请选择客户">
       <el-option
      v-for="item in customers"
      :key="item.id"
      :label="item.name"
      :value="item.id">
         </el-option>
              </el-select>
				</el-form-item>

        <el-form-item label="下单日期" prop="orderDate">
   <el-date-picker type="date" placeholder="选择日期" v-model="editForm.orderDate" style="width: 100%;"></el-date-picker>
                </el-form-item>
				 
			  <el-form-item label="定金(元)" prop="deposit">
                   <el-input  v-model="editForm.deposit"></el-input>
 
                </el-form-item>

                 <el-form-item label="状态" prop="status">
                   

                   	<el-select v-model="editForm.status"   filterable placeholder="请选择客户">
       <el-option
      v-for="item in allStatus"
      :key="item.name"
      :label="item.name"
      :value="item.name">
         </el-option>
              </el-select>
 
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
        deposit: [{ required: true, message: "请输入定金", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        shopName: "",
        customer: {"id":""},
        orderDate:"",
        deposit:"",
        status:""
        
      },

      allStatus:[{"name":"已下单"},{"name":"已完成"}]

      
    
    };
  },
  methods: {
    handleCurrentChange(val) {
				this.page = val;
				this.getOrders();
			},

    getOrders() { 
   
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

    //   this.orders = [
    //     {
    //         "id": 156,
    //         "shopName": "居然之家",
    //         "orderDate": "2018-04-01",
    //         "deposit": 1000,
    //         "status": "已下单",
    //         "customer": {
    //             "id": 7,
    //             "name": "张三",
    //             "sex": "男",
    //             "address": "上海市xxxx浦东的",
    //             "telephone": "18302174508"
    //         }
    //     }
    // ]
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
              .patch("/order/modifyOrder", para)
              .then(function(res) {
                console.log(res);
                that.editLoading = false;
                that.$message({
                  message:res.data,
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
      this.$confirm("确认删除该订单吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;

          let para = { id: row.id };
          let that = this;
          axios
            .delete("/order/deleteOrderById", { params: para })
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
            .delete("/order/deleteOrdersByIds", {
              params: para
             
            })
            .then(function(res) {
              that.listLoading = false;
              that.$message({
                message: res.data,
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
        // this.customers = [{"id":8,"name":"李四",type:"1223","venderName":"aaaas"},
        // {"id":7,"name":"张三",type:"122311223","venderName":"aaaas"}]
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



 
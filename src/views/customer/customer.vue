<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="客户姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getCustomers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="customers" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
		 <!-- <el-table-column prop="id" v-if=false width="180" >
			</el-table-column> -->
			<el-table-column prop="name" label="姓名" width="200" sortable>
			</el-table-column>
            <el-table-column prop="sex" label="性别"  width="120" sortable>
			</el-table-column>
		  <el-table-column prop="address" label="地址"  width="200" sortable>
			</el-table-column>
            <el-table-column prop="telephone" label="电话"  width="200" sortable>
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
			<!-- <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;"> -->
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				
				 <el-form-item v-if=false  prop="id">
					<el-input v-model="editForm.id" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" :disabled=true auto-complete="off"></el-input>
				</el-form-item>

                <el-form-item label="性别" prop="sex">
                 <el-radio-group v-model="editForm.sex">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                 </el-radio-group>
  	            </el-form-item>

			 
				<el-form-item label="地址" prop="address">
					<el-input v-model="editForm.address" ></el-input>
				</el-form-item>

                <el-form-item label="电话" prop="telephone">
					<el-input v-model="editForm.telephone" ></el-input>
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
				 
			
				<el-form-item label="名字" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>

                 <el-form-item label="性别" prop="sex">
                 <el-radio-group v-model="addForm.sex" auto-complete="off">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                 </el-radio-group>
  	            </el-form-item>
			 
				<el-form-item label="地址" prop="address">
					<el-input  v-model="addForm.address" auto-complete="off"></el-input>
				</el-form-item>

             <el-form-item label="电话" prop="telephone">
					<el-input v-model="addForm.telephone" auto-complete="off"></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
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
        name: ""
      },
      customers: [],
	  
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入客户姓名", trigger: "blur" }],
        telephone: [{ required: true, message: "请输入客户电话", trigger: "blur" }],
        address: [{ required: true, message: "请输入客户地址", trigger: "blur" }],
        sex:[{ required: true, message: '请选择客户性别', trigger: 'change' }]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        name: "",
        sex:"",
        address: "",
        telephone:"" 
        
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
		 
        name: [{ required: true, message: "请输入客户姓名", trigger: "blur" }],
        sex:[{ required: true, message: '请选择客户性别', trigger: "change" }],
        telephone: [{ required: true, message: "请输入客户电话", trigger: "blur"}],
        address: [{ required: true, message: "请输入客户地址", trigger: "blur" }]
        
		
		 
      },
      //新增界面数据
      addForm: {
         
        name: "",
        sex:"男",
        address: "",
        telephone:""
      }
    };
  },
  methods: {
    getCustomers() {
        // this.products = [{"id":122,"name":"aaa",type:"1223","venderName":"aaaas"},
        // {"id":123,"name":"bbb",type:"122311223","venderName":"aaaas"}]
      let para = { name: this.filters.name };
      this.listLoading = true;
      let that = this;
      axios
        .get("/customer/getCustomersByName", { params: para })
        .then(function(e) {
          console.log(e);
          that.customers = e.data.customers;
          that.listLoading = false;
        })
        .catch(function() {
          that.listLoading = false;
        });
    },
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true;
     this.addForm ={
       
        name: "",
        sex:"",
        address: "",
        telephone:""
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
              .post("/customer/addNewCustomer", para)
              .then(function(res) {
                console.log(res);
                that.addLoading = false;
                if(res.data=="添加客户成功！"){
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
                that.getCustomers();
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
                that.getCustomers();
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
              .patch("/customer/modifyCustomer", para)
              .then(function(res) {
                console.log(res);
                that.editLoading = false;
                that.$message({
                  message: res.data,
                  type: "success"
                });
                that.$refs["editForm"].resetFields();
                that.editFormVisible = false;
                that.getCustomers();
              })
              .catch(function(error) {
                console.log(error);
                that.editLoading = false;
                that.$message({
                  message: error.message,
                  type: "error"
                });
                that.$refs["editForm"].resetFields();
                that.editFormVisible = false;
                that.getCustomers();
              });
          });
        }
      });
    },

    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该客户吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;

          let para = { id: row.id };
          let that = this;
          axios
            .delete("/customer/deleteCustomerById", { params: para })
            .then(function(res) {
              that.listLoading = false;
              that.$message({
                message: res.data,
                type: "success"
              });
              that.getCustomers();
            })
            .catch(function(error) {
              that.listLoading = false;
              that.$message({
                message: error.message,
                type: "error"
              });
              that.getCustomers();
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
            .delete("/customer/deleteCustomersByIds", {
              params: para
             
            })
            .then(function(res) {
              that.listLoading = false;
              that.$message({
                message: res.data,
                type: "success"
              });
              that.getCustomers();
            })
            .catch(function(error) {
              that.listLoading = false;
              that.$message({
                message: error.message,
                type: "error"
              });
              that.getCustomers();
            });
        })
        .catch(() => {});
	},
	 
  },


  mounted() {
	this.getCustomers();
	 
  }
};
</script>

<style >

</style>



 
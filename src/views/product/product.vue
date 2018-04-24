<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.type" placeholder="商品型号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProducts">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="products" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
		 <el-table-column prop="id" v-if=false width="180" >
			</el-table-column>
			<el-table-column prop="venderName" label="厂家名称" width="200" sortable>
			</el-table-column>
		  <el-table-column prop="type" label="商品型号"  width="200" sortable>
			</el-table-column>
      <el-table-column prop="name" label="商品名称" width="200" sortable>
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

				<el-form-item label="厂家名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
			 
				<el-form-item label="电话">
					<el-input v-model="editForm.telephone" ></el-input>
				</el-form-item>
				 
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.address"></el-input>
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
				<el-form-item label="厂家名称" prop="venderId">
					
					 <el-select v-model="addForm.vender.id" filterable placeholder="请选择" >
                    <el-option
                           v-for="item in venders"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                   </el-option>
                   </el-select>
				</el-form-item>
			
				<el-form-item label="型号" prop="type">
					<el-input v-model="addForm.type" auto-complete="off"></el-input>
				</el-form-item>
			 
				<el-form-item label="名称" >
					<el-input  v-model="addForm.name"></el-input>
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
        type: ""
      },
      products: [],
	  venders:[],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入厂家名称", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        name: "",
        telephone: "",
        address: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
		// venderId: [{ required: true, message: "请选择厂家", trigger: "change" }],
		type: [{ required: true, message: "请输入商品类型", trigger: "blur" }]
		
		 
      },
      //新增界面数据
      addForm: {
        vender: {"id":""},
        name: "",
        type: ""
      }
    };
  },
  methods: {
    getProducts() {
      //   this.venders = [{"id":122,"name":"aaa",telephone:"1223","address":"aaaas"},
      //   {"id":123,"name":"bbb",telephone:"122311223","address":"aaaas"}]
      let para = { type: this.filters.type };
      this.listLoading = true;
      let that = this;
      axios
        .get("/product/getProductsByType", { params: para })
        .then(function(e) {
          console.log(e);
          that.products = e.data.products;
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
       vender: {"id":""},
        name: "",
        type: ""
	  }
	//   this.venders = [{"id":122,"name":"aaa",telephone:"1223","address":"aaaas"},
	// 		   {"id":123,"name":"bbb",telephone:"122311223","address":"aaaas"}]
	this.getVenders();
	
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
              .post("/product/addNewProduct", para)
              .then(function(res) {
                console.log(res);
                that.addLoading = false;
                that.$message({
                  message: "提交成功",
                  type: "success"
                });
                that.$refs["addForm"].resetFields();
                that.addFormVisible = false;
                that.getProducts();
              })
              .catch(function() {
                that.$message({
                  message: "提交失败",
                  type: "error"
                });
                that.$refs["addForm"].resetFields();
                that.addFormVisible = false;
                that.getProducts();
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
              .patch("/vender/modifyVender", para)
              .then(function(res) {
                console.log(res);
                that.editLoading = false;
                that.$message({
                  message: "提交成功",
                  type: "success"
                });
                that.$refs["editForm"].resetFields();
                that.editFormVisible = false;
                that.getProducts();
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
                that.getProducts();
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
            .delete("/vender/deleteVenderById", { params: para })
            .then(function(res) {
              that.listLoading = false;
              that.$message({
                message: "删除成功",
                type: "success"
              });
              that.getProducts();
            })
            .catch(function(error) {
              that.listLoading = false;
              that.$message({
                message: "删除失败",
                type: "error"
              });
              that.getProducts();
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
            .delete("/vender/deleteVendersByIds", {
              params: para
              // 	paramsSerializer:function(param){
              //     params, {arrayFormat:'brackets'}
              // }
            })
            .then(function(res) {
              that.listLoading = false;
              that.$message({
                message: "删除成功",
                type: "success"
              });
              that.getProducts();
            })
            .catch(function(error) {
              that.listLoading = false;
              that.$message({
                message: "删除失败",
                type: "error"
              });
              that.getProducts();
            });
        })
        .catch(() => {});
	},
	  getVenders(){
			  
          let para = {name: ""}
        
                let that = this; 
                axios.get('/vender/queryVendersByName',{params:para})
                     .then(function(e){
                        console.log(e)
                        that.venders = e.data.venders;
                       
                     })
                     .catch(function(){
                  
                     })

		},
  },



  mounted() {
	this.getProducts();
	 
  }
};
</script>

<style >

</style>



 
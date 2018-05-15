<<template>
  <section>
<div class="orderInfo">	
<pre>
  <label class="header">店铺名称: </label>{{currentOrder.shopName}} <label class="header">客户姓名: </label>{{currentOrder.customerName}} <label class="header">下单日期：</label>{{currentOrder.orderDate}}
</pre>
			</div>
 
<div >
     <el-button class="add-btn" type="primary" @click="add">新增</el-button>
<el-table
      :data="items"
      border
      style="width: 100%; "
      >

      	 <el-table-column prop="venderName" label="厂家名称"    sortable>
               <template slot-scope="scope">
                    
<el-select v-model="scope.row.venderName" filterable placeholder="请选择" @change="onChangeVender($event)">
                    <el-option
                           v-for="item in venders"
                           :key="item.id"
                           :label="item.name"
                           :value="item.name">
                   </el-option>
                   </el-select>

                   </template>
			</el-table-column>
		 
             <el-table-column prop="productType" label="商品型号"    sortable>
                 <template slot-scope="scope">
  <el-select v-model="scope.row.productType" filterable placeholder="请选择" >
                    <el-option
                           v-for="item in selectedProducts"
                           :key="item.id"
                           :label="item.type"
                           :value="item.type">
                   </el-option>
                   </el-select>
                   </template>
			</el-table-column>

             <el-table-column prop="venderUnitPrice" label="进货单价"    sortable>
                 <template slot-scope="scope">
                   <el-input type="number" v-model="scope.row.venderUnitPrice" @blur="onVenderUnitPriceChange($event, scope.row)" @change="onVenderUnitPriceChange($event, scope.row)"> </el-input>
                 </template>
                 
			</el-table-column>

              <el-table-column prop="sellUnitPrice" label="出售单价"   sortable>
                    <template slot-scope="scope">
                   <el-input type="number" v-model="scope.row.sellUnitPrice" @blur="onSellUnitPriceChange($event, scope.row)" @change="onSellUnitPriceChange($event, scope.row)">  </el-input>
                 </template>
			</el-table-column>
       
        <el-table-column prop="quantity" label="出售数量"   sortable>
              <template slot-scope="scope">
                   
                   <el-input-number class="iptnum" size="small" v-model="scope.row.quantity"  :min="1" @blur="onQuantityChange($event, scope.row)" @change="onQuantityChange($event, scope.row)"></el-input-number>
                   
                 </template>
			</el-table-column>

            <el-table-column prop="sellTotalPrice" label="出售总价"   sortable>
                 <template slot-scope="scope">
                   <el-input disabled  v-model="scope.row.sellTotalPrice" @change="calculateTotalMoney"> 
                     <!-- <template slot="append">元</template> -->
                     </el-input>
                 </template>
			</el-table-column>

            <el-table-column  prop="profit" label="利润"   sortable>
                 <template slot-scope="scope">
                   <el-input disabled v-model="scope.row.profit"> </el-input>
                 </template>
			</el-table-column>

             <el-table-column label="操作"   >
 <template slot-scope="scope">
     <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
     </template>
                 </el-table-column>
     

         
     
    </el-table>

     <div class="right">总金额：{{ totalMoney }}</div>

     <div>
<el-button class="savebt" type="primary" @click="saveItems">保存</el-button>
         </div>
 
<!-- <hr>
<p>
<pre>
{{$data|json}}
</pre>
</p> -->
</div>

</section>

</template>

<<script>
import axios from "axios";
export default {
  data() {
  		return {
            venders:[],
            selectedProducts:[],
        	items: [],
            totalMoney: 0,
      currentOrder: {
       "id":"",
       "customerName":"",
       "shopName":"",
       "orderDate":"",
       "status":"",
       "deposit":""
      }
        }
    },
    methods: {

        onChangeVender(event) {
            console.log(event);
            for(var i = 0;i<this.venders.length;i++){
                if(this.venders[i].name==event){
                this.selectedProducts = this.venders[i].products;
                }
            }
              this.calculateTotalMoney();
        },
    	add() {
            this.selectedProducts = [];
        	this.items.push({
                //orderId : this.currentOrder.id,
            	venderName: "",
                productType: "",
                venderUnitPrice: 0,
                sellUnitPrice: 0,
                quantity: 0,
                sellTotalPrice: 0,
                profit:0
            })
        },

  //删除
    handleDel: function(index, row) {
      
        //  this.items =[];

          	// 刪除
            this.items.splice(index, 1)
            // 重新計算總金額
            this.calculateTotalMoney();
           
         
    },
   // 计算出售总价
       calculateSellTotalPrice(item){
       item.sellTotalPrice = item.sellUnitPrice * item.quantity;
       item.profit = (item.sellUnitPrice-item.venderUnitPrice)*item.quantity;
       this.calculateTotalMoney();
       },
        // 計算總金額
        calculateTotalMoney() {
        // this.totalMoney = parseFloat(this.items.map( i => parseFloat(i.sellTotalPrice)).reduce( (a, b) => (a + b), 0)).toFixed(2)
         var sum = 0;
         for(var j=0;j<this.items.length;j++){
             sum += this.items[j].sellTotalPrice;
         }
         this.totalMoney = sum;
       },
        
       
        onVenderUnitPriceChange(event, item) {
        	const venderUnitPrice = parseFloat(event.target.value)
            // 一樣就不繼續了
        	if(item.venderUnitPrice === venderUnitPrice) return
        	// 檢測輸入的是否為數字
        	if(this.isNumeric(event.target.value)) {
            	item.venderUnitPrice = venderUnitPrice
                // 計算金額
                this.calculateSellTotalPrice(item);
            } else {
                item.venderUnitPrice = 0
                this.$message({
          showClose: true,
          message: '进货单价输入错误！',
          type: 'error'
        });
            }
        },

        onQuantityChange(event, item){
           this.calculateSellTotalPrice(item);
           
        },

          onSellUnitPriceChange(event, item) {
        	const sellUnitPrice = parseFloat(event.target.value)
            // 一樣就不繼續了
        	if(item.sellUnitPrice === sellUnitPrice) return
        	// 檢測輸入的是否為數字
        	if(this.isNumeric(event.target.value)) {
            	item.sellUnitPrice = sellUnitPrice
                // 計算金額
                this.calculateSellTotalPrice(item);
                
            } else {
                item.sellUnitPrice = 0
                this.$message({
          showClose: true,
          message: '出售单价输入错误！',
          type: 'error'
        });
            }
        },
       
        // 簡易的判斷是否為數字的 func
        isNumeric(n) {
          return !isNaN(parseFloat(n)) && isFinite(n);
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
        
    getOrderItems:function(id) {

     let para = { id: id};
      
       
      let that = this;
      axios.get("/order/getOrderItemsByOrderId", { params: para })
        .then(function(e) {
          console.log(e);
          that.items = e.data.orderItems;
           that.calculateTotalMoney();
        })
        .catch(function() {
            
        });

     

    // this.items.push( {
    //         "id": 194,
    //         "productType": "C23型号",
    //         "venderName": "艾是墙布",
    //         "quantity": 20,
    //         "venderUnitPrice": 120,
    //         "sellUnitPrice": 250,
    //         "venderTotalPrice": 2400,
    //         "sellTotalPrice": 5000,
    //         "profit": 2600
    //     })
  },

  saveItems() {

    let saveItems = this.items;
    // for(var i=0;i<saveItems.length;i++){
    //     saveItems[i].orderId = this.currentOrder.id ;
    // }
    let param = {"items":saveItems};
    var that = this;
    axios.post("/order/addOrderItems?orderId="+this.currentOrder.id, param)
              .then(function(res) {
                console.log(res);
                 that.$message({
                  message: res.data,
                  type: "success"
                });
              
                 
              })
  } 


    },
     mounted(){
          let order = this.$route.query.order;
   
     this.currentOrder.shopName = order.shopName;
     this.currentOrder.customerName = order.customer.name;
     this.currentOrder.orderDate = order.orderDate;
     this.currentOrder.id = order.id;
this.getVenders();
this.getOrderItems(this.currentOrder.id); 

     }
}
</script>

<<style>
 

.add-btn {
    margin: 10px 0;

}

.savebt{
    margin: 30px 0 0 900px;
}

.right {
    text-align: right;
    margin-top:10px;
}

.iptnum{
    width:100%;
}

 
</style>


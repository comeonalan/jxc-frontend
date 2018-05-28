<<template>
  <section>
<div class="orderInfo">	
<pre>
  <label class="header">店铺名称: </label>{{currentOrder.shopName}} <label class="header">客户姓名: </label>{{currentOrder.customerName}} <label class="header">下单日期：</label>{{currentOrder.orderDate}}
</pre>
			</div>
 
<el-button class="add-btn" type="primary" @click="add">新增</el-button>
<el-button class="savebt" type="primary" @click="saveItems">保存</el-button>
<el-collapse accordion  @change="handleCollapseChange">

    <div v-for="item in orderItems" >
  <el-collapse-item :title="item" >
   

         <template slot="title" slot-scope="scope">
      厂家名称<el-select  v-model="item.venderName" filterable placeholder="请选择" @change="onChangeVender($event)">
                    <el-option
                           v-for="item in venders"
                           :key="item.id"
                           :label="item.name"
                           :value="item.name">
                   </el-option>
                   </el-select>
 <el-button class="delbt" type="danger" size="small" @click="handleDelItem((scope.$index))">删除</el-button>
  
    </template>

<div >

<div class="itemSection">
      进货总价<el-input  v-model="item.venderTotalPrice" style="width:20%"   @change="calculateUnitPrice(item)"> 
                     <!-- <template slot="append">元</template> -->
         </el-input>
           出售总价<el-input v-model="item.sellTotalPrice" style="width:20%"    @change="calculateTotalMoneyAndUnitPrice(item)"> 
                      
        </el-input>
        
    </div>
         
<el-table
      :data="item.items"
      border
      style="width: 100%; "
   >

      
             <el-table-column prop="productType" label="商品型号"  sortable >
                 <template slot-scope="scope" >
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

                <el-table-column prop="quantity" label="出售数量"   sortable>
              <template slot-scope="scope">
                   
                   <el-input-number class="iptnum" size="small" v-model="scope.row.quantity"  :min="1" @blur="onQuantityChange(scope.row)" @change="onQuantityChange(scope.row)"></el-input-number>
                   
                 </template>
			 </el-table-column>

             <el-table-column prop="venderUnitPrice" label="进货单价"    sortable>
                 <template slot-scope="scope">
                   <el-input disabled type="number" v-model="scope.row.venderUnitPrice"> </el-input>
                 </template>
                 
			</el-table-column>

              <el-table-column prop="sellUnitPrice" label="出售单价"   sortable>
                    <template slot-scope="scope">
                   <el-input disabled type="number" v-model="scope.row.sellUnitPrice" >  </el-input>
                 </template>
			</el-table-column>
       
    

            <el-table-column  prop="profit" label="利润"   sortable>
                 <template slot-scope="scope">
                   <el-input disabled v-model="scope.row.profit"> </el-input>
                 </template>
			</el-table-column>

             <el-table-column label="操作"   >
 <template slot-scope="scope">
     <el-button type="danger" size="small" @click="handleDelProduct(item,scope.$index,scope.row)">删除</el-button>
     </template>
                 </el-table-column>
     

         
     
    </el-table>

     

    <div class="right">
         <el-button class="add-btn" type="primary" @click="addProduct(item)">新增</el-button>
           

        </div>


        
       
 
 
</div>
   
 </el-collapse-item>
    
 </div>
</el-collapse>

<div class="right">总金额：{{ totalMoney }}</div>

</section>

</template>

<script>
import axios from "axios";
export default {
  data() {
  		return {
            venders:[],
            selectedProducts:[],
            items: [],
            orderItems:[],
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
              
        },
    	addProduct(item) {
           
             for(var i = 0;i<this.venders.length;i++){
                if(this.venders[i].name==item.venderName){
                this.selectedProducts = this.venders[i].products;
                }
            }
            
        	item.items.push({
                //orderId : this.currentOrder.id,
            	venderName: item.venderName,
                productType: "",
                venderUnitPrice: 0,
                sellUnitPrice: 0,
                quantity: 1,
                sellTotalPrice: 0,
                profit:0
            })
          this.calculateUnitPrice(item);
           
        },

        calculateTotalMoneyAndUnitPrice(item){
            this.calculateTotalMoney(); 
            this.calculateUnitPrice(item);
        },

        calculateTotalMoney(){
             this.totalMoney = 0;
          for(let i=0;i<this.orderItems.length;i++){
                this.totalMoney += parseFloat(this.orderItems[i].sellTotalPrice);
            }
        },

        	add() {
            
        	this.orderItems.push({
                //orderId : this.currentOrder.id,
            	venderName: "",  
                venderUnitPrice: 0,
                sellTotalPrice: 0,
                items:[]
               
            })

           
        },

        handleDelItem(index){
       this.orderItems.splice(index, 1);
       this.calculateTotalMoney();
        },

  //删除
    handleDelProduct(item,index,row) {

            for(let i=0;i<item.items.length;i++){
                if(item.items[i].id==row.id){
                    item.items.splice(index, 1);
                }
            }

            this.calculateUnitPrice(item);
        	
         
    },
 

        onQuantityChange(item){
               var currentOrderItem = null;
             for(let i=0;i<this.orderItems.length;i++){
                 if(this.orderItems[i].venderName==item.venderName){
                     currentOrderItem = this.orderItems[i];
                     break;
                 }
             }
           
            if(currentOrderItem!=null){
                 this.calculateUnitPrice(currentOrderItem);
            }
        },

         calculateUnitPrice(currentOrderItem){
           
             let totalQuantity = 0;
            
               for(let i=0;i<currentOrderItem.items.length;i++){
               totalQuantity += currentOrderItem.items[i].quantity
                }
             let sellTotalPrice = currentOrderItem.sellTotalPrice;
             let venderTotalPrice = currentOrderItem.venderTotalPrice;

             let sellUnitPrice = sellTotalPrice/totalQuantity;
             let venderUnitPrice = venderTotalPrice/totalQuantity;

              for(let i=0;i<currentOrderItem.items.length;i++){
                currentOrderItem.items[i].sellUnitPrice = sellUnitPrice.toFixed(2);
                currentOrderItem.items[i].venderUnitPrice = venderUnitPrice.toFixed(2);
                currentOrderItem.items[i].profit = ((sellUnitPrice -venderUnitPrice) * currentOrderItem.items[i].quantity).toFixed(2);
                }
             
          
           
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
          that.orderItems = e.data.orderItems;
           that.calculateTotalMoney();
        })
        .catch(function() {
            
        });

     

    // this.items.push( {
    //         "id": 194,
    //         "productType": "C18型号",
    //         "venderName": "A",
    //         "quantity": 15,
    //         "venderUnitPrice": 100,
    //         "sellUnitPrice": 300,
    //         "venderTotalPrice": 1500,
    //         "sellTotalPrice": 4500,
    //         "profit": 3000
    //     })
    //       this.items.push( {
    //         "id": 195,
    //         "productType": "C23型号",
    //         "venderName": "A",
    //         "quantity": 5,
    //         "venderUnitPrice": 1,
    //         "sellUnitPrice": 2,
    //         "venderTotalPrice": 5,
    //         "sellTotalPrice": 10,
    //         "profit": 5
    //     })

    //     this.orderItems = [{"venderName":"A",
    //     "sellTotalPrice":4510,
    //     "venderTotalPrice":1505,
    //     "items":this.items},
    //     {"venderName":"B",
    //     "sellTotalPrice":1000,
    //     "venderTotalPrice":2000,
    //     "items":this.items}]
  },

  saveItems() {

    let saveItems = this.orderItems;
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
  },

  handleCollapseChange(){
   this.selectedProducts =[];
  
  },

  
    


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
 
.delbt{
    margin-left:20px;
}
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

/* .inputTotal{
    width:20%;
} */

.itemSection{
    margin:20px 0px;
}

 
</style>


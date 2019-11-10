<template>
  <el-card class="box-card order-detail">
    <div slot="header" class="clearfix">
      <span>订单详情</span>
      <el-button
        :type="isEdit ? 'primary':'success'"
        @click="handelEdit"
        style="float: right;"
        size="small"
      >{{ btnText }}</el-button>
    </div>
    <div class="text item editfs">
      <!-- 订单号 -->
      <span>
        订单号：
        <span v-if="!isEdit">{{ orderData.orderNo }}</span>
        <el-input
          size="small"
          v-else
          v-model="orderData.orderNo"
          style="display:inline-block;width:260px;"
        ></el-input>
      </span>
      <el-divider></el-divider>
      <!-- 下单时间 -->
      <span>
        下单时间：
        <span v-if="!isEdit">{{ orderData.orderTime }}</span>
        <el-date-picker
          v-else
          size="small"
          v-model="orderData.orderTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </span>
      <el-divider></el-divider>
      <!-- 手机号 -->
      <span>
        手机号：
        <span v-if="!isEdit">{{ orderData.phone }}</span>
        <el-input
          size="small"
          v-else
          v-model="orderData.phone"
          style="display:inline-block;width:260px;"
        ></el-input>
      </span>
      <el-divider></el-divider>
      <!-- 收货人 -->
      <span>
        收货人：
        <span v-if="!isEdit">{{ orderData.consignee }}</span>
        <el-input
          size="small"
          v-else
          v-model="orderData.consignee"
          style="display:inline-block;width:260px;"
        ></el-input>
      </span>
      <el-divider></el-divider>
      <!-- 配送地址 -->
      <span>
        配送地址：
        <span v-if="!isEdit">{{ orderData.deliverAddress }}</span>
        <el-input
          size="small"
          v-else
          v-model="orderData.deliverAddress"
          style="display:inline-block;width:260px;"
        ></el-input>
      </span>
      <el-divider></el-divider>
      <!-- 送达时间 -->
      <span>
        送达时间：
        <span v-if="!isEdit">{{ orderData.deliveryTime }}</span>
        <el-date-picker
          v-else
          size="small"
          v-model="orderData.deliveryTime"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </span>
      <el-divider></el-divider>
      <!-- 用户备注 -->
      <span>
        用户备注：
        <span v-if="!isEdit">{{ orderData.remarks }}</span>
        <el-input
          size="small"
          v-else
          v-model="orderData.remarks"
          style="display:inline-block;width:260px;"
        ></el-input>
      </span>
      <el-divider></el-divider>
      <!-- 订单金额 -->
      <span>
        订单金额：
        <span v-if="!isEdit">{{ orderData.orderAmount }}</span>
        <el-input
          size="small"
          v-else
          v-model="orderData.orderAmount"
          style="display:inline-block;width:260px;"
        ></el-input>
      </span>
      <el-divider></el-divider>
      <!-- 订单状态 -->
      <span>
        订单状态：
        <span v-if="!isEdit">{{ orderData.orderState }}</span>
        <el-select size="small" v-else placeholder="订单状态" v-model="orderData.orderState">
          <el-option label="已受理" value="已受理"></el-option>
          <el-option label="派送中" value="派送中"></el-option>
          <el-option label="已完成" value="已完成"></el-option>
        </el-select>
      </span>
    </div>
  </el-card>
</template>

<script>
import { orderEdit } from "@/api/order";
export default {
  data() {
    return {
      //订单数据
      orderData: {},
      //是否可以编辑
      isEdit: false
    };
  },
  created() {
    //取出兄弟组件传来的数据
    this.orderData = JSON.parse(window.sessionStorage.getItem("row"));
    console.log(this.orderData);
  },
  methods: {
    async handelEdit() {
      this.isEdit = !this.isEdit;

      //如果按钮显示为保存，再点击的时候才发送请求
      if (!this.isEdit) {
          
        let { code } = await orderEdit(this.orderData);
        if( code === 0 ){
            this.$router.push( '/home/ordermanage' )
        }
      }
    }
  },
  computed: {
    btnText() {
      return this.isEdit ? "保存" : "编辑";
    }
  }
};
</script>

<style lang="less">
.order-detail {
  .editfs {
    font-size: 14px;
  }
}
</style>
<template>
  <el-card class="box-card order-manage">
    <div class="text item">
      <!-- 搜索表单 -->
      <el-form :model="formData" ref="sousuoForm" :inline="true" size="small">
        <!-- 订单号 -->
        <el-form-item label="订单号">
          <el-input v-model="formData.orderNo" placeholder="订单号"></el-input>
        </el-form-item>
        <!-- 收货人 -->
        <el-form-item label="收货人">
          <el-input v-model="formData.consignee" placeholder="收货人"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机号">
          <el-input v-model="formData.phone" placeholder="手机号"></el-input>
        </el-form-item>
        <!-- 订单状态 -->
        <el-form-item label="订单状态">
          <el-select placeholder="订单状态" v-model="formData.orderState">
            <el-option label="已受理" value="已受理"></el-option>
            <el-option label="派送中" value="派送中"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
          </el-select>
        </el-form-item>
        <!-- 选择时间 -->
        <el-form-item label="选择时间" class="timechouse" v-model="formData.date">
          <el-date-picker
            v-model="formData.date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <!-- 查询 -->
        <el-form-item>
          <el-button type="primary" @click="subQuery">查询</el-button>
          <el-button type="primary" @click="clear">清除</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" max-height="250">
        <el-table-column fixed prop="orderNo" label="订单号" width="150"></el-table-column>
        <el-table-column prop="orderTime" label="下单时间" width="160"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
        <el-table-column prop="consignee" label="收货人" width="120"></el-table-column>
        <el-table-column prop="deliverAddress" label="配送地址" width="120"></el-table-column>
        <el-table-column prop="deliveryTime" label="送达时间" width="160"></el-table-column>
        <el-table-column prop="remarks" label="用户备注" width="120"></el-table-column>
        <el-table-column prop="orderAmount" label="订单金额" width="120"></el-table-column>
        <el-table-column prop="orderState" label="订单状态" width="120"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEditOrder(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        layout="total, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </el-card>
</template>

<script>
import { regPhoneNum } from "@/utils/reg";
import { availOrder } from "@/api/order";
import moment from "moment";
export default {
  data() {
    /* 自定义验证手机号 */
    const validatePhone = (rule, value, callback) => {
      if (!rule.reg.test(value)) {
        callback(new Error("请输入正确的电话号码"));
      } else {
        callback();
      }
    };
    return {
      formData: {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: "",
        date: []
      },
      tableData: [],
      //分页数据
      currentPage: 1,
      pagesize: 5,
      total: 0
    };
  },
  methods: {
    //查询
    subQuery() {
      this.$refs.sousuoForm.validate(valid => {
        this.currentPage = 1
        this.getOrders();
      });
    },
    //清除
    clear() {
      this.formData = {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: "",
        date: []
      };
      this.getOrders();
    },
    //获取订单列表
    async getOrders() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pagesize,
        orderNo: this.formData.orderNo,
        consignee: this.formData.consignee,
        phone: this.formData.phone,
        orderState: this.formData.orderState,
        date: JSON.stringify(this.formData.date)
      };
      let { total, data } = await availOrder(params);
      this.total = total;
      data.forEach(v => {
        v.orderTime = moment(v.orderTime).format("YYYY-MM-DD hh:mm:ss");
        v.deliveryTime = moment(v.deliveryTime).format("YYYY-MM-DD hh:mm:ss");
      });
      this.tableData = data;
    },
    //改变页码
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrders();
    },
    //查看详情
    toEditOrder(row){

      //存到本地传给兄弟组件
      window.sessionStorage.setItem('row',JSON.stringify( row ))

      this.$router.push('/home/editorder')
    }
  },
  created() {
    this.getOrders();
  }
};
</script>

<style lang="less">
.order-manage {
  .el-form {
    .el-form-item:not(.timechouse) {
      width: 340px;
    }
  }
  .el-pagination {
    margin-top: 20px;
  }
}
</style>
<template>
  <div class="order-total">
    <!-- 日期选择 -->
    <div class="data-choose">
      <span>时间范围</span>
      <el-date-picker
        v-model="value2"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      ></el-date-picker>
      <el-button type="primary" @click="getChartsAgain">查询</el-button>
    </div>

    <!-- 报表 -->
    <el-card class="box-card use-echarts">
      <div class="text item echarts-box" id="myChart"></div>
    </el-card>
  </div>
</template>

<script>
/* echarts */
import echarts from "echarts";
import moment from "moment";

import { orderTotal } from "@/api/order";

export default {
  data() {
    return {
      //日期选择框数据
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value2: ""
      //报表数据
    };
  },
  methods: {
    //绘制报表函数
    drawLine(xArr, yArr) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表

      myChart.setOption({
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xArr
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} 元"
          }
        },
        tooltip: {
          trigger: "none",
          axisPointer: {
            type: "cross"
          }
        },
        series: [
          {
            data: yArr,
            type: "line",
            areaStyle: {}
          }
        ]
      });
    },

    //获取echarts订单数据
    async getOrderCharts() {
      let { data } = await orderTotal({ date: JSON.stringify(this.value2) });
      //格式化日期
      data.forEach(v => (v.orderTime = moment(v.orderTime).format("YY/MM/DD")));

      let newObj = {};//新对象储存日期和销售额键值对

      //循环data对象，累加在同一天产生的订单额
      data.forEach(v => {
        if (!newObj[v.orderTime]) {
          //如果不存在就增加键值对
          newObj[v.orderTime] = v.orderAmount;
        } else {
          //否则将值累加
          newObj[v.orderTime] += v.orderAmount;
        }
      });

      let xArr = [],
          yArr = []

      for( const key in newObj ){
        xArr.push( key )
        yArr.push( newObj[key] )
      }
    
      this.drawLine(xArr,yArr);
    },

    //点击查询，重新获取订单数据
    getChartsAgain(){
      this.getOrderCharts()
    }
  },
  mounted() {
    //挂载后调用echarts订单函数
    this.getOrderCharts();
  }
};
</script>

<style lang="less">
.order-total {
  .data-choose {
    margin-bottom: 30px;
    .el-date-editor {
      margin: 0 10px;
    }
  }
  .use-echarts {
    .echarts-box {
      width: 100%;
      height: 400px;
    }
  }
}
</style>
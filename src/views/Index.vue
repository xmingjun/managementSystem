<template>
  <div class="index">
    <!-- 头部数据 -->
    <el-row :gutter="20" class="top">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card shadow="hover">
            <p class="aliicon">
              <i class="iconfont icon-tuanduicankaoxian-" style="color:red"></i>
            </p>
            <div class="alldata">
              <p>总订单</p>
              <span>{{ orders }}</span>
            </div>
          </el-card>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card shadow="hover">
            <p class="aliicon">
              <i class="iconfont icon-qian" style="color:yellowgreen"></i>
            </p>
            <div class="alldata">
              <p>总销售额</p>
              <span>{{ sells }}</span>
            </div>
          </el-card>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card shadow="hover">
            <p class="aliicon">
              <i class="iconfont icon-dingdan1" style="color:blue"></i>
            </p>
            <div class="alldata">
              <p>今日订单数</p>
              <span>{{ todayorders }}</span>
            </div>
          </el-card>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="grid-content bg-purple">
          <el-card shadow="hover">
            <p class="aliicon">
              <i class="iconfont icon-qian4" style="color:green"></i>
            </p>

            <div class="alldata">
              <p>今日销售额</p>
              <span>{{ todaysells }}</span>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <!-- 报表 -->
    <el-card class="box-card use-echarts">
      <div class="text item echarts-box" id="myChart"></div>
    </el-card>
  </div>
</template>

<script>
/* echarts */
import echarts from "echarts";

import { getIndexEcharts } from "@/api/order";

export default {
  data() {
    return {
      /* 总数据 */
      orders: "103242",
      sells: "122123",
      todayorders: "10234",
      todaysells: "10122"
    };
  },
  methods: {
    //报表函数
    drawLine(xArr, yObj) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "数据统计"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["订单数", "销售额"]
        },
        color: ["red", "yellowgreen"],
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xArr
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "订单数",
            type: "line",
            stack: "总量",
            data: yObj.order
          },
          {
            name: "销售额",
            type: "line",
            stack: "总量",
            data: yObj.sell
          }
        ]
      });
    },
    //获取echarts数据,渲染报表函数
    async getEchartsData() {
      let { date, data } = await getIndexEcharts();
      if (date && data) {
        this.drawLine(date, data);
      }
    }
  },

  mounted() {
    //调用获取echarts数据函数
    this.getEchartsData();
  }
};
</script>

<style lang="less">
.index {
  .grid-content {
    .inconfont {
      font-size: 30px;
      color: red;
    }
  }
  .top {
    .el-card {
      .el-card__body {
        display: flex;
        justify-content: space-between;
        .aliicon {
          i {
            font-size: 40px;
            font-weight: 600;
          }
        }
        .alldata {
          display: flex;
          flex-direction: column;
          justify-content: center;
          p {
            color: #ccc;
          }
          span {
            font-weight: 700;
            line-height: 30px;
          }
        }
      }
    }
  }
  .use-echarts {
    margin-top: 40px;
    .echarts-box {
      width: 100%;
      height: 500px;
    }
  }
}
</style>
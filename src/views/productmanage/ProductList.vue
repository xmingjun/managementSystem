<template>
  <el-card class="box-card product-list">
    <div class="text item">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <!-- 展开显示的项 -->
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <!-- 商品id -->
              <el-form-item label="商品 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <!-- 商品图片 -->
              <el-form-item label="商品图片">
                <span>
                  <img
                    width="100"
                    :src="'http://127.0.0.1:8000/upload/goods/'+props.row.imgUrl"
                    height="100"
                    style="border-radius: 4px"
                  />
                </span>
              </el-form-item>
              <!-- 商品名称 -->
              <el-form-item label="商品名称">
                <span>{{ props.row.goodsname }}</span>
              </el-form-item>
              <!-- 商品分类 -->
              <el-form-item label="商品分类">
                <span>{{ props.row.goodscategory }}</span>
              </el-form-item>
              <!-- 商品特色 -->
              <el-form-item label="商品特色">
                <span>{{ props.row.goodsfeature | filterFeature }}</span>
              </el-form-item>
              <!-- 是否促销 -->
              <el-form-item label="是否促销">
                <span>{{ props.row.isPromotion }}</span>
              </el-form-item>
              <!-- 商品规格 -->
              <el-form-item label="商品规格">
                <span>{{ props.row.standard | filterStandard }}</span>
              </el-form-item>

              <!-- 商品描述 -->
              <el-form-item label="商品描述">
                <span>{{ props.row.goodsdesc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="商品 ID" prop="id"></el-table-column>
        <el-table-column label="商品名称" prop="goodsname"></el-table-column>
        <el-table-column label="描述" prop="goodsdesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="toEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="delGoods(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </el-card>
</template>

<script>
import { avilGoodsList, delRowGoods } from "@/api/goods";
export default {
  data() {
    return {
      //表格数据
      tableData: [],
      //分页数据
      currentPage: 1,
      pageSize: 5,
      total: 0
    };
  },
  methods: {
    //获取商品列表
    async getGoodsList() {
      let { total, data } = await avilGoodsList({
        currentPage: this.currentPage,
        pageSize: this.pageSize
      });
      this.total = total;
      this.tableData = data;
    },
    //当前页改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getGoodsList();
    },
    //删除商品
    delGoods({ id }) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { code } = await delRowGoods({ id });
          if (code === 0) {
            this.getGoodsList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //编辑商品
    toEdit(row) {
      // console.log( row )
      //将row存到本地
      window.sessionStorage.setItem("editRow", JSON.stringify(row));
      //跳转到编辑
      this.$router.push("/home/editproduct");
    }
  },
  created() {
    this.getGoodsList();
  },
  filters: {
    // 过滤特色
    filterFeature(feature) {
      return JSON.parse(feature).join(" / ");
    },
    //过滤规格
    filterStandard(sta) {
      let arr = JSON.parse(sta);
      let newArr = arr.map(
        v => `${v.goodsstandard} ${v.goodsPrice} ${v.packingexpense}`
      );
      return newArr.join(" & ");
    }
  }
};
</script>

<style lang="less">
.product-list {
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .block {
    margin-top: 20px;
  }
}
</style>
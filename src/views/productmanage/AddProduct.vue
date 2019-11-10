<template>
  <el-card class="box-card add-product">
    <div slot="header" class="clearfix">
      <span>添加商品</span>
    </div>
    <div class="text item">
      <!-- 添加商品表单 -->
      <el-form :model="formData" :rules="rules" ref="addProductForm" label-width="100px">
        <!-- 商品名称 -->
        <el-form-item label="商品名称" prop="goodsname">
          <el-input v-model="formData.goodsname"></el-input>
        </el-form-item>

        <!-- 商品分类 -->
        <el-form-item label="商品分类" prop="goodscategory">
          <el-select placeholder="请选择商品分类" v-model="formData.goodscategory">
            <el-option label="家常菜" value="家常菜"></el-option>
            <el-option label="火锅" value="火锅"></el-option>
            <el-option label="冒菜" value="冒菜"></el-option>
          </el-select>
        </el-form-item>

        <!-- 商品特色 -->
        <el-form-item label="商品特色" prop="goodsfeature">
          <el-checkbox-group v-model="formData.goodsfeature">
            <el-checkbox label="新品上市" name="goodsfeature"></el-checkbox>
            <el-checkbox label="本店招牌" name="goodsfeature"></el-checkbox>
            <el-checkbox label="火爆产品" name="goodsfeature"></el-checkbox>
            <el-checkbox label="折扣商品" name="goodsfeature"></el-checkbox>
            <el-checkbox label="本地食材" name="goodsfeature"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 商品图片 -->
        <el-form-item label="商品图片">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:8000/goods/upload"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <img
              v-if="formData.imgUrl"
              :src="'http://127.0.0.1:8000/upload/goods/'+formData.imgUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <!-- 是否促销 -->
        <el-form-item label="是否促销" prop="isPromotion">
          <el-radio-group v-model="formData.isPromotion">
            <el-radio label="促销"></el-radio>
            <el-radio label="不促销"></el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 食品规格 -->
        <el-form-item label="食品规格" prop="goodsstandard">
          <el-radio-group v-model="formData.goodsstandard">
            <el-radio label="单规格"></el-radio>
            <el-radio label="多规格"></el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 单规格的包装费 -->
        <el-form-item v-if="standardFlag" label="包装费" prop="packingexpense">
          <el-input-number
            size="small"
            v-model="formData.packingexpense"
            :min="0"
            :max="20"
            label="包装费"
          ></el-input-number>
        </el-form-item>
        <!-- 单规格的价格 -->
        <el-form-item v-if="standardFlag" label="价 格" prop="goodsPrice">
          <el-input-number size="small" v-model="formData.goodsPrice" :min="10" label="价格"></el-input-number>
        </el-form-item>

        <!-- 多规格 的包装费和价格 -->
        <div v-if="!standardFlag" style="text-align: center; margin-bottom: 30px;">
          <el-button size="medium" type="primary" @click="dialogFormVisible = true">添加规格</el-button>

          <el-table :data="formData.tableData" style="width: 100%">
            <el-table-column prop="goodsstandard" label="规格" width="120"></el-table-column>
            <el-table-column prop="packingexpense" label="包装费" width="120"></el-table-column>
            <el-table-column prop="goodsPrice" label="价格"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="delOneRow(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 商品描述 -->
        <el-form-item label="商品描述" prop="goodsdesc">
          <el-input v-model="formData.goodsdesc"></el-input>
        </el-form-item>

        <!-- 添加规格模态框 -->
        <el-dialog title="添加规格" :visible.sync="dialogFormVisible">
          <el-form :model="addStandardForm">
            <!-- 规格 -->
            <el-form-item label="规格" :label-width="formLabelWidth">
              <el-input
                style="width:180px;"
                v-model="addStandardForm.goodsstandard"
                autocomplete="off"
              ></el-input>
            </el-form-item>

            <!-- 包装费 -->
            <el-form-item :label-width="formLabelWidth" label="包装费">
              <el-input-number
                v-model="addStandardForm.packingexpense"
                :min="0"
                :max="10"
                label="包装费"
              ></el-input-number>
            </el-form-item>

            <!-- 价格 -->
            <el-form-item :label-width="formLabelWidth" label="价格">
              <el-input-number v-model="addStandardForm.goodsPrice" :min="20" label="价格"></el-input-number>
            </el-form-item>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="subtableData">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 添加 -->
        <el-form-item>
          <el-button type="primary" @click="submitAdd">立即添加</el-button>
          <el-button @click="resetAll">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { addGoods } from "@/api/goods";
export default {
  data() {
    return {
      //添加规格模态框的显示和隐藏
      dialogFormVisible: false,
      formLabelWidth: "120px", // 标签宽度
      //表单数据
      formData: {
        goodsname: "", //商品名称
        goodscategory: "", //商品分类
        goodsfeature: [], //商品特色
        isPromotion: "", //是否促销
        goodsstandard: "单规格", //食品规格
        packingexpense: "", //包装费
        goodsPrice: "20", //价格
        goodsdesc: "", //商品描述
        imgUrl: "", //商品图片地址
        //多规格
        tableData: [
          {
            goodsstandard: "默认", //规格
            packingexpense: "0", //包装费
            goodsPrice: "20" //价格
          }
        ]
      },
      //添加多规格的数据
      addStandardForm: {
        goodsstandard: "", //规格
        packingexpense: "", //包装费
        goodsPrice: "" //价格
      },
      //表单验证
      rules: {
        goodsname: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 3, max: 10, message: "商品名称在3-10个字", trigger: "blur" }
        ],
        goodscategory: [
          { required: true, message: "请选择商品分类", trigger: "change" }
        ],
        goodsfeature: [
          {
            required: true,
            message: "请选择至少一种商品特色",
            trigger: "change"
          }
        ],

        isPromotion: [
          { required: true, message: "请选择是否促销", trigger: "change" }
        ],
        goodsdesc: [
          { required: true, message: "请输入商品描述", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //提交表单
    submitAdd() {
      this.$refs.addProductForm.validate(async valid => {
        if (valid) {
          //解构表单所有参数
          let {
            goodsname,
            goodscategory,
            goodsfeature,
            imgUrl,
            isPromotion,
            goodsstandard,
            packingexpense,
            goodsPrice,
            goodsdesc,
            tableData
          } = this.formData;
          //配置参数
          let params = {
            goodsname,
            goodscategory,
            goodsfeature: JSON.stringify(goodsfeature),
            imgUrl,
            isPromotion,
            standard:
              this.formData.goodsstandard === "单规格"
                ? JSON.stringify([{ goodsstandard, packingexpense, goodsPrice }])
                : JSON.stringify(tableData),
            goodsdesc
          };

          let {code} = await addGoods(params);
          if( code === 0 ){
            this.$router.push('/home/productlist')
          }
        } else {
          return false;
        }
      });
    },
    //重置表单
    resetAll() {
      this.$refs.addProductForm.resetFields();
    },
    // 多规格点击删除一行
    delOneRow(index) {
      this.formData.tableData.splice(index, 1);
    },
    //多规格---点击确定将数据添加到table
    subtableData() {
      //将数据添加到表单里的多规格里
      this.formData.tableData.unshift(this.addStandardForm);

      //将多规格表格清空
      this.addStandardForm = {
        goodsstandard: "", //规格
        packingexpense: "", //包装费
        goodsPrice: "" //价格
      };

      //隐藏表单
      this.dialogFormVisible = false;
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      let { code, imgUrl } = res;
      if (code === 0) {
        this.formData.imgUrl = imgUrl;
      }
    },
    // 图片上传之前的处理函数
    beforeAvatarUpload(file) {
      const isPNG = file.type === "image/png";
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!(isPNG || isJPG)) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return (isPNG || isJPG) && isLt2M;
    }
  },
  computed: {
    //计算显示和隐藏单规格多规格选项
    standardFlag() {
      return this.formData.goodsstandard === "单规格" ? true : false;
    }
  }
};
</script>

<style lang="less">
.add-product {
  .el-form {
    width: 600px;
    .el-form-item {
      .is-top::after {
        content: "";
        height: 0;
      }
    }
    .el-tabs__active-bar {
      height: 0;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
}
</style>
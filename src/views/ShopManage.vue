<template>
  <div class="shop-manage">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>店铺管理</span>
      </div>
      <div class="text item">
        <el-form
          :disabled="isDisabled"
          :model="shopFormData"
          ref="shopForm"
          label-width="80px"
          style="width:500px;"
        >
          <!-- 店铺名称 -->
          <el-form-item label="店铺名称">
            <el-input v-model="shopFormData.shopname"></el-input>
          </el-form-item>
          <!-- 详细地址 -->
          <el-form-item label="详细地址">
            <el-input v-model="shopFormData.address"></el-input>
          </el-form-item>
          <!-- 联系电话 -->
          <el-form-item label="联系电话">
            <el-input v-model="shopFormData.phone"></el-input>
          </el-form-item>
          <!-- 店铺简介 -->
          <el-form-item label="店铺简介">
            <el-input v-model="shopFormData.shopdesc"></el-input>
          </el-form-item>
          <!-- 店铺标语 -->
          <el-form-item label="店铺标语">
            <el-input v-model="shopFormData.slogan"></el-input>
          </el-form-item>
          <!-- 店铺分类 -->
          <el-form-item label="店铺分类">
            <el-select placeholder="请选择商品分类" v-model="shopFormData.category">
              <el-option label="火锅" value="火锅"></el-option>
              <el-option label="串儿" value="串儿"></el-option>
              <el-option label="干锅" value="干锅"></el-option>
              <el-option label="小龙虾" value="小龙虾"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <!-- 店铺特点 -->
          <el-form-item label="店铺特点">
            <el-checkbox-group v-model="shopFormData.feature">
              <el-checkbox label="美食/餐厅" name="美食/餐厅"></el-checkbox>
              <el-checkbox label="品牌保证" name="品牌保证"></el-checkbox>o
              <el-checkbox label="蜂鸟专送" name="蜂鸟专送"></el-checkbox>
              <el-checkbox label="新店开铺" name="新店开铺"></el-checkbox>
              <el-checkbox label="外卖宝" name="外卖宝"></el-checkbox>
              <el-checkbox label="准时达" name="准时达"></el-checkbox>
              <el-checkbox label="开发票" name="开发票"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 配送费 -->
          <el-form-item label="配送费">
            <el-input-number v-model="shopFormData.packingexpense" :min="0" :max="20" label="描述文字"></el-input-number>
          </el-form-item>
          <!-- 起送价 -->
          <el-form-item label="起送价">
            <el-input-number v-model="shopFormData.minprice" :min="0" label="描述文字"></el-input-number>
          </el-form-item>
          <!-- 营业时间 -->
          <el-form-item label="营业时间">
            <el-time-picker
              is-range
              arrow-control
              v-model="shopFormData.date"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            ></el-time-picker>
          </el-form-item>
          <!-- 店铺头像 -->
          <el-form-item label="店铺头像">
            <el-upload
              class="avatar-uploader"
              :action="upApi"
              :show-file-list="false"
              :on-success="handleAvatarSuccess1"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="shopFormData.shopAvatar"
                :src="serveApi + shopFormData.shopAvatar"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <!-- 营业执照 -->
          <el-form-item label="营业执照">
            <el-upload
              class="avatar-uploader"
              :action="upApi"
              :show-file-list="false"
              :on-success="handleAvatarSuccess2"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="shopFormData.businessLicenseImg"
                :src="serveApi + shopFormData.businessLicenseImg"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <!-- 餐饮服务许可证 -->
          <el-form-item label="餐饮服务许可证">
            <el-upload
              class="avatar-uploader"
              :action="upApi"
              :show-file-list="false"
              :on-success="handleAvatarSuccess3"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="shopFormData.cateringServiceLicenseImg"
                :src="serveApi + shopFormData.cateringServiceLicenseImg"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <!-- 优惠活动 -->
          <el-form-item label="优惠活动">
            <el-select @change="dialogFormVisible = true" v-model="activity" placeholder="请选择优惠活动">
              <el-option label="满减优惠" value="满减优惠"></el-option>
              <el-option label="特惠大酬宾" value="特惠大酬宾"></el-option>
              <el-option label="新用户立减" value="新用户立减"></el-option>
              <el-option label="进店领券" value="进店领券"></el-option>
            </el-select>
          </el-form-item>
          <!-- 优惠活动的模态框 -->
          <el-dialog title="活动详情" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="活动详情" label-width="120px">
                <el-input v-model="form.detail" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="handelDetermin">确 定</el-button>
            </div>
          </el-dialog>

          <!-- 优惠表格 -->
          <el-form-item>
            <el-table :data="shopFormData.tableData" style="width: 100%">
              <el-table-column prop="title" label="活动标题" width="100"></el-table-column>
              <el-table-column prop="artical" label="活动名称" width="100"></el-table-column>
              <el-table-column prop="detail" label="活动详情" width="140"></el-table-column>
              <el-table-column prop="operation" label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="delActivity(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <!-- 保存 -->
        <div style="margin-left:100px">
          <el-button @click="isDisabled = false">编辑</el-button>
          <el-button type="primary" @click="toModifyShop">保存</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { modifyShop, getShopData } from "@/api/shop";

export default {
  data() {
    return {
      //是否禁用表单
      isDisabled: true,
      //图片上传地址
      upApi: "http://127.0.0.1:8000/shop/upload",

      serveApi: "http://127.0.0.1:8000/upload/shop/",
      //模态框数据
      form: {
        detail: ""
      },
      //显示和隐藏模态框
      dialogFormVisible: false,
      // 商品表单数据
      activity: "",
      shopFormData: {
        shopname: "", //店铺名称
        address: "", //详细地址
        phone: "", //联系电话
        shopdesc: "", //店铺简介
        slogan: "", //店铺标语
        category: "", //店铺分类
        feature: [], //店铺特点
        packingexpense: 0, //配送费
        minprice: 10, //起送价
        date: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)], //营业时间
        shopAvatar: "", //店铺头像
        businessLicenseImg: "", //营业执照
        cateringServiceLicenseImg: "", //餐饮服务许可证
        tableData: [
          { title: "减", artical: "满减优惠", detail: "满10减1 满30减5" }
        ]
      }
    };
  },
  methods: {
    //获取店铺信息
    async getShopInfo() {
      let { data } = await getShopData();
      if (data) {
        data.date = JSON.parse(data.date);
        data.feature = JSON.parse(data.feature);
        data.tableData = JSON.parse(data.tableData);
        this.shopFormData = { ...data };
      }
    },
    //修改店铺
    async toModifyShop() {
      let params = { ...this.shopFormData };
      params.feature = JSON.stringify(params.feature);
      params.date = JSON.stringify(params.date);
      params.tableData = JSON.stringify(params.tableData);

      let { code } = await modifyShop(params);
      if (code === 0) {
        this.getShopInfo();
      }

      //禁用表单
      this.isDisabled = true;
    },
    //店铺头像上传成功
    handleAvatarSuccess1(res, file) {
      let { code, imgUrl } = res;
      if (code === 0) {
        this.shopFormData.shopAvatar = imgUrl;
      }
    },
    //营业执照上传成功
    handleAvatarSuccess2(res, file) {
      let { code, imgUrl } = res;
      if (code === 0) {
        this.shopFormData.businessLicenseImg = imgUrl;
      }
    },
    //餐饮许可证上传成功
    handleAvatarSuccess3(res, file) {
      let { code, imgUrl } = res;
      if (code === 0) {
        this.shopFormData.cateringServiceLicenseImg = imgUrl;
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
    },
    //删除优惠活动
    delActivity(index) {
      this.shopFormData.tableData.splice(index, 1);
    },
    //模态框编辑确定，将数据添加到活动里
    handelDetermin() {
      let name;
      switch (this.activity) {
        case "满减优惠":
          name = "减";
          break;
        case "特惠大酬宾":
          name = "特";
          break;
        case "新用户立减":
          name = "新";
          break;
        case "进店领券":
          name = "领";
          break;
      }

      let activityData = {
        title: name,
        artical: this.activity,
        detail: this.form.detail
      };

      this.shopFormData.tableData.unshift(activityData);
      this.form.detail = "";
      this.dialogFormVisible = false;
    }
  },
  created() {
    // 调用获取店铺信息函数
    this.getShopInfo();
  }
};
</script>

<style lang="less">
.shop-manage {
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
</style>
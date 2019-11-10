<template>
  <el-card class="box-card personal-center">
    <div slot="header" class="clearfix">
      <span>管理员信息</span>
    </div>
    <div class="personal-info">
      <div>
        <span>管理员ID:</span>
        {{ info.id }}
      </div>
      <div>
        <span>账号:</span>
        {{ info.account }}
      </div>
      <div>
        <span>用户组:</span>
        {{ info.userGroup }}
      </div>
      <div>
        <span>创建时间:</span>
        {{ info.ctime | filterCtime }}
      </div>
      <div class="layoutImg">
        <span style="margin-right:20px;">管理员头像:</span>
        <el-upload
          style="margin-right:30px;"
          class="avatar-uploader"
          action="http://127.0.0.1:8000/account/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="info.imgUrl" :src="serveApi + info.imgUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-button type="success" size="small" @click="avatarModify">修改头像</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { getPersonInfo, avatarModify } from "@/api/account";
import moment from "moment";
export default {
  data() {
    return {
      serveApi: "http://127.0.0.1:8000/upload/account/",
      info: {
        id: 0,
        account: "",
        userGroup: "",
        ctime: "",
        imgUrl: ""
      }
    };
  },
  methods: {
    //获取账号信息
    async getaccountInfo() {
      let { accountInfo } = await getPersonInfo();

      let { id, account, imgUrl, ctime, userGroup } = accountInfo;
      this.info = { id, account, imgUrl, ctime, userGroup };
    },
    //上传成功的回调
    handleAvatarSuccess(res,file) {
      let { code, imgUrl } = res
      if( code === 0 ){
        this.info.imgUrl = imgUrl
      }
    },
    //上传之前的判断
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
    
    //修改头像
    async avatarModify(){
      let {code} = await avatarModify({ imgUrl: this.info.imgUrl})
      if( code === 0 ){

        //发信息给头部组件，更新头像
        this.$bus.$emit( 'updateAvatar' )
      }
    }
  },
  filters: {
    //过滤创建时间
    filterCtime(time) {
      return moment(time).format("YYYY-MM-DD hh:mm:ss");
    }
  },
  created() {
    this.getaccountInfo();
  }
};
</script>

<style lang="less">
.personal-center {
  .el-card__body {
    padding-top: 0;
  }
  .personal-info {
    & > div {
      border-bottom: 1px solid #eee;
      line-height: 40px;
      padding: 10px 0;
      span {
        font-weight: 600;
      }
      img {
        width: 80px;
        height: 80px;
        vertical-align: middle;
        border-radius: 6px;
      }
    }
    .layoutImg {
      display: flex;
      align-items: center;
    }
  }
}
</style>
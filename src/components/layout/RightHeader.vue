<template>
  <div class="header">
    <el-header>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :key="index" v-for="(item, index) in breadNav" :to="{ path: item.path }">{{ item.title }}</el-breadcrumb-item>
        
      </el-breadcrumb>

      <div class="head-portrait">
        <div>
          <span>欢迎你, {{account}}</span>
        </div>

        <div class="img-circle">
          <el-dropdown placement="bottom" @command="handleCommand">
            <span class="el-dropdown-link">
              <img v-if="imgUrl" :src="serveApi + imgUrl" alt="头像" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="person">用户信息</el-dropdown-item>
              <el-dropdown-item command="logout">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>
  </div>
</template>

<script>
import local from '@/utils/local'
import { getPersonInfo } from "@/api/account";

export default {
  data() {
    return {
      //头像图片地址
      serveApi:'http://127.0.0.1:8000/upload/account/',
      //账号
      account: "",
      //头像
      imgUrl: "",
      //面包屑导航的数据
      breadNav:[]
    };
  },
  methods: {
    //用户信息和退出系统
    handleCommand(command) {
      if (command === "person") {
        this.$router.push("/home/personal");
      } else if (command === "logout") {
        //清除本地token
        local.remove( "token" )
        //跳转到登录
        this.$router.push("/login");
      }
    },
    //获取用户信息
    async getaccountInfo() {
      let { accountInfo } = await getPersonInfo();
      let { account, imgUrl } = accountInfo
      this.account = account
      this.imgUrl = imgUrl
    },
    //计算面包屑
    countBread(){
      this.breadNav = this.$route.meta.navArr
    }
  },
  created() {
    //调用获取用户信息函数
    this.getaccountInfo()
    
    //接收用户中心传来的信息，更新头像
    this.$bus.$on( 'updateAvatar', () => {
      this.getaccountInfo()
    } )

    //进页面计算一次面包屑
    this.countBread()
  },
  watch: {
    //监听路有变化
    '$route.path'(){
       this.countBread()
    }
  },
};
</script>

<style lang="less">
.header {
  .el-header {
    display: flex;
    justify-content: space-between;

    .el-breadcrumb {
      line-height: 60px;
    }

    .head-portrait {
      display: flex;
      margin-right: 20px;
      span {
        line-height: 60px;
        margin-right: 10px;
      }
      .img-circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-top: 10px;
        .el-dropdown {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
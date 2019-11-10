<template>
  <div class="login">
    <el-form ref="loginForm" :rules="rules" class="demo-ruleForm" size="small" :model="loginForm">
      <h1 class="tologin">系统登录</h1>
      <!-- 账号 -->
      <el-form-item prop="account">
        <el-input v-model="loginForm.account" prefix-icon="iconfont icon-yonghu" autocomplete="off"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password" @click.native="changeType">
        <el-input
          v-model="loginForm.password"
          :suffix-icon="isText ?'iconfont icon-jurassic_openeyes': 'iconfont icon-biyan'"
          prefix-icon="iconfont icon-mima"
          :type="isText ? 'text':'password'"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="isSubmit('loginForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { regUtils } from "../utils/reg";
import local from "@/utils/local";
import { checkLogin } from "@/api/account";
export default {
  data() {
    const testReg = (rule, value, callback) => {
      // rule: 验证规则对象  value: 用户输入的值， callback: 回调函数
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!rule.isSatisfy.test(value)) {
        callback(new Error("密码至少包含 数字和英文，长度6-12"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        account: "",
        password: ""
      },
      isText: false,
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" }, //内置非空验证
          { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" }
        ],
        password: [
          //自定义验证----函数写在data的return前
          { validator: testReg, isSatisfy: regUtils(), trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //改变密码输入框的type
    changeType(e) {
      if (
        e.target.className.includes("icon-biyan") ||
        e.target.className.includes("icon-jurassic_openeyes")
      ) {
        this.isText = !this.isText;
      }
    },
    //是否阻止表单提交
    isSubmit(loginForm) {
      this.$refs[loginForm].validate(async valid => {
        // console.log(valid);
        if (valid) {
          let { token, role } = await checkLogin(this.loginForm);

          if (token) {
            local.set("token", token);
            local.set( "role",role )//role根据返回的值不同，生成不同的菜单(权限)
            setTimeout(() => {
              this.$router.push("/home");
            }, 1000);
          }

        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less">
.login {
  height: 100%;
  background-color: #2d3a4b;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-form {
    width: 360px;
    .tologin {
      text-align: center;
      color: #fff;
      margin-bottom: 30px;
      font-size: 24px;
    }
    .el-button {
      width: 100%;
    }
    .el-input {
      input {
        background-color: #283443;
        color: #fff;
      }
    }
  }
}
</style>
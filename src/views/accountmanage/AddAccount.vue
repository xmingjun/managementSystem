<template>
  <div class="addaccount">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加账号</span>
      </div>
      <!-- 表单 -->
      <div>
        <el-form :model="addFormData" :rules="rules" size="small" ref="addForm" label-width="100px">
          <!-- 账号 -->
          <el-form-item label="账号" prop="account">
            <el-input v-model="addFormData.account" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input v-model="addFormData.password" type="password" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 用户组 -->
          <el-form-item label="用户组" prop="userGroup">
            <el-select v-model="addFormData.userGroup" placeholder="请选择用户组">
              <el-option label="超级管理员" value="超级管理员"></el-option>
              <el-option label="普通管理员" value="普通管理员"></el-option>
            </el-select>
          </el-form-item>
          <!-- 提交 -->
          <el-form-item>
            <el-button type="primary" @click="submitData">提交</el-button>
            <el-button @click="resetAll">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
/* 引入工具函数 */
import { regUtils } from "@/utils/reg";
/* 引入api里的请求函数 */
import { addAccount } from "@/api/account";
export default {
  data() {
    /* 密码验证 */
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else if (!rule.regular.test(value)) {
        callback(new Error("密码至少包含数字和英文，6-12位"));
      } else {
        callback();
      }
    };
    return {
      addFormData: {
        account: "",
        password: "",
        userGroup: ""
      },
      /* 表单验证 */
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 2, max: 6, message: "账号长度在2-6位", trigger: "blur" }
        ],
        password: [
          {
            required: true,
            validator: validatePassword,
            regular: regUtils(),
            trigger: "blur"
          }
        ],
        userGroup: [
          { required: true, message: "请选择用户组", trigger: "change" }
        ]
      }
    };
  },

  methods: {
    /* 重置表单 */
    resetAll() {
      this.$refs.addForm.resetFields();
    },
    /* 提交表单 */
    submitData() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          /* 发送axios请求 */
          let  {code, msg} = await addAccount(this.addFormData);
          if( code === 0 ){//成功
          this.$router.push('/home/accountlist')
          }
          
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.addaccount {
  .el-form {
    width: 303px;
  }
}
</style>
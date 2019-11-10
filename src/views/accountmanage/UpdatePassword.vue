<template>
  <el-card class="box-card update-password">
    <div slot="header" class="clearfix">
      <span>修改密码</span>
    </div>
    <div>
      <el-form
        :model="updateData"
        :rules="rules"
        status-icon
        ref="UpdateForm"
        size="small"
        style="width:360px;"
        label-width="100px"
      >
        <!-- 原密码 -->
        <el-form-item label="原密码" prop="oldPwd">
          <el-input type="password" v-model="updateData.oldPwd"></el-input>
        </el-form-item>
        <!-- 新密码 -->
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" autocomplete="off" v-model="updateData.newPwd"></el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item label="确认密码" prop="confimPassword">
          <el-input type="password" autocomplete="off" v-model="updateData.confimPassword"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="subForm">提交</el-button>
          <el-button @click="resetAll">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
/* 工具函数 */
import { regUtils } from "@/utils/reg";
import { checkOldPwd, updatePwd } from '@/api/account'
import local from "@/utils/local"
import { async } from 'q';
export default {
  data() {
    /* 原密码验证 */
    const regPassword1 =async (rule, value, callback) => {

      let {code, msg} = await checkOldPwd( {oldPwd:value} )
      
      if (!value) {
        callback(new Error("请输入密码"));
      } else if (code == 11) {
        callback(new Error("原密码不正确"));
      } else {
        callback();
      }
    };
    /* 新密码验证 */
    const regPassword2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else if (!rule.reg.test(value)) {
        callback(new Error("密码至少包含数字和英文，长度6-12"));
      } else if (value === this.updateData.oldPwd) {
        callback(new Error("新旧密码不能相同"));
      } else {
        if( this.updateData.confimPassword !== "" ){
            this.$refs.UpdateForm.validateField('confimPassword')
        }
        callback();
      }
    };
    /* 确认密码验证 */
    const regPassword3 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else if (value !== this.updateData.newPwd) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };

    return {
      updateData: {
        oldPwd: "",
        newPwd: "",
        confimPassword: ""
      },
      rules: {
        oldPwd: [
          {
            required: true,
            validator: regPassword1,
            reg: regUtils(),
            trigger: "blur"
          }
        ],
        newPwd: [
          {
            required: true,
            validator: regPassword2,
            reg: regUtils(),
            trigger: "blur"
          }
        ],
        confimPassword: [
          {
            required: true,
            validator: regPassword3,
            reg: regUtils(),
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    /* 重置表单 */
    resetAll() {
      this.$refs.UpdateForm.resetFields();
    },
    /* 提交表单 */
    subForm() {
      this.$refs.UpdateForm.validate(async valid => {
        if (valid) {
         let{code} = await updatePwd({newPwd:this.updateData.newPwd})
         if( code === 0 ){
           local.remove('token')
           this.$router.push('/login')
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
</style>
<template>
  <el-container class="right-content">
    <!-- 头部导航 -->
    <RightHeader></RightHeader>

    <el-main>
      <!-- 路由出口 -->
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import RightHeader from './RightHeader.vue'

export default {
  components:{
    RightHeader
  }
};
</script>

<style lang="less" scoped>
.right-content {
  display: flex;
  flex-direction: column;
  .el-main {
    background-color: #eee;
  }
}
</style>
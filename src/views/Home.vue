<template>
  <div class="home">
    <el-container>
      <!-- 导航 -->
      <LeftNav />

      <!-- 右边内容 -->
      <RightContent />
    </el-container>
  </div>
</template>

<script>
import LeftNav from "@/components/layout/LeftNav.vue";
import RightContent from "@/components/layout/RightContent.vue";
export default {
  components: {
    LeftNav,
    RightContent
  }
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  .el-container {
    height: 100%;
  }
}
</style>
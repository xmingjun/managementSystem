<template>
  <el-aside width="200px">

    <div class="nav-title">外卖管理系统</div>

    <el-menu
      :default-active="path"
      router
      unique-opened
      background-color="#304156"
      text-color="#fff"
    >
      <!-- 循环导航菜单--创建一个空标签template循环 -->
      <template v-for="(item,index) in menus">
        <!-- 一级菜单 -->
        <el-menu-item v-if="!item.children" :index="item.path" :key="index">
          <i class="iconfont" :class="item.icon"></i>
          <span slot="title" style="user-select:none">{{item.title}}</span>
        </el-menu-item>
        <!-- 二级菜单 -->
        <el-submenu v-else :index="item.path" :key="index">
          <template slot="title">
            <i class="iconfont" :class="item.icon"></i>
            <span style="user-select:none">{{item.title}}</span>
          </template>

          <el-menu-item-group>
            <el-menu-item
              style="user-select:none"
              v-for="(v, index) in item.children"
              :key="index"
              :index="v.path"
            >{{v.title}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
import local from "@/utils/local";
export default {
  data() {
    return {
      /* 导航 */
      menus: []
    };
  },
  computed: {
    //计算path,高亮菜单
    path() {
      if (this.$route.path === "/home/editorder") {
        return "/home/ordermanage";
      }
      if (this.$route.path === "/home/editproduct") {
        return "/home/productlist";
      }
      return this.$route.path;
    }
  },
  methods: {
    //判断用户身份，生成不同菜单(菜单权限)
    judgeUser() {
      //取出本地role --- 登录时存入
      let role = local.get("role");

      //完整菜单
      let allMenus = [
        /* 首页 */
        {
          path: "/home/index",
          icon: "icon-shouye",
          title: "后台首页",
          meta: { role: ["super", "ordinary"] }
        },
        /* 订单管理 */
        {
          path: "/home/ordermanage",
          icon: "icon-dingdan",
          title: "订单管理",
          meta: { role: ["super", "ordinary"] }
        },
        /* 商品管理 */
        {
          path: "/home/productmanage",
          icon: "icon-shangpin",
          title: "商品管理",
          children: [
            { path: "/home/productlist", title: "商品列表" },
            { path: "/home/addproduct", title: "添加商品" }
          ],
          meta: { role: ["super", "ordinary"] }
        },
        /* 店铺管理 */
        {
          path: "/home/shopmanage",
          icon: "icon-shop",
          title: "店铺管理",
          meta: { role: ["super", "ordinary"] }
        },
        /* 账号管理 */
        {
          path: "/home/accountmanage",
          icon: "icon-zhanghao",
          title: "账号管理",
          children: [
            { path: "/home/accountlist", title: "账号列表" },
            { path: "/home/addaccount", title: "添加账号" },
            { path: "/home/updatepassword", title: "修改密码" }
          ],
          meta: { role: ["super"] }
        },
        /* 商品统计 */
        {
          path: "/home/selltotal",
          icon: "icon-tongji",
          title: "销售统计",
          children: [
            { path: "/home/producttotal", title: "商品统计" },
            { path: "/home/ordertotal", title: "订单统计" }
          ],
          meta: { role: ["super"] }
        }
      ];

      //根据用户身份 计算菜单权限
      let accessMenus = allMenus.filter(
        item => item.meta && item.meta.role.includes(role)
      );

      //给菜单赋值
      this.menus = accessMenus;
    }
  },
  created() {
    //调用生成菜单的函数
    this.judgeUser()
  },
};
</script>

<style lang="less">
.el-aside {
  background-color: #304156;
  .nav-title{
    text-align: center;
    line-height: 60px;
    color: #fff;
    font-size: 20px;
    text-shadow: 2px 4px 8px #000;
    
  }
  .el-menu {
    border: none;

    .el-submenu {
      .el-menu-item {
        background-color: #202f3f !important;
      }
      .iconfont {
        color: #eee;
        margin: 10px;
      }
    }

    .el-menu-item {
      .iconfont {
        color: #eee;
        margin: 10px;
      }
    }

    .el-menu-item-group__title {
      padding: 0;
    }
  }
}
</style>
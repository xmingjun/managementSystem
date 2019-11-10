import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', //登录
    redirect: '/login',
  },
  {
    path: '/login', //登录
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home', //首页
    redirect: '/home/index',
    component: () => import('../views/Home.vue'),
    children: [
      {
        meta: {
          navArr: [
            { path: '/home', title: '首页' },
            { path: '/home/index', title: '后台首页' }
          ]
        },
        path: '/home/index', //首页
        component: () => import('../views/Index.vue')
      },
      {
        meta: {
          navArr: [
            { path: '/home', title: '首页' },
            { path: '/home/personal', title: '个人中心' }
          ]
        },
        path: '/home/personal', //个人中心
        component: () => import('../views/PersonalCenter.vue')
      },
      {
        meta: {
          navArr: [
            { path: '/home', title: '首页' },
            { path: '/home/ordermanage', title: '订单管理' }
          ]
        },
        path: '/home/ordermanage', //订单管理
        component: () => import('../views/ordermanage/OrderManage.vue'),
      },
      {
        meta: {
          navArr: [
            { path: '/home', title: '首页' },
            { path: '/home/ordermanage', title: '订单管理' },
            { path: '/home/editorder', title: '查看订单' },
          ]
        },
        path: '/home/editorder',//订单查看
        component: () => import('../views/ordermanage/EditOrder.vue')
      },
      {
        meta: {
          navArr: [
            { path: '/home', title: '首页' },
            { path: '/home/productlist', title: '商品管理' },
            { path: '/home/productlist', title: '商品列表' },
          ]
        },
        path: '/home/productlist', //商品列表
        component: () => import('../views/productmanage/ProductList.vue')
      },
      {
        meta: {
          navArr: [
            { path: '/home', title: '首页' },
            { path: '/home/productlist', title: '商品管理' },
            { path: '/home/addproduct', title: '添加商品' },
          ]
        },
        path: '/home/addproduct', //添加商品
        component: () => import('../views/productmanage/AddProduct.vue')
      },
      {
        meta: {
          navArr: [
            { path: '/home', title: '首页' },
            { path: '/home/productlist', title: '商品管理' },
            { path: '/home/editproduct', title: '编辑商品' },
          ]
        },
        path: '/home/editproduct', //编辑商品
        component: () => import('../views/productmanage/ProductEdit.vue')
      },
      {
        meta: {
          navArr: [
            { path: '/home', title: '首页' },
            { path: '/home/shopmanage', title: '店铺管理' }
          ]
        },
        path: '/home/shopmanage', //店铺管理
        component: () => import('../views/ShopManage.vue')
      },
      {
        meta: {
          navArr: [
            { path: '/home', title: '首页' },
            { path: '/home/accountlist', title: '账号管理' },
            { path: '/home/addaccount', title: '添加账号' }
          ]
        },
        path: '/home/addaccount', //添加账号
        component: () => import('../views/accountmanage/AddAccount.vue')
      },
      {
        meta: {
          navArr: [
            { path: '/home', title: '首页' },
            { path: '/home/accountlist', title: '账号管理' },
            { path: '/home/accountlist', title: '账号列表' }
          ]
        },
        path: '/home/accountlist', //账号列表
        component: () => import('../views/accountmanage/AccountList.vue')
      },
      {
        meta: {
          navArr: [
            { path: '/home', title: '首页' },
            { path: '/home/accountlist', title: '账号管理' },
            { path: '/home/updatepassword', title: '修改密码' }
          ]
        },
        path: '/home/updatepassword', //修改密码
        component: () => import('../views/accountmanage/UpdatePassword.vue')
      },
      {
        meta: {
          navArr: [
            { path: '/home', title: '首页' },
            { path: '/home/producttotal', title: '销售统计' },
            { path: '/home/producttotal', title: '商品统计' }
          ]
        },
        path: '/home/producttotal', //商品统计
        component: () => import('../views/selltotal/ProductTotal.vue')
      },
      {
        meta: {
          navArr: [
            { path: '/home', title: '首页' },
            { path: '/home/producttotal', title: '销售统计' },
            { path: '/home/ordertotal', title: '订单统计' }
          ]
        },
        path: '/home/ordertotal', //订单统计
        component: () => import('../views/selltotal/OrderTotal.vue')
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

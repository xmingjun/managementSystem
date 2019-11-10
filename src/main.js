import Vue from 'vue'
import App from './App.vue'
import router from './router'
/* 引入element-ui */
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './assets/fonts/iconfont.css' //字体图标

import './assets/css/reset.css'//重置样式

import local from '@/utils/local'//本地存储函数


/* 中央事件总线 */
const bus = new Vue()
Vue.prototype.$bus = bus

/* 路由守卫 */
router.beforeEach( (to, from, next) => {
  let token = local.get( 'token' )
  if( token ) {
    next()
  }else{
    if( to.path === '/login' ){
      next()
    }else{
      next( '/login' )
    }
  }
} )

//使用element-ui
Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

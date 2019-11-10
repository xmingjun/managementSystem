/* 
* 账号管理的请求
*/

/* 引入utils封装的axios */
import req from '@/utils/request'

//添加商品
export const addGoods = params => req.post('/goods/goodsadd',params)

//获取商品列表
export const avilGoodsList = params => req.get('/goods/goodslist',params)
//删除商品
export const delRowGoods = params => req.get('/goods/goodsdel',params)
//修改商品
export const editGoods = params => req.post('/goods/goodsedit',params)



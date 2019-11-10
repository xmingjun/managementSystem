/* 
* 店铺管理的请求
*/

/* 引入utils封装的axios */
import req from '@/utils/request'

//修改店铺
export const modifyShop = params => req.post( '/shop/shopedit', params )
//获取店铺数据
export const getShopData = () => req.get( '/shop/shopinfo' )
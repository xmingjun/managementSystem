/* 
* 订单管理的请求
*/

/* 引入utils封装的axios */
import req from '@/utils/request'

//获取订单
export const availOrder = params => req.get('/order/orderlist',params)
//修改订单
export const orderEdit = params => req.post('/order/orderedit',params)

//首页echarts数据
export const getIndexEcharts = () => req.get( '/order/indexcharts' )
//订单统计echarts
export const orderTotal = params => req.get( '/order/ordertotal', params )

/* 
* 账号管理的请求
*/

/* 引入utils封装的axios */
import req from '@/utils/request'

//登录
export const checkLogin = params => req.post( '/account/checklogin',params ) //得到一个promise对象，可以.then和.catch
//添加账号
export const addAccount = params => req.post( '/account/addaccount',params ) //得到一个promise对象，可以.then和.catch
//获取账号列表
export const accountList = params => req.get( '/account/accountlist',params )
//删除一行
export const accountDel = params => req.get( '/account/accountdel',params )
//批量删除
export const accountBatchdel = params => req.get( '/account/accountbatchdel',params )
//保存编辑
export const accountEdit = params => req.post( '/account/accountedit',params )
//验证旧密码是否正确
export const checkOldPwd = params => req.get( '/account/checkoldpwd',params )
//修改密码
export const updatePwd = params => req.post( '/account/passwordedit',params )
//获取用户信息
export const getPersonInfo = params => req.get( '/account/accountinfo',params )
//修改头像
export const avatarModify = params => req.get( '/account/avataredit',params )







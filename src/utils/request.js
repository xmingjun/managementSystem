/* 
*axios请求函数
*
*/

/* 引入axios和qs */
import axios from 'axios'
import qs from 'qs'

import {Message} from 'element-ui'
import local from "@/utils/local"

/* 设置默认服务器根目录 */
axios.defaults.baseURL = 'http://127.0.0.1:8000'

/* 请求拦截器 */
axios.interceptors.request.use(config => {
    //在请求发送之前带上一些东西，config是请求的配置对象，如果直接返回，就等于什么都不带

    //所有请求在发送出去之前都带上token
    let token = local.get('token')
    config.headers.Authorization = 'Bearer ' + token

    return config;
}, error => {
    return Promise.reject(error); // 请求错误处理
})

/* 响应拦截器 */
axios.interceptors.response.use(response => {
    //response就是后端响应回来的东西，如果你想做什么统一的处理，就写在这里
    let { code, msg } = response.data;
    if( code === 0 ){
        Message({
            type:'success',
            message:msg,
            center:true,
            duration:1000
        })
    }else if( code === 1 ){
        Message.error({
            message:msg,
            center:true,
            duration:1000
        })
    }
    return response;
}, error => {
    Message.error({
        message:"网络请求发生错误，请稍后再试",
        center:true
    })
    return Promise.reject(error) //响应错误处理
})

/* 导出get和post方法 */
export default {
    get(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.get(url, { params })
                .then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
        })

    },
    post(url, params) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(params))
                .then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject(err)
                })
        })
    }
}
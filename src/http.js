import axios from 'axios'
import { Message, Loading } from 'element-ui';
import router from './router'

let loading        //定义loading变量

function startLoading() {    //使用Element loading-start 方法
    loading = Loading.service({
        lock: true,
        text: '加载中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}
function endLoading() {    //使用Element loading-close 方法
    loading.close()
}

// 请求拦截  设置统一header
axios.interceptors.request.use(config => {
    // 加载
    startLoading()
    if (localStorage.eleToken)
        config.headers.Authorization = localStorage.eleToken
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截  token过期处理
axios.interceptors.response.use(response => {
    endLoading();
    if(response.data.success){
        return response.data.message;
    }else{
        Message.error(response.data.message);
        return Promise.reject(response.data.message)
    }
}, error => {
    // 错误提醒
    endLoading()
    //Message.error(error.response.message)
    const { status } = error.response
    if (status ==  '401') {
        Message.error('token值无效，请重新登录')
        // 清除token
        localStorage.removeItem('eleToken')
        //清除projectId
        localStorage.removeItem('eleProjectId')
        // 页面跳转
        router.push('/login')
    }else{
        Message.error('系统错误')
    }
    return Promise.reject(error)
})

export default axios
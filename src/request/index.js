import axios from 'axios'
import {config} from "../config/index.js";

// 创建一个 axios 实例
const request = axios.create({
    baseURL: config.API_SERVER, // 所有的请求地址前缀部分
    timeout: 60000, // 请求超时时间毫秒
    withCredentials: false, // 异步请求携带cookie
})

request.interceptors.response.use(
    function (response) {
        return response.data.data
    }
)


export default request

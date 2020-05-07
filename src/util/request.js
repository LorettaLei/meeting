import axios from 'axios'
import { Notify } from 'vant';
import { DEVELOP } from '../config'
axios.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    if (DEVELOP) {
        console.log(error)
    }
    Notify('网络错误，请稍后重试')
    return Promise.reject(error);
});
  
axios.interceptors.response.use(function (response) {
    let config = response.config;
    if (DEVELOP) {
        console.log(response.data)
    }
    if (response.data && response.data.status == 200) {
        return Promise.resolve(response.data);
    } else if (response.data && /token/.test(response.data.message) && !config.retry) {
        config['retry'] = true;
        return axios(config);
    } else {
        return Promise.resolve(response.data);
    }
}, function () {
    Notify('网络错误，请稍后重试')
    // 对请求错误做些什么
    return Promise.resolve({code:500});
});

export default axios;
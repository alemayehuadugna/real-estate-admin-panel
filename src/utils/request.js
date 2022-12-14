import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent
        
        if (store.getters.token) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            config.headers['authorization'] = "Bearer " + getToken();
        }
        return config
    },
    error => {

        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor 
service.interceptors.response.use(
    response => {
        const res = response.data

        if (res.statusCode !== 200) {
            Message({
                message: res.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            })
            
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
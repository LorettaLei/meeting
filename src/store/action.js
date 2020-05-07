import request from '../util/request'
import { BASE_URL } from '../config'
export default {
    getAuth() {
        return request({
            url: `${BASE_URL}/auth`,
            method: 'post'
        });
    },
    login(data) {
        return request({
            url: `${BASE_URL}/login`,
            method: 'post',
            data: data,
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }]
        });
    },
    getToken(data) {
        return request({
            url: `${BASE_URL}/token`,
            method: 'get',
            params: data
        });
    },
    getRooms() {
        return request({
            url: `${BASE_URL}/room`,
            method: 'get'
        });
    },
    getMeetings(data) {
        return request({
            url: `${BASE_URL}/list`,
            method: 'get',
            params: data
        });
    },
    getHistorys(data) {
        return request({
            url: `${BASE_URL}/history`,
            method: 'get',
            params: data
        });
    },
    addMeeting(data) {
        return request({
            url: `${BASE_URL}/create`,
            method: 'post',
            data: data,
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }]
        });
    },
    editMeeting(data) {
        return request({
            url: `${BASE_URL}/update`,
            method: 'post',
            data: data,
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }]
        });
    },
    delMeeting(data) {
        return request({
            url: `${BASE_URL}/delete`,
            method: 'post',
            data: data,
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }]
        });
    }
}
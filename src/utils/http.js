import axios from 'axios'
import qs from 'qs'
import res from './res'

const iBaseUrl = res.resBaseUrl

axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})

function checkStatus (response) {
  if (response != null && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response
  }
  return {
    status: 1,
    msg: 'Fail! Reason: ' + response.message
  }
}

export default {
  post (url, data) {
    return axios({
      method: 'post',
      baseURL: iBaseUrl,
      url,
      data: qs.stringify(data),
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).catch((error) => {
      return {
        status: 1,
        msg: 'Fail! Reason: ' + error
      }
    })
  },
  get (url, params) {
    return axios({
      method: 'get',
      baseURL: iBaseUrl,
      url,
      params,
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).catch((error) => {
      return {
        status: 1,
        msg: 'Fail! Reason: ' + error
      }
    })
  }
}

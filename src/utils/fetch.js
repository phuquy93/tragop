import { Message } from 'element-ui'
import { getToken2, setToken2, getUser } from '@/utils/auth'

async function request(data) {
  try {
    const headers = new Headers()

    if (data.method === 'GET') {
      headers.append('Content-Type', 'application/json')
    }

    if (getUser()) {
      data.url =
        data.url +
        '&token=' +
        JSON.parse(getUser())
          .find((a) => a.split('=')[0] === 'token')
          .split('=')[1]
    }

    const response = await fetch(process.env.VUE_APP_BASE_API + data.url, {
      method: data.method,
      body: data.data,
      headers: headers
    })

    return response.json()
  } catch (error) {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
}

async function requestLogin(data) {
  try {
    const headers = new Headers()

    headers.append('Content-Type', 'application/json')

    const response = await fetch(data.url, {
      method: data.method,
      body: JSON.stringify(data.data),
      headers: headers
    })

    const data2 = await response.json()

    setToken2(data2.data.accessToken)

    return data2
  } catch (error) {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
}

async function requestOrder(data) {
  try {
    const headers = new Headers()

    headers.append('Content-Type', 'application/json')

    const response = await fetch(process.env.VUE_APP_API + data.url, {
      method: data.method,
      body: JSON.stringify(data.data),
      headers: headers
    })

    return response
    // if (response.status == 401) {
    //   await requestLogin({
    //     url: "https://api.identity.service.dienmaycholon.vn/Identity/Login/Password",
    //     method: "post",
    //     data: {
    //       username: "staff.test",
    //       password: "staff.test",
    //     },
    //   });

    //   return requestOrder(data);
    // } else {
    //   return response;
    // }
  } catch (error) {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
}

export { request, requestOrder, requestLogin }

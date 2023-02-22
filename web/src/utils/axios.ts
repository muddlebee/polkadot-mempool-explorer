import axios from 'axios'

let API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api/v1/mempool-explorer'
console.log('API_BASE_URL', API_BASE_URL)
if (process.env.NODE_ENV === 'development') {
  API_BASE_URL = 'http://localhost:8081/api/v1/mempool-explorer'
}
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  responseType: 'json',
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || error.message || 'Something went wrong'
    )
)

export default axiosInstance

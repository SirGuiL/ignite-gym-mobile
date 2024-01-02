import { AppError } from '@utils/AppError'
import axios from 'axios'
import { Alert } from 'react-native'

const apiUrl = process.env.EXPO_PUBLIC_API_URL

const api = axios.create({
  baseURL: apiUrl,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(new AppError(error.response.data.message))
    } else {
      return Promise.reject(error)
    }
  }
)

export { api }

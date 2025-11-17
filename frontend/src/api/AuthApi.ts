import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000/api/v1/mt5'

export interface LoginDTO {
  server: string
  login: string
  password: string
}

export class AuthApi {
  static async login(data: LoginDTO) {
    const url = `${BASE_URL}/login`
    return axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

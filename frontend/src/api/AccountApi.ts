import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000/api/v1/mt5'

export interface AccountData {
  connected: boolean
  login: string
  name: string
  balance: number
  equity: number
  margin: number
  free_margin: number
  leverage: number
  currency: string
  terminal_info: string
  timestamp: Date
  warnings: string[]
}
export interface CurrentPositionData {
    ticket: number
    opened_at: string
    updated_at: string
    type: number
    reason: number
    magic: number
    identifier: number
    symbol: string
    volume: number
    price_open: number
    sl: number
    tp: number
    price_current: number
    swap: number
    profit: number
    comment: string | null
  }

export interface CurrentPositionDataDTO{
  from : Date, 
  to: Date,
  symbol: string;
}

export class AccountApi {
  // static api calls for account info

  static async fetchAccountData(): Promise<AccountData> {
    const res = await axios.get(`${BASE_URL}/status`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if(res.status < 200 || res.status >= 300){
        throw new Error("Couldn't retrive account data from mt5.");
    }
    return res.data;
  }

  static async fetchCurrentPositions(data?: CurrentPositionDataDTO): Promise<CurrentPositionData[]> {
    const res = await axios.get(`${BASE_URL}/current_positions`, {
      params: data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if(res.status < 200 || res.status >= 300){
        throw new Error("Couldn't retrieve positions from mt5.");
    }
    return res.data;
  }

}

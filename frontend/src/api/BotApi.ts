import axios from "axios";

const BASE_URL = 'http://127.0.0.1:8000/api/v1/bot'

export interface CreateBotDTO{
  symbols: string[]
  timeframe: string
  mode: string
  n_bars: number
  loop_sleep_s: number
  risk: number
  rr: number
  be_thresh: number
  be_buffer_pips: number
}

const payload: CreateBotDTO = {
      symbols: [
        'EURUSD',
        'GBPUSD',
        'USDJPY',
        'USDCAD',
        'AUDUSD',
        'USDCHF',
        'XAUUSD',
        'US500',
        'US30',
        'US2000',
        'F40',
        'BTCUSD',
      ],
      mode: 'scalp',
      timeframe: 'H1',
      n_bars: 1000,
      loop_sleep_s: 0.5,
      risk: 0.01,
      rr: 1.2,
      be_thresh: 0.4,
      be_buffer_pips: 1.0,
    }
export class BotApi {
  static async createBot(data = payload){ 
    const url = `${BASE_URL}/BOT_001/create`
    return axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  static async initBot(){
    const data = {"gateway_id": "MT5_GATEWAY_1"}
    const url = `${BASE_URL}/BOT_001/init`
    return axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  static async startBot(){
    const data = {"enabled": true}
    const url = `${BASE_URL}/BOT_001/start`
    return axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  static async stopBot(){
    const botId = "BOT_001"
    const url = `${BASE_URL}/${botId}/stop`
    return axios.post(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  static async initBotDefault()
  {
    await this.createBot()
    await this.initBot()
  }
  static async botStatus(){
    const url = `${BASE_URL}/status`
    return axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}



// {
// 	"symbols": [
// 		"EURUSD",
// 		"GBPUSD",
// 		"USDJPY",
// 		"USDCAD",
// 		"AUDUSD",
// 		"NZDUSD",
// 		"USDCHF",
// 		"XAUUSD",
// 		"US500",
// 		"US30",
// 		"US2000",
// 		"F40",
// 		"BTCUSD"
// 	],
// 	"timeframe" :"H1",
// 	"mode": "scalp",
// 	"params_csv": "bot/config/symbol_params.csv",
// 	"n_bars": 1000,
// 	"loop_sleep_s": 0.5,
// 	"risk": 0.01,
// 	"rr": 1.2,
// 	"be_thresh": 0.4,
// 	"be_buffer_pips": 1.0
// }
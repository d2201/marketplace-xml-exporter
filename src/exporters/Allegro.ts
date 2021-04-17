import ApiBase from '@sdk/base'
import fs from 'fs'
import ini from 'ini'
import { promisify } from 'util'
import { Maybe } from '../types'

const ONE_SECOND = 1000

const SCOPES = [
  'allegro:api:sale:offers:read'
].join('%20')

const sleep = promisify(setTimeout)

export default class Allegro extends ApiBase {
  private clientId: string
  private clientSecret: string
  private authUrl: string

  constructor() {
    const config = ini.parse(fs.readFileSync('config.ini', 'utf-8'))

    super({
      requestsRateLimit: +config.allegro.rateLimit,
      baseUrl: config.allegro.apiUrl,
      maxErrorCount: 10,
      sleepDurationOnError: {
        network: 30 * ONE_SECOND,
        rateLimit: 60 * ONE_SECOND,
        serviceUnavailable: 10 * ONE_SECOND
      },
      repeatOnUnknownError: false
    })

    this.clientId = config.allegro.clientId
    this.clientSecret = config.allegro.clientSecret
    this.authUrl = config.allegro.authorizationUrl
  }

  async authorizeWithCode() {
    const params = new URLSearchParams()

    params.append('client_id', this.clientId)

    const result = await this.request<CodeAuthorizationResponse>({
      path: '/auth/oauth/device',
      method: 'POST',
      url: this.authUrl,
      auth: {
        username: this.clientId,
        password: this.clientSecret
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: params
    })

    while (true) {
      await sleep(result.interval * ONE_SECOND)

      const token = await this.getAccessTokenForDeviceCode(result.device_code)

      if (!token) {
        continue
      }
    }
  }

  async getAccessTokenForDeviceCode(deviceCode: string): Maybe<TokenResponse> {
    const params = new URLSearchParams()

    params.append('grant_type', 'urn:ietf:params:oauth:grant-type:device_code')
    params.append('device_code', deviceCode)

    try {
      const result = await this.request<TokenResponse>({
        method: 'POST',
        url: this.authUrl,
        path: '/auth/oauth/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
          username: this.clientId,
          password: this.clientSecret
        },
        data: params
      })

      return result
    } catch (e) {}
  }

  protected async authorize() {
    
  }
}

type CodeAuthorizationResponse = {
  device_code: string
  expires_in: number
  user_code: string
  interval: number // in seconds
  verification_uri: string
  verification_uri_complete: string
}

type TokenResponse = {
  access_token: string
  token_type: string
  refresh_token: string
  expires_in: number
  scope: string
  allegro_api: boolean
  jti: string
}
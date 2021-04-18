import ApiBase from '@sdk/base'
import fs from 'fs'
import ini from 'ini'
import { promisify } from 'util'
import { Maybe } from '../types'
import logger from '../logger'

const ONE_SECOND = 1000

// const SCOPES = ['allegro:api:sale:offers:read'].join('%20') TODO use it

const sleep = promisify(setTimeout)

export default class Allegro extends ApiBase {
  private clientId: string

  private clientSecret: string

  private refreshToken: string | undefined

  private authUrl: string

  private config: any

  constructor() {
    const config = ini.parse(fs.readFileSync('config.ini', 'utf-8'))

    super({
      requestsRateLimit: +config.allegro.rateLimit,
      baseUrl: config.allegro.apiUrl,
      maxErrorCount: 10,
      sleepDurationOnError: {
        network: 30 * ONE_SECOND,
        rateLimit: 60 * ONE_SECOND,
        serviceUnavailable: 10 * ONE_SECOND,
      },
      repeatOnUnknownError: false,
    })

    this.defaultHeaders = {
      'Content-Type': 'application/vnd.allegro.public.v1+json',
      'Accept': 'application/vnd.allegro.public.v1+json',
    }
    this.config = config
    this.clientId = config.allegro.clientId
    this.clientSecret = config.allegro.clientSecret
    this.refreshToken = config.allegro.refreshToken
    this.authUrl = config.allegro.authorizationUrl
  }

  protected async authorize() {
    logger.debug('Authorization step')

    let token: TokenResponse | undefined

    if (this.refreshToken) {
      logger.debug('Authorizing through refresh token')
      const result = await this.getAccessTokenFromRefreshToken()

      if (result) {
        token = result
      }
    }

    if (!token) {
      logger.debug('Authorizing via device flow')
      token = await this.getAccessTokenFromDeviceFlow()
    }

    this.saveRefreshTokenInFile(token.refresh_token)
    this.authorizationHeaders = {
      Authorization: `Bearer ${token.access_token}`,
    }
    this.isAuthorized = true

    logger.info('Successfully authorized')
  }

  private saveRefreshTokenInFile(refreshToken: string) {
    this.config.allegro.refreshToken = refreshToken

    fs.writeFileSync('config.ini', ini.stringify(this.config))
  }

  private async getAccessTokenFromDeviceFlow(): Promise<TokenResponse> {
    const params = new URLSearchParams()

    params.append('client_id', this.clientId)

    const result = await this.request<CodeAuthorizationResponse>({
      path: '/auth/oauth/device',
      method: 'POST',
      url: this.authUrl,
      auth: {
        username: this.clientId,
        password: this.clientSecret,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: params,
      requireAuthorization: false,
    })

    logger.warn(`Authorize app by going to this link: ${result.verification_uri_complete}`)

    let token: TokenResponse | undefined

    while (!token) {
      await sleep(result.interval * ONE_SECOND)
      logger.info('Checking authorization')

      const response = await this.getAccessTokenForDeviceCode(result.device_code)

      token = response
    }

    return token
  }

  private async getAccessTokenForDeviceCode(deviceCode: string): Maybe<TokenResponse> {
    const params = new URLSearchParams()

    params.append('grant_type', 'urn:ietf:params:oauth:grant-type:device_code')
    params.append('device_code', deviceCode)

    try {
      const result = await this.request<TokenResponse>({
        method: 'POST',
        url: this.authUrl,
        path: '/auth/oauth/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: this.clientId,
          password: this.clientSecret,
        },
        data: params,
        requireAuthorization: false,
      })

      return result
    } catch (e) {
      // TODO log it
    }
  }

  private async getAccessTokenFromRefreshToken(): Maybe<TokenResponse> {
    const params = new URLSearchParams()

    params.append('grant_type', 'refresh_token')
    params.append('refresh_token', this.refreshToken!)

    try {
      const result = await this.request<TokenResponse>({
        url: this.authUrl,
        path: '/auth/oauth/token',
        method: 'POST',
        auth: {
          username: this.clientId,
          password: this.clientSecret,
        },
        requireAuthorization: false,
        data: params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })

      return result
    } catch (e) {
      // TODO log it
    }
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

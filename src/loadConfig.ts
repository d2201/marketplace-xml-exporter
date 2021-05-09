import fs from 'fs'
import ini from 'ini'

declare global {
  namespace NodeJS {
    interface Global {
      config: {
        allegro: AllegroConfig
        exporter: ExporterConfig
        log: LoggerConfig
      }
    }
  }
}

type AllegroConfig = {
  rateLimit: string
  apiUrl: string
  authorizationUrl: string
  clientId: string
  clientSecret: string
  refreshToken?: string
}

type ExporterConfig = {
  directory: string
  progress: string
}

type LoggerConfig = {
  level: 'info'
}

const config = ini.parse(fs.readFileSync('config.ini', 'utf-8'))
const defaultConfig = ini.parse(fs.readFileSync('config.example.ini', 'utf-8'))

global.config = {
  allegro: {
    ...defaultConfig.allegro,
    ...config.allegro,
  },
  exporter: {
    ...defaultConfig.exporter,
    ...config.exporter,
  },
  log: {
    ...defaultConfig.log,
    ...config.log,
  },
}

export {}

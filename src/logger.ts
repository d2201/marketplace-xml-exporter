import winston from 'winston'

const logger = winston.createLogger({
  level: global.config.log.level,
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  transports: [new winston.transports.Console()],
})

export default logger

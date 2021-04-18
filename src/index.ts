import AllegroSDK from './sdk/AllegroSDK'
import logger from './logger'
import AllegroExporter from './exporters/allegroExporter'

Promise.resolve().then(async () => {
  await new AllegroExporter().run()
})

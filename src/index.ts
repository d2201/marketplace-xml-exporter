import './loadConfig'
import AllegroExporter from './exporters/allegroExporter'

Promise.resolve().then(async () => {
  await new AllegroExporter().run()
})

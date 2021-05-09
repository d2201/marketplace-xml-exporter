import './loadConfig'
import AllegroExporter from './exporters/allegroExporter'
import VariantSetsExporter from './exporters/allegro/variantSetsExporter'
import ShippingRatesExporter from './exporters/allegro/shippingRatesExporter'

Promise.resolve().then(async () => {
  await new VariantSetsExporter().run()
  await new ShippingRatesExporter().run()
  await new AllegroExporter().run()
})

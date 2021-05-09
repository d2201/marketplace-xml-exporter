import Exporter from '../exporter'
import allegroSdk from '../../sdk/AllegroSDK'
import { XmlShippingRate } from '../../types'
import logger from '../../logger'

export default class ShippingRatesExporter extends Exporter<XmlShippingRate> {
  constructor() {
    super('shipping-rates', 'shipping-rates.xml')
  }

  async run() {
    logger.info('Exporting shipping rates')
    const { shippingRates } = await allegroSdk.getShippingRates()

    for (const shippingRate of shippingRates) {
      this.writeItem({
        id: shippingRate.id,
        name: shippingRate.name,
      })
    }

    this.close()
    logger.info('Exported shipping rates')
  }
}

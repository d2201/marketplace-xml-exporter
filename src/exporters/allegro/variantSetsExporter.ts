import Exporter from '../exporter'
import allegroSdk from '../../sdk/AllegroSDK'
import logger from '../../logger'
import runConcurrently from '../../helpers/runConcurrently'
import { XmlVariantSet } from '../../types'

export default class VariantSetsExporter extends Exporter<XmlVariantSet> {
  constructor() {
    super('variant-sets', 'variant-sets.xml')
  }

  async run() {
    logger.info('Exporting variant sets...')

    await runConcurrently(allegroSdk.findAllVariantSets(), 10, async (set) => {
      const parameters = set.parameters.filter((parameter) => parameter.id !== 'color/pattern')
      const useThumbnail = set.parameters.some((parameter) => parameter.id === 'color/pattern')

      this.writeItem({
        id: set.id,
        name: set.name,
        parameterIds: parameters.map(({ id }) => id),
        useThumbnail,
        productIds: set.offers.map((offer) => offer.id),
      })
    })

    this.close()

    logger.info('Variant sets exported successfully')
  }
}

import Exporter from './exporter'
import AllegroSDK from '../sdk/AllegroSDK'
import logger from '../logger'
import parseHandlingTime from '../helpers/parseHandlingTime'
import runConcurrently from '../helpers/runConcurrently'

export default class AllegroExporter extends Exporter {
  async run() {
    logger.info('Starting exporter')

    const allegro = new AllegroSDK()

    const { totalCount } = await allegro.getOffers(0)

    let processed = 0

    await runConcurrently(allegro.findAllOffers(), 50, async ({ id }) => {
      const offer = await allegro.getOfferById(id)

      if (!offer) {
        return
      }

      this.writeItem({
        id: offer.id,
        name: offer.name,
        price: +offer.sellingMode.price!.amount,
        stock: offer.stock.available,
        description: offer.description,
        categoryId: offer.category?.id,
        externalId: offer.external?.id,
        attributes: offer.parameters,
        images: offer.images,
        delivery: parseHandlingTime(offer.delivery?.handlingTime),
      })

      processed += 1

      if (processed % 50 === 0) {
        logger.info(`[${processed}/${totalCount}] Batch processed`)
      }
    })

    logger.info(`[${processed}/${totalCount}] Exported fully...`)

    this.close()
  }
}

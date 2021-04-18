import Exporter from './exporter'
import AllegroSDK from '../sdk/AllegroSDK'

export default class AllegroExporter extends Exporter {
  async run() {
    const allegro = new AllegroSDK()

    for await (const { id } of allegro.findAllOffers()) {
      const offer = await allegro.getOfferById(id)

      if (!offer) {
        continue
      }

      this.writeItem({
        id: offer.id,
        price: +offer.sellingMode.price!.amount,
        stock: offer.stock.available,
        description: offer.description,
        categoryId: offer.category.id,
        attributes: offer.parameters,
        images: offer.images,
      })
    }

    this.close()
  }
}

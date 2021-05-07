import Allegro from './Allegro'
import { OfferListingResponse, OfferListing, Offer } from '../types/allegro'
import { Maybe } from '../types'
import omitNotFoundError from '../helpers/omitNotFoundError'

const OFFERS_LIMIT = 1000

export default class AllegroSDK extends Allegro {
  /**
   * @see findAllOffers - you may be interested in iterator implementation rather than this raw function.
   */
  getOffers(offset: number): Promise<OfferListingResponse> {
    return this.request({
      path: '/sale/offers',
      queryParams: {
        offset,
        limit: OFFERS_LIMIT,
      },
    })
  }

  /**
   * @usage `for await (const offer of findAllOffers()) { ...code }`
   */
  async *findAllOffers(): AsyncIterableIterator<OfferListing> {
    let offset = 0

    // maximum offset + limit is 10 mln
    while (offset <= 9_999_000) {
      const result = await this.getOffers(offset)

      yield* result.offers

      offset += result.offers.length

      if (result.offers.length < OFFERS_LIMIT) {
        return
      }
    }
  }

  getOfferById(id: string): Maybe<Offer> {
    return omitNotFoundError(this.request({ path: `/sale/offers/${id}` }))
  }
}

import Allegro from './Allegro'
import {
  OfferListingResponse,
  OfferListing,
  Offer,
  ShippingRate,
  OfferVariantsResponse,
  VariantSet,
} from '../types/allegro'
import { Maybe } from '../types'
import omitNotFoundError from '../helpers/omitNotFoundError'

const OFFERS_LIMIT = 1000
const VARIANT_SETS_LIMITS = 50

class AllegroSDK extends Allegro {
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

  getShippingRates(): Promise<{ shippingRates: ShippingRate[] }> {
    return this.request({ path: '/sale/shipping-rates' })
  }

  private getVariantSets(offset: number): Promise<OfferVariantsResponse> {
    return this.request({
      path: '/sale/offer-variants',
      queryParams: { offset, limit: VARIANT_SETS_LIMITS },
    })
  }

  private getDetailedVariantSet(id: string): Maybe<VariantSet> {
    return omitNotFoundError(this.request({ path: `/sale/offer-variants/${id}` }))
  }

  async *findAllVariantSets(): AsyncIterableIterator<VariantSet> {
    const offset = 0

    while (offset <= 9_950) {
      const result = await this.getVariantSets(offset)

      for (const variant of result.offerVariants) {
        const detailedVariantSet = await this.getDetailedVariantSet(variant.id)

        if (detailedVariantSet) {
          yield detailedVariantSet
        }
      }

      if (result.offerVariants.length < VARIANT_SETS_LIMITS) {
        return
      }
    }
  }
}

const allegroSdk = new AllegroSDK()

export default allegroSdk

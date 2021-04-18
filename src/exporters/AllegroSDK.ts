import Allegro from './Allegro'
import { OfferListingResponse } from '../types/allegro'

export default class AllegroSDK extends Allegro {
  getOffers(): Promise<OfferListingResponse> {
    return this.request({
      path: '/sale/offers',
    })
  }
}

import Allegro from './Allegro'

export default class AllegroSDK extends Allegro {
  getOfferById() {
    this.request({ path: '/' })
    // TODO
  }
}

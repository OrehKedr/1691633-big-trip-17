import { generateOffers } from '../mock/point';

export default class OffersModel {
  #offersCatalog = generateOffers();

  get offers() {
    return this.#offersCatalog;
  }
}

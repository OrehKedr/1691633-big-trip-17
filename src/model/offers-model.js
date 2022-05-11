import { generateOffers } from '../mock/point';

export default class OffersModel {
  #offersCatalog = generateOffers();

  get offers() {
    return this.#offersCatalog;
  }

  getOffersByType(pointType) {
    return (
      this.#offersCatalog.find((offer) => offer.type === pointType)?.offers ||
      []
    );
  }
}

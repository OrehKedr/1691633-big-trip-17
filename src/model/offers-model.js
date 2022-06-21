export default class OffersModel {
  #pointsApiService = null;
  #offers = [];

  constructor(pointsApiService) {
    this.#pointsApiService = pointsApiService;
  }

  get offers() {
    return this.#offers;
  }

  init = async () => {
    try {
      this.#offers = await this.#pointsApiService.offers;
    } catch(err) {
      this.#offers = [];
    }
  };
}

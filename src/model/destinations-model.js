export default class DestinationsModel {
  #pointsApiService = null;
  #destinations = [];

  constructor(pointsApiService) {
    this.#pointsApiService = pointsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      this.#destinations = await this.#pointsApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }
  };
}

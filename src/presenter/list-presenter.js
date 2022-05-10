import { render } from '../render.js';
import ListView from '../view/list-view';
import EditPointView from '../view/edit-point-view.js';
import EventView from '../view/event-view.js';

export default class ListPresenter {
  #listComponent = new ListView();
  #editPointComponent = null;
  #offersModel = null;
  #pointsModel = null;
  #offers = [];
  #points = [];

  init(tripEvents, pointsModel, offersModel) {
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#offers = [...this.#offersModel.offers];
    this.#points = [...this.#pointsModel.points];

    render(this.#listComponent, tripEvents);

    let offersByType = [];
    for (let i = 0; i < this.#points.length; i++) {
      offersByType = this.#offersModel.getOffersByType(this.#points[i].type);

      this.#renderPoint(this.#points[i], offersByType, this.#points);
    }

    // offersByType = this.#offersModel.getOffersByType(this.#points[1].type);
    // this.#editPointComponent = new EditPointView(
    //   this.#points[1],
    //   offersByType,
    //   this.#points
    // );
  }

  #renderPoint = (point, offers, points) => {
    const pointComponent = new EventView(point, offers);
    const editPointComponent = new EditPointView(point, offers, points);

    const replacePointToForm = () => {
      this.#listComponent.element.replaceChild(
        editPointComponent.element,
        pointComponent.element
      );
    };

    const replaceFormToPoint = () => {
      this.#listComponent.element.replaceChild(
        pointComponent.element,
        editPointComponent.element
      );
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', () => {
        replacePointToForm();
        document.addEventListener('keydown', onEscKeyDown);
      });

    editPointComponent.element
      .querySelector('form')
      .addEventListener('submit', (evt) => {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      });

    editPointComponent.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', (evt) => {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      });

    render(pointComponent, this.#listComponent.element);
  };
}

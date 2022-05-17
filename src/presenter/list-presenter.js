import { render } from '../render.js';
import ListView from '../view/list-view';
import EditPointView from '../view/edit-point-view.js';
import EventView from '../view/event-view.js';
import SortView from '../view/sort-view';
import ListEmptyView from '../view/list-empty-view';

export default class ListPresenter {
  #tripEventsContainer = null;
  #listComponent = new ListView();
  #sortComponent = new SortView();
  #listEmptyViewComponent = new ListEmptyView();
  #offersModel = null;
  #pointsModel = null;
  #points = [];

  constructor(tripEvents, pointsModel, offersModel) {
    this.#tripEventsContainer = tripEvents;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#points = [...this.#pointsModel.points];

    this.#renderBoard();
  };

  #renderBoard = () => {
    if (this.#points.length === 0) {
      render(this.#listEmptyViewComponent, this.#tripEventsContainer);
    } else {
      render(this.#sortComponent, this.#tripEventsContainer);
      render(this.#listComponent, this.#tripEventsContainer);

      let offersByType = [];
      for (let i = 0; i < this.#points.length; i++) {
        offersByType = this.#offersModel.getOffersByType(this.#points[i].type);

        this.#renderPoint(this.#points[i], offersByType, this.#points);
      }
    }
  };

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

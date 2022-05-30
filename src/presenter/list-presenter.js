import { render } from '../framework/render';
import { updateItem } from '../utils';
import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import ListEmptyView from '../view/list-empty-view';
import PointPresenter from './point-presenter';

export default class ListPresenter {
  #tripEventsContainer = null;
  #listComponent = new ListView();
  #sortComponent = new SortView();
  #listEmptyViewComponent = new ListEmptyView();
  #offersModel = null;
  #pointsModel = null;
  #points = [];
  #pointPresenter = new Map();

  constructor(tripEvents, pointsModel, offersModel) {
    this.#tripEventsContainer = tripEvents;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#points = [...this.#pointsModel.points];

    this.#renderList();
  };

  #renderList = () => {
    if (this.#points.length === 0) {
      render(this.#listEmptyViewComponent, this.#tripEventsContainer);
    } else {
      render(this.#sortComponent, this.#tripEventsContainer);
      render(this.#listComponent, this.#tripEventsContainer);

      this.#renderPoints(this.#points, this.#offersModel.offers);
    }
  };

  #renderPoints = (points, offers) => {
    for (let i = 0; i < points.length; i++) {
      this.#renderPoint(points[i], offers, points);
    }
  };

  #renderPoint = (point, offers, points) => {
    const pointPresenter = new PointPresenter(
      this.#listComponent.element,
      this.#handlePointChange,
      this.#handleModeChange
    );
    pointPresenter.init(point, offers, points);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #handlePointChange = (updatedPoint, offers, points) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenter
      .get(updatedPoint.id)
      .init(updatedPoint, offers, points);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };
}

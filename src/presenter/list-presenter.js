import { render } from '../framework/render';
import { sortPointsByPrice, sortPointsByTime } from '../utils/point';
import { updateItem } from '../utils/common';
import { SortType } from '../const';
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
  #sourcePoints = [];
  #currentSortType = SortType.DEFAULT;
  #pointPresenter = new Map();

  constructor(tripEvents, pointsModel, offersModel) {
    this.#tripEventsContainer = tripEvents;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#points = [...this.#pointsModel.points];
    this.#sourcePoints = [...this.#pointsModel.points];

    this.#renderPointList();
  };

  #renderPointList = () => {
    if (this.#points.length === 0) {
      render(this.#listEmptyViewComponent, this.#tripEventsContainer);
    } else {
      this.#renderSort();
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

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.PRICE:
        this.#points.sort(sortPointsByPrice);
        break;
      case SortType.TIME:
        this.#points.sort(sortPointsByTime);
        break;
      default:
        this.#points = [...this.#sourcePoints];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#tripEventsContainer);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };
}

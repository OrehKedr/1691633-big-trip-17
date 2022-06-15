import { render, RenderPosition, remove } from '../framework/render';
import { sortPointsByPrice, sortPointsByTime } from '../utils/point';
import { SortType, UpdateType, UserAction, FilterType } from '../const';
import { filter } from '../utils/filter';
import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import ListEmptyView from '../view/list-empty-view';
import PointPresenter from './point-presenter';
import PointNewPresenter from './point-new-presenter';

export default class ListPresenter {
  #tripEventsContainer = null;
  #listComponent = new ListView();
  #sortComponent = null;
  #listEmptyViewComponent = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #pointPresenter = new Map();
  #pointNewPresenter = null;

  constructor(tripEvents, pointsModel, offersModel, filterModel) {
    this.#tripEventsContainer = tripEvents;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#listComponent.element, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const points = this.#pointsModel.points;
    this.#filterType = this.#filterModel.filter;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortPointsByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortPointsByTime);
    }

    return filteredPoints;
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenter.get(data.id).init(data, this.#offersModel.offers, this.points);
        break;
      case UpdateType.MINOR:
        // - обновить список
        this.#clearPointList();
        this.#renderPointList();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearPointList(true);
        this.#renderPointList();
        break;
    }
  };

  init = () => {
    this.#renderPointList();
  };

  #renderPointList = () => {
    if (this.points.length === 0) {
      this.#renderNoPoints();
    } else {
      this.#renderSort();
      render(this.#listComponent, this.#tripEventsContainer);

      this.#renderPoints(this.points, this.#offersModel.offers);
    }
  };

  #renderNoPoints = () => {
    this.#listEmptyViewComponent = new ListEmptyView(this.#filterType);
    render(this.#listEmptyViewComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoints = (points, offers) => {
    for (let i = 0; i < points.length; i++) {
      this.#renderPoint(points[i], offers, points);
    }
  };

  #renderPoint = (point, offers, points) => {
    const pointPresenter = new PointPresenter(
      this.#listComponent.element,
      this.#handleViewAction,
      this.#handleModeChange
    );
    pointPresenter.init(point, offers, points);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPointList();
  };

  #clearPointList = (resetSortType = false) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);

    if (this.#listEmptyViewComponent) {
      remove(this.#listEmptyViewComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(
      callback,
      this.#offersModel.offers,
      this.#pointsModel.points
    );
  };
}

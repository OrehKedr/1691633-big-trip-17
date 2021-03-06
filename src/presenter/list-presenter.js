import { render, RenderPosition, remove } from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import { sortPointsByPrice, sortPointsByTime, sortPointsByDate } from '../utils/point';
import { SortType, UpdateType, UserAction, FilterType } from '../const';
import { filter } from '../utils/filter';
import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import ListEmptyView from '../view/list-empty-view';
import ListNoOffersView from '../view/list-no-offers-view';
import LoadingView from '../view/loading-view';
import PointPresenter from './point-presenter';
import PointNewPresenter from './point-new-presenter';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class ListPresenter {
  #tripEventsContainer = null;
  #listComponent = new ListView();
  #loadingComponent = new LoadingView();
  #noOffersComponent = new ListNoOffersView();
  #sortComponent = null;
  #listEmptyViewComponent = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;
  #destinationsModel = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(tripEvents, pointsModel, offersModel, filterModel, destinationsModel) {
    this.#tripEventsContainer = tripEvents;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#destinationsModel = destinationsModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#listComponent.element, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const points = this.#pointsModel.points;
    this.#filterType = this.#filterModel.filter;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DEFAULT:
        return filteredPoints.sort(sortPointsByDate);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointsByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortPointsByTime);
    }

    return filteredPoints;
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // - ???????????????? ?????????? ???????????? (????????????????, ?????????? ???????????????????? ????????????????)
        this.#pointPresenter
          .get(data.id)
          .init(data, this.#offersModel.offers, this.points);
        break;
      case UpdateType.MINOR:
        // - ???????????????? ????????????
        this.#clearPointList();
        this.#renderPointList();
        break;
      case UpdateType.MAJOR:
        // - ???????????????? ?????? ?????????? (????????????????, ?????? ???????????????????????? ??????????????)
        this.#clearPointList(true);
        this.#renderPointList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        remove(this.#noOffersComponent);
        this.#renderPointList();
        break;
    }
  };

  init = () => {
    this.#renderPointList();
  };

  #renderPointList = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (
      this.#offersModel.offers.length === 0 ||
      this.#destinationsModel.destinations.length === 0
    ) {
      this.#renderNoOffers();
      return;
    }

    if (this.points.length === 0) {
      this.#renderNoPoints();
    } else {
      this.#renderSort();
      render(this.#listComponent, this.#tripEventsContainer);

      this.#renderPoints(
        this.points,
        this.#offersModel.offers,
        this.#destinationsModel.destinations
      );
    }
  };

  #renderLoading = () => {
    render(
      this.#loadingComponent,
      this.#tripEventsContainer,
      RenderPosition.AFTERBEGIN
    );
  };

  #renderNoPoints = () => {
    this.#listEmptyViewComponent = new ListEmptyView(this.#filterType);
    render(
      this.#listEmptyViewComponent,
      this.#tripEventsContainer,
      RenderPosition.AFTERBEGIN
    );
  };

  #renderNoOffers = () => {
    render(
      this.#noOffersComponent,
      this.#tripEventsContainer,
      RenderPosition.AFTERBEGIN
    );
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoints = (points, offers, destinations) => {
    for (let i = 0; i < points.length; i++) {
      this.#renderPoint(points[i], offers, destinations);
    }
  };

  #renderPoint = (point, offers, destinations) => {
    const pointPresenter = new PointPresenter(
      this.#listComponent.element,
      this.#handleViewAction,
      this.#handleModeChange
    );
    pointPresenter.init(point, offers, destinations);
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
    remove(this.#loadingComponent);

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
      this.#destinationsModel.destinations
    );
  };
}

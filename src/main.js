import { render } from './framework/render';
import NewPointButtonView from './view/new-point-button-view';
import ListPresenter from './presenter/list-presenter';
import FilterPresenter from './presenter/filter-presenter';
import PointsModel from './model/points-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';
import FilterModel from './model/filter-model';
import PointsApiService from './points-api-service';

const AUTHORIZATION = 'Basic hS2sfS14kct1sa5j';
const END_POINT = 'https://17.ecmascript.pages.academy/big-trip';
const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const tripMain = document.querySelector('.trip-main');
const tripMainFilters = tripMain.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const tripEvents = pageMain.querySelector('.trip-events');
const pointsModel = new PointsModel(pointsApiService);
const offersModel = new OffersModel(pointsApiService);
const destinationsModel = new DestinationsModel(pointsApiService);
const filterModel = new FilterModel();
const listPresenter = new ListPresenter(
  tripEvents,
  pointsModel,
  offersModel,
  filterModel,
  destinationsModel
);
const filterPresenter = new FilterPresenter(
  tripMainFilters,
  filterModel,
  pointsModel
);
const newPointButtonComponent = new NewPointButtonView();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointFormClick = () => {
  listPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

filterPresenter.init();
listPresenter.init();
offersModel.init();
destinationsModel.init();
pointsModel.init().finally(() => {
  render(newPointButtonComponent, tripMain);
  newPointButtonComponent.setClickHandler(handleNewPointFormClick);
});

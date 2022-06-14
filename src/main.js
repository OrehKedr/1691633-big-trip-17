import { render } from './framework/render';
import NewPointButtonView from './view/new-point-button-view';
import ListPresenter from './presenter/list-presenter';
import FilterPresenter from './presenter/filter-presenter';
import PointsModel from './model/points-model';
import OffersModel from './model/offers-model';
import FilterModel from './model/filter-model';

const tripMain = document.querySelector('.trip-main');
const tripMainFilters = tripMain.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const tripEvents = pageMain.querySelector('.trip-events');
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();
const listPresenter = new ListPresenter(tripEvents, pointsModel, offersModel, filterModel);
const filterPresenter = new FilterPresenter(tripMainFilters, filterModel, pointsModel);
const newPointButtonComponent = new NewPointButtonView();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointFormClick = () => {
  listPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

render(newPointButtonComponent, tripMain);
newPointButtonComponent.setClickHandler(handleNewPointFormClick);

filterPresenter.init();
listPresenter.init();

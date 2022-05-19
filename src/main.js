import { render } from './framework/render';
import FilterView from './view/filter-view';
import ListPresenter from './presenter/list-presenter';
import PointsModel from './model/points-model';
import OffersModel from './model/offers-model';

const tripMain = document.querySelector('.trip-main');
const tripMainFilters = tripMain.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const tripEvents = pageMain.querySelector('.trip-events');
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const listPresenter = new ListPresenter(tripEvents, pointsModel, offersModel);

render(new FilterView(), tripMainFilters);

listPresenter.init();

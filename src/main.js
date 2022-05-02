import { render } from './render.js';
import FilterView from './view/filter-view';
import SortView from './view/sort-view';
import ListPresenter from './presenter/list-presenter.js';

const tripMain = document.querySelector('.trip-main');
const tripMainFilters = tripMain.querySelector('.trip-controls__filters');
const pageMain = document.querySelector('.page-main');
const tripEvents = pageMain.querySelector('.trip-events');
const listPresenter = new ListPresenter();

render(new FilterView(), tripMainFilters);
render(new SortView(), tripEvents);

listPresenter.init(tripEvents);

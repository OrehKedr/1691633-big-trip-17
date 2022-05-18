import AbstractView from '../framework/view/abstract-view';

/*
Значение отображаемого текста зависит от выбранного фильтра:
    * Everthing – 'Click New Event to create your first point'
    * Past — 'There are no past events now';
    * Future — 'There are no future events now'.
*/
const createListEmptyTemplate = () =>
  '<p class="trip-events__msg">Click New Event to create your first point</p>';

export default class ListEmptyView extends AbstractView {
  get template() {
    return createListEmptyTemplate();
  }
}

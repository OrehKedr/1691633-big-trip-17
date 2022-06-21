import AbstractView from '../framework/view/abstract-view';

const createListNoOffersTemplate = () =>
  '<p class="trip-events__msg">Сервер с каталогами Предложений/Точек маршрутов прилёг отдохнуть. Попробуйте открыть страницу позже.</p>';

export default class ListNoOffersView extends AbstractView {
  get template() {
    return createListNoOffersTemplate();
  }
}

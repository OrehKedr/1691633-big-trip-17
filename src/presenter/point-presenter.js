import { render, replace, remove } from '../framework/render';
import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';

const mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  //DOM-узел в дереве документа, контейнер для монтажа компонент.
  #pointListContainer = null;

  //Компоненты (Views).
  #pointComponent = null;
  #editPointComponent = null;

  //Данные моделей.
  #point = null;
  #offers = null;
  #points = null;

  //Callbacks.
  #changeData = null;
  #changeMode = null;

  #mode = mode.DEFAULT;

  constructor(pointListContainer, changeData, changeMode) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point, offers, points) => {
    this.#point = point;
    this.#offers = offers;
    this.#points = points;

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(this.#point, this.#offers);
    this.#editPointComponent = new EditPointView(
      this.#point,
      this.#offers,
      this.#points
    );

    this.#pointComponent.setEditClickHandler(this.#replacePointToForm);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editPointComponent.setEditClickHandler(this.#replaceFormToPoint);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  };

  #replacePointToForm = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      { ...this.#point, isFavorite: !this.#point.isFavorite },
      this.#offers,
      this.#points
    );
  };

  #handleFormSubmit = (point) => {
    this.#changeData(point, this.#offers, this.#points);
    this.#replaceFormToPoint();
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  };

  resetView = () => {
    if (this.#mode !== mode.DEFAULT) {
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };
}

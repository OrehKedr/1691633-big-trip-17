import { remove, render, RenderPosition } from '../framework/render';
import EditPointView from '../view/edit-point-view';
import { UserAction, UpdateType } from '../const';

export default class PointNewPresenter {
  #tripEventsContainer = null;
  #editPointComponent = null;

  #offers = null;
  #destinations = null;

  #changeData = null;
  #destroyCallback = null;

  constructor(tripEventsContainer, changeData) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#changeData = changeData;
  }

  init = (callback, offers, destinations) => {
    this.#offers = offers;
    this.#destinations = destinations;
    this.#destroyCallback = callback;

    if (this.#editPointComponent !== null) {
      return;
    }

    this.#editPointComponent = new EditPointView(
      null,
      this.#offers,
      this.#destinations
    );

    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editPointComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#editPointComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#editPointComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#editPointComponent);
    this.#editPointComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    this.#editPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}

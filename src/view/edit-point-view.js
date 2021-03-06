import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { humanizePointDate } from '../utils/point';
import { getOffersByType } from '../utils/common';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const POINT_TYPE = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const BLANK_POINT = {
  id: 'HRaQyvYwVDfOcXfxMswM_',
  basePrice: 1,
  dateFrom: '2022-06-13T15:41:30.549Z',
  dateTo: '2022-06-13T15:48:58.290Z',
  destination: {
    description: '',
    name: '',
    pictures: [],
  },
  isFavorite: false,
  offers: [],
  type: POINT_TYPE[0],
};

const createOffersTemplate = (offers, offerIDs, isDisabled) => {
  const offersListTemplate = offers
    .map((offer) => {
      const checked = offerIDs.some((id) => offer.id === id);

      return `
        <div class="event__offer-selector">
          <input
            class="event__offer-checkbox  visually-hidden"
            id="${offer.id}"
            type="checkbox"
            name="event-offer-luggage"
            ${checked ? 'checked' : ''}
            ${isDisabled ? 'disabled' : ''}
          >
          <label class="event__offer-label" for="${offer.id}">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`;
    })
    .join('');

  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersListTemplate}
      </div>
    </section>`;
};

const createPhotosTemplate = (pictures) => {
  const photosListTemplate = pictures
    .map((picture) => {
      const { src, description } = picture;
      return `
        <img class="event__photo" src="${src}" alt="${description}">`;
    })
    .join('');

  return `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${photosListTemplate}
      </div>
    </div>`;
};

const createDestinationTemplate = (point) => {
  const {
    destination: { name, description, pictures },
  } = point;

  const photosTemplate = createPhotosTemplate(pictures);

  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">${name}</h3>
      <p class="event__destination-description">${description}</p>
      ${photosTemplate}
    </section>`;
};

const createDestinationDropdownListTemplate = (destinations) => {
  const template = destinations
    .map(({ name }) => `<option value="${name}"></option>`)
    .join('');

  return template;
};

const createEventTypeListTemplate = (type, isDisabled) => {
  const template = POINT_TYPE.map(
    (pointType) => `
    <div class="event__type-item">
      <input
        id="event-type-${pointType}-1"
        class="event__type-input  visually-hidden"
        type="radio" name="event-type"
        value="${pointType}"
        ${type === pointType ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
      >
      <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-1">${pointType}</label>
    </div>
  `
  ).join('');

  return `<div class="event__type-list">
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>
    ${template}
  </fieldset>
</div>`;
};

const createEditPointTemplate = (state, offers, destinations) => {
  const {
    basePrice,
    type,
    destination,
    hasDestination,
    isNewPoint,
    isDisabled,
    isSaving,
    isDeleting,
  } = state;
  const offerIDs = state.offers;
  const dateFrom = humanizePointDate(state.dateFrom);
  const dateTo = humanizePointDate(state.dateTo);

  const offersByType = getOffersByType(type, offers);
  const hasOffers = offersByType.length !== 0;
  const offersTemplate = hasOffers
    ? createOffersTemplate(offersByType, offerIDs, isDisabled)
    : '';

  const destinationTemplate = hasDestination
    ? createDestinationTemplate(state)
    : '';

  const destinationDropdownListTemplate =
    createDestinationDropdownListTemplate(destinations);

  const eventTypeList = createEventTypeListTemplate(type, isDisabled);

  const resetBtnText = isNewPoint ? 'Cancel' : 'Delete';

  const rollupBtnTemplate = isNewPoint
    ? ''
    : `
    <button
      class="event__rollup-btn"
      type="button"
      ${isDisabled ? 'disabled' : ''}
    >
      <span class="visually-hidden">Open event</span>
    </button>`;

  return `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            ${eventTypeList}
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationDropdownListTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              value="${dateFrom}"
              ${isDisabled ? 'disabled' : ''}
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${dateTo}"
              ${isDisabled ? 'disabled' : ''}
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-1"
              type="number" step="1"
              name="event-price"
              value="${basePrice}"
              ${isDisabled ? 'disabled' : ''}
            >
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">
            ${isSaving ? 'Saving...' : 'Save'}
          </button>
          <button class="event__reset-btn" type="reset">
            ${isDeleting ? 'Deleting' : resetBtnText}
          </button>
          ${rollupBtnTemplate}
        </header>
        <section class="event__details">
          ${offersTemplate}

          ${destinationTemplate}
        </section>
      </form>
    </li>`;
};

export default class EditPointView extends AbstractStatefulView {
  #offers = [];
  #destinations = [];
  #datepickerStartTime = null;
  #datepickerEndTime = null;

  constructor(point, offers, destinations) {
    super();
    this._state = EditPointView.parsePointToState(point);

    //??????????????????????. ???????????? ?????????????? ??????????, ?????????? ????????????????.
    this.#offers = offers;
    this.#destinations = destinations;

    this.#setInnerHandlers();
    this.#setDatepickers();
  }

  get template() {
    return createEditPointTemplate(
      this._state,
      this.#offers,
      this.#destinations,
    );
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerStartTime && this.#datepickerEndTime) {
      this.#datepickerStartTime.destroy();
      this.#datepickerStartTime = null;
      this.#datepickerEndTime.destroy();
      this.#datepickerEndTime = null;
    }
  };

  static parsePointToState = (point) => {
    const isNewPoint = !point;
    point = isNewPoint ? BLANK_POINT : point;

    return {
      ...point,
      hasDestination:
        Boolean(point.destination.description) &&
        Boolean(point.destination.pictures.length),
      isNewPoint,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  };

  static parseStateToPoint = (state) => {
    const { dateFrom, dateTo } = state;
    const point = {
      ...state,
      dateFrom: new Date(dateFrom),
      dateTo: new Date(dateTo),
    };

    delete point.hasDestination;
    delete point.isNewPoint;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EditPointView.parseStateToPoint(this._state));
  };

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element
      .querySelector('.event__rollup-btn')
      ?.addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EditPointView.parseStateToPoint(this._state));
  };

  #setInnerHandlers = () => {
    this.element
      .querySelector('.event__available-offers')
      ?.addEventListener('click', this.#offerToggleHandler);
    this.element
      .querySelector('.event__type-list')
      .addEventListener('click', this.#eventTypeClickHandler);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);
  };

  #offerToggleHandler = (evt) => {
    const label = evt.target.closest('.event__offer-label');

    if (!label) {
      return;
    }

    const id = Number(label.getAttribute('for'));
    const idSet = new Set(this._state.offers);

    if (idSet.has(id)) {
      idSet.delete(id);
    } else {
      idSet.add(id);
    }

    //???? ?????????????????? ?????????????????? ?????????? ???????????????? ??????????????, ?????????????? _setState() ???????????? updateElement().
    this._setState({ offers: [...idSet] });
  };

  #eventTypeClickHandler = (evt) => {
    const target = evt.target;
    if (target.nodeName !== 'INPUT') {
      return;
    }

    this.updateElement({
      type: target.value,
      offers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    const value = evt.target.value;
    const options = [...evt.target.list.options];
    const isValidValue = options.some((option) => option.value === value );
    const name = isValidValue ? value : options[0].value;

    const destination = this.#destinations.find(
      (dest) => dest.name === name
    );

    this.updateElement({
      destination,
      hasDestination:
        Boolean(destination.description) && Boolean(destination.pictures.length),
    });
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatepickers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditClickHandler(this._callback.editClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  reset = (point) => {
    this.updateElement(EditPointView.parsePointToState(point));
  };

  #dateFromChangeHandler = ([userDate]) => {
    const dateFrom = userDate;
    this.updateElement({
      dateFrom,
      dateTo: dateFrom,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    const dateTo = userDate;
    this._setState({
      dateTo,
    });
  };

  #setDatepickers = () => {
    this.#datepickerStartTime = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        minuteIncrement: 1,
        dateFormat: 'd/m/y H:i',
        defaultDate: dayjs(this._state.dateFrom).toISOString(),
        onClose: this.#dateFromChangeHandler, // ???? ?????????????? flatpickr ???????????????? ?????? ????????????
      }
    );

    this.#datepickerEndTime = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        minuteIncrement: 1,
        dateFormat: 'd/m/y H:i',
        minDate: dayjs(this._state.dateFrom).toISOString(),
        defaultDate: dayjs(this._state.dateTo).toISOString(),
        onClose: this.#dateToChangeHandler,
      }
    );
  };

  #priceChangeHandler = (evt) => {
    const basePrice = Math.floor(Number(evt.target.value));

    evt.target.value = basePrice;

    this._setState({ basePrice });
  };
}

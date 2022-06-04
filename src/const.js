const FilterType = {
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PAST: 'PAST',
};

const SortType = {
  DEFAULT: 'DEFAULT',
  PRICE: 'PRICE',
  TIME: 'TIME',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export { FilterType, SortType, UserAction, UpdateType };

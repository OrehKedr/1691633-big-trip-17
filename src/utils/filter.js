import { FilterType } from '../const';
import { isPointFuture, isPointPast } from './point';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) =>
    points.filter((point) => isPointFuture(point.dateFrom)),
  [FilterType.PAST]: (points) =>
    points.filter((point) => isPointPast(point.dateTo)),
};

export { filter };

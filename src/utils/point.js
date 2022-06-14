import dayjs from 'dayjs';

const humanizePointTime = (date) => dayjs(date).format('HH:mm');
const humanizePointDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');
const humanizeListPointDate = (date) => dayjs(date).format('MMM DD');

const getPointDurationSnippet = (postfix, value) => {
  if (value === 0) {
    return `00${postfix}`;
  }

  return value > 10 ? `${value}${postfix}` : `0${value}${postfix}`;
};

const getPointDuration = (dateFrom, dateTo) => {
  const dayJSFrom = dayjs(dateFrom);
  const dayJSTo = dayjs(dateTo);
  const diffMinutes = dayJSTo.diff(dayJSFrom, 'minute');
  const days = Math.floor(diffMinutes / (24 * 60));

  const restMinutes = diffMinutes - days * 24 * 60;
  const hours = Math.floor(restMinutes / 60);
  const minutes = restMinutes - hours * 60;

  let duration = getPointDurationSnippet('M', minutes);

  if (days > 0) {
    duration = `${getPointDurationSnippet('D', days)} ${getPointDurationSnippet(
      'H',
      hours
    )} ${getPointDurationSnippet('M', minutes)}`;
  }

  if (days === 0 && hours > 0) {
    duration = `${getPointDurationSnippet(
      'H',
      hours
    )} ${getPointDurationSnippet('M', minutes)}`;
  }

  return duration;
};

const sortPointsByPrice = (pointA, pointB) => (pointB.basePrice - pointA.basePrice);

const sortPointsByTime = (pointA, pointB) => {
  const dayJSFromA = dayjs(pointA.dateFrom);
  const dayJSToA = dayjs(pointA.dateTo);
  const durationA = dayJSToA.diff(dayJSFromA);

  const dayJSFromB = dayjs(pointB.dateFrom);
  const dayJSToB = dayjs(pointB.dateTo);
  const durationB = dayJSToB.diff(dayJSFromB);

  return durationB - durationA;
};

const isDatesEqual = (dateA, dateB) =>
  (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

const isPointFuture = (dateFrom) =>
  dayjs(dateFrom).isAfter(dayjs(), 'D') || dayjs(dateFrom).isSame(dayjs(), 'D');

const isPointPast = (dateTo) =>
  dayjs().isAfter(dayjs(dateTo), 'D');

export {
  humanizePointTime,
  humanizePointDate,
  getPointDuration,
  sortPointsByPrice,
  sortPointsByTime,
  isDatesEqual,
  isPointFuture,
  isPointPast,
  humanizeListPointDate,
};

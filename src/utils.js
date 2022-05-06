import dayjs from 'dayjs';

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const humanizePointTime = (date) => dayjs(date).format('HH:mm');
const humanizePointDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

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

export {
  getRandomInteger,
  humanizePointTime,
  humanizePointDate,
  getPointDuration,
};

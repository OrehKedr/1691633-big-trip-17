import dayjs from 'dayjs';
import { getRandomInteger } from '../utils';

const generatePointType = () => {
  const POINT_TYPE = [
    'taxi',
    // 'bus',
    // 'train',
    // 'ship',
    // 'drive',
    'flight',
    // 'check-in',
    'sightseeing',
    // 'restaurant',
  ];

  const randomIndex = getRandomInteger(0, POINT_TYPE.length - 1);

  return POINT_TYPE[randomIndex];
};

const generatePointDestination = () => {
  const PICTURE_ID_BOUNDARY = 100;
  const destinationCatalog = [
    {
      description:
        'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
      name: 'Chamonix',
      pictures: [
        {
          src: `http://picsum.photos/248/152?r=${getRandomInteger(
            1,
            PICTURE_ID_BOUNDARY
          )}`,
          description: 'Chamonix parliament building',
        },
        {
          src: `http://picsum.photos/248/152?r=${getRandomInteger(
            1,
            PICTURE_ID_BOUNDARY
          )}`,
          description: 'Chamonix parliament building',
        },
        {
          src: `http://picsum.photos/248/152?r=${getRandomInteger(
            1,
            PICTURE_ID_BOUNDARY
          )}`,
          description: 'Chamonix parliament building',
        },
      ],
    },
    {
      description:
        'Geneva, is a beautiful city, a true asian pearl, with crowded streets.',
      name: 'Geneva',
      pictures: [
        {
          src: `http://picsum.photos/248/152?r=${getRandomInteger(
            1,
            PICTURE_ID_BOUNDARY
          )}`,
          description: 'Geneva parliament building',
        },
        {
          src: `http://picsum.photos/248/152?r=${getRandomInteger(
            1,
            PICTURE_ID_BOUNDARY
          )}`,
          description: 'Geneva parliament building',
        },
        {
          src: `http://picsum.photos/248/152?r=${getRandomInteger(
            1,
            PICTURE_ID_BOUNDARY
          )}`,
          description: 'Geneva parliament building',
        },
      ],
    },
    {
      description:
        'Valencia, is a beautiful city, a true asian pearl, with crowded streets.',
      name: 'Valencia',
      pictures: [
        {
          src: `http://picsum.photos/248/152?r=${getRandomInteger(
            1,
            PICTURE_ID_BOUNDARY
          )}`,
          description: 'Valencia parliament building',
        },
        {
          src: `http://picsum.photos/248/152?r=${getRandomInteger(
            1,
            PICTURE_ID_BOUNDARY
          )}`,
          description: 'Valencia parliament building',
        },
        {
          src: `http://picsum.photos/248/152?r=${getRandomInteger(
            1,
            PICTURE_ID_BOUNDARY
          )}`,
          description: 'Valencia parliament building',
        },
      ],
    },
  ];
  const randomIndex = getRandomInteger(0, destinationCatalog.length - 1);

  return destinationCatalog[randomIndex];
};

const generateOffers = () => {
  const offersCatalog = [
    {
      type: 'taxi',
      offers: [
        {
          id: 1,
          title: 'Upgrade to a business class',
          price: 120,
        },
        {
          id: 2,
          title: 'Choose the radio station',
          price: 60,
        },
      ],
    },
    {
      type: 'flight',
      offers: [
        {
          id: 1,
          title: 'Upgrade to a business class',
          price: 120,
        },
        {
          id: 2,
          title: 'Choose window seat',
          price: 60,
        },
      ],
    },
  ];

  return offersCatalog;
};

const generatePoint = () => {
  const MAX_BASE_PRICE = 1500;
  const dateFrom = dayjs();
  const dateTo = dayjs(dateFrom + getRandomInteger(216000, 10368000));

  return {
    basePrice: getRandomInteger(1, MAX_BASE_PRICE),
    dateFrom,
    dateTo,
    destination: generatePointDestination(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: [1],
    type: generatePointType(),
  };
};

export { generatePoint, generateOffers };

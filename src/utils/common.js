const getOffersByType = (pointType, offers) =>
  offers.find((offer) => offer.type === pointType)?.offers || [];

export { getOffersByType };

import { render, RenderPosition } from '../render.js';
import ListView from '../view/list-view';
import EditPointView from '../view/edit-point-view.js';
import EventView from '../view/event-view.js';

export default class ListPresenter {
  listComponent = new ListView();

  init(tripEvents, pointsModel, offersModel) {
    this.offersModel = offersModel;
    this.pointsModel = pointsModel;
    this.offers = [...this.offersModel.getOffers()];
    this.points = [...this.pointsModel.getPoints()];

    render(this.listComponent, tripEvents);

    let offersByType = [];
    for (let i = 0; i < this.points.length; i++) {
      offersByType = this.offersModel.getOffersByType(this.points[i].type);

      render(
        new EventView(this.points[i], offersByType),
        this.listComponent.getElement()
      );
    }

    offersByType = this.offersModel.getOffersByType(this.points[1].type);
    render(
      new EditPointView(this.points[1], offersByType, this.points),
      this.listComponent.getElement(),
      RenderPosition.AFTERBEGIN
    );
  }
}

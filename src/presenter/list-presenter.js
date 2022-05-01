import { render, RenderPosition} from '../render.js';
// import LoadingView from '../view/loading-view.js';
import ListView from '../view/list-view';
// import ListEmptyView from '../view/list-empty-view.js';
// import AddNewPointView from '../view/add-new-point-view.js';
// import AddNewPointWithoutDestinationView from '../view/add-new-point-without-destination-view.js';
// import AddNewPointWithoutOffersView from '../view/add-new-point-without-offers-view.js';
import EditPointView from '../view/edit-point-view.js';
import EventView from '../view/event-view.js';

export default class ListPresenter {
  listComponent = new ListView();

  init(tripEvents) {
    render(this.listComponent, tripEvents);

    // render(new LoadingView(), this.listComponent.getElement());
    // render(new ListEmptyView(), this.listComponent.getElement());
    // render(new AddNewPointView(), this.listComponent.getElement());
    // render(new AddNewPointWithoutDestinationView(), this.listComponent.getElement());
    // render(new AddNewPointWithoutOffersView(), this.listComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new EventView(), this.listComponent.getElement());
    }

    render(new EditPointView(), this.listComponent.getElement(), RenderPosition.AFTERBEGIN);
  }
}

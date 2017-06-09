import { bindable } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';

export class ListEditorCustomElement {

    @bindable items = [];
    @bindable addItem;
}

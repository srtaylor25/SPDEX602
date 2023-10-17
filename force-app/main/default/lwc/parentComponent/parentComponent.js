import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {

    // private property to conditionally display child  component
    showChild = true;
    childSaid;          // property to hold the value passed in the child event

    // method to handle the event raised by the child component
    handleFit(evt) {
        // move the data in the detail property of the event into my private property to display in the UI
        console.log(evt);
        this.childSaid = evt.detail;
    }

    toggleView() {
        this.showChild = !this.showChild;
    }

    // constructor lifecycle method
    constructor() {
        super();
        console.log('Parent Component: Constructor fired....');
    }

    // connected and disconnected callback lifecycle methods
    connectedCallback() {
        console.log('Parent Component: connectedCallback fired....');
    }

    disconnectedCallback() {
        console.log('Parent Component: disconnectedCallback fired....');
    }

    // rendered callback lifecycle method
    renderedCallback() {
        console.log('Parent Component: renderedCallback fired....');
    }
}
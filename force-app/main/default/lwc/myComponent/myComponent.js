import { LightningElement } from 'lwc';

export default class MyComponent extends LightningElement {

    // boolean property to determine conditional display
    showContacts = false;

    // create an array property to hold some contact objects (aka records)
    contacts = [
        { Id: '111', Name: 'John', Title: 'VP'},
        { Id: '222', Name: 'Dagny', Title: 'SVP'},
        { Id: '333', Name: 'Henry', Title: 'President'}
    ];

    // create a method to toggle the showContacts boolean property
    toggleView() {
        this.showContacts = !this.showContacts;     // toggling the boolean value of the property
    }
}
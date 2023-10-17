import { LightningElement, wire } from 'lwc';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AcctDetail extends LightningElement {

    accountId;          // property to hold the account ID received from the message channel
    accountName;        // property to hold the account Name received from the message channel
    subscription = {}   // property to hold the subscription object returned from subscribe

    // getter method to display a label in the Detail component
    get detailLabel() {
        return 'Details for ' + this.accountName;
    }

    // create the MessageContext object
    @wire(MessageContext)
    messageContext;

    // method to subscribe to the message channel
    subscribeToMessageChannel() {
        this.subscription = subscribe(this.messageContext, AccountMC, (message) => this.handleMessage(message));
    }

    // method to unsubscribe from the message channel
    unsubscribeFromMessageChannel() {
        unsubscribe(this.subscription);
    }

    // method to handle the message channel message received
    handleMessage(message) {
        this.accountId = message.recordId;
        this.accountName = message.accountName;
        console.log('acctDetail: Message received and handled: ' + this.accountId + ' ' + this.accountName);
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeFromMessageChannel();
    }

    // method to dispatch a toast event when the record is successfully saved
    detailSaved(event) {
        console.log(event);
        this.dispatchEvent(new ShowToastEvent({
            title: 'Account Updated',
            message: 'Account ' + event.detail.fields.Name.value + ' was successfully updated!',
            variant: 'success'
        }));
    }
}
import { LightningElement, wire } from 'lwc';
import getTopAccounts from '@salesforce/apex/AccountController.getTopAccounts';
import { refreshApex } from '@salesforce/apex';
import AccountMC from '@salesforce/messageChannel/AccountMessageChannel__c';
import { publish, MessageContext } from 'lightning/messageService';
import RecordModal from 'c/recordModal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AcctList extends LightningElement {

    records;                // property to hold the account records returned from the wire service
    results;                // property to hold the provisioned object from the wire service
    selectedId;             // property to hold the selected account ID
    selectedName;           // property to hold the selected account Name

    // use the wire service to create the MessageContext object required by the publish method
    @wire(MessageContext)
    messageContext;

    // wire up the getTopAccounts and return the results into a method
    @wire(getTopAccounts) 
    wiredAccounts(topAccts) {
        this.results = topAccts;

        // check if data was returned
        if (this.results.data) {
            this.records = this.results.data;

            // take the first record in the list and publish its info to the message channel
            this.selectedId = this.records[0].Id;
            this.selectedName = this.records[0].Name;
            this.sendMessageService(this.selectedId, this.selectedName);
        }

        // check if error was returned
        if (this.results.error) {
            console.error('Error occurred retrieving top accounts....');
        }
    }

    // create a method to handle the selected event from acctCard
    handleSelection(event) {
        console.log(event.detail.property1);
        console.log(event.detail.property2);

        this.selectedId = event.detail.property1;
        this.selectedName = event.detail.property2;
        this.sendMessageService(this.selectedId, this.selectedName);
    }

    // create a method to publish the account ID and Name to the message channel
    sendMessageService(accountId, accountName) {
        // invoke the publish method to publish the account info to the message channel
        publish(this.messageContext, AccountMC, { recordId: accountId, accountName: accountName} );
        console.log('Published message with: ' + accountId + ' ' + accountName);
    }

    // create a method to create a new Account record
    createAcct() {
        // use our RecordModal component
        RecordModal.open({
            size: 'small',
            objectApiName: 'Account',
            formMode: 'edit',
            layoutType: 'Full',
            headerLabel: 'Create New Account'
        })
            .then((result) => {
                if (result === 'modsuccess') {
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Account Created',
                        message: 'Account created successfully!',
                        variant: 'success'
                    }));
                }
            });
    }
}
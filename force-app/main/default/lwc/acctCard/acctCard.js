import { LightningElement, api } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';
import creditCheckApi from '@salesforce/apexContinuation/CreditCheckContinuation.creditCheckApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class AcctCard extends LightningElement {

    // public properties to hold the account record field values
    @api name;
    @api annualRevenue;
    @api phone;
    @api acctId;
    @api rank;

    contacts;           // property to hold the list of related contact records
    showContacts;       // property to determine display of contact records
    loadingContacts = false;    // property to determine display of lightning spinner
    creditObj = {};     // property to hold the JSON response object from the parsing

    // getter method to return the account ranking
    get ranking() {
        const acctRank = this.rank + 1;
        return acctRank + '. ';
    }

    // create a method to dispatch an event with selection information
    handleSelect() {
        // create a custom event, and pass the account ID and account Name in the event detail
        const myEvent = new CustomEvent('selected',{ detail: { 'property1': this.acctId, 'property2': this.name}});
        this.dispatchEvent(myEvent);
    }

    // create a method to handle the displaying of contacts
    displayContacts() {
        if (this.showContacts) {
            this.showContacts = false;
        } else {
            // display the spinner
            this.loadingContacts = true;
            // invoke the getContactList method
            getContactList({ accountId: this.acctId })
                .then((data) => {
                    this.contacts = data;
                    this.showContacts = true;
                })
                .catch((err) => {
                    console.error('Error retrieving contact records...');
                    this.showContacts = false;
                })
                .finally(() => {
                    console.log('Displaying contacts finally....');
                    this.loadingContacts = false;
                });
        }
    }

    // create a method to invoke the creditCheckApi
    checkCredit() {
        // make an imperative call to our creditCheckApi method
        creditCheckApi({ accountId: this.acctId })
            .then( response => {
                console.log(response);
                // parse the response and move into an object to access the fields(properties) of the response
                this.creditObj = JSON.parse(response);

                console.log(this.creditObj);

                // create a toast event message with the company info in it
                var toastMessage = 'Credit check approved for ' + this.creditObj.Company_Name__c + '!';

                this.dispatchEvent(new ShowToastEvent({
                    title: 'Credit Check Complete',
                    message: toastMessage,
                    variant: 'success',
                    mode: 'sticky'
                }));
            })
            .catch( error => {
                console.error('Error occurred with credit check....');
                console.log(error);
            })
            .finally(() => {
                console.log('Finally finished credit check....');
            });
    }
}
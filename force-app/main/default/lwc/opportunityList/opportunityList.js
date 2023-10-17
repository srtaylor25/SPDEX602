import { LightningElement, api, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';
import { refreshApex } from '@salesforce/apex';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import OPP_STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';
import { subscribe, unsubscribe } from 'lightning/empApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OpportunityList extends LightningElement {

    // create a public property to inherit the record ID from the Account record page
    @api recordId;

    // private properties to use in my controller logic
    results;                        // property to hold the provisioned object from the wire service
    recordsToDisplay = false;       // boolean property to determine if we have records to display in the UI
    allOpps = [];                   // array property to hold ALL the related opp records
    displayedOpps = [];             // array property to hold the opp records to DISPLAY in the UI
    status = 'All';                 // property to hold the value selected in the combobox
    totalRecords;                   // property to hold the total number of records being displayed
    totalAmount;                    // property to holde the total amount of opps being displayed
    channelName = '/topic/Opportunities';   // property to hold the push topic channel
    subscription = {};                      // property to hold the subscription object returned from the subscribe method
    tableMode = false;              // property to determine display of either table or card format
    cardChecked = true;             // property to determine menu item checked or not
    tableChecked = false;           // property to determine menu item checked or not
    myDrafts = [];                  // property to hold the draft values from inline editing in the data table

    // array property for column information to use in the datatable
    columns = [
        { label: 'Opportunity Name', fieldName: 'Name', type: 'text', editable: true},
        { label: 'Amount', fieldName: 'Amount', type: 'currency', editable: true},
        { label: 'Stage', fieldName: 'StageName', type: 'text'},
        { label: 'Close Date', fieldName: 'CloseDate', type: 'date'}
    ];

    // an array property to hold the options for the combobox
    comboOptions = [
        { value: 'All', label: 'All'},
        { value: 'Open', label: 'Open'},
        { value: 'Closed', label: 'Closed'},
        // { value: 'ClosedWon', label: 'Closed Won'},
        // { value: 'ClosedLost', label: 'Closed Lost'}
    ];

    // use the wire service to invoke getPicklistValues method and put the response into our comboOptions array
    @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: OPP_STAGE_FIELD})
    wiredPicklist({ data, error }) {
        // check if data was returned
        if (data) {
            // iterate over the picklist values and add them to my comboOptions
            for (let item of data.values) {
                this.comboOptions.push({ value: item.value, label: item.label});
            }

            // make a shallow copy of the array and write it back into the original array so the component
            // recognizes the change to the elements in the array
            this.comboOptions = this.comboOptions.slice();
        }

        // check if error was returned
        if (error) {
            console.error('Error occurred retrieving picklist values....');
        }
    }

    // use the wire service to invoke getOpportunities and handle the returned object in a method
    @wire(getOpportunities, { accountId: '$recordId'})
    wiredOpps(oppRecords) {
        // move the provisioned object from the wire service into a property(so I can refresh cache later)
        this.results = oppRecords;
        console.log(this.results);

        // check to see if we got data or error returned
        if (this.results.data) {
            this.allOpps = this.results.data;

            // dispatch an event with oppportunity record count
            this.dispatchEvent(new CustomEvent('oppcount', { detail: this.allOpps.length}));
            // this.displayedOpps = this.results.data;
            // this.recordsToDisplay = true;
            this.updateList();      // call updateList to populate total records and amount with values
        }

        if (this.results.error) {
            console.error('Error occurred retrieving opp records...');
            console.error(this.results.error);
            this.recordsToDisplay = false;
        }
    }

    // create a method to handle the selection in the combobox
    handleChange(event) {
        this.status = event.detail.value;       // take the value selected from the combobox
        this.updateList();                      // invoke a method to update the list based off of status
    }

    // create a method to update the list of opps to display in the UI based on the value of status
    updateList() {
        this.displayedOpps = [];        // clear out the displayedOpps array

        // create a variable to hold the current record as I iterate over the list of allOpps
        let currentRecord = {};

        // determine which records meet our filter criteria, and move them into displayedOpps
        if (this.status === 'All') {
            this.displayedOpps = this.allOpps;              // move the full array of records into displayedOpps
        } else {
            // iterate over the records, check them against the status, and add to displayedOpps as needed
            for (let i = 0; i < this.allOpps.length; i++) {

                // move the current record into currentRecord
                currentRecord = this.allOpps[i];

                // check records against status
                if (this.status === 'Open') {
                    if (!currentRecord.IsClosed) {
                        this.displayedOpps.push(currentRecord);
                    }
                } else if (this.status === 'Closed') {
                    if (currentRecord.IsClosed) {
                        this.displayedOpps.push(currentRecord);
                    }
                } else if ( this.status === currentRecord.StageName){
                    this.displayedOpps.push(currentRecord);
                }
                // } else if (this.status === 'ClosedWon') {
                //     if (currentRecord.IsWon) {
                //         this.displayedOpps.push(currentRecord);
                //     }
                // } else if (this.status === 'ClosedLost') {
                //     if (currentRecord.IsClosed && !currentRecord.IsWon) {
                //         this.displayedOpps.push(currentRecord);
                //     }
                // }
            }
        }

        // check to see if I have any records to display
        this.recordsToDisplay = this.displayedOpps.length > 0 ? true : false;

        // calculate total record count and amount
        this.totalRecords = this.displayedOpps.length;
        this.totalAmount = this.displayedOpps.reduce((prev, curr) => prev + curr.Amount, 0);
    }

    // create a method to refresh the cache of related Opp records
    refreshWire() {
        refreshApex(this.results);          // pass the property holding the provisioned object to refreshApex
    }

    // create a method to subscribe to a push topic
    handleSubscribe() {
        // callback function to execute when receiving a message on the channel
        const messageCallback = response => {
            console.log(response);
            // check for deletion event
            if (response.data.event.type === 'deleted') {
                // check to see if it is an opp we are displaying
                if (this.allOpps.find(elem => { return elem.Id === response.data.sobject.Id})){
                    this.refreshWire();     // refresh the cache of records
                }
            } else {        // must be created, updated or undeleted
                // check to see if this is an opp for the account we are currently viewing
                if (response.data.sobject.AccountId === this.recordId) {
                    this.refreshWire();
                }
            }
        }

        // subscribe to push topic
        subscribe(this.channelName, -1, messageCallback)
        .then(response => {this.subscription = response});
    }

    // create a method to unsubscribe from the push topic
    handleUnsubscribe() {
        // unsubscribe from the push topic
        unsubscribe(this.subscription, response => {console.log('Opplist unsubscribed from push topic....')});
    }

    // execute when the component is inserted into the DOM
    connectedCallback() {
        this.handleSubscribe();
    }

    // executed when the component is removed from the DOM
    disconnectedCallback() {
        this.handleUnsubscribe();
    }

    // create a method to toggle between card and table format when the user selects an option
    handleToggle(event) {
        const selection = event.detail.value;

        if (selection === 'card') {
            this.tableMode = false;
            this.cardChecked = true;
            this.tableChecked = false;
        } else if (selection === 'table') {
            this.tableMode = true;
            this.cardChecked = false;
            this.tableChecked = true;
        }
    }

    // create a method to take draft values submitted from the datatable save event, and update the records in Salesforce
    handleTableSave(event) {
        console.log(event);

        // move the draft values from the event into my property
        this.myDrafts = event.detail.draftValues;

        // convert the draft values objects (elements) into recordInput objects to be passed into updateRecord
        const inputItems = this.myDrafts.slice().map( draft => {
            var fields = Object.assign({}, draft);
            return { fields };
        });

        console.log(JSON.stringify(inputItems));

        // create a list(array) of Promise objects to hold calls to updateRecord for earch record inputItem
        const promises = inputItems.map(recordInput => updateRecord(recordInput));

        Promise.all(promises)
            .then( result => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success!',
                        message: 'Successfully updated the records.',
                        variant: 'success',
                        mode: 'dismissible'
                    })
                );
            })
            .catch( error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error!',
                        message: 'Error occurred updating the records.',
                        variant: 'error'
                    })
                );
            })
            .finally( () => {
                this.myDrafts = [];
            });
    }
}
import { LightningElement, api, wire } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class CaseList extends LightningElement {

    // public property to hold the record Id of the parent record
    @api recordId;

    casesToDisplay = false;     // property to determine if we have records to display
    cases;                      // property to hold the case records returned from the getRelatedListRecords function
    results;                    // property to hold response object from the wire service

    // wire up the getRelatedListRecords method and handle the response
    @wire(getRelatedListRecords, { parentRecordId: '$recordId', relatedListId: 'Cases',
            fields: ['Case.Id', 'Case.CaseNumber', 'Case.Subject', 'Case.Status', 'Case.Priority']})
    wiredCases(caseRecords) {
        this.results = caseRecords;

        if (this.results.data) {
            this.cases = this.results.data.records;
            this.casesToDisplay = this.cases.length > 0 ? true : false;
            this.dispatchEvent(new CustomEvent('casecount', {detail: this.cases.length}));
        }

        if (this.results.error) {
            console.error('Error occurred retrieving Case records...');
            this.casesToDisplay = false;
        }
    }
}
import { LightningElement, api } from 'lwc';

export default class OppRecordForm extends LightningElement {

    // public properties to inherit the record ID and Object API Name from the record page
    @api recordId;
    @api objectApiName;

    @api layoutType = 'Compact';
    @api formMode = 'readonly';

    myFields = ['Name', 'Amount', 'CloseDate', 'StageName'];

}
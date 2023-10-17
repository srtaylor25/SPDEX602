import { LightningElement, api } from 'lwc';
import ACCOUNT_FIELD from '@salesforce/schema/Opportunity.AccountId';
import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import AMOUNT_FIELD from '@salesforce/schema/Opportunity.Amount';
import CLOSE_DATE_FIELD from '@salesforce/schema/Opportunity.CloseDate';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';

export default class OppRecordEditForm extends LightningElement {

    // public properties to inherit the record context from the record page
    @api recordId;
    @api objectApiName;

    // boolean property to toggle between edit and view mode
    editMode = false;

    // create properties to hold the schema information (aka API names) from the imported fields
    // so we can bind them to our markup
    accountField = ACCOUNT_FIELD;
    nameField = NAME_FIELD;
    amountField = AMOUNT_FIELD;
    closeDateField = CLOSE_DATE_FIELD;
    stageField = STAGE_FIELD;

    // create a method to toggle between modes
    toggleMode() {
        this.editMode = !this.editMode;
    }
}
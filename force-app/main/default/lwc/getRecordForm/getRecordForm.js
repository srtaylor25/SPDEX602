import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Contact.Name';
import TITLE_FIELD from '@salesforce/schema/Contact.Title';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import EMAIL_FIELD from '@salesforce/schema/Contact.Email';

export default class GetRecordForm extends LightningElement {

    // public property to inherit the record ID from the record page
    @api recordId;

    // properties to hold wire service response
    contact;
    error;
    wireResponse;

    // use the wire decorator on a property (the property will hold the object provisioned by the wire service)
    // @wire(getRecord, { recordId: '$recordId', fields: [NAME_FIELD, TITLE_FIELD, PHONE_FIELD, EMAIL_FIELD]}) 
    // contact;

    @wire(getRecord, { recordId: '$recordId', fields: [NAME_FIELD, TITLE_FIELD, PHONE_FIELD, EMAIL_FIELD]}) 
    wiredContact(wiredObj) {

        this.wireResponse = wiredObj;
        console.log('Wired contact....');
        console.log(this.wireResponse);

        if (this.wireResponse.data) {
            console.log('Data was returned...');
            this.contact = this.wireResponse.data;
            this.error = undefined;
        }

        if (this.wireResponse.error) {
            console.error('Error retrieving contact...');
            this.error = this.wireResponse.error;
            this.contact = undefined;
        }
    };

    // getter methods to return field values
    get title() {
        let titleVar = this.contact.fields.Title.value;
        return titleVar.toUpperCase();
    }

    get phone() {
        return this.contact.fields.Phone.value;
    }

    get email() {
        return this.contact.fields.Email.value;
    }

}
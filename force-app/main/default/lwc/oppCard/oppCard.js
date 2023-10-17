import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import RecordModal from 'c/recordModal';                // import my custom recordModal component
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OppCard extends NavigationMixin(LightningElement) {

    // create public properties to hold the opp records field values
    @api name;
    @api amount;
    @api stage;
    @api closeDate;
    @api oppId;

    // create a method to navigate to the full opportunity record page
    viewRecord() {
        // call the Navigate method from NavigationMixin and pass in some parameters
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.oppId,
                actionName: 'view'
            }
        });
    }

    // create a method to open the recordModal component window
    editOpp() {
        // open the modal window
        RecordModal.open({
            size: 'small',
            recordId: this.oppId,
            objectApiName: 'Opportunity',
            formMode: 'edit',
            layoutType: 'Compact',
            headerLabel: 'Edit Opportunity'
        })
        .then((result) => {
            console.log(result);

            // check to see if the result is modsuccess, and if so, dispatch an event to the parent component
            if (result === 'modsuccess') {
                // dispatch a custom event to tell opportunityList to refresh the cache of records
                const savedEvent = new CustomEvent('modsaved');
                this.dispatchEvent(savedEvent);

                // create a toast notification
                const myToast = new ShowToastEvent({
                    title: 'Opportunity Saved Successfully',
                    message: 'The opportunity record was updated successfully!',
                    variant: 'success',
                    mode: 'dismissible'
                });

                // dispatch the toast notification
                this.dispatchEvent(myToast);
            }
        });
    }
}
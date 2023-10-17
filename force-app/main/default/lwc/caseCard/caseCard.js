import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import RecordModal from 'c/recordModal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CaseCard extends NavigationMixin(LightningElement) {

    // public properties to hold the Case record field values
    @api caseNumber;
    @api subject;
    @api status;
    @api priority;
    @api caseId;

    // create a method to navigate to the full Case record
    viewRecord() {
        // call the Navigate method from NavigationMixin
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.caseId,
                actionName: 'view'
            }
        });
    }

    // create a method to open the recordModal component window
    editCase() {
        RecordModal.open({
            size: 'small',
            recordId: this.caseId,
            objectApiName: 'Case',
            formMode: 'edit',
            layoutType: 'Compact',
            headerLabel: 'Edit Case'
        })
        .then((result) =>{
            if (result === 'modsuccess') {
                const myToast = new ShowToastEvent({
                    title: 'Case Saved Successfully',
                    message: 'The case record was saved successfully!',
                    variant: 'success'
                })
            }
        });
    }
}
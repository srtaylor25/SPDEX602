import { LightningElement, api } from 'lwc';
import GenWattStyle from '@salesforce/resourceUrl/GenWattStyle';    // import static resource
import { loadStyle } from 'lightning/platformResourceLoader';       // method to load the style sheet

export default class HelloWorld extends LightningElement {

    // public property to bind to the markup (HTML)
    @api firstName = 'World';

    // use the constructor method to load my external style sheet
    constructor() {
        // first call in a constructor method must be to super()
        super();            // establishes the prototype chain (giving us access to the this keyword);

        // use the loadStyle method to load our external style sheet (aka static resource)
        loadStyle(this, GenWattStyle)
            .then(() => {console.log('Style sheet loaded...')})
            .catch((error) => {console.error('Error occurred....')});
    }
}
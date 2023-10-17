public with sharing class CreditCheckContinuation {
    
    // create an action method to populate a continuation object with callouts
    @AuraEnabled(continuation=true cacheable=true)
    public static Object creditCheckApi(String accountId) {

        // create a continuation object
        Continuation con = new Continuation(60);
        con.continuationMethod = 'processResponse';

        // we can pass data as an object to the state property to have it available in the callback function
        con.state = 'Howdy';

        // query the database to retrieve information about the account for the parameters
        Account a = [SELECT Id, Name, Owner.Name, Owner.Email FROM Account
                        WHERE Id = :accountId LIMIT 1];

        // create a string variable to hold the url and parameters for the endpoint
        String url = 'https://steve-wasula-splx201-dev-ed.my.salesforce-sites.com/creditcheck';

        // append the parameters for the callout to our url
        url += '?name=' + EncodingUtil.urlEncode(a.Name, 'UTF-8')
            + '&email=' + a.Owner.Email
            + '&requestor=' + EncodingUtil.urlEncode(a.Owner.Name, 'UTF-8');

        system.debug(url);

        // create a new HTTP Request and set the method and endpoint properties
        HttpRequest req = new HttpRequest();
        req.setEndpoint(url);
        req.setMethod('GET');

        // add the HTTP Request to my continuation object
        con.addHttpRequest(req);

        // we can add up to two more request (for a total of three) to the continuation object

        // return the continuation object
        return con;

    }

    // create a callback method that executes when the callouts are complete
    @AuraEnabled(cacheable=true)
    public static Object processResponse(List<String> labels, Object state) {
        // access the response from the list and return the body to our LWC
        HttpResponse response = Continuation.getResponse(labels[0]);
        return response.getBody();
    }
}
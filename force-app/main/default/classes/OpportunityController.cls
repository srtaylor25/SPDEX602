public with sharing class OpportunityController {
    
    // create a public static method that accepts an Account ID as a parameter, and returns a related
    // list of opportunity records.  Annotate the method with @AuraEnabled to make it available in our LWC
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities(String accountId) {
        
        // create a list to hold the related Opp records
        List<Opportunity> opps = new List<Opportunity>();

        // query the database to return the Opp records related to the Account ID passed in
        opps = [SELECT Id, Name, Amount, StageName, CloseDate, IsWon, IsClosed FROM Opportunity
                    WHERE AccountId = :accountId WITH SECURITY_ENFORCED];

        // return the list of opp records
        return opps;
    }
}
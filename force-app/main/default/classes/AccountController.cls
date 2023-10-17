public with sharing class AccountController {
    
    // create a method that will return a list of 5 account records sorted by annual revenue
    @AuraEnabled(cacheable=true)
    public static List<Account> getTopAccounts() {
        // return a list of account records
        return [SELECT Id, Name, AnnualRevenue, Phone FROM Account WITH SECURITY_ENFORCED
                    ORDER BY AnnualRevenue DESC NULLS LAST LIMIT 5];
    }
}
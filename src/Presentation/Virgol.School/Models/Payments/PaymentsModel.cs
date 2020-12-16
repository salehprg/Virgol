using System;

public class PaymentsModel {
    public int Id {get;set;}
    public int UserId {get;set;}
    public int amount {get;set;}
    public int UserCount {get;set;}
    public DateTime payTime {get;set;}
    public int serviceId {get;set;}

    //Payment Status
    public string status {get;set;}
    
    ///<summary>
    ///refrence Id pass to Our Site From payment Site 
    ///</summary>
    public string refId {get;set;}
    ///<summary>
    ///uniqueId for redirect to Payment URL
    ///</summary>
    public string paymentCode {get;set;}

    ///<summary>
    ///Error log / trackCode from payment site 
    ///</summary>
    public string reqId {get;set;}

    public string statusMessage {get;set;}

}
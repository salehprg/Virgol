public class ServicePrice {
    public int Id {get;set;}
    public string serviceName {get;set;}
    public int pricePerUser {get;set;}
    public float discount {get;set;}
    public string option {get;set;}


    //e.g : Service for Server Adobe Proffesional = adobe|pro
    //Service for Server BigBlueButton Normal = bbb|norm
    //service name according to ServiceType.cs
    public string serviceType {get;set;}

}

using System.Xml.Serialization;
using Models.AdobeConnectApi;

[XmlRoot("results")]
public class CommonInfo {
    public Status status {get;set;}
    public Common common {get;set;}
}

public class Common {
    public string cookie {get;set;}
    public User user {get;set;}
}

public class User {
    public string login {get;set;}
    [XmlAttribute("user-id")]public string userId {get;set;}
}
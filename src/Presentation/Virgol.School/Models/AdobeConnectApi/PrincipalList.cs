using System.Collections.Generic;
using System.Xml.Serialization;
using Models.AdobeConnectApi;

[XmlRoot("results")]
public class PrincipalList
{
    public Status status {get;set;}
    [XmlElement("principal-list")]
    public Principals principallist {get;set;}
}

public class Principals
{
    [XmlElement("principal")]
    public List<Principal> principals { get; set; }
}

public class Principal
{
    
    [XmlAttribute("principal-id")]public string Id { get; set; }
    [XmlAttribute("account-id")]public string accId { get; set; }

    [XmlElement("name")]
    public string Name { get; set; }
    [XmlElement("login")]
    public string Login { get; set; }
}
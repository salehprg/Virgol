using System.Xml.Serialization;

public class OWASP
{
    public string token { get; set; }
}

[XmlRoot("results")]
public class LoginModel
{
    public Status status {get;set;}
    
    [XmlElement("OWASP_CSRFTOKEN")]
    public OWASP Otoken { get; set; }
}

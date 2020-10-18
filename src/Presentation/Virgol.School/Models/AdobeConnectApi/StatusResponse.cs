using System.Xml.Serialization;

[XmlRoot("results")]
public class StatusResponse {
    public Status status {get;set;}
}
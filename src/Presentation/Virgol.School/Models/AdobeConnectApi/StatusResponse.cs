using System.Xml.Serialization;
using Models.AdobeConnectApi;

[XmlRoot("results")]
public class StatusResponse {
    public Status status {get;set;}
}
using System;
using System.Xml.Serialization;
using Models.AdobeConnectApi;
public class SCO
{
    [XmlAttribute("sco-id")]public string scoId { get; set; }
    
    [XmlElement("date-created")]
    public DateTime dateCreated { get; set; }

    [XmlElement("url-path")]
    public string urlPath { get; set; }
}

[XmlRoot("results")]
public class MeetingInfoResponse
{
    public Status status {get;set;}
    [XmlElement("sco")]
    public SCO scoInfo {get;set;}
}

using System;
using System.Xml.Serialization;

public class SCO
{
    [XmlAttribute("folder-id")]
    public string folderId { get; set; }

    [XmlAttribute("sco-id")]
    public string scoId { get; set; }
    
    [XmlElement("date-created")]
    public DateTime dateCreated { get; set; }

    [XmlElement("url-path")]
    public string urlPath { get; set; }

    [XmlElement("filename")]
    public string fileName { get; set; }
}

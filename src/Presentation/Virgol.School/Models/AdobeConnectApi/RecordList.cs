using System;
using System.Xml.Serialization;
using Models.AdobeConnectApi;

[XmlRoot("results")]
public class RecordList
{
    public Status status {get;set;}

    [XmlElement("recordings")]
    public AdobeRecordInfo recordings {get;set;}
}
public class AdobeRecordInfo
{
    [XmlElement("sco")]
    public SCO scoInfo {get;set;}
}



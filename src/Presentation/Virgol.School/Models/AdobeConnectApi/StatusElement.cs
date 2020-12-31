//<invalid field="name" type="string" subcode="duplicate"/>
using System.Xml.Serialization;

namespace Models.AdobeConnectApi
{
    public class Message
    {
        [XmlAttribute]public string field { get; set; }
        [XmlAttribute]public string subcode { get; set; }
    }
    public class Status
    {
        [XmlAttribute]public string code { get; set; }
        public Message invalid { get; set; }
    }
}
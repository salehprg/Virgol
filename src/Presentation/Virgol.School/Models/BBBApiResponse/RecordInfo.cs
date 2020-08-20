using System.Collections.Generic;
using Newtonsoft.Json;

public class PlayBack
{
    [JsonConverter(typeof(SingleValueArrayConverter<AttendeeInfo>))]
    public List<FormatInfo> format { get; set; }
}
public class RecordInfo {

    public string name { get; set; }
    public string recordID { get; set; }
    public PlayBack playback { get; set; }

    
}
using System;

public class Stream {
    public int Id {get; set;}
    public int StreamerId {get; set;}
    public string StreamName {get; set;}
    public string OBS_Link {get; set;}
    public string OBS_Key {get; set;}
    public string JoinLink {get; set;}
    public DateTime StartTime {get; set;}
    public DateTime EndTime {get; set;}
    public bool isActive {get; set;}
}
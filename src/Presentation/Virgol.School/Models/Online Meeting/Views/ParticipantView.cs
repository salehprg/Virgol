using System;

public class ParticipantView {
    public string FirstName {get; set;}
    public string LastName {get; set;}
    public string MelliCode {get; set;}    
    public string MeetingName {get; set;}
    public int CheckCount {get; set;}
    public DateTime StartTime {get; set;}
    public int Id {get; set;}
    public int UserId {get; set;} // User id
    public int MeetingId {get; set;} //Meeting id in Meetings table in our database
    public int PresentCount {get; set;}
    public bool IsPresent {get; set;}
}
using System;

public class Meeting {
    public int Id {get; set;}
    public string MeetingName {get; set;} //Meeting Id that bbb give us
    public string BBB_MeetingId {get; set;} //Meeting Id that bbb give us
    public int AttendeeCount {get; set;}
    public int PresentCount {get; set;}
    public bool Finished {get; set;}
    public int CheckCount {get; set;} //How many CheckAttendeJob , check for Absense/Present Student
    public DateTime StartTime {get; set;}
    public DateTime EndTime {get; set;}
    public int ModeretorId {get; set;}// Moderator moodle_id

}
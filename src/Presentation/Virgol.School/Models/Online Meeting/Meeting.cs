using System;
using System.ComponentModel.DataAnnotations.Schema;

public class Meeting {
    public int Id {get; set;}
    public string MeetingName {get; set;} 
    public string BBB_MeetingId {get; set;} 
    public int AttendeeCount {get; set;}
    public int PresentCount {get; set;}
    public bool Finished {get; set;}
    public int CheckCount {get; set;} //How many CheckAttendeJob , check for Absense/Present Student
    public DateTime StartTime {get; set;}
    public DateTime EndTime {get; set;}
    public int TeacherId {get; set;}
    ///<summary>
    ///school Lesson Id
    ///</summary>
    public int ScheduleId {get; set;}

    [NotMapped]
    public string className {get; set;}
    [NotMapped]
    public string schoolName {get; set;}


}
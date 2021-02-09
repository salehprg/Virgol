using System;
using System.ComponentModel.DataAnnotations.Schema;

public class MeetingView {
    public int Id {get; set;} //Meeting Id
    public string MeetingName {get; set;} 
    public string MeetingId {get; set;} 
    public bool Finished {get; set;}
    public bool Private {get; set;}
    public int CheckCount {get; set;} //How many CheckAttendeJob , check for Absense/Present Student
    public DateTime StartTime {get; set;}
    public DateTime EndTime {get; set;}
    public int TeacherId {get; set;}
    public int ScheduleId {get; set;}
    ///<summary>
    ///Get dayType from DayType class
    ///</summary>
    public int? DayType {get; set;}
    public int? ClassId {get; set;}
    public int? School_Id {get; set;}
    public int? weekly {get;set;}
    public float? StartHour {get; set;}
    public float? EndHour {get; set;}
    public string FirstName {get; set;}
    public string LastName {get; set;}
    public string OrgLessonName {get; set;}
    public string ClassName {get;set;}
    public string SchoolName {get;set;}
    public string ServiceType {get;set;}


    [NotMapped]
    public bool started {get; set;}
    [NotMapped]
    public bool teacherAsStudent {get; set;}

}
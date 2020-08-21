using System;
using System.ComponentModel.DataAnnotations.Schema;

public class MeetingView {
    public int Id {get; set;} //Meeting Id
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
    ///Get dayType from DayType class
    ///</summary>
    public int DayType {get; set;}
    public int ClassId {get; set;}
    public int School_Id {get; set;}
    public float StartHour {get; set;}
    public float EndHour {get; set;}
    public string FirstName {get; set;}
    public string LastName {get; set;}
    public string OrgLessonName {get; set;}
    public string ClassName {get;set;}
    public string SchoolName {get;set;}




}
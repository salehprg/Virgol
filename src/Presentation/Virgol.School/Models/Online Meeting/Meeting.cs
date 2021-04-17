using System;
using System.ComponentModel.DataAnnotations.Schema;

public class Meeting {
    public int Id {get; set;}
    public string MeetingName {get; set;} 
    public string MeetingId {get; set;} 
    public bool Finished {get; set;}
    public int CheckCount {get; set;} //How many CheckAttendeJob , check for Absense/Present Student
    public DateTime StartTime {get; set;}
    public DateTime EndTime {get; set;}
    public int TeacherId {get; set;}
    ///<summary>
    ///school Lesson Id or If Our meeting private schedule Id is school Id
    ///</summary>
    public int ScheduleId {get; set;}
    public bool Private {get; set;}
    ///<summary>
    ///Use ServiceType Class
    ///</summary>
    public string ServerURL {get; set;}
    public string RecordURL {get; set;}
    public string RecordId {get; set;}
    public string ServiceType {get; set;}
    public int ServiceId {get; set;}
    public int SchoolId {get; set;}


    [NotMapped]
    public string className {get; set;}
    [NotMapped]
    public string downloadURL {get; set;}
    [NotMapped]
    public string schoolName {get; set;}
    [NotMapped]
    public string nameWithoutCounter {get; set;}


}
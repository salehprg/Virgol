using System;
using System.ComponentModel.DataAnnotations.Schema;

public class ClassScheduleView {
    //we set name data in database for having better performance
    public int Id {get; set;}
    public int ClassId {get; set;}
    ///<summary>
    ///Get dayType from DayType class
    ///</summary>
    public int DayType {get; set;}
    public int LessonId {get; set;}
    public int TeacherId {get; set;}
    public int weekly {get; set;}
    public float StartHour {get; set;}
    public float EndHour {get; set;}
    public string FirstName {get; set;}
    public string LastName {get; set;}
    public string OrgLessonName {get; set;}

    [NotMapped]
    public string moodleUrl {get;set;}

}
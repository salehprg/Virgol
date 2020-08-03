using System;

public class Class_WeeklySchedule {
    //we set name data in database for having better performance
    public int Id {get; set;}
    public int ClassId {get; set;}
    ///<summary>
    ///Get dayType from DayType class
    ///</summary>
    public int DayType {get; set;}
    public int LessonId {get; set;}
    public int TeaacherId {get; set;}
    public DateTime StartHour {get; set;}
    public DateTime EndHour {get; set;}

}
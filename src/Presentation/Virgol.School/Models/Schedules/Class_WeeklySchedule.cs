using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

public class Class_WeeklySchedule {
    //we set name data in database for having better performance
    public int Id {get; set;}
    public int ClassId {get; set;}
    ///<summary>
    ///Get dayType from DayType class
    ///</summary>
    public int DayType {get; set;}
    public int LessonId {get; set;}
    public int TeacherId {get; set;}

    [NotMapped]
    public List<int> ListTeacherId {get; set;}
    public float StartHour {get; set;}
    public float EndHour {get; set;}
    ///<summary>
    ///0 = everyWeek
    ///1 = zojWeek
    ///2 = fardWeek
    ///</sumary>
    public int weekly {get; set;}
    public int MixedId {get;set;}
    public bool MultiTeacher {get;set;}

    [NotMapped]
    public string CustomLessonName {get;set;}


}
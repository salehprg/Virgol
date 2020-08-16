using System;

public class CourseNotify {
    //we set name data in database for having better performance
    public int Id {get; set;}
    public int UserId {get; set;}
    public int ScheduleId {get; set;}
    public DateTime SentTime {get; set;}

}
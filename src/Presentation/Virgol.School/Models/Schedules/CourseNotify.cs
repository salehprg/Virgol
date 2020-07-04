using System;

public class CourseNotify {
    //we set name data in database for having better performance
    public int Id {get; set;}
    public int StudentId {get; set;}
    public string CourseName {get; set;}
    public DateTime CourseTime {get; set;}
    public Boolean Sent {get; set;}

}
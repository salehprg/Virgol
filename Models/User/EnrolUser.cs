public class EnrolUser {

    //Every data should be from Moodle database
    public int RoleId {get; set;}
    public int UserId {get; set;}
    public int CourseId {get; set;}
    public int CategoryId {get; set;} // use When add student to category
}
public class EnrolUser {

    //Every data should be from Moodle database
    public int RoleId {get; set;}   //Teacher Role = 3
                                    //Student Role = 5
    public int UserId {get; set;}
    public int CourseId {get; set;}
    public int CategoryId {get; set;} // use When add student to category
}
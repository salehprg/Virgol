public class EnrolUser {

    //Every data should be from Moodle database
    ///<summary>
    ///Teacher Role = 3
    ///Student Role = 5
    ///</summary>
    public int RoleId {get; set;}   

    ///<summary>
    ///User Id in moodle
    ///</summary>
    public int UserId {get; set;}
    public int lessonId {get; set;}// use When add teacher to lesson
    ///<summary>
    ///grade Id in moodle
    ///</summary>
    public int gradeId {get; set;} // use When add student to grade
}
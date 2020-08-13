using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;


namespace Models.Users.Teacher
{
    public class TeacherCourseInfo {

        public int id {get; set;}
        public int TeacherId {get; set;}
        public int CourseId {get; set;} // Course Id in Moodle
    }
}
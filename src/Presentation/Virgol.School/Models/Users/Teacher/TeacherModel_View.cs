using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;


namespace Models.Users.Teacher
{
    public class TeacherModel_View {

        public int id {get; set;}
        public int TeacherId {get; set;}
        public int CourseId {get; set;}
        public string FirstName {get; set;}
        public string LastName {get; set;}

    }
}
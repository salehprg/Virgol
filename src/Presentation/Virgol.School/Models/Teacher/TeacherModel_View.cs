using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;


namespace Models.Teacher
{
    public class TeacherModel_View {

        public int Id {get; set;}
        public int TeacherId {get; set;}
        public int CourseId {get; set;}
        public string Firstname {get; set;}
        public string Lastname {get; set;}

    }
}
namespace Virgol.School.Models
{
    public class ExtraLessonView
    {
        public int Id {get; set;}
        public int UserId {get; set;}
        public int lessonId {get; set;}
        public int ClassId {get; set;}

        public int School_Id {get; set;}
        public string FirstName {get; set;}
        public string LastName {get; set;}
        public string ClassName {get; set;}
        public string LessonName {get; set;}

    }
}
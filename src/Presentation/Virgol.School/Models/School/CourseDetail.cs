namespace Models
{
    public class CourseDetail
    {
        public int id { get; set; }
        public string shortname { get; set; }
        public string TeacherName { get; set; }
        public string displayname { get; set; }
        public float Score {get; set;}
        public int categoryId { get; set; } 
        
        public string CourseUrl {get; set;}

        //Use this just for pass data From FrontEnd to Backend
        public int TeacherId {get; set;}
    }

}
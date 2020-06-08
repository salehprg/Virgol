namespace Models
{
    public class CourseDetail
    {
        public int id { get; set; }
        public string shortname { get; set; }
        public string fullname { get; set; }
        public string displayname { get; set; }
        public float Grade {get; set;}
        public int categoryId { get; set; } 
        
        public string CourseUrl {get; set;}
    }

}
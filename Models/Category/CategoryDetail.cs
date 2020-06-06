namespace Models
{
    public class CategoryDetail
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public float Avverage { get; set; }
        public int CourseCount { get; set; }
        public int ParentCategory { get; set; }
    }
}
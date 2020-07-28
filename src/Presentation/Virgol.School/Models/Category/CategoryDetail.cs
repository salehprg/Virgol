namespace Models
{
    public class CategoryDetail
    {
        //This model uses for both admin and user , thus Avverage property just filled when User Used , in other
        //condition it can be empty


        public int Id { get; set; }
        public string Name { get; set; }
        public float Avverage { get; set; }
        public int CourseCount { get; set; }
        public int StudentCount { get; set; }
        public int ParentCategory { get; set; }
    }
}
using System.Collections.Generic;

namespace Models.MoodleApiResponse.Activity_Grade_Info
{
    public class GradeReport {
        public string FullName { get; set; }
        public List<GradeDetails> gradeDetails { get; set; }
        public float TotalGrade { get; set; } 
    }
}
using System.Collections.Generic;

namespace Models.MoodleApiResponse.Activity_Grade_Info
{
    public class ScoresReport {
        public string FullName { get; set; }
        public List<ScoreDetails> scoreDetails { get; set; }
        public float TotalGrade { get; set; } 
    }
}
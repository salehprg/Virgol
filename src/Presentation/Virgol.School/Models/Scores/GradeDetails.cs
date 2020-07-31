using System.Collections.Generic;

namespace Models.MoodleApiResponse.Activity_Grade_Info
{
    public class ScoreDetails {
        public string ActivityName { get; set; }
        public float ActivityGrade { get; set; }  // Can be assign,lesson,quiz,lti,course
        
    }
}
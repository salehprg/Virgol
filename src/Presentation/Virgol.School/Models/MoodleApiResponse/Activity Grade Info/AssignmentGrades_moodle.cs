using System.Collections.Generic;

namespace Models.MoodleApiResponse.Activity_Grade_Info
{
    public class AssignmentGrades_moodle
    {
        public int userid { get; set; }
        public string userfullname { get; set; }
        public List<GradeDetails_moodle> gradeitems {get; set;}
    }
}
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Models.MoodleApiResponse.Activity_Grade_Info
{
    public class GradeDetails_moodle {
        public int id { get; set; }
        public string itemname { get; set; }
        public string itemmodule { get; set; }  // Can be assign,lesson,quiz,lti,course
        public float graderaw { get; set; }
        public float grademin { get; set; }
        public float grademax { get; set; }
    }
}

using Newtonsoft.Json;

namespace Models.MoodleApiResponse
{
    public class CategoryDetail_moodle
    {
        public int id { get; set; }
        public int coursecount { get; set; }
        public string name { get; set; }
        public string parent { get; set; }

        
    }
}
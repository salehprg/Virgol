
using Newtonsoft.Json;

namespace Models.MoodleApiResponse
{
    public class CategoryDetail_moodle
    {
        public int id { get; set; }
        public string name { get; set; }

        [JsonIgnore]
        public string parent { get; set; }
    }
}
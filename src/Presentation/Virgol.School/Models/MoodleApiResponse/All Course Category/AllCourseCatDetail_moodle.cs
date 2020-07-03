
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Models.MoodleApiResponse
{
    public class AllCourseCatDetail_moodle<T>
    {
        [JsonProperty("courses")]
        public List<T> items {get; set;}
    }
}
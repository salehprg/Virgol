

namespace Models.MoodleApiResponse
{
    public class UserInfo_moodle
    {
        public int id {get; set;}
        public string username {get; set;}
        public string firstname {get; set;}
        public string lastname {get; set;}
        public string email {get; set;}
        public string idnumber {get; set;}

        public string password  {get; set;} // use when create user
        public string auth {get; set;}
    }
}
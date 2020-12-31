namespace Models.StreamApi
{
    public class CreateResponse
    {
        public string MeetingId {get; set;}
        public string ModeratorLink {get; set;}
        public string attendeeLink {get; set;}
        public string rtmpLink {get; set;}
        public string HLSLink {get; set;}
        public string dashLink {get; set;}
    }
}
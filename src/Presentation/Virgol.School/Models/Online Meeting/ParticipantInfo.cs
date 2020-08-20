public class ParticipantInfo {
    public int Id {get; set;}
    public int UserId {get; set;} // User id
    public int MeetingId {get; set;} //Meeting id in Meetings table in our database
    public int PresentCount {get; set;}
    public bool IsPresent {get; set;}
}
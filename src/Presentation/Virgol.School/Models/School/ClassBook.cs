using System.Collections.Generic;

public class ClassBook {
    public int UserId {get; set;}
    public string FirstName {get; set;}
    public string LastName {get; set;}
    public string MelliCode {get; set;}
    public string Email {get; set;}
    public int AbsentCount {get; set;}
    public float Score {get; set;}
    public List<ParticipantView> ParticipantDetail {get; set;}

}
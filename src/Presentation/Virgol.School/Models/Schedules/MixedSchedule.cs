using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

public class MixedSchedule {
    public int Id {get; set;}
    public string MixedName {get; set;}
    public int MeetingId {get; set;}
    
}
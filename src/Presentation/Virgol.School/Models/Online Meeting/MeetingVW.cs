using System;
using System.ComponentModel.DataAnnotations.Schema;

public class MeetingVW : Meeting {
    public ClassScheduleView meetingDetail {get;set;}


}
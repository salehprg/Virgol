using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

public class MultiTeacherSchedules {
    //we set name data in database for having better performance
    public int Id {get; set;}
    public int ScheduleId {get; set;}
    public int TeacherId {get; set;}


}
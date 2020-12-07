using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

public class TeacherDetail {
    public int Id {get;set;}
    public int TeacherId {get;set;}
    ///<summary>
    ///seperate by ','
    ///</summary>
    public string SchoolsId {get;set;}
    public string personalIdNUmber {get;set;}
    public DateTime birthDate {get;set;}
    public string cityBirth {get;set;}
    public string MeetingService {get;set;}


    public List<int> getTeacherSchoolIds()
    {
        List<int> schoolsId = new List<int>();
        
        string[] schoolsIdStr = SchoolsId.Split(",");
        foreach (var schoolId in schoolsIdStr)
        {
            int Id = -1;
            int.TryParse(schoolId , out Id);

            if(Id != -1 && Id != 0)
            {
                schoolsId.Add(Id);
            }
        }
        return schoolsId;
    }

    public string setTeacherSchoolIds(List<int> schoolsId)
    {     
        string schoolsIdStr = "";

        foreach (var schoolId in schoolsId)
        {
            schoolsIdStr += schoolId.ToString() + ",";
        }

        SchoolsId = schoolsIdStr;

        return schoolsIdStr;
    }

}
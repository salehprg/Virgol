using System;
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


}
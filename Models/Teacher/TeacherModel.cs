using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;


public class TeacherModel {

    public int Id {get; set;}
    public string Firstname {get; set;}
    public string Lastname {get; set;}
    public int Age {get; set;}
    public int MelliCode {get; set;}
}
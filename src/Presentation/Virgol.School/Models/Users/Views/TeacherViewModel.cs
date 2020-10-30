using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;


namespace Models.Users.Teacher
{
    public class TeacherViewModel {

        public int Id {get;set;}
        public string Email {get; set;}
        public string FirstName {get; set;}
        public string LastName {get; set;}
        public string LatinFirstname {get; set;}
        public string LatinLastname {get; set;}
        public string MelliCode {get; set;}    
        public string PhoneNumber {get; set;}    
        public string SchoolsId {get;set;}
        public string personalIdNUmber {get;set;}
        //0 = Girl , 1 = Boy
        public int? Sexuality {get; set;}

    }
}
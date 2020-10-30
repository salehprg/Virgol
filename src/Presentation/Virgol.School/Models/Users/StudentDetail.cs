using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Models.User
{
    public class StudentDetail {
        public int Id {get; set;}
        public int UserId {get; set;}
        public string ShDocument {get; set;}
        public string Document2 {get; set;}
        public string FatherName {get; set;}
        public string MotherName {get; set;}
        public string FatherPhoneNumber {get; set;}
        public string FatherMelliCode {get; set;}
        public string cityBirth {get; set;}
        public int BaseId {get; set;}
        public DateTime BirthDate {get; set;}

    }

}
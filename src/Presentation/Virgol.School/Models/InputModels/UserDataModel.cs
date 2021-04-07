using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Models.User;
using Newtonsoft.Json;

namespace Models.InputModel
{
    public class UserDataModel {

        public int Id {get; set;}
        public string FirstName {get; set;}
        public string Email {get; set;}
        public string LastName {get; set;}
        public string LatinFirstname {get; set;}
        public string LatinLastname {get; set;}
        public string PhoneNumber { get; set; }
        public string UserName { get; set; }
        public int SchoolId {get; set;}
        public string MelliCode {get; set;}    
        public bool ConfirmedAcc {get; set;}
        public int Moodle_Id {get; set;}
        //0 = Girl , 1 = Boy
        public int Sexuality {get; set;}

        [NotMapped]
        public bool completed {get;set;}
        [NotMapped]
        public string password {get;set;}
        
        [NotMapped]
        public StudentDetail studentDetail {get; set;}
        [NotMapped]
        public TeacherDetail teacherDetail {get; set;}
        [NotMapped]
        public ManagerDetail managerDetail {get; set;}
    }
}
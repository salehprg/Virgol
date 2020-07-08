using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Models.User.InputModel
{
    public class UserInputModel : UserModel {
        public string ShDocument {get; set;}
        public string Document2 {get; set;}
        public string FatherName {get; set;}
        public string FatherMelliCode {get; set;}
        public string MotherName {get; set;}
        public string MotherMelliCode {get; set;}
        public int BaseId {get; set;}
        public DateTime BirthDate {get; set;}
    }
}
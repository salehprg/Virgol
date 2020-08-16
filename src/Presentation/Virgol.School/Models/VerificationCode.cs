using Microsoft.EntityFrameworkCore;
using System;
using System.ComponentModel.DataAnnotations;


namespace Models
{
    public class VerificationCodeModel {

        public int Id {get; set;}
        public string VerificationCode {get; set;}
        public int UserId {get; set;}
        public bool fatherCode {get; set;}
        public DateTime LastSend {get; set;}
    }
}
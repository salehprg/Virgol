using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Models.User
{
    
    public class UserModel : IdentityUser<int> {
        
        public string FirstName {get; set;}
        public string LastName {get; set;}
        public string LatinFirstname {get; set;}
        public string LatinLastname {get; set;}
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

    }

}
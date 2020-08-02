using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Models.User
{
    
    public class UserModel : IdentityUser<int> {
        
        public string FirstName {get; set;}
        public string LastName {get; set;}
        public int SchoolId {get; set;}
        public string MelliCode {get; set;}    
        public bool ConfirmedAcc {get; set;}
        public int userTypeId {get; set;}
        public int Moodle_Id {get; set;}
    }

}
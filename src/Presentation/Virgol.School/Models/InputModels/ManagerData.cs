using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Models.User;

namespace Models.InputModel
{
    public class ManagerData : UserModel {
        public string personalIdNumber {get; set;}
        public string password {get; set;}

        public int schoolSexuality {get; set;} // school Sexulaity code
    }
}
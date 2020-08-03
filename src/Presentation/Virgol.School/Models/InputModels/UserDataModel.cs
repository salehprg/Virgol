using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Models.User;

namespace Models.InputModel
{
    public class UserDataModel : UserModel {
        // UserDataModel(UserModel parent)
        // {
        //     this.FirstName
        // }
        public StudentDetail userDetail {get; set;}
    }
}
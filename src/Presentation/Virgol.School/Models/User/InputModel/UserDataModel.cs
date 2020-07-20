using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Models.User.InputModel
{
    public class UserDataModel : UserModel {
        // UserDataModel(UserModel parent)
        // {
        //     this.FirstName
        // }
        public UserDetail userDetail {get; set;}
    }
}
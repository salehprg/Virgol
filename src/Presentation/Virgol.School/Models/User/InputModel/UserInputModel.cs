using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Models.User.InputModel
{
    public class UserInputModel : UserModel {
        public UserDetail userDetail {get; set;}
    }
}
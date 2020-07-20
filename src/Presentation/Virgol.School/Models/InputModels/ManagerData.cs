using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Models.User;

namespace Models.InputModel
{
    public class ManagerData : UserModel {

        public int schoolId {get; set;}
    }
}
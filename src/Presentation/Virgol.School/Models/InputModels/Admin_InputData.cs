using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Models.User;

namespace Models.InputModel
{
    public class Admin_InputData : UserModel {
        public int schoolType {get; set;}
        public int schoolLimit {get; set;}
        public string SchoolTypeName {get;set;}
    }
}
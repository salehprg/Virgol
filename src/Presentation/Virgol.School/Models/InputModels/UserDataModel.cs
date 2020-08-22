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
        
        public StudentDetail studentDetail {get; set;}
        public TeacherDetail teacherDetail {get; set;}
        public ManagerDetail managerDetail {get; set;}
    }
}
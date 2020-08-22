using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Models.User;
using Newtonsoft.Json;

namespace Models.InputModel
{
    public class UserDataModel : UserModel {

        public StudentDetail studentDetail {get; set;}
        public TeacherDetail teacherDetail {get; set;}
        public ManagerDetail managerDetail {get; set;}
    }
}
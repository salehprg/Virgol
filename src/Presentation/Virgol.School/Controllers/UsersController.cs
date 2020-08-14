﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Novell.Directory.Ldap;
using System.Net;
using System.Security.Cryptography;
using System.Net.Http;
using System.Net.Http.Headers;
using Models.MoodleApiResponse;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Options;

using lms_with_moodle.Helper;

using Models;
using Models.User;
using Microsoft.AspNetCore.Http;
using System.IO;
using Models.InputModel;

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class UsersController : ControllerBase
    {
        private readonly AppSettings appSettings;
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;
        private readonly SignInManager<UserModel> signInManager;
        private readonly AppDbContext appDbContext;
        private readonly LDAP_db ldap;

        MoodleApi moodleApi;
        FarazSmsApi SMSApi;
        public UsersController(UserManager<UserModel> _userManager 
                                , SignInManager<UserModel> _signinManager
                                , RoleManager<IdentityRole<int>> _roleManager
                                , IOptions<AppSettings> _appsetting
                                , AppDbContext _appdbContext)
        {
            userManager = _userManager;
            roleManager = _roleManager;
            signInManager =_signinManager;
            appSettings = _appsetting.Value;
            appDbContext = _appdbContext;


            ldap = new LDAP_db(appSettings);
            moodleApi = new MoodleApi(appSettings);
            SMSApi = new FarazSmsApi(appSettings);
        }
        

//Get data fro Enrolled User from Moodle 
#region UserActions
        
        [HttpGet]
        [Authorize(Roles = "User")]
        [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        public async Task<IActionResult> GetCetegoryNames()
        {
            
            //userManager getuserid get MelliCode field of user beacause we set in token
            int UserId = await moodleApi.GetUserId(userManager.GetUserId(User));

            if(UserId != -1)
            {
                List<CourseDetail> userCourses = await moodleApi.getUserCourses(UserId);
                var groupedCategory = userCourses.GroupBy(course => course.categoryId).ToList(); //لیستی برای بدست اوردن ایدی دسته بندی ها

                List<CategoryDetail> categoryDetails = new List<CategoryDetail>();

                foreach(var id in groupedCategory)
                {
                    List<float> grades = id.Select(x => x.Score).ToList(); //نمرات موجود در دستبه بندی 

                    float sum = 0;
                    foreach(var grade in grades)
                    {
                        sum += grade; // جمع نمرات
                    }
                    float avverage = sum / grades.Count;
        
                    CategoryDetail categoryDetail = await moodleApi.getCategoryDetail(id.Key);
                    categoryDetail.Avverage = avverage;
                    categoryDetail.CourseCount = id.Count();
                    
                    categoryDetails.Add(categoryDetail);
                }

                return Ok(categoryDetails.Where(x => x.ParentCategory != 0));
            }
            else{
                return BadRequest();
            }
        }

        [HttpGet]
        [Authorize(Roles = "User")]
        [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        public async Task<IActionResult> GetCoursesInCategory(int CategoryId)
        {
            
            int UserId = await moodleApi.GetUserId(userManager.GetUserId(User));

            if(UserId != -1)
            {
                List<CourseDetail> userCourses = await moodleApi.getUserCourses(UserId);

                userCourses = userCourses.Where(course => course.categoryId == CategoryId).ToList(); //Categories Courses by Categoty Id
                userCourses.ForEach(x => x.CourseUrl = appSettings.moddleCourseUrl + x.id);

                return Ok(userCourses);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [Authorize(Roles="User")]
        public async Task<IActionResult> VerifyPhoneNumber(string phoneNumber , int type , string verificationCode)
        {
            try
            {
                //Type  0 => send verificationCode => data = phonenumber
                //Type  1 => check verificationCode => data = verificationCode

                string idNumber = userManager.GetUserId(User);
                UserModel user = appDbContext.Users.Where(x => x.MelliCode == idNumber).FirstOrDefault();
                user.PhoneNumber = phoneNumber;

                if(type == 0)
                {
                    UserModel userPhonenumber = appDbContext.Users.Where(x => x.PhoneNumber.Contains(phoneNumber)).FirstOrDefault();

                    if(userPhonenumber.Id != user.Id)
                        return BadRequest("شماره همراه وارد شده قبلا در سیستم ثبت شده است");

                    //Every user can get just 3 Verification code in last 30 minutes
                    if(checkUserAttempts(user))
                    {
                        bool result = await SendCode(user);
                        if(result)
                        {
                            return Ok("پیامک تایید با موفقیت ارسال شد");
                        }
                        else
                        {
                            return BadRequest("مشکلی در ارسال پیامک بوجود آمد");
                        }
                    }
                    
                    return BadRequest("در هر 30 دقیقه 3 بار مجاز به ارسال پیامک هستید");

                }
                else if(type == 1)
                {
                    if(await CheckVerificationCode(verificationCode , user))
                    {
                        user.PhoneNumber = phoneNumber;
                        user.PhoneNumberConfirmed = true;
                        appDbContext.Users.Update(user);
                        appDbContext.SaveChanges();
                        return Ok(true);
                    }
                    return Ok(false);
                }

                return BadRequest("مشکلی بوجود آمده");
            }
            catch (System.Exception)
            {
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<IActionResult> ForgotPWDCode(string idNumber , int type , string verificationCode = "")
        {
            try
            {
                //Type  0 => send verificationCode
                //Type  1 => check verificationCode

                UserModel user = appDbContext.Users.Where(x => x.MelliCode == idNumber).FirstOrDefault();

                if(type == 0)
                {
                    //Every user can get just 3 Verification code in last 30 minutes
                    if(user.PhoneNumber != null)
                    {
                        if(checkUserAttempts(user))
                        {
                            bool result = await SendCode(user);
                            if(result)
                            {
                                return Ok("پیامک تایید با موفقیت ارسال شد");
                            }
                            else
                            {
                                return BadRequest("مشکلی در ارسال پیامک بوجود آمد");
                            }
                        }
                        
                        return BadRequest("در هر 30 دقیقه 3 بار مجاز به ارسال پیامک هستید");
                    }
                     return BadRequest("شما هنوز حساب کاربری خودرا تکمیل نکرده اید");

                }
                else if(type == 1)
                {
                    if(await CheckVerificationCode(verificationCode , user))
                    {
                        string token = await userManager.GeneratePasswordResetTokenAsync(user);
                        await userManager.ResetPasswordAsync(user , token , user.MelliCode);
                        return Ok(true);
                    }
                }

                return Ok(true);
            }
            catch (System.Exception)
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [Authorize(Roles="User")]
        public async Task<IActionResult> CompleteStudentProfile([FromBody]UserDataModel userDataModel)
        {
            try
            {
                string idNumber = userManager.GetUserId(User);
                UserModel user = appDbContext.Users.Where(x => x.MelliCode == idNumber).FirstOrDefault();

                if(user.LatinFirstname != null && user.LatinLastname != null)
                    return BadRequest("شما قبلا اطلاعات خودرا تکمیل کرده اید");
 
                StudentDetail studentDetail = appDbContext.StudentDetails.Where(x => x.UserId == user.Id).FirstOrDefault();

                studentDetail.BirthDate = userDataModel.userDetail.BirthDate;
                studentDetail.cityBirth = userDataModel.userDetail.cityBirth;
                
                appDbContext.StudentDetails.Update(studentDetail);

                user.LatinFirstname = userDataModel.LatinFirstname;
                user.LatinLastname = userDataModel.LatinLastname;

                appDbContext.Users.Update(user);
                appDbContext.SaveChanges();

                ldap.AddMail(user);

                return Ok(true);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles="Teacher")]
        public async Task<IActionResult> CompleteTeacherProfile([FromBody]UserDataModel userDataModel)
        {
            try
            {
                string idNumber = userManager.GetUserId(User);
                UserModel user = appDbContext.Users.Where(x => x.MelliCode == idNumber).FirstOrDefault();

                if(user.LatinFirstname != null && user.LatinLastname != null)
                    return BadRequest("شما قبلا اطلاعات خودرا تکمیل کرده اید");

                bool duplicatePersonalIdNumber = appDbContext.TeacherDetails.Where(x => x.personalIdNUmber == userDataModel.teacherDetail.personalIdNUmber).FirstOrDefault() != null;
                                           
                if(duplicatePersonalIdNumber)
                    return BadRequest("کد پرسنلی وارد شده تکراریست");
 
                TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == user.Id).FirstOrDefault();

                teacherDetail.birthDate = userDataModel.teacherDetail.birthDate;
                teacherDetail.cityBirth = userDataModel.teacherDetail.cityBirth;
                teacherDetail.personalIdNUmber = userDataModel.teacherDetail.personalIdNUmber;
                
                appDbContext.TeacherDetails.Update(teacherDetail);

                user.LatinFirstname = userDataModel.LatinFirstname;
                user.LatinLastname = userDataModel.LatinLastname;

                appDbContext.Users.Update(user);
                appDbContext.SaveChanges();

                ldap.AddMail(user);

                return Ok(true);

            }
            catch (System.Exception)
            {
                return BadRequest();
            }
        }
#endregion


#region Login/Register
        
        public class InputModel
        {
            public string Password {get; set;}
            public string Username {get; set;}
        }
        [HttpPost]
        public async Task<IActionResult> LoginUser([FromBody]InputModel inpuLogin)
        {
            var Result = signInManager.PasswordSignInAsync(inpuLogin.Username , inpuLogin.Password , false , false).Result;

            bool authResult = Result.Succeeded;

            if(!authResult)
            {
                string IdNumber = ldap.Authenticate(inpuLogin.Username , inpuLogin.Password);
                authResult = (IdNumber != null ? true : false);

                inpuLogin.Username = IdNumber;
            }
            
            if(authResult)
            {
                UserModel userInformation  = await userManager.FindByNameAsync(inpuLogin.Username);

                if(!userInformation.ConfirmedAcc)
                {
                    return StatusCode(423 , "حساب کاربری شما تایید نشده است");
                }

                object userDetail = null;

                switch(userInformation.userTypeId)
                {
                    case (int)UserType.Student:
                        SchoolModel school = appDbContext.Schools.Where(x => x.Id == userInformation.SchoolId).FirstOrDefault();
                        School_studentClass classs = appDbContext.School_StudentClasses.Where(x => x.UserId == userInformation.Id).FirstOrDefault();
                        School_Class classDetail = appDbContext.School_Classes.Where(x => x.Id == classs.ClassId).FirstOrDefault();
                        GradeModel grade = appDbContext.Grades.Where(x => x.Id == classDetail.Grade_Id).FirstOrDefault();
                        userDetail = new {
                            school,
                            classDetail.ClassName,
                            grade.GradeName
                        };
                        
                        break;

                    case (int)UserType.Teacher:
                        userDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == userInformation.Id).FirstOrDefault();
                        break;

                    case (int)UserType.Admin:
                        userDetail = appDbContext.AdminDetails.Where(x => x.UserId == userInformation.Id).FirstOrDefault();

                        string schooltypeName = "";
                        if (((AdminDetail)userDetail).SchoolsType == SchoolType.Sampad)
                        {
                            schooltypeName = "استعداد های درخشان";
                        }
                        else if (((AdminDetail)userDetail).SchoolsType == SchoolType.AmoozeshRahDor)
                        {
                            schooltypeName = "آموزش از راه دور";
                        }
                        else if (((AdminDetail)userDetail).SchoolsType == SchoolType.Gheyrdolati)
                        {
                            schooltypeName = "غیر دولتی";
                        }
                        else if (((AdminDetail)userDetail).SchoolsType == SchoolType.Dolati)
                        {
                            schooltypeName = "دولتی";
                        }

                        userDetail = new {userDetail , schooltypeName };
                        
                        break;

                    case (int)UserType.Manager:
                        userDetail = appDbContext.ManagerDetails.Where(x => x.UserId == userInformation.Id).FirstOrDefault();
                        break;
                    
                }

                var userRoleNames = new List<string>();

                userRoleNames = userManager.GetRolesAsync(userInformation).Result.ToList();

                List<Claim> authClaims = new List<Claim>()
                {
                    new Claim(JwtRegisteredClaimNames.Sub, userInformation.UserName),
                    new Claim(JwtRegisteredClaimNames.GivenName, userInformation.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),          
                };

                foreach (var item in userRoleNames)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, item)); // Add Users role
                }

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettings.JWTSecret));

                var token = new JwtSecurityToken(
                    issuer: "https://localhost:5001",
                    audience: "https://localhost:5001",
                    expires: DateTime.UtcNow.AddDays(1),
                    claims: authClaims,  // Add user Roles to token
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                    ) ;

                StudentDetail studentDetail = appDbContext.StudentDetails.Where(x => x.UserId == userInformation.Id).FirstOrDefault();
                int baseId = (studentDetail != null ? studentDetail.BaseId : -1);

                CategoryDetail category = new CategoryDetail();
                if(baseId != -1)
                {
                    category = await moodleApi.getCategoryDetail(baseId);
                }

                bool completedProfile = userInformation.LatinFirstname != null && userInformation.LatinFirstname != null;
                
                //Get userTypeId information from UserType Class
                return Ok(new
                {
                    UserType = userInformation.userTypeId,
                    category,
                    completedProfile,
                    BaseId = baseId,
                    userInformation,
                    userDetail,
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo
                });
            }

            return Unauthorized("Username Or Password Not Found");
        }

        //Sameple Data : Users/RegisterNewUser?Password=Saleh-1379   newUser post as json data
        [HttpPut]
        [ProducesResponseType(typeof(UserDataModel), 200)]
        [ProducesResponseType(typeof(IEnumerable<IdentityError>), 400)]
        public async Task<IActionResult> RegisterNewUser([FromBody]UserDataModel _model)
        {
            //Check for admin Account 
            UserModel adminUser = await userManager.FindByNameAsync("Admin");
            if(adminUser == null)
            {
                //When admin account not available it means this block doesn't call yet
                try
                {
                    adminUser = new UserModel{ConfirmedAcc = true , Email = "Admin@info.com" , FirstName = "Admin" , LastName = "Admin" , UserName = "Admin"};
                    await userManager.CreateAsync(adminUser , "Admin-1379");
                    
                    IdentityRole<int> adminRole = new IdentityRole<int>{Name = "Admin"};
                    await roleManager.CreateAsync(adminRole);
                    
                    IdentityRole<int> teacherRole = new IdentityRole<int>{Name = "Teacher"};
                    await roleManager.CreateAsync(teacherRole);

                    IdentityRole<int> userRole = new IdentityRole<int>{Name = "User"};
                    await roleManager.CreateAsync(userRole);

                    IdentityRole<int> managerRole = new IdentityRole<int>{Name = "Manager"};
                    await roleManager.CreateAsync(managerRole);

                    await userManager.AddToRoleAsync(adminUser , "Admin");
                }
                catch
                {}
            }

            UserModel newUser = _model;

            try
            {
                
                newUser.ConfirmedAcc = false;
                newUser.UserName = _model.MelliCode;
                newUser.userTypeId = (int)UserType.Student;
                
                IdentityResult result = userManager.CreateAsync(newUser , newUser.MelliCode).Result;
                
                if(result.Succeeded)
                {
                    await userManager.AddToRoleAsync(newUser , "User");

                    int userId = userManager.FindByNameAsync(newUser.MelliCode).Result.Id;

                     //These file name Are set by default and its extension should be checked between jpg/png
                    StudentDetail userDetail = new StudentDetail{
                        ShDocument = _model.MelliCode,
                        Document2 = _model.MelliCode + "_Doc2",
                        BaseId = _model.userDetail.BaseId,
                        BirthDate = _model.userDetail.BirthDate,
                        FatherMelliCode = _model.userDetail.FatherMelliCode,
                        FatherName = _model.userDetail.FatherName,
                        FatherPhoneNumber = _model.userDetail.FatherPhoneNumber,
                        UserId = userId
                    };

                    appDbContext.StudentDetails.Add(userDetail);
                    appDbContext.SaveChanges();
                    
                    return Ok(newUser);
                }
                else
                {
                    return BadRequest(result.Errors);
                }
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newUser);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        public async Task<IActionResult> UploadDocuments([FromForm]IFormCollection Files , string Mellicode)
        {
            var file = Files.Files[0];

            if (file != null)
            {
                if (file.Length > 0)
                {
                    string path = Path.Combine(Request.Host.Value, "ClientApp/build/Documents");

                    var fs = new FileStream(Path.Combine("ClientApp/build/Documents", Mellicode + "." + file.FileName.Split(".")[1]), FileMode.Create);
                    await file.CopyToAsync(fs);

                    return Ok(true);
                }
            }
            return BadRequest(false);
        }


        //For security Reason We Use this methode here
        [HttpGet]
        [ProducesResponseType(typeof(List<CategoryDetail>), 200)]
        public async Task<IActionResult> GetAllCategory()
        {
            try
            {
                
                List<CategoryDetail_moodle> result = await moodleApi.GetAllCategories(-1);
                List<CategoryDetail> Categories = new List<CategoryDetail>();

                foreach(var cat in result)
                {
                    if(cat.id != 1)  // Miscellaneous Category
                    {
                        CategoryDetail cateDetail = new CategoryDetail();
                        cateDetail.Id = cat.id;
                        cateDetail.Name = cat.name;

                        Categories.Add(cateDetail);
                    }
                }

                return Ok(Categories);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<CategoryDetail>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetAllSchools()
        {
            try
            {
                return Ok(appDbContext.Schools.Where(x => x.SelfSign).ToList());
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

#endregion
    

#region SMS
        [ApiExplorerSettings(IgnoreApi = true)]
        public bool checkUserAttempts(UserModel user)
        {
            List<VerificationCodeModel> lastestCodeInfo = new List<VerificationCodeModel>();
            lastestCodeInfo = appDbContext.VerificationCodes.Where(x => x.UserId == user.Id && x.LastSend.AddMinutes(30) >= DateTime.Now) //Limit count in 30 minutes
                                                            .ToList().OrderByDescending(x => x.LastSend).Take(3).ToList();
            
            if(lastestCodeInfo.Count != 3 && lastestCodeInfo.Count > 0) // Rich limit Send sms
            {
                if(lastestCodeInfo[0].LastSend.AddMinutes(3) < DateTime.Now)//Send sms code delay
                {   
                    return true;
                }
                else
                {
                    //return Ok("Limit Reached");
                    return false;
                }
            }
            else if(lastestCodeInfo.Count == 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        async Task<bool> SendCode(UserModel user)
        {
            try
            {
                string Code = await userManager.GenerateChangePhoneNumberTokenAsync(user , user.PhoneNumber);// Make new Verification code
                //bool SmsResult = SMSApi.SendForgotSms(user.PhoneNumber , Code);
                bool SmsResult = SMSApi.SendVerifySms(user.PhoneNumber , user.FirstName + " " + user.LastName , Code);

                if(SmsResult)
                {
                    VerificationCodeModel verification = new VerificationCodeModel();
                    verification.LastSend = DateTime.Now;
                    verification.UserId = user.Id;
                    verification.VerificationCode = Code;

                    appDbContext.VerificationCodes.Add(verification);
                    appDbContext.SaveChanges();

                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
        
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<bool> CheckVerificationCode(string verifyCode , UserModel user)
        {
            string Code = await userManager.GenerateChangePhoneNumberTokenAsync(user , user.PhoneNumber);

            bool resultVerify = (Code == verifyCode);

            if(resultVerify)
            {
                return true;
            }
            else
            {
                //Check verification if user Reach limit Code by Check last sent Code 

                VerificationCodeModel lastVerifyCode = appDbContext.VerificationCodes.Where(x => x.UserId == user.Id && x.LastSend.AddMinutes(30) >= DateTime.Now) //Limit count in 30 minutes
                                                            .ToList().OrderByDescending(x => x.LastSend).Take(3).ToList()[0];
                string LastCode = lastVerifyCode.VerificationCode;
                
                if(LastCode == verifyCode)
                {
                    return true;
                }

                return false;
            }
        }

#endregion
    }
}



using System;
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

            moodleApi = new MoodleApi(appSettings);
            SMSApi = new FarazSmsApi(appSettings);
        }
        

//Get data fro Enrolled User from Moodle 
#region User->indexPage
        
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
                    List<float> grades = id.Select(x => x.Grade).ToList(); //نمرات موجود در دستبه بندی 

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

            if(Result.Succeeded)
            {
                UserModel userInformation  = await userManager.FindByNameAsync(inpuLogin.Username);

                UserDetail userDetail = appDbContext.UserDetails.Where(x => x.UserId == userInformation.Id).FirstOrDefault();

                int UserType = -1; // 0 = Student , 1 = Teacher , 2 = Admin

                if(!userInformation.ConfirmedAcc)
                {
                    return StatusCode(423);
                }

                var userRoleNames = new List<string>();

                userRoleNames = userManager.GetRolesAsync(userInformation).Result.ToList();

                List<Claim> authClaims = new List<Claim>()
                {
                    new Claim(JwtRegisteredClaimNames.Sub, inpuLogin.Username),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),          
                };

                foreach (var item in userRoleNames)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, item)); // Add Users role
                    if(UserType == -1)
                    {
                        switch(item)
                        {
                            case "Admin":
                                UserType = 2;
                                break;

                            case "Teacher":
                                UserType = 1;
                                break;
                            
                            case "User":
                                UserType = 0;
                                break;
                        }
                    }
                }

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettings.JWTSecret));

                var token = new JwtSecurityToken(
                    issuer: "https://localhost:5001",
                    audience: "https://localhost:5001",
                    expires: DateTime.UtcNow.AddDays(1),
                    claims: authClaims,  // Add user Roles to token
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                    ) ;

                UserDetail userdetail = appDbContext.UserDetails.Where(x => x.UserId == userInformation.Id).FirstOrDefault();
                int baseId = (userdetail != null ? userdetail.BaseId : -1);
                CategoryDetail category = new CategoryDetail();
                if(baseId != -1)
                {
                    category = await moodleApi.getCategoryDetail(baseId);
                }

                return Ok(new
                {
                    UserType = UserType,
                    category,
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
                
                IdentityResult result = userManager.CreateAsync(newUser , newUser.MelliCode).Result;
                
                if(result.Succeeded)
                {
                    await userManager.AddToRoleAsync(newUser , "User");

                    int userId = userManager.FindByNameAsync(newUser.MelliCode).Result.Id;

                     //These file name Are set by default and its extension should be checked between jpg/png
                    UserDetail userDetail = new UserDetail{
                        ShDocument = _model.MelliCode,
                        Document2 = _model.MelliCode + "_Doc2",
                        BaseId = _model.userDetail.BaseId,
                        BirthDate = _model.userDetail.BirthDate,
                        FatherMelliCode = _model.userDetail.FatherMelliCode,
                        MotherMelliCode = _model.userDetail.MotherMelliCode,
                        FatherName = _model.userDetail.FatherName,
                        FatherPhoneNumber = _model.userDetail.FatherPhoneNumber,
                        MotherName = _model.userDetail.MotherName,
                        LatinFirstname = _model.userDetail.LatinFirstname,
                        LatinLastname = _model.userDetail.LatinLastname,
                        UserId = userId
                    };

                    appDbContext.UserDetails.Add(userDetail);
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

    #region ForgotPassword
        async Task<bool> SendCode(UserModel user)
        {
            try
            {
                string Code = await userManager.GenerateChangePhoneNumberTokenAsync(user , user.PhoneNumber);// Make new Verification code
                //bool SmsResult = SMSApi.SendForgotSms(user.PhoneNumber , Code);
                bool SmsResult = SMSApi.SendSms(new string[] {user.PhoneNumber} , Code);

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
        
        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        public async Task<IActionResult> SendVerificationCode(string IdNumer)
        {
            UserModel user = appDbContext.Users.Where(x => x.MelliCode == IdNumer).FirstOrDefault();


            //Every user can get just 3 Verification code in last 30 minutes
            List<VerificationCodeModel> lastestCodeInfo = new List<VerificationCodeModel>();
            lastestCodeInfo = appDbContext.VerificationCodes.Where(x => x.UserId == user.Id && x.LastSend.AddMinutes(30) >= DateTime.Now) //Limit count in 30 minutes
                                                            .ToList().OrderByDescending(x => x.LastSend).Take(3).ToList();
            
            if(lastestCodeInfo.Count != 3 && lastestCodeInfo.Count > 0) // Rich limit Send sms
            {
                if(lastestCodeInfo[0].LastSend.AddMinutes(3) < DateTime.Now)//Send sms code delay
                {   
                    bool sendCodeResult = await SendCode(user);
                    return Ok(sendCodeResult);
                }
                else
                {
                    //return Ok("Limit Reached");
                    return Ok(false);
                }
            }
            else if(lastestCodeInfo.Count == 0)
            {
                return Ok(await SendCode(user));
            }
            else
            {
                return Ok(false);
            }
            
            
        }


        public class VerificationInput
        {
            public string MelliCode {get; set;}
            public string VerificationCode {get; set;}
        }
        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        public async Task<IActionResult> ForgotPassword([FromBody]VerificationInput _input)
        {
            UserModel user = appDbContext.Users.Where(x => x.MelliCode == _input.MelliCode).FirstOrDefault();

            string Code = await userManager.GenerateChangePhoneNumberTokenAsync(user , user.PhoneNumber);

            bool resultVerify = (Code == _input.VerificationCode);

            if(resultVerify)
            {
                string token = await userManager.GeneratePasswordResetTokenAsync(user);
                await userManager.ResetPasswordAsync(user , token , user.MelliCode);
                return Ok(true);
            }
            else
            {
                //Check verification if user Reach limit Code by Check last sent Code 

                VerificationCodeModel lastVerifyCode = appDbContext.VerificationCodes.Where(x => x.UserId == user.Id && x.LastSend.AddMinutes(30) >= DateTime.Now) //Limit count in 30 minutes
                                                            .ToList().OrderByDescending(x => x.LastSend).Take(3).ToList()[0];
                string LastCode = lastVerifyCode.VerificationCode;
                
                if(LastCode == _input.VerificationCode)
                {
                    string token = await userManager.GeneratePasswordResetTokenAsync(user);
                    await userManager.ResetPasswordAsync(user , token , user.MelliCode);
                    return Ok(true);
                }

                return Ok(false);
            }
        }

    #endregion
        
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
                
                List<CategoryDetail_moodle> result = await moodleApi.GetAllCategories();
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
        public async Task<IActionResult> GetAllSchools()
        {
            try
            {
                List<CategoryDetail_moodle> categories = await moodleApi.GetAllCategories();
                List<CategoryDetail> schools = new List<CategoryDetail>();

                foreach (var category in categories)
                {
                    if(category.parent == "0")
                    {
                        CategoryDetail school = new CategoryDetail();
                        school.Id = category.id;
                        school.Name = category.name;

                        schools.Add(school);
                    }
                }

                return Ok(schools);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

#endregion
    
    }
}



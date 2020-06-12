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

                return Ok(categoryDetails);
            }
            else{
                return BadRequest();
            }
        }

        [HttpGet]
        [Authorize(Roles = "User")]
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
                int UserType = -1; // 0 = Student , 1 = Teacher , 2 = Admin

                if(!userInformation.ConfirmedAcc)
                {
                    return Unauthorized("حساب کاربری شما تایید نشده است");
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

                
                return Ok(new
                {
                    UserType = UserType,
                    userInformation,
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo
                });
            }

            return Unauthorized("Username Or Password Not Found");
        }

        [HttpPut]
        //Sameple Data : Users/RegisterNewUser?Password=Saleh-1379   _model post as json data
        public async Task<IActionResult> RegisterNewUser([FromBody]UserModel _model , string Password)
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

                    await userManager.AddToRoleAsync(adminUser , "Admin");
                }
                catch
                {}
            }

            try
            {
                _model.ConfirmedAcc = false;
                _model.UserName = _model.MelliCode;

                //These file name Are set by default and its extension should be checked between jpg/png
                _model.ShDocument = _model.MelliCode;
                _model.Document2 = _model.MelliCode + "_Doc2";
                
                IdentityResult result = userManager.CreateAsync(_model , Password).Result;

                if(result.Succeeded)
                {
                    await userManager.AddToRoleAsync(_model , "User");
                    return Ok(result.Succeeded);
                }
                else
                {
                    return BadRequest(result.Errors);
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    #region ForgotPassword
        async Task<bool> SendCode(UserModel user)
        {
            try
            {
                string Code = await userManager.GenerateChangePhoneNumberTokenAsync(user , user.PhoneNumber);// Make new Verification code
                string SmsResult = SMSApi.SendSms(new String[] {user.PhoneNumber} , Code);

                VerificationCodeModel verification = new VerificationCodeModel();
                verification.LastSend = DateTime.Now;
                verification.UserId = user.Id;
                verification.VerificationCode = Code;

                appDbContext.VerificationCodes.Add(verification);
                appDbContext.SaveChanges();

                return true;
            }
            catch
            {
                return false;
            }
        }
        [HttpPost]
        public async Task<IActionResult> SendVerificationCode([FromBody]UserModel _input)
        {
            UserModel user = appDbContext.Users.Where(x => x.MelliCode == _input.MelliCode).FirstOrDefault();


            //Every user can get just 3 Verification code in last 30 minutes
            List<VerificationCodeModel> lastestCodeInfo = new List<VerificationCodeModel>();
            lastestCodeInfo = appDbContext.VerificationCodes.Where(x => x.UserId == user.Id && x.LastSend.AddMinutes(30) >= DateTime.Now) //Limit count in 30 minutes
                                                            .ToList().OrderByDescending(x => x.LastSend).Take(3).ToList();
            
            if(lastestCodeInfo.Count != 3 && lastestCodeInfo.Count > 0) // Rich limit Send sms
            {
                if(lastestCodeInfo[0].LastSend.AddMinutes(3) < DateTime.Now)//Send sms code delay
                {   
                    return Ok(await SendCode(user));
                }
                else
                {
                    return Ok("Limit Reached");
                }
            }
            else if(lastestCodeInfo.Count == 0)
            {
                if(lastestCodeInfo[0].LastSend.AddMinutes(3) < DateTime.Now)//Send sms code delay
                {   
                    return Ok(await SendCode(user));
                }
                else
                {
                    return Ok("Limit Reached");
                }
            }
            else
            {
                return Ok("Limit Reached");
            }
            
            
        }


        public class VerificationInput
        {
            public string MelliCode {get; set;}
            public string VerificationCode {get; set;}
        }
        [HttpPost]
        public async Task<IActionResult> ForgotPassword([FromBody]VerificationInput _input)
        {
            UserModel user = appDbContext.Users.Where(x => x.MelliCode == _input.MelliCode).FirstOrDefault();

            string Code = await userManager.GenerateChangePhoneNumberTokenAsync(user , user.PhoneNumber);

            bool resultVerify = (Code == _input.VerificationCode);

            if(resultVerify)
            {
                return Ok(true);
            }
            else
            {
                //Check verification if user Reach limit Code by Check last sent Code 

                VerificationCodeModel lastVerifyCode = appDbContext.VerificationCodes.Where(x => x.UserId == user.Id && x.LastSend.AddMinutes(30) >= DateTime.Now) //Limit count in 30 minutes
                                                            .ToList().OrderByDescending(x => x.LastSend).Take(3).ToList()[0];
                string LastCode = lastVerifyCode.VerificationCode;
                
                return Ok(LastCode == _input.VerificationCode);
            }
        }

    #endregion
        
        [HttpPost]
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
        public async Task<IActionResult> GetAllCategory()
        {
            try
            {
                
                List<CategoryDetail_moodle> result = await moodleApi.GetAllCategories();
                List<CategoryDetail> Categories = new List<CategoryDetail>();

                foreach(var cat in result)
                {
                    if(cat.id != "1")  // Miscellaneous Category
                    {
                        CategoryDetail cateDetail = new CategoryDetail();
                        cateDetail.Id = int.Parse(cat.id);
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

#endregion
    
    }
}



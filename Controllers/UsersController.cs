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

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class UsersController : ControllerBase
    {
        private readonly AppSettings appSettings;
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;
        private readonly SignInManager<UserModel> signInManager;

        public UsersController(UserManager<UserModel> _userManager 
                                , SignInManager<UserModel> _signinManager
                                , RoleManager<IdentityRole<int>> _roleManager
                                , IOptions<AppSettings> _appsetting)
        {
            userManager = _userManager;
            roleManager = _roleManager;
            signInManager =_signinManager;
            appSettings = _appsetting.Value;
        }
        
#region User->indexPage
        
        [HttpGet]
        [Authorize(Roles = "User , Admin")]
        public async Task<IActionResult> GetCetegoryNames(int UserId)
        {
            MoodleApi moodleApi = new MoodleApi();

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

        [HttpGet]
        [Authorize(Roles = "User , Admin")]
        public async Task<IActionResult> GetCoursesInCategory(int CategoryId , int UserId)
        {
            MoodleApi moodleApi = new MoodleApi();
            List<CourseDetail> userCourses = await moodleApi.getUserCourses(UserId);

            userCourses = userCourses.Where(course => course.categoryId == CategoryId).ToList(); //Categories Courses by Categoty Id

            return Ok(userCourses);
        }

#endregion


#region Login/Register
        
        [HttpPost]
        public async Task<IActionResult> LoginUser(string Password , string Username)
        {
            var Result = signInManager.PasswordSignInAsync(Username , Password , false , false).Result;

            if(Result.Succeeded)
            {
                UserModel userInformation  = await userManager.FindByNameAsync(Username);

                if(!userInformation.ConfirmedAcc)
                {
                    return Unauthorized("حساب کاربری شما تایید نشده است");
                }

                var userRoleNames = new List<string>();

                userRoleNames = userManager.GetRolesAsync(userInformation).Result.ToList();

                List<Claim> authClaims = new List<Claim>()
                {
                    new Claim(JwtRegisteredClaimNames.Sub, Username),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),          
                };

                foreach (var item in userRoleNames)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, item)); // Add Users role
                }

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(appSettings.Secret));

                var token = new JwtSecurityToken(
                    issuer: "https://localhost:5001",
                    audience: "https://localhost:5001",
                    expires: DateTime.UtcNow.AddDays(1),
                    claims: authClaims,  // Add user Roles to token
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                    ) ;

                
                return Ok(new
                {
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

#endregion
    
    }
}



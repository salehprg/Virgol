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
using static SchoolDataHelper;
using ExcelDataReader;
using Newtonsoft.Json;

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppSettings appSettings;
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;
        private readonly SignInManager<UserModel> signInManager;
        private readonly AppDbContext appDbContext;

        LDAP_db ldap;
        MoodleApi moodleApi;
        FarazSmsApi SMSApi;
        public AdminController(UserManager<UserModel> _userManager 
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
            ldap = new LDAP_db(appSettings , appDbContext);
        }

        [HttpGet]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult getDashboardInfo()
        {
            try
            {
                string adminUserName = userManager.GetUserId(User);
                int userId = appDbContext.Users.Where(x => x.UserName == adminUserName).FirstOrDefault().Id;
                AdminDetail adminModel = appDbContext.AdminDetails.Where(x => x.UserId == userId).FirstOrDefault();

                List<SchoolModel> schools = appDbContext.Schools.Where(x => x.SchoolType == adminModel.SchoolsType).ToList();

                int schoolCount = schools.Count;
                int limitCount = adminModel.SchoolLimit - schoolCount;
                int studentsCount = 0;

                List<UserModel> teachers = appDbContext.Users.Where(x => x.userTypeId == (int)UserType.Teacher).ToList();

                List<UserModel> resultTeacher = new List<UserModel>();

                foreach (var school in schools)
                {
                    studentsCount += appDbContext.Users.Where(x => x.SchoolId == school.Id && (x.userTypeId == (int)UserType.Student)).Count();
                    foreach (var teacher in teachers)
                    {
                        TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == teacher.Id).FirstOrDefault();
                        if(teacherDetail.SchoolsId.Contains(school.Id.ToString() + ","))
                        {
                            resultTeacher.Add(teacher);
                        }
                    }
                }

                resultTeacher.Distinct();
                int teacherCount = resultTeacher.Count;

                return Ok(new{
                    adminDetail = adminModel,
                    schoolCount,
                    keyCount = limitCount,
                    studentsCount,
                    teacherCount
                });
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }


#region Manager

        [HttpGet]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetManagers()
        {
            try
            {
                int roleId = roleManager.GetRoleIdAsync(new IdentityRole<int>{Name = "Teacher"}).Result.FirstOrDefault();

                var userInRole = appDbContext.UserRoles.Where(x => x.RoleId == roleId);

                List<UserModel> mangers = new List<UserModel>();
                foreach (var user in userInRole)
                {
                    UserModel manager = appDbContext.Users.Where(x => x.Id == user.UserId).FirstOrDefault();
                    mangers.Add(manager);
                }

                return Ok(mangers);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult RedirectAdmin(int schoolId)
        {
            try
            {
                var userRoleNames = new List<string>();
                int managerId = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault().ManagerId;

                UserModel userInformation  = appDbContext.Users.Where(x => x.Id == managerId).FirstOrDefault();

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

                object userDetail = null;

                switch(userInformation.userTypeId)
                {
                    case (int)UserType.Student:
                        userDetail = appDbContext.StudentDetails.Where(x => x.UserId == userInformation.Id).FirstOrDefault();
                        
                        break;

                    case (int)UserType.Teacher:
                        userDetail = appDbContext.StudentDetails.Where(x => x.UserId == userInformation.Id).FirstOrDefault();
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

                //Get userTypeId information from UserType Class
                return Ok(new
                {
                    UserType = userInformation.userTypeId,
                    userInformation,
                    userDetail,
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo
                });
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }


        [HttpPut]
        [ProducesResponseType(typeof(UserModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddNewManager([FromBody]ManagerData model)
        {
            try
            {
                UserModel manager = model;
                manager.UserName = model.MelliCode;
                manager.ConfirmedAcc = true;
                manager.userTypeId = (int)UserType.Manager;
                manager.Moodle_Id = 0;
                manager.MelliCode = ConvertToPersian.PersianToEnglish(manager.MelliCode);

                bool result = userManager.CreateAsync(manager , manager.MelliCode).Result.Succeeded;

                if(result)
                {
                    await userManager.AddToRolesAsync(manager , new string[]{"User" , "Manager"});
                    
                    int userId = userManager.FindByNameAsync(manager.UserName).Result.Id;
                    manager.Id = userId;

                    bool ldapUser = ldap.AddUserToLDAP(manager);

                    bool userToMoodle = false;
                    if(ldapUser)
                    {
                        userToMoodle = await moodleApi.CreateUsers(new List<UserModel>() {manager});
                    }

                    if(userToMoodle)
                    {
                        int userMoodle_id = await moodleApi.GetUserId(manager.MelliCode);
                        manager.Moodle_Id = userMoodle_id;

                        appDbContext.Users.Update(manager);

                        ManagerDetail managerDetail = new ManagerDetail();
                        managerDetail.personalIdNumber = ConvertToPersian.PersianToEnglish(model.personalIdNumber);
                        managerDetail.UserId = userId;

                        appDbContext.ManagerDetails.Add(managerDetail);
                        appDbContext.SaveChanges();
                        
                        SchoolModel school = appDbContext.Schools.Where(x => x.Id == model.SchoolId).FirstOrDefault();

                        if(school != null)
                        {
                            school.ManagerId = userId;
                            appDbContext.Schools.Update(school);
                            appDbContext.SaveChanges();
                        }
                    }
                }

                return Ok(model);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(UserModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> EditManager([FromBody]ManagerData model)
        {
            try
            {
                
                // SchoolModel oldSchool = new SchoolModel();
                // oldSchool = appDbContext.Schools.Where(x => x.Id == model.SchoolId).FirstOrDefault();
                
                // SchoolModel newSchool = new SchoolModel();
                // newSchool = appDbContext.Schools.Where(x => x.Id == model.SchoolId).FirstOrDefault();

                // if(oldSchool != null && model.SchoolId != 0)
                // {
                //     oldSchool.ManagerId = -1;
                //     appDbContext.Schools.Update(oldSchool);
                // }

                // if(newSchool != null && model.SchoolId != 0)
                // {
                //     newSchool.ManagerId = model.Id;
                //     appDbContext.Schools.Update(newSchool);
                // }
                model.MelliCode = ConvertToPersian.PersianToEnglish(model.MelliCode);

                UserModel manager = appDbContext.Users.Where(x => x.MelliCode == model.MelliCode).FirstOrDefault();
                IdentityResult chngPass = new IdentityResult();
                if(manager != null)
                {
                    
                    if(!string.IsNullOrEmpty(model.password))
                    {
                        string token = await userManager.GeneratePasswordResetTokenAsync(manager);
                        chngPass = await userManager.ResetPasswordAsync(manager , token , model.password);
                    }
                    manager.FirstName = model.FirstName;
                    manager.LastName = model.LastName;
                    manager.PhoneNumber = (model.PhoneNumber != null ? ConvertToPersian.PersianToEnglish(model.PhoneNumber) : null );

                    appDbContext.Users.Update(manager);
                    appDbContext.SaveChanges();
                }
                else
                {
                    UserModel oldManager = appDbContext.Users.Where(x => x.SchoolId == model.SchoolId && x.userTypeId == (int)UserType.Manager).FirstOrDefault();
                    if(oldManager != null)
                    {
                        oldManager.SchoolId = -1;

                        appDbContext.Users.Update(oldManager);
                        appDbContext.SaveChanges();
                    }

                    await AddNewManager(model);
                    UserModel newManager = appDbContext.Users.Where(x => x.MelliCode == model.MelliCode).FirstOrDefault();

                    string token = await userManager.GeneratePasswordResetTokenAsync(newManager);
                    await userManager.ResetPasswordAsync(newManager , token , model.password);
                }

                List<IdentityError> errors = chngPass.Errors.ToList();
                return Ok(new{
                    manager,
                    errors
                });
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [ProducesResponseType(typeof(UserModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult RemoveManager(int managerId)
        {
            try
            {
                
                SchoolModel oldSchool = new SchoolModel();
                oldSchool = appDbContext.Schools.Where(x => x.ManagerId == managerId).FirstOrDefault();

                if(oldSchool != null)
                {
                    oldSchool.ManagerId = -1;
                    appDbContext.Schools.Update(oldSchool);
                }

                UserModel manager = appDbContext.Users.Where(x => x.Id == managerId).FirstOrDefault();
                bool removeManager = userManager.DeleteAsync(manager).Result.Succeeded;

                if(removeManager)
                {
                    appDbContext.SaveChanges();
                }
                
                return Ok(managerId);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

#endregion

        [HttpGet]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetAllTeachers()
        {
            try
            {
                string userName = userManager.GetUserId(User);
                int adminId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;
                int schoolType = appDbContext.AdminDetails.Where(x => x.UserId == adminId).FirstOrDefault().SchoolsType;

                List<SchoolModel> schools = appDbContext.Schools.Where(x => x.SchoolType == schoolType).ToList();
                List<UserModel> teachers = appDbContext.Users.Where(x => x.userTypeId == (int)UserType.Teacher).ToList();

                List<UserDataModel> result = new List<UserDataModel>();

                foreach (var school in schools)
                {
                    int schoolId = school.Id;
                    foreach (var teacher in teachers)
                    {
                        var serializedParent = JsonConvert.SerializeObject(teacher); 
                        UserDataModel teacherVW = JsonConvert.DeserializeObject<UserDataModel>(serializedParent);

                        TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == teacher.Id).FirstOrDefault();
                        if(teacherDetail.SchoolsId.Contains(schoolId.ToString() + ","))
                        {
                            if(teacher.LatinFirstname != null)
                            {
                                teacherVW.completed = true;
                            }
                            teacherVW.teacherDetail = teacherDetail;
                            result.Add(teacherVW);
                        }
                    }
                }

                return Ok(result.Distinct());
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetAllStudents()
        {
            try
            {
                string userName = userManager.GetUserId(User);
                int adminId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;
                int schoolType = appDbContext.AdminDetails.Where(x => x.UserId == adminId).FirstOrDefault().SchoolsType;

                List<SchoolModel> schools = appDbContext.Schools.Where(x => x.SchoolType == schoolType).ToList();

                List<UserDataModel> result = new List<UserDataModel>();

                foreach (var school in schools)
                {
                    List<UserModel> students = appDbContext.Users.Where(x => x.SchoolId == school.Id && x.userTypeId == (int)UserType.Student).ToList();
                    foreach (var student in students)
                    {
                        var serializedParent = JsonConvert.SerializeObject(student); 
                        UserDataModel studentVW = JsonConvert.DeserializeObject<UserDataModel>(serializedParent);

                        StudentDetail studentDetail = appDbContext.StudentDetails.Where(x => x.UserId == student.Id).FirstOrDefault();
                        if(student.LatinFirstname != null)
                        {
                            studentVW.completed = true;
                        }
                        studentVW.userDetail = studentDetail;

                        result.Add(studentVW);
                    }
                }

                return Ok(result);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

    }
}
        
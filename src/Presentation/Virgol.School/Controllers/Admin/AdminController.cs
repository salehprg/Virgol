using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;

using Virgol.Helper;

using Models;
using Models.User;
using Models.Users.Roles;
using Models.InputModel;
using Newtonsoft.Json;
using Models.Users.Teacher;

namespace Virgol.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = Roles.Admin)]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;
        private readonly SignInManager<UserModel> signInManager;
        private readonly AppDbContext appDbContext;

        UserService UserService;
        public AdminController(UserManager<UserModel> _userManager 
                                , SignInManager<UserModel> _signinManager
                                , RoleManager<IdentityRole<int>> _roleManager
                                , AppDbContext _appdbContext)
        {
            userManager = _userManager;
            roleManager = _roleManager;
            signInManager =_signinManager;
            appDbContext = _appdbContext;

            UserService = new UserService(userManager , appDbContext);
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
                int studentsCount = appDbContext.StudentViews.Where(x => x.SchoolType == adminModel.SchoolsType).Count();

                List<TeacherViewModel> teachers = appDbContext.TeacherViews.ToList();

                List<TeacherViewModel> resultTeacher = new List<TeacherViewModel>();

                foreach (var school in schools)
                {
                    foreach (var teacher in teachers)
                    {
                        if(teacher.SchoolsId.Contains(school.Id.ToString() + ","))
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
                int roleId = roleManager.GetRoleIdAsync(new IdentityRole<int>{Name = Roles.Manager}).Result.FirstOrDefault();

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
                SchoolModel schoolModel = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault();
                int managerId = schoolModel.ManagerId;

                UserModel userInformation  = appDbContext.Users.Where(x => x.Id == managerId).FirstOrDefault();

                userRoleNames = UserService.GetUserRoles(userInformation).Result.ToList();

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

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppSettings.JWTSecret));

                var token = new JwtSecurityToken(
                    issuer: "https://localhost:5001",
                    audience: "https://localhost:5001",
                    expires: DateTime.UtcNow.AddDays(1),
                    claims: authClaims,  // Add user Roles to token
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                    ) ;

                object userDetail = appDbContext.ManagerDetails.Where(x => x.UserId == userInformation.Id).FirstOrDefault();

                int schoolType = schoolModel.SchoolType;

                string schooltypeName = "";
                if (schoolType == SchoolType.Sampad)
                {
                    schooltypeName = "استعداد های درخشان";
                }
                else if (schoolType == SchoolType.AmoozeshRahDor)
                {
                    schooltypeName = "آموزش از راه دور";
                }
                else if (schoolType == SchoolType.Gheyrdolati)
                {
                    schooltypeName = "غیر دولتی";
                }
                else if (schoolType == SchoolType.Dolati)
                {
                    schooltypeName = "دولتی";
                }

                userDetail = new {userDetail , schooltypeName };

                //Get UserType information from UserType Class
                return Ok(new
                {
                    UserType = Roles.Manager,
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
                //manager.UserType = Roles.Manager;
                manager.Moodle_Id = 0;
                manager.MelliCode = ConvertToPersian.PersianToEnglish(manager.MelliCode);

                ManagerDetail managerDetail = new ManagerDetail();
                managerDetail.personalIdNumber = ConvertToPersian.PersianToEnglish(model.personalIdNumber);

                UserDataModel managerData = new UserDataModel();
                var seialized = JsonConvert.SerializeObject(manager);
                managerData = JsonConvert.DeserializeObject<UserDataModel>(seialized);

                managerData.managerDetail = managerDetail;

                List<string> userRoles = new List<string>{Roles.Manager};

                List<UserDataModel> managerDatas = await UserService.CreateUser(new List<UserDataModel>{managerData} , userRoles , model.SchoolId , model.password);

                SchoolModel school = appDbContext.Schools.Where(x => x.Id == model.SchoolId).FirstOrDefault();

                if(school != null)
                {
                    school.ManagerId = managerDatas[0].Id;
                    appDbContext.Schools.Update(school);
                    await appDbContext.SaveChangesAsync();
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
                SchoolModel schoolModel = appDbContext.Schools.Where(x => x.Id == model.SchoolId).FirstOrDefault();
                schoolModel.sexuality = model.schoolSexuality;
                
                appDbContext.Schools.Update(schoolModel);
                await appDbContext.SaveChangesAsync();

                model.MelliCode = ConvertToPersian.PersianToEnglish(model.MelliCode);

                int currentManagerId = appDbContext.Schools.Where(x => x.Id == model.SchoolId).FirstOrDefault().ManagerId;
                UserModel currentManager = appDbContext.Users.Where(x => x.Id == currentManagerId).FirstOrDefault();
                UserModel newManager = appDbContext.Users.Where(x => x.MelliCode == model.MelliCode).FirstOrDefault();

                if(newManager != null && currentManager == null)
                {
                    return BadRequest("کد ملی وارد شده تکراریست");
                }

                IdentityResult chngPass = new IdentityResult();
                if(currentManager != null && newManager != null && currentManager.Id == newManager.Id)//It means MelliCode not changed and just should Edit manager Info
                {
                    newManager = null;

                    if(!string.IsNullOrEmpty(model.password) && model.password.Length < 8)
                        return BadRequest("حداقل طول رمز عبور باید 8 رقم باشد");

                    if(model.PhoneNumber != null && model.PhoneNumber != currentManager.PhoneNumber)
                    {
                        if(UserService.CheckPhoneInterupt(model.PhoneNumber))
                            return BadRequest("شماره همراه وارد شده قبلا در سیستم ثبت شده است");

                        currentManager.PhoneNumber = ConvertToPersian.PersianToEnglish(model.PhoneNumber);
                    }
                    
                    
                    currentManager.FirstName = model.FirstName;
                    currentManager.LatinFirstname = model.LatinFirstname;
                    currentManager.LastName = model.LastName;
                    currentManager.LatinLastname = model.LatinLastname;

                    UserDataModel userDataModel = new  UserDataModel();
                    var serialized = JsonConvert.SerializeObject(currentManager);
                    userDataModel = JsonConvert.DeserializeObject<UserDataModel>(serialized);

                    userDataModel.managerDetail = new ManagerDetail();
                    userDataModel.managerDetail.personalIdNumber = model.personalIdNumber;

                    await UserService.EditUsers(new List<UserDataModel>{userDataModel} , model.SchoolId , false , model.password);

                    List<IdentityError> errors = chngPass.Errors.ToList();
                    return Ok(new{
                        currentManager,
                        errors
                    });
                }
                
                if(newManager == null ) //melliCode changed and should remove oldManager then add newManager
                {
                    if(model.password == null || model.password.Trim() == null)
                        return BadRequest("لطفا برای ساخت مدیر جدید رمزعبور مدیر را هم وارد نمایید");

                    if(model.password.Length < 8)
                        return BadRequest("حداقل طول رمز عبور باید 8 رقم باشد");

                    if(UserService.CheckPhoneInterupt(ConvertToPersian.PersianToEnglish(model.PhoneNumber)))
                        return BadRequest("شماره همراه وارد شده قبلا در سیستم ثبت شده است");

                    if(currentManager != null)
                    {
                        await UserService.DeleteUser(currentManager);
                    }
                    model.UserName = model.MelliCode;

                    model.ConfirmedAcc = true;
                    UserDataModel userDataModel = new  UserDataModel();
                    var serialized = JsonConvert.SerializeObject(model);
                    userDataModel = JsonConvert.DeserializeObject<UserDataModel>(serialized);

                    userDataModel.managerDetail = new ManagerDetail();
                    userDataModel.managerDetail.personalIdNumber = model.personalIdNumber;

                    List<string> userRoles = new List<string>{Roles.Manager};
                    List<UserDataModel> datas = await UserService.CreateUser(new List<UserDataModel>{userDataModel} , userRoles , model.SchoolId , model.password );

                    if(datas.Count > 0)
                    {
                        SchoolModel school = appDbContext.Schools.Where(x => x.Id == model.SchoolId).FirstOrDefault();
                        school.ManagerId = datas[0].Id;

                        appDbContext.Schools.Update(school);
                        await appDbContext.SaveChangesAsync();

                        var serializedNewManager = JsonConvert.SerializeObject(userDataModel);
                        UserModel newUserManager = JsonConvert.DeserializeObject<UserModel>(serialized);

                        newManager = newUserManager;
                    }
                    
                    List<IdentityError> errors = chngPass.Errors.ToList();
                    return Ok(new{
                        newManager,
                        errors
                    });
                }

                if(newManager != null)
                {
                    if(UserService.CheckMelliCodeInterupt(newManager.MelliCode , currentManager.Id))
                        return BadRequest("کد ملی وارد شده تکراریست");
                }
                
                return BadRequest("اطلاعات وارد شده ناقص میباشد");
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return BadRequest("خطای سیستمی رخ داد لطفا بعدا تلاش نمایید");
            }
        }

        [HttpDelete]
        [ProducesResponseType(typeof(UserModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> RemoveManager(int managerId)
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
                    await appDbContext.SaveChangesAsync();
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

                List<TeacherViewModel> allTeachers = appDbContext.TeacherViews.ToList();
                List<TeacherViewModel> result = new List<TeacherViewModel>();

                foreach (var school in schools)
                {
                    int schoolId = school.Id;
                    foreach (var teacher in allTeachers)
                    {
                        if(teacher.SchoolsId.Contains(schoolId.ToString() + ","))
                        {
                            result.Add(teacher);
                        }
                    }
                }
                
                result = result.Distinct().ToList();
                result = result.OrderBy(x => x.LastName).ToList();
                return Ok(result);
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

                List<StudentViewModel> result = appDbContext.StudentViews.Where(x => x.SchoolType == schoolType && x.rolename == Roles.Student).ToList();

                result = result.OrderBy(x => x.LastName).ToList();
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
        
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
                int teacherCount = 0;

                foreach (var school in schools)
                {
                    studentsCount += appDbContext.Users.Where(x => x.SchoolId == school.Id && (x.userTypeId == (int)UserType.Student)).Count();
                    teacherCount += appDbContext.Users.Where(x => x.SchoolId == school.Id && x.userTypeId == (int)UserType.Teacher).Count();
                }

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

                bool result = userManager.CreateAsync(manager , manager.MelliCode).Result.Succeeded;

                if(result)
                {
                    await userManager.AddToRolesAsync(manager , new string[]{"User" , "Manager"});
                    
                    int userId = userManager.FindByNameAsync(manager.UserName).Result.Id;

                    ManagerDetail managerDetail = new ManagerDetail();
                    managerDetail.personalIdNumber = model.personalIdNumber;
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

                UserModel manager = appDbContext.Users.Where(x => x.MelliCode == model.MelliCode).FirstOrDefault();
                if(manager != null)
                {

                    manager.FirstName = model.FirstName;
                    manager.LastName = model.LastName;
                    manager.PhoneNumber = model.PhoneNumber;

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
                }

                return Ok(manager);
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


    }
}
        
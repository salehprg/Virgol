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
        [ProducesResponseType(typeof(SchoolModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddNewManager([FromBody]ManagerData model)
        {
            try
            {
                UserModel manager = model;
                manager.UserName = model.MelliCode;

                bool result = userManager.CreateAsync(manager , manager.MelliCode).Result.Succeeded;

                if(result)
                {
                    await userManager.AddToRolesAsync(manager , new string[]{"User" , "Manager"});

                    SchoolModel school = appDbContext.Schools.Where(x => x.Id == model.schoolId).FirstOrDefault();

                    school.ManagerId = userManager.FindByNameAsync(manager.UserName).Result.Id;
                    appDbContext.Schools.Update(school);
                    appDbContext.SaveChanges();
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
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult EditManager([FromBody]ManagerData model)
        {
            try
            {
                
                SchoolModel oldSchool = new SchoolModel();
                oldSchool = appDbContext.Schools.Where(x => x.ManagerId == model.Id).FirstOrDefault();
                
                SchoolModel newSchool = new SchoolModel();
                newSchool = appDbContext.Schools.Where(x => x.Id == model.schoolId).FirstOrDefault();

                if(oldSchool != null)
                {
                    oldSchool.ManagerId = -1;
                }

                if(newSchool != null)
                {
                    newSchool.ManagerId = model.Id;
                }

                appDbContext.Schools.Update(oldSchool);
                appDbContext.Schools.Update(newSchool);
                appDbContext.Users.Update(model);
                
                appDbContext.SaveChanges();

                return Ok(true);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult RemoveManager([FromBody]int managerId)
        {
            try
            {
                
                SchoolModel oldSchool = new SchoolModel();
                oldSchool = appDbContext.Schools.Where(x => x.ManagerId == managerId).FirstOrDefault();

                if(oldSchool != null)
                {
                    appDbContext.Schools.Remove(oldSchool);
                }

                UserModel teacher = appDbContext.Users.Where(x => x.Id == managerId).FirstOrDefault();
                bool removeTeacher = userManager.DeleteAsync(teacher).Result.Succeeded;

                if(removeTeacher)
                {
                    appDbContext.SaveChanges();
                }
                
                return Ok(true);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

#endregion
    
#region School

        [HttpGet]
        [ProducesResponseType(typeof(List<SchoolModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetSchools()
        {
            try
            {
                return Ok(appDbContext.Schools.ToList());
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }


        [HttpPut]
        [ProducesResponseType(typeof(SchoolModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddNewSchool([FromBody]SchoolModel model)
        {
            SchoolModel newSchool = model;
            try
            {
                int schoolId = await moodleApi.CreateCategory(newSchool.SchoolName);
                if(schoolId != -1)
                {
                    model.Moodle_Id = schoolId;

                    appDbContext.Schools.Add(model);
                    appDbContext.SaveChanges();

                    model.Id = appDbContext.Schools.OrderBy(x => x.Id).FirstOrDefault().Id;

                    return Ok(model);
                }
                else
                {
                    return BadRequest("در ایجاد مدرسه مشکلی پیش آمد");
                }
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> EditSchool([FromBody]SchoolModel model)
        {
            try
            {
                CategoryDetail school = new CategoryDetail();
                school.Id = model.Moodle_Id;
                school.Name = model.SchoolName;
                school.ParentCategory = 0;

                bool editMoodle = await moodleApi.EditCategory(school);
                if(editMoodle)
                {
                    appDbContext.Schools.Update(model);

                    appDbContext.SaveChanges();
                    return Ok(true);
                }
                
                return BadRequest("مشکلی در ویرایش مدرسه بوجود آمد");
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> RemoveSchool([FromBody]int schoolId)
        {
            try
            {
                int catId = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault().Moodle_Id;
                bool removeCat = await moodleApi.DeleteCategory(catId);

                if(removeCat)
                {
                    SchoolModel school = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault();

                    appDbContext.Schools.Remove(school);
                    appDbContext.SaveChanges();

                    return Ok(true);
                }
                
                return BadRequest("مشکلی در حذف مدرسه بوجود آمد");
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
        
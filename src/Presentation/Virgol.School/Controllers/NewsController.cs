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
    public class NewsController : ControllerBase
    {
        private readonly AppSettings appSettings;
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;
        private readonly SignInManager<UserModel> signInManager;
        private readonly AppDbContext appDbContext;
        private readonly LDAP_db ldap;

        MoodleApi moodleApi;
        FarazSmsApi SMSApi;
        public NewsController(UserManager<UserModel> _userManager 
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
        
        [HttpGet]
        [ProducesResponseType(typeof(NewsModel), 200)]
        public IActionResult GetIncommingNews()
        {
            string userName = userManager.GetUserId(User);
            UserModel userModel = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();
            string roleName = userManager.GetRolesAsync(userModel).Result.Where(x => x != "User").FirstOrDefault();

            int managerRoleId = roleManager.FindByNameAsync(roleName).Result.Id;

            List<NewsModel> allowedNews = appDbContext.News.Where(x => x.AccessRoleId.Contains(managerRoleId.ToString())).ToList();

            foreach (var news in allowedNews)
            {
                List<string> tags = news.Tags.Split(",").ToList();

                news.tagsStr = tags;
            }

            return Ok(allowedNews);
        }

        [HttpGet]
        [ProducesResponseType(typeof(NewsModel), 200)]
        public IActionResult GetMyNews()
        {
            string userName = userManager.GetUserId(User);
            int UserId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;

            List<NewsModel> myNews = appDbContext.News.Where(x => x.AutherId == UserId).ToList();

            foreach (var news in myNews)
            {
                List<string> tags = news.Tags.Split(",").ToList();

                news.tagsStr = tags;
            }

            return Ok(myNews);
        }

        [HttpGet]
        [ProducesResponseType(typeof(NewsModel), 200)]
        public IActionResult GetAccessRoleIds()
        {
            List<IdentityRole<int>> roles = appDbContext.Roles.ToList();
            List<IdentityRole<int>> viewRoles = new List<IdentityRole<int>>();

            foreach (var role in roles)
            {
                IdentityRole<int> editRole = new IdentityRole<int>();
                editRole = role;

                switch(role.Name)
                {
                    case "Manager":
                        editRole.Name = "مدیر";
                        break;

                    case "Teacher":
                        editRole.Name = "معلم";
                        break;
                    
                    case "User":
                        editRole.Name = "دانش آموز";
                        break;
                    
                }

                viewRoles.Add(editRole);
            }
            
            return Ok(viewRoles);
        }

        [HttpPut]
        [ProducesResponseType(typeof(NewsModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> CreateNews([FromBody]NewsModel model)
        {
            NewsModel newsModel = model;
            try
            {
                string userName = userManager.GetUserId(User);
                int UserId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;

                string accessStr = "";
                foreach (var access in model.AccessRoleIdList)
                {
                    accessStr += access + ",";
                }

                newsModel.AccessRoleId = accessStr;

                newsModel.AutherId = UserId;
                newsModel.CreateTime = DateTime.Now;

                appDbContext.News.Add(newsModel);
                await appDbContext.SaveChangesAsync();

                return Ok(appDbContext.News.OrderByDescending(x => x.Id).FirstOrDefault());
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
        public IActionResult EditNews([FromBody]NewsModel model)
        {
            try
            {
                NewsModel newsModel = model;

                string accessStr = "";
                foreach (var access in model.AccessRoleIdList)
                {
                    accessStr += access + ",";
                }

                newsModel.AccessRoleId = accessStr;

                appDbContext.News.Update(newsModel);
                appDbContext.SaveChanges();

                return BadRequest("رشته ای انتخاب نشده است");
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
        public async Task<IActionResult> RemoveNews([FromBody]int newsId)
        {
            try
            {
                NewsModel news = appDbContext.News.Where(x => x.Id == newsId).FirstOrDefault();
                appDbContext.News.Remove(news);
                await appDbContext.SaveChangesAsync();

                return Ok(true);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

    }
}
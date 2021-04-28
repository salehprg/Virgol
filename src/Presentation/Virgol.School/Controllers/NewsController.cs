using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Virgol.Helper;

using Models;
using Models.User;
using Models.Users.Roles;

namespace Virgol.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class NewsController : ControllerBase
    {
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;
        private readonly SignInManager<UserModel> signInManager;
        private readonly AppDbContext appDbContext;
        UserService UserService;
        public NewsController(UserManager<UserModel> _userManager 
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
        [ProducesResponseType(typeof(NewsModel), 200)]
        public IActionResult GetIncommingNews()
        {
            try
            {
                UserModel userModel = UserService.GetUserModel(User);
                
                List<string> userRoles = UserService.GetUserRoles(userModel).Result;

                string roleName ="";
                roleName = userRoles.Where(x => x != "User").FirstOrDefault(); // result such as : Teacher , Admin , ...
                roleName = (string.IsNullOrEmpty(roleName) ? "User" : roleName);

                int userRoleId = roleManager.FindByNameAsync(roleName).Result.Id;

                List<NewsModel> allowedNews = appDbContext.News.Where(x => x.AccessRoleId.Contains(userRoleId.ToString() + ",")).ToList();
                List<NewsModel> result = new List<NewsModel>();

                foreach (var news in allowedNews)
                {
                    int autherId = news.AutherId;
                    UserModel auther = appDbContext.Users.Where(x => x.Id == autherId).FirstOrDefault();
                    List<string> autherRoles = UserService.GetUserRoles(auther).Result;

                    if(auther != null)
                    {
                        List<string> tags = new List<string>();

                        if(news.Tags != null)
                        {
                            tags = news.Tags.Split(",").ToList();
                        }

                        news.tagsStr = tags;
                        
                        //Get news according to School if authur is Manager
                        if(UserService.HasRole(auther , Roles.Manager , autherRoles) || UserService.HasRole(auther , Roles.CoManager , autherRoles))
                        {
                            int schoolId = auther.SchoolId;
                            if(UserService.HasRole(userModel , Roles.Student , userRoles))
                            {
                                if(userModel.SchoolId == schoolId)
                                {
                                    result.Add(news);
                                }
                            }
                            else if(UserService.HasRole(userModel , Roles.Teacher , userRoles))
                            {
                                string schoolIds = appDbContext.TeacherDetails.Where(x => x.TeacherId == userModel.Id).FirstOrDefault().SchoolsId;
                                if(schoolIds.Contains(schoolId + ","))
                                {
                                    result.Add(news);
                                }
                            }
                        }
                        else if(UserService.HasRole(auther , Roles.Admin , autherRoles))
                        {
                            int schoolType = appDbContext.AdminDetails.Where(x => x.UserId == auther.Id).FirstOrDefault().SchoolsType;
                            List<SchoolModel> schools = appDbContext.Schools.Where(x => x.SchoolType == schoolType).ToList();
                            foreach (var school in schools)
                            {
                                if(UserService.HasRole(userModel , Roles.Teacher , userRoles))
                                {
                                    string schoolIds = appDbContext.TeacherDetails.Where(x => x.TeacherId == userModel.Id).FirstOrDefault().SchoolsId;
                                    if(schoolIds.Contains(school.Id + ","))
                                    {
                                        result.Add(news);
                                    }
                                }
                                else
                                {
                                    if(userModel.SchoolId == school.Id)
                                    {
                                        result.Add(news);
                                    }
                                }
                            }
                            
                        }
                        else if(UserService.HasRole(auther , Roles.Teacher , autherRoles))
                        {
                            //Because only students can see Teachers News we Should only check SchoolId
                            string schoolIds = appDbContext.TeacherDetails.Where(x => x.TeacherId == auther.Id).FirstOrDefault().SchoolsId;
                            if(schoolIds.Contains(userModel.SchoolId + ","))
                            {
                                result.Add(news);
                            }
                        }
                    }
                }

                return Ok(result.OrderByDescending(x => x.CreateTime));
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error News : " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                
                return BadRequest("مشکلی در دریافت اخبار بوجود آمد");
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(NewsModel), 200)]
        public IActionResult GetMyNews()
        {
            try
            {
                string userName = userManager.GetUserId(User);
                int UserId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;

                List<NewsModel> myNews = appDbContext.News.Where(x => x.AutherId == UserId).ToList();

                foreach (var news in myNews)
                {
                    List<string> tags = new List<string>();

                    if(news.Tags != null)
                    {
                        tags = news.Tags.Split(",").ToList();
                    }

                    news.tagsStr = tags;
                }

                return Ok(myNews.OrderByDescending(x => x.CreateTime));
            }
            catch (Exception ex)
            {
                Console.WriteLine("My news Error : " + ex.Message);
                Console.WriteLine(ex.StackTrace);
                
                return BadRequest("مشکلی در دریافت اخبار بوجود آمد");
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(NewsModel), 200)]
        public IActionResult GetAccessRoleIds()
        {
            try
            {
                List<IdentityRole<int>> roles = appDbContext.Roles.ToList();
                List<IdentityRole<int>> viewRoles = new List<IdentityRole<int>>();

                foreach (var role in roles)
                {
                    IdentityRole<int> editRole = new IdentityRole<int>();
                    editRole = role;

                    switch(role.Name)
                    {
                        case Roles.CoManager:
                            editRole.Name = "معاون";
                            break;

                        case Roles.Manager:
                            editRole.Name = "مدیر";
                            break;

                        case Roles.Teacher:
                            editRole.Name = "معلم";
                            break;
                        
                        case Roles.Student:
                            editRole.Name = "دانش آموز";
                            break;
                        
                    }

                    viewRoles.Add(editRole);
                }
                
                return Ok(viewRoles);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace)    ;

                return BadRequest(ex.Message);
            }
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
                newsModel.CreateTime = MyDateTime.Now();

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
        public async Task<IActionResult> EditNews([FromBody]NewsModel model)
        {
            try
            {

                NewsModel newsModel = appDbContext.News.Where(x => x.Id == model.Id).FirstOrDefault();

                string accessStr = "";
                foreach (var access in model.AccessRoleIdList)
                {
                    accessStr += access + ",";
                }

                newsModel.AccessRoleId = accessStr;
                newsModel.Message = model.Message;
                newsModel.Tags = model.Tags;

                appDbContext.News.Update(newsModel);
                await appDbContext.SaveChangesAsync();

                return Ok("خبر با موفقیت ویرایش شد");
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
        public async Task<IActionResult> RemoveNews(int newsId)
        {
            try
            {
                NewsModel news = appDbContext.News.Where(x => x.Id == newsId).FirstOrDefault();
                appDbContext.News.Remove(news);
                await appDbContext.SaveChangesAsync();

                return Ok(newsId);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

    }
}
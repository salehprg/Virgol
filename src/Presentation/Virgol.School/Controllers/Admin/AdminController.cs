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
                string userIdnumber = userManager.GetUserId(User);
                int userId = appDbContext.Users.Where(x => x.MelliCode == userIdnumber).FirstOrDefault().Id;
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


#region News
        [HttpGet]
        [ProducesResponseType(typeof(List<NewsModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetNews()
        {
            try
            {
                string IdNumber = userManager.GetUserId(User);
                int userId = appDbContext.Users.Where(x => x.MelliCode == IdNumber).FirstOrDefault().Id;

                List<NewsModel> myNews = appDbContext.News.Where(x => x.AutherId == userId).ToList();

                foreach (var news in myNews)
                {
                    List<string> tags = news.Tags.Split(",").ToList();

                    news.tagsStr = tags;
                }

                return Ok(myNews);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
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
                string accessStr = "";
                foreach (var access in model.AccessRoleIdList)
                {
                    accessStr += access + ",";
                }

                newsModel.AccessRoleId = accessStr;
                string IdNumber = userManager.GetUserId(User);
                int userId = appDbContext.Users.Where(x => x.MelliCode == IdNumber).FirstOrDefault().Id;

                newsModel.AutherId = userId;
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
        [ProducesResponseType(typeof(NewsModel), 200)]
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

                return Ok(newsModel);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [ProducesResponseType(typeof(NewsModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> RemoveNews([FromBody]int newsId)
        {
            try
            {
                NewsModel news = appDbContext.News.Where(x => x.Id == newsId).FirstOrDefault();
                appDbContext.News.Remove(news);
                await appDbContext.SaveChangesAsync();

                return Ok(news);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

#endregion

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
        public async Task<IActionResult> AddNewManager([FromBody]UserModel model)
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

                    SchoolModel school = appDbContext.Schools.Where(x => x.Id == model.SchoolId).FirstOrDefault();

                    if(school != null)
                    {
                        school.ManagerId = userManager.FindByNameAsync(manager.UserName).Result.Id;
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
        public IActionResult EditManager([FromBody]ManagerData model)
        {
            try
            {
                
                SchoolModel oldSchool = new SchoolModel();
                oldSchool = appDbContext.Schools.Where(x => x.ManagerId == model.Id).FirstOrDefault();
                
                SchoolModel newSchool = new SchoolModel();
                newSchool = appDbContext.Schools.Where(x => x.Id == model.schoolId).FirstOrDefault();

                if(oldSchool != null && model.SchoolId != 0)
                {
                    oldSchool.ManagerId = -1;
                    appDbContext.Schools.Update(oldSchool);
                }

                if(newSchool != null && model.SchoolId != 0)
                {
                    newSchool.ManagerId = model.Id;
                    appDbContext.Schools.Update(newSchool);
                }

            
                appDbContext.Users.Update(model);
                
                appDbContext.SaveChanges();

                return Ok((UserModel)model);
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
        public IActionResult RemoveManager([FromBody]int managerId)
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
                
                return Ok(manager);
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
        [ProducesResponseType(typeof(List<StudyFieldModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetSchoolInfo(int schoolId)
        {
            try
            {
                List<School_BasesVW> bases = new List<School_BasesVW>();
                foreach (var basee in appDbContext.School_Bases.Where(x => x.School_Id == schoolId).ToList())
                {
                    var serializedParent = JsonConvert.SerializeObject(basee); 
                    School_BasesVW basesVW  = JsonConvert.DeserializeObject<School_BasesVW>(serializedParent);

                    basesVW.BaseName = appDbContext.Bases.Where(x => x.Id == basee.Base_Id).FirstOrDefault().BaseName;

                    bases.Add(basesVW);
                }

                List<School_StudyFieldsVW> studies = new List<School_StudyFieldsVW>();
                foreach (var studyF in appDbContext.School_StudyFields.Where(x => x.School_Id == schoolId).ToList())
                {
                    var serializedParent = JsonConvert.SerializeObject(studyF); 
                    School_StudyFieldsVW studyField  = JsonConvert.DeserializeObject<School_StudyFieldsVW>(serializedParent);

                    studyField.StudyFieldName = appDbContext.StudyFields.Where(x => x.Id == studyF.StudyField_Id).FirstOrDefault().StudyFieldName;

                    studies.Add(studyField);
                }

                List<School_GradesVW> grades = new List<School_GradesVW>();
                foreach (var grade in appDbContext.School_Grades.Where(x => x.School_Id == schoolId).ToList())
                {
                    var serializedParent = JsonConvert.SerializeObject(grade); 
                    School_GradesVW gradeVW  = JsonConvert.DeserializeObject<School_GradesVW>(serializedParent);

                    gradeVW.GradeName = appDbContext.Grades.Where(x => x.Id == grade.Grade_Id).FirstOrDefault().GradeName;

                    grades.Add(gradeVW);
                }

                SchoolModel schoolModel = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault();

                return Ok(new{
                    bases,
                    studies,
                    grades,
                    schoolModel
                });
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<SchoolModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetSchools()
        {
            try
            {
                string userIdnumber = userManager.GetUserId(User);
                int userId = appDbContext.Users.Where(x => x.MelliCode == userIdnumber).FirstOrDefault().Id;
                AdminDetail adminModel = appDbContext.AdminDetails.Where(x => x.UserId == userId).FirstOrDefault();

                return Ok(appDbContext.Schools.Where(x => x.SchoolType == adminModel.SchoolsType).ToList());
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
        public async Task<IActionResult> AddNewSchool([FromBody]SchoolData inputData)
        {
            SchoolModel newSchool = inputData.schoolModel;
            try
            {
                int schoolMoodleId = await moodleApi.CreateCategory(newSchool.SchoolName , 0);

                if(schoolMoodleId != -1)
                {
                    newSchool.Moodle_Id = schoolMoodleId;

                    SchoolDataHelper schoolDataHelper = new SchoolDataHelper(appSettings , appDbContext);
                    CreateSchoolResult schoolResult = await schoolDataHelper.CreateSchool_Grade(inputData.BaseIds , inputData.StudyFieldIds , inputData.GradeIds , schoolMoodleId);

                    appDbContext.Schools.Add(newSchool);
                    appDbContext.SaveChanges();

                    newSchool.Id = appDbContext.Schools.OrderByDescending(x => x.Id).FirstOrDefault().Id;

                    foreach(var schGrade in schoolResult.school_Grades)
                    {
                        schGrade.School_Id = newSchool.Id;
                    }
                    foreach(var schStudyF in schoolResult.school_StudyFields)
                    {
                        schStudyF.School_Id = newSchool.Id;
                    }
                    foreach(var schBase in schoolResult.school_Bases)
                    {
                        schBase.School_Id = newSchool.Id;
                    }

                    appDbContext.School_Bases.AddRange(schoolResult.school_Bases);
                    appDbContext.School_Grades.AddRange(schoolResult.school_Grades);
                    appDbContext.School_StudyFields.AddRange(schoolResult.school_StudyFields);

                    appDbContext.SaveChanges();

                    return Ok(newSchool);
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
        public async Task<IActionResult> EditSchool([FromBody]SchoolData inputData)
        {
            try
            {
                SchoolModel schoolInfo = appDbContext.Schools.Where(x => x.Id == inputData.schoolModel.Id).FirstOrDefault();

                List<School_Bases> previousBases = appDbContext.School_Bases.Where(x => x.School_Id == schoolInfo.Id).ToList();
                List<School_StudyFields> previousStudyF = appDbContext.School_StudyFields.Where(x => x.School_Id == schoolInfo.Id).ToList();
                List<School_Grades> previousGrades = appDbContext.School_Grades.Where(x => x.School_Id == schoolInfo.Id).ToList();

                //Check for add new Base->StudyField->Grade
                foreach (var newBaseId in inputData.BaseIds)
                {
                    if(previousBases.Where(x => x.Base_Id == newBaseId).FirstOrDefault() != null)
                    {
                        //Remove same
                        previousBases.Remove(previousBases.Where(x => x.Id == newBaseId).FirstOrDefault());
                        inputData.BaseIds.Remove(newBaseId);
                    }
                }

                foreach (var newStudyFId in inputData.StudyFieldIds)
                {
                    if(previousStudyF.Where(x => x.StudyField_Id == newStudyFId).FirstOrDefault() != null)
                    {
                        //Remove same
                        previousStudyF.Remove(previousStudyF.Where(x => x.Id == newStudyFId).FirstOrDefault());
                        inputData.StudyFieldIds.Remove(newStudyFId);
                    }
                }

                foreach (var newGradeId in inputData.GradeIds)
                {
                    if(previousGrades.Where(x => x.Grade_Id == newGradeId).FirstOrDefault() != null)
                    {
                        //Remove same
                        previousGrades.Remove(previousGrades.Where(x => x.Id == newGradeId).FirstOrDefault());
                        inputData.BaseIds.Remove(newGradeId);
                    }
                }

                //Create new data
                SchoolDataHelper schoolDataHelper = new SchoolDataHelper(appSettings , appDbContext);
                await schoolDataHelper.CreateSchool_Grade(inputData.BaseIds , inputData.StudyFieldIds , inputData.GradeIds , schoolInfo.Moodle_Id);
                
                //Remove deleted data from moodle
                foreach (var prBase in previousBases)
                {
                    await moodleApi.DeleteCategory(prBase.Moodle_Id);
                }
                foreach (var prStudyF in previousStudyF)
                {
                    await moodleApi.DeleteCategory(prStudyF.Moodle_Id);
                }
                foreach (var prGrade in previousGrades)
                {
                    await moodleApi.DeleteCategory(prGrade.Moodle_Id);
                }

                appDbContext.School_Bases.RemoveRange(previousBases);
                appDbContext.School_StudyFields.RemoveRange(previousStudyF);
                appDbContext.School_Grades.AddRange(previousGrades);

                appDbContext.SaveChanges();
                

                return Ok("مدرسه با موفقیت ویرایش شد");
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
                SchoolModel school = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault();

                bool removeCat = await moodleApi.DeleteCategory(school.Moodle_Id);

                if(removeCat)
                {
    
                    appDbContext.School_Bases.RemoveRange(appDbContext.School_Bases.Where(x => x.School_Id == school.Id).ToList());
                    appDbContext.School_StudyFields.RemoveRange(appDbContext.School_StudyFields.Where(x => x.School_Id == school.Id).ToList());
                    appDbContext.School_Grades.RemoveRange(appDbContext.School_Grades.Where(x => x.School_Id == school.Id).ToList());
                    appDbContext.School_Classes.RemoveRange(appDbContext.School_Classes.Where(x => x.School_Id == school.Id).ToList());
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
    
#region Bases

        [HttpGet]
        [ProducesResponseType(typeof(List<BaseModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetBases()
        {
            try
            {
                return Ok(appDbContext.Bases.ToList());
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }


        // [HttpPut]
        // [ProducesResponseType(typeof(SchoolModel), 200)]
        // [ProducesResponseType(typeof(string), 400)]
        // public async Task<IActionResult> AddNewBase([FromBody]BaseModel model)
        // {
        //     BaseModel newBase = model;
        //     try
        //     {
        //         appDbContext.Bases.Add(newBase);
        //         await appDbContext.SaveChangesAsync();

        //         return Ok(appDbContext.Bases.OrderByDescending(x => x.Id).FirstOrDefault());
        //     }
        //     catch(Exception ex)
        //     {
        //         //await userManager.DeleteAsync(newSchool);
        //         return BadRequest(ex.Message);
        //     }
        // }


        // [HttpPost]
        // [ProducesResponseType(typeof(bool), 200)]
        // [ProducesResponseType(typeof(string), 400)]
        // public async Task<IActionResult> EditBase([FromBody]BaseModel model)
        // {
        //     try
        //     {
        //         if(model.Id != 0)
        //         {
        //             appDbContext.Bases.Update(model);
        //             await appDbContext.SaveChangesAsync();

        //             return Ok(true);
        //         }

        //         return BadRequest("مقطعی انتخاب نشده است");
        //     }
        //     catch(Exception ex)
        //     {
        //         //await userManager.DeleteAsync(newSchool);
        //         return BadRequest(ex.Message);
        //     }
        // }

        // [HttpDelete]
        // [ProducesResponseType(typeof(bool), 200)]
        // [ProducesResponseType(typeof(string), 400)]
        // public async Task<IActionResult> RemoveBase([FromBody]int baseId)
        // {
        //     try
        //     {
        //         BaseModel baseModel = appDbContext.Bases.Where(x => x.Id == baseId).FirstOrDefault();

        //         appDbContext.Bases.Remove(baseModel);
        //         await appDbContext.SaveChangesAsync();

        //         return Ok(true);
        //     }
        //     catch(Exception ex)
        //     {
        //         //await userManager.DeleteAsync(newSchool);
        //         return BadRequest(ex.Message);
        //     }
        // }

#endregion
    
#region StudyFields

        [HttpGet]
        [ProducesResponseType(typeof(List<StudyFieldModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetStudyFields(int BaseId)
        {
            try
            {
                if(BaseId != -1)
                {
                    return Ok(appDbContext.StudyFields.Where(x => x.Base_Id == BaseId).ToList().Take(15));
                }
                return Ok(appDbContext.StudyFields.ToList());
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }


#endregion
   
#region Grade

        [HttpGet]
        [ProducesResponseType(typeof(List<StudyFieldModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetGrade(int StudyFieldId)
        {
            try
            {
                return Ok(appDbContext.Grades.Where(x => x.StudyField_Id == StudyFieldId).ToList().Take(15));
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }


#endregion
   
#region Lessons

        [HttpGet]
        [ProducesResponseType(typeof(List<LessonModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetLessons(int gradeId)
        {
            try
            {
                return Ok(appDbContext.Lessons.Where(x => x.Grade_Id == gradeId).ToList().Take(20));
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
        
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

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = "Administrator,Admin")]
    public class AdministratorController : ControllerBase
    {
        private readonly AppSettings appSettings;
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;
        private readonly SignInManager<UserModel> signInManager;
        private readonly AppDbContext appDbContext;

        MoodleApi moodleApi;
        FarazSmsApi SMSApi;
        public AdministratorController(UserManager<UserModel> _userManager 
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

#region Functions
        ///<param name="CategoryId">
        ///Default is set to -1 and if Used this methode to add Student this property should set to Category Id
        ///</param>
        ///<param name="userTypeId">
        ///Set userTypeId from UserType class Teacher,Student,...
        ///</param>
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> CreateBulkBase(string fileName)
        {
            //Username and password Default is MelliCode

            //1 - Read data from excel
            //2 - Check valid data
            //3 - Add Base to Database

            List<string> errors = new List<string>();

            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            using (var stream = System.IO.File.Open(fileName, FileMode.Open, FileAccess.Read))
            {
                using (var excelData = ExcelReaderFactory.CreateReader(stream))
                {
                    excelData.Read(); //Ignore column header name

                    List<BaseModel> excelBases = new List<BaseModel>();
                    List<StudyFieldModel> excelStudies = new List<StudyFieldModel>();
                    List<GradeModel> excelGrades = new List<GradeModel>();
                    List<LessonModel> excelLessons = new List<LessonModel>();


                    while (excelData.Read()) //Each row of the file
                    {
                        
                        try
                        {
                            BaseModel currentBase = new BaseModel
                            {
                                CodeBase = excelData.GetValue(0).ToString(),
                                BaseName = excelData.GetValue(1).ToString()
                            };

                            //check if Duplicate ignore it otherwise , add it to List
                            if(excelBases.Where(x => x.CodeBase == currentBase.CodeBase).FirstOrDefault() == null)
                            {
                                excelBases.Add(currentBase);
                            }

                            StudyFieldModel currentStudyF = new StudyFieldModel
                            {
                                NM_CodeBase = currentBase.CodeBase,
                                CodeStudyField = int.Parse(excelData.GetValue(2).ToString()),
                                StudyFieldName = excelData.GetValue(3).ToString()
                            };

                            if(excelStudies.Where(x => x.CodeStudyField == currentStudyF.CodeStudyField).FirstOrDefault() == null)
                            {
                                excelStudies.Add(currentStudyF);
                            }

                            GradeModel currentgrade = new GradeModel
                            {
                                NM_CodeStudyField = currentStudyF.CodeStudyField,
                                CodeGrade = int.Parse(excelData.GetValue(4).ToString()),
                                GradeName ="پایه " + excelData.GetValue(4).ToString()
                            };

                            if(excelGrades.Where(x => x.CodeGrade == currentgrade.CodeGrade && x.NM_CodeStudyField == currentgrade.NM_CodeStudyField).FirstOrDefault() == null)
                            {
                                excelGrades.Add(currentgrade);
                            }

                            LessonModel currentLesson = new LessonModel
                            {
                                LessonCode = excelData.GetValue(7).ToString(),
                                OrgLessonName = excelData.GetValue(8).ToString(),
                                LessonName = excelData.GetValue(9).ToString(),
                                NM_CodeGrade = currentgrade.CodeGrade,
                                NM_CodeStudyField = currentStudyF.CodeStudyField,
                                Vahed = int.Parse(excelData.GetValue(10).ToString())
                            };


                            //Check for duplicate
                            if(excelLessons.Where(x => x.NM_CodeGrade == currentLesson.NM_CodeGrade && x.NM_CodeStudyField == currentLesson.NM_CodeStudyField && x.LessonCode == currentLesson.LessonCode).FirstOrDefault() == null)
                            {
                                excelLessons.Add(currentLesson);
                            }
                        }
                        catch (Exception ex)
                        {
                            errors.Add(ex.Message);
                        }
                    }
                    
                    List<BaseModel> dbBases = appDbContext.Bases.ToList();
                    List<BaseModel> newBases = new List<BaseModel>();

                    foreach (var basee in excelBases)
                    {
                        //Remove duplicate data in first list from second List
                        if(dbBases.Where(x => x.CodeBase == basee.CodeBase).FirstOrDefault() == null)
                        {
                            newBases.Add(basee);
                        }
                    }

                    await appDbContext.Bases.AddRangeAsync(newBases);
                    await appDbContext.SaveChangesAsync();

                    dbBases = appDbContext.Bases.ToList();
                    foreach (var basee in dbBases)
                    {

                        List<StudyFieldModel> editedStudyF = excelStudies.Where(x => x.NM_CodeBase == basee.CodeBase).ToList();
                        editedStudyF.ForEach(x => x.Base_Id = basee.Id);

                        List<StudyFieldModel> dbStudies = appDbContext.StudyFields.ToList();
                        List<StudyFieldModel> newStudies = new List<StudyFieldModel>();

                        foreach (var study in editedStudyF)
                        {
                            //Remove duplicate data in first list from second List
                            if(dbStudies.Where(x => x.CodeStudyField == study.CodeStudyField).FirstOrDefault() == null)
                            {
                                newStudies.Add(study);
                            }
                        }

                        await appDbContext.StudyFields.AddRangeAsync(newStudies);
                        await appDbContext.SaveChangesAsync();

                        dbStudies = appDbContext.StudyFields.Where(x => x.Base_Id == basee.Id).ToList();
                        foreach (var studyF in dbStudies)
                        {
                            int studyFId = studyF.Id;

                            List<GradeModel> editedGrades = excelGrades.Where(x => x.NM_CodeStudyField == studyF.CodeStudyField).ToList();
                            editedGrades.ForEach(x => x.StudyField_Id = studyFId);

                            List<GradeModel> dbGrades = appDbContext.Grades.ToList();
                            List<GradeModel> newGrades = new List<GradeModel>();

                            foreach (var grade in editedGrades)
                            {
                                //Remove duplicate data in first list from second List
                                if(dbGrades.Where(x => x.CodeGrade == grade.CodeGrade && x.StudyField_Id == studyFId).FirstOrDefault() == null)
                                {
                                    newGrades.Add(grade);
                                }
                            }

                            await appDbContext.Grades.AddRangeAsync(newGrades);
                            await appDbContext.SaveChangesAsync();

                            dbGrades = appDbContext.Grades.Where(x => x.StudyField_Id == studyFId).ToList();
                            foreach (var grade in dbGrades)
                            {
                                int gradeId = grade.Id;

                                List<LessonModel> editedLessons = excelLessons.Where(x => x.NM_CodeGrade == grade.CodeGrade && x.NM_CodeStudyField == studyF.CodeStudyField).ToList();
                                editedLessons.ForEach(x => x.Grade_Id = gradeId);

                                List<LessonModel> dbLessons = appDbContext.Lessons.ToList();
                                List<LessonModel> newLessons = new List<LessonModel>();

                                foreach (var lesson in editedLessons)
                                {
                                    //Remove duplicate data in first list from second List
                                    if(dbLessons.Where(x => x.Grade_Id == grade.Id).FirstOrDefault() == null)
                                    {
                                        newLessons.Add(lesson);
                                    }
                                }

                                await appDbContext.Lessons.AddRangeAsync(newLessons);
                                await appDbContext.SaveChangesAsync();
                            }
                        }
                    }
                }
            }
            

            return Ok(true);
        }


        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<bool> UploadFile(IFormFile file , string FileName)
        {
            bool result = false;

            if (file != null)
            {
                if (file.Length > 0)
                {
                    string path = Path.Combine(Request.Host.Value, FileName);

                    var fs = new FileStream(Path.Combine("BulkData", FileName), FileMode.Create);
                    await file.CopyToAsync(fs);
                    fs.Close();
                    result = true;
                }
            }

            return result;
        }

#endregion

#region BulkData
        [HttpPost]
        [ProducesResponseType(typeof(List<string>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddBulkLessonInfo([FromForm]IFormCollection Files )
        {
            try
            {
                //Username and password Default is MelliCode

                //1 - Read data from excel
                //2 - Check valid data
                //3 - Add user to Database
                //3.1 - don't add duplicate username 

                bool FileOk = await UploadFile(Files.Files[0] , "BulkLesson.xlsx");

                if(FileOk)
                {
                    var errors = await CreateBulkBase("Bulkdata\\BulkLesson.xlsx");
                    return Ok(errors);
                }

                return BadRequest("آپلود فایل با مشکل مواجه شد");
                
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

#endregion

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

                return Ok(appDbContext.News.Where(x => x.AutherId == userId).ToList());
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
        [ProducesResponseType(typeof(SchoolModel), 200)]
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
                    studentsCount += appDbContext.Users.Where(x => x.SchoolId == school.Id && x.userTypeId == (int)UserType.Student).Count();
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


        [HttpPut]
        [ProducesResponseType(typeof(SchoolModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddNewBase([FromBody]BaseModel model)
        {
            BaseModel newBase = model;
            try
            {
                appDbContext.Bases.Add(newBase);
                await appDbContext.SaveChangesAsync();

                return Ok(appDbContext.Bases.OrderByDescending(x => x.Id).FirstOrDefault());
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
        public async Task<IActionResult> EditBase([FromBody]BaseModel model)
        {
            try
            {
                if(model.Id != 0)
                {
                    appDbContext.Bases.Update(model);
                    await appDbContext.SaveChangesAsync();

                    return Ok(true);
                }

                return BadRequest("مقطعی انتخاب نشده است");
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
        public async Task<IActionResult> RemoveBase([FromBody]int baseId)
        {
            try
            {
                BaseModel baseModel = appDbContext.Bases.Where(x => x.Id == baseId).FirstOrDefault();

                appDbContext.Bases.Remove(baseModel);
                await appDbContext.SaveChangesAsync();

                return Ok(true);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

#endregion
    
#region StudyFields

        [HttpGet]
        [ProducesResponseType(typeof(List<StudyFieldModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetStudyFields([FromBody] int BaseId = -1)
        {
            try
            {
                if(BaseId != -1)
                {
                    return Ok(appDbContext.StudyFields.Where(x => x.Base_Id == BaseId).ToList());
                }
                return Ok(appDbContext.StudyFields.ToList());
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }


        [HttpPut]
        [ProducesResponseType(typeof(StudyFieldModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddNewStudyFields([FromBody]StudyFieldModel model)
        {
            StudyFieldModel newStudyF = model;
            try
            {
                appDbContext.StudyFields.Add(newStudyF);
                await appDbContext.SaveChangesAsync();

                return Ok(appDbContext.StudyFields.OrderByDescending(x => x.Id).FirstOrDefault());
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
        public IActionResult EditStudyFields([FromBody]StudyFieldModel model)
        {
            try
            {
                StudyFieldModel study = appDbContext.StudyFields.Where(x => x.Id == model.Id).FirstOrDefault();

                if(study != null)
                {
                    study.Base_Id = (model.Base_Id != 0 ? model.Base_Id : study.Base_Id);
                    study.StudyFieldName = (model.StudyFieldName != "" ? model.StudyFieldName : study.StudyFieldName);

                    appDbContext.StudyFields.Update(model);
                    appDbContext.SaveChanges();

                    return Ok(true);
                }

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
        public async Task<IActionResult> RemoveStudyFields([FromBody]int studyFId)
        {
            try
            {
                StudyFieldModel studyFModel = appDbContext.StudyFields.Where(x => x.Id == studyFId).FirstOrDefault();

                appDbContext.StudyFields.Remove(studyFModel);
                await appDbContext.SaveChangesAsync();

                return Ok(true);
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
        public IActionResult GetGrade()
        {
            try
            {
                return Ok(appDbContext.Grades.ToList());
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }


        [HttpPut]
        [ProducesResponseType(typeof(GradeModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddNewGrades([FromBody]GradeModel model)
        {
            GradeModel newStudyF = model;
            try
            {
                if(appDbContext.Grades.Where(x => x.GradeName == model.GradeName).FirstOrDefault() == null)
                {
                    appDbContext.Grades.Add(newStudyF);
                    await appDbContext.SaveChangesAsync();

                    return Ok(appDbContext.Grades.OrderByDescending(x => x.Id).FirstOrDefault());
                }
                return BadRequest("نام انتخابی برای پایه تکراری است");
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
        public IActionResult EditGrades([FromBody]GradeModel model)
        {
            try
            {
                GradeModel grade = appDbContext.Grades.Where(x => x.Id == model.Id).FirstOrDefault();

                if(grade != null && appDbContext.Grades.Where(x => x.GradeName == model.GradeName).FirstOrDefault() == null)
                {
                    grade.GradeName = (model.GradeName != "" ? model.GradeName : grade.GradeName);
                    grade.StudyField_Id = (model.StudyField_Id != 0 ? model.StudyField_Id : grade.StudyField_Id);

                    appDbContext.Grades.Update(grade);
                    appDbContext.SaveChanges();

                    return Ok(true);
                }

                 return BadRequest("پایه ای انتخاب نشده است");
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
        public async Task<IActionResult> RemoveGrades([FromBody]int studyFId)
        {
            try
            {
                GradeModel studyFModel = appDbContext.Grades.Where(x => x.Id == studyFId).FirstOrDefault();

                appDbContext.Grades.Remove(studyFModel);
                await appDbContext.SaveChangesAsync();

                return Ok(true);
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
        public IActionResult GetLessons()
        {
            try
            {
                return Ok(appDbContext.Lessons.ToList());
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }


        [HttpPut]
        [ProducesResponseType(typeof(LessonModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddNewLessons([FromBody]LessonModel model)
        {
            LessonModel newStudyF = model;
            try
            {
                appDbContext.Lessons.Add(newStudyF);
                await appDbContext.SaveChangesAsync();

                return Ok(appDbContext.Lessons.OrderByDescending(x => x.Id).FirstOrDefault());
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
        public IActionResult EditLessons([FromBody]LessonModel model)
        {
            try
            {
                LessonModel lesson = appDbContext.Lessons.Where(x => x.Id == model.Id).FirstOrDefault();

                if(lesson != null)
                {
                    lesson.LessonCode = (model.LessonCode != "" ? model.LessonCode : lesson.LessonCode);
                    lesson.Grade_Id = (model.Grade_Id != 0 ? model.Grade_Id : lesson.Grade_Id);
                    lesson.LessonName = (model.LessonName != "" ? model.LessonName : lesson.LessonName);
                    lesson.Vahed = (model.Vahed != 0 ? model.Vahed : lesson.Vahed);

                    appDbContext.Lessons.Update(lesson);
                    appDbContext.SaveChanges();

                    return Ok(true);
                }

                return BadRequest("درسی انتخاب نشده است");
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
        public async Task<IActionResult> RemoveLessons([FromBody]int studyFId)
        {
            try
            {
                LessonModel studyFModel = appDbContext.Lessons.Where(x => x.Id == studyFId).FirstOrDefault();

                appDbContext.Lessons.Remove(studyFModel);
                await appDbContext.SaveChangesAsync();

                return Ok(true);
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
        
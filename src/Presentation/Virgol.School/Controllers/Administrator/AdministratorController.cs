using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

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
using static SchoolService;
using ExcelDataReader;
using Models.Users.Teacher;
using Newtonsoft.Json;

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = "Administrator,Admin")]
    public class AdministratorController : ControllerBase
    {
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;
        private readonly SignInManager<UserModel> signInManager;
        private readonly AppDbContext appDbContext;
        private readonly AppDbContextBackup appDbContextBackup;
        

        SchoolService schoolService;
        ClassScheduleService scheduleService;
        ManagerService managerService;
        FarazSmsApi SMSApi;
        public AdministratorController(UserManager<UserModel> _userManager 
                                , SignInManager<UserModel> _signinManager
                                , RoleManager<IdentityRole<int>> _roleManager
                                , AppDbContext _appdbContext , AppDbContextBackup _appDBBackup)
        {
            userManager = _userManager;
            roleManager = _roleManager;
            signInManager =_signinManager;
            appDbContext = _appdbContext;
            appDbContextBackup = _appDBBackup;

            //MoodleApi moodleApi = new MoodleApi();
            SMSApi = new FarazSmsApi();
            schoolService = new SchoolService(appDbContext);
            //scheduleService = new ClassScheduleService(appDbContext , moodleApi);
            scheduleService = new ClassScheduleService(appDbContext);
            managerService = new ManagerService(appDbContext);
        }

#region Admin
        [HttpGet]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetAdmins()
        {
            try
            {
                return Ok(appDbContext.Users.Where(x => x.userTypeId == (int)UserType.Admin).ToList());
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
        public async Task<IActionResult> AddAdmin([FromBody]Admin_InputData model , string userName , string password)
        {
            UserModel newAdmin = model;
            try
            {   
                if(userName == null)
                {
                    newAdmin.UserName = model.MelliCode;
                }
                else
                {
                    newAdmin.UserName = userName;
                }

                if(password == null)
                {
                    password = model.MelliCode;
                }

                newAdmin.userTypeId = (int)UserType.Admin;
                newAdmin.ConfirmedAcc = true;
                IdentityResult result = await userManager.CreateAsync(newAdmin , password);

                if(result.Succeeded)
                {
                    newAdmin.Id = (await userManager.FindByNameAsync(newAdmin.UserName)).Id;
                    await userManager.AddToRolesAsync(newAdmin , new string[]{"User" , "Admin"});
                    
                    AdminDetail adminDetail = new AdminDetail();
                    adminDetail.UserId = newAdmin.Id;
                    adminDetail.SchoolsType = model.schoolType;
                    adminDetail.SchoolLimit = model.schoolLimit;

                    appDbContext.AdminDetails.Add(adminDetail);
                    appDbContext.SaveChanges();
                }
                else
                {
                    return BadRequest(result.Errors);
                }

                return Ok(newAdmin);
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
        public IActionResult EditAdmin([FromBody]Admin_InputData model)
        {
            try
            {
                UserModel admin = new UserModel();
                if(model.Id != 0)
                {
                    admin = appDbContext.Users.Where(x => x.Id == model.Id).FirstOrDefault();
                    AdminDetail adminDetail_DbData = appDbContext.AdminDetails.Where(x => x.UserId == admin.Id).FirstOrDefault();

                    admin.FirstName = (model.FirstName == null ? admin.FirstName : model.FirstName);
                    admin.LastName = (model.LastName == null ? admin.LastName : model.LastName);
                    admin.PhoneNumber = (admin.PhoneNumber == null ? admin.PhoneNumber : model.PhoneNumber);
                    admin.MelliCode = (admin.MelliCode == null ? admin.MelliCode : model.MelliCode);
                    
                    AdminDetail adminDetail = new AdminDetail();
                    adminDetail.UserId = admin.Id;
                    adminDetail.SchoolsType = (model.schoolType != 0 ? model.schoolType : adminDetail_DbData.SchoolsType);
                    adminDetail.SchoolLimit = (model.schoolLimit != 0 ? model.schoolLimit : adminDetail_DbData.SchoolLimit);

                    appDbContext.Users.Update(admin);
                    appDbContext.AdminDetails.Update(adminDetail);
                    appDbContext.SaveChanges();
                }
                else
                {
                    return BadRequest("اید مدیرکل به درستی وارد نشده است");
                }

                return Ok(admin);
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
        public async Task<IActionResult> RemoveAdmin(int adminId)
        {
            try
            {
                await userManager.DeleteAsync(appDbContext.Users.Where(x => x.Id == adminId).FirstOrDefault());

                AdminDetail adminDetail = appDbContext.AdminDetails.Where(x => x.UserId == adminId).FirstOrDefault();

                appDbContext.AdminDetails.Remove(adminDetail);
                appDbContext.SaveChanges();

                return Ok(true);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

#endregion

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
     
#region Sync Data   

    public class RestoreScheduleModel
    {
        public int oldId {get; set;}
        public int newId {get; set;}
    }
    public async Task<IActionResult> RestoreClassData(int classId)
    {
        try
        {
            School_Class school_Class = appDbContextBackup.School_Classes.Where(x => x.Id == classId).FirstOrDefault();

            List<School_studentClass> studentClasses = appDbContextBackup.School_StudentClasses.Where(x => x.ClassId == classId).ToList();

            SchoolModel schoolModel = appDbContext.Schools.Where(x => x.Id == school_Class.School_Id).FirstOrDefault();

            ClassData classData = new ClassData();
            classData.ClassName = school_Class.ClassName;
            classData.gradeId = school_Class.Grade_Id;
            
            
            // //First create Class
            School_Class newSchoolClass = await schoolService.AddClass(classData , schoolModel);

            // //Add Schedules To Class
            List<Class_WeeklySchedule> classSchedules = appDbContextBackup.ClassWeeklySchedules.Where(x => x.ClassId == classId).ToList();
            List<RestoreScheduleModel> restoreSchedules = new List<RestoreScheduleModel>();

            foreach (var schedule in classSchedules)
            {
                RestoreScheduleModel restoreSchedule = new RestoreScheduleModel();
                restoreSchedule.oldId = schedule.Id;

                schedule.ClassId = newSchoolClass.Id;
                UserModel oldTeacher = appDbContext.Users.Where(x => x.Id == schedule.TeacherId).FirstOrDefault();

                if(oldTeacher != null)
                {
                    Class_WeeklySchedule classSchedule = await scheduleService.AddClassSchedule(schedule);

                    if(classSchedule != null)
                    {
                        restoreSchedule.newId = classSchedule.Id;

                        restoreSchedules.Add(restoreSchedule);
                    }
                }
            }

            // //Add Students To Class
            // List<School_studentClass> studentClasses = appDbContextBackup.School_StudentClasses.Where(x => x.ClassId == classId).ToList();

            List<UserModel> result = new List<UserModel>();
            foreach(var student in studentClasses)
            {
                UserModel studentModel = appDbContext.Users.Where(x => x.Id == student.UserId).FirstOrDefault();

                if(studentModel != null)
                {
                    result.Add(studentModel);
                }
            }

            bool assign = await managerService.AssignUsersToClass(result , newSchoolClass.Id);
        
            return Ok(true);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            Console.WriteLine(ex.Message);
            return BadRequest(ex.Message);
            throw;
        }
    }

    public async Task<bool> SyncMoodleLDAP()
    {
        UserService UserService = new UserService(userManager , appDbContext);
        return await UserService.SyncUserData(appDbContext.Users.ToList());
    }

    public async Task<IActionResult> RecreateMoodle()
    {
        List<AdminDetail> adminDetails = appDbContext.AdminDetails.ToList();

        MoodleApi moodleApi = new MoodleApi();
        
        foreach (var detail in adminDetails)
        {
            int adminCatId = await moodleApi.CreateCategory(detail.TypeName);
            detail.orgMoodleId = adminCatId;

            List<SchoolModel> schools = appDbContext.Schools.Where(x => x.SchoolType == detail.SchoolsType).ToList();

            foreach (var school in schools)
            {
                int schoolId = await moodleApi.CreateCategory(school.SchoolName , adminCatId);
                school.Moodle_Id = schoolId;

                List<School_Bases> baseModels = appDbContext.School_Bases.Where(x => x.School_Id == school.Id).ToList();
                foreach (var baseModel in baseModels)
                {
                    string baseName = appDbContext.Bases.Where(x => x.Id == baseModel.Base_Id).FirstOrDefault().BaseName;
                    int baseId = await moodleApi.CreateCategory(baseName , schoolId);
                    baseModel.Moodle_Id = baseId;

                    List<School_StudyFields> schoolStudyFields = appDbContext.School_StudyFields.Where(x => x.School_Id == school.Id).ToList();
                    List<StudyFieldModel> studyFields = appDbContext.StudyFields.Where(x => x.Base_Id == baseModel.Base_Id).ToList();
                    foreach (var schoolStudyF in schoolStudyFields)
                    {
                        StudyFieldModel studyField = studyFields.Where(x => x.Id == schoolStudyF.StudyField_Id).FirstOrDefault();
                        if(studyField != null)
                        {
                            int studyFId = await moodleApi.CreateCategory(studyField.StudyFieldName , baseId);
                            schoolStudyF.Moodle_Id = studyFId;

                            List<School_Grades> school_Grades = appDbContext.School_Grades.Where(x => x.School_Id == school.Id).ToList();
                            List<GradeModel> gradeModels = appDbContext.Grades.Where(x => x.StudyField_Id == studyField.Id).ToList();
                            foreach (var schollGrade in school_Grades)
                            {
                                GradeModel gradeModel = gradeModels.Where(x => x.Id == schollGrade.Grade_Id).FirstOrDefault();
                                if(gradeModel != null)
                                {
                                    int gradeId = await moodleApi.CreateCategory(gradeModel.GradeName , studyFId);
                                    schollGrade.Moodle_Id = gradeId;

                                    List<School_Class> school_Classes = appDbContext.School_Classes.Where(x => x.School_Id == school.Id && x.Grade_Id == schollGrade.Grade_Id).ToList();
                                    foreach (var schoolClass in school_Classes)
                                    {
                                        int classId = await moodleApi.CreateCategory(schoolClass.ClassName , gradeId);
                                        schoolClass.Moodle_Id = classId;

                                        List<School_Lessons> school_Lessons = appDbContext.School_Lessons.Where(x => x.School_Id == school.Id && x.classId == schoolClass.Id).ToList();
                                        List<LessonModel> lessons = appDbContext.Lessons.Where(x => x.Grade_Id == schollGrade.Grade_Id).ToList();

                                        List<EnrolUser> enrolsData = new List<EnrolUser>();
                                        foreach (var schoolLesson in school_Lessons)
                                        {
                                            LessonModel lesson = lessons.Where(x => x.Id == schoolLesson.Lesson_Id).FirstOrDefault();
                                            if(lesson != null)
                                            {
                                                int moodleId = await moodleApi.CreateCourse(lesson.LessonName + " (" + school.Moodle_Id + "-" + schoolClass.Moodle_Id + ")", lesson.LessonName + " (" + school.SchoolName + "-" + schoolClass.ClassName + ")" , schoolClass.Moodle_Id);
                                                schoolLesson.Moodle_Id = moodleId;

                                                int managerMoodleId = appDbContext.Users.Where(x => x.Id == school.ManagerId).FirstOrDefault().Moodle_Id;
                
                                                EnrolUser enrol = new EnrolUser();
                                                enrol.lessonId = schoolLesson.Moodle_Id;
                                                enrol.UserId = managerMoodleId;
                                                enrol.RoleId = 3;

                                                enrolsData.Add(enrol);
                                            
                                                List<School_studentClass> studentClasses = appDbContext.School_StudentClasses.Where(x => x.ClassId == schoolClass.Id).ToList();
                                                foreach (var student in studentClasses)
                                                {
                                                    int studentMoodleId = appDbContext.Users.Where(x => x.Id == student.UserId).FirstOrDefault().Moodle_Id;

                                                    enrol = new EnrolUser();
                                                    enrol.lessonId = schoolLesson.Moodle_Id;
                                                    enrol.UserId = studentMoodleId;
                                                    enrol.RoleId = 5;

                                                    enrolsData.Add(enrol);
                                                }
                                                    

                                                await moodleApi.AssignUsersToCourse(enrolsData);
                                            }
                                        }

                                        appDbContext.School_Lessons.UpdateRange(school_Lessons);
                                    }

                                    appDbContext.School_Classes.UpdateRange(school_Classes);
                                }
                            }

                            appDbContext.School_Grades.UpdateRange(school_Grades);
                        }
                    }

                    appDbContext.School_StudyFields.UpdateRange(schoolStudyFields);
                }

                appDbContext.School_Bases.UpdateRange(baseModels);
            }

            appDbContext.Schools.UpdateRange(schools);
        }

        appDbContext.AdminDetails.UpdateRange(adminDetails);
        await appDbContext.SaveChangesAsync();
        
        return Ok(true);
    }

    public async Task<bool> SyncUserDetails()
    {
        UserService UserService = new UserService(userManager , appDbContext);

        List<StudentViewModel> studentViews = appDbContext.StudentViews.Where(x => x.BirthDate == null).ToList();

        foreach (var studentView in studentViews)
        {
            UserModel user = appDbContext.Users.Where(x => x.Id == studentView.Id).FirstOrDefault();
            
            var serialized = JsonConvert.SerializeObject(user);
            UserDataModel userData = JsonConvert.DeserializeObject<UserDataModel>(serialized);

            StudentDetail studentDetail = new StudentDetail();
            studentDetail.UserId = studentView.Id;

            userData.studentDetail = studentDetail;
            userData.Id = studentView.Id;

            await UserService.SyncUserDetail(userData);
            
        }

        List<TeacherViewModel> teacherViews = appDbContext.TeacherViews.Where(x => x.SchoolsId == null).ToList();

        foreach (var teacherView in teacherViews)
        {
            UserModel user = appDbContext.Users.Where(x => x.Id == teacherView.Id).FirstOrDefault();

            var serialized = JsonConvert.SerializeObject(user);
            UserDataModel userData = JsonConvert.DeserializeObject<UserDataModel>(serialized);

            TeacherDetail teacherDetail = new TeacherDetail();
            teacherDetail.TeacherId = teacherView.Id;
            
            userData.teacherDetail = teacherDetail;
            userData.Id = teacherView.Id;

            await UserService.SyncUserDetail(userData);
            
        }

        return true;
    }
#endregion
    }
}
        
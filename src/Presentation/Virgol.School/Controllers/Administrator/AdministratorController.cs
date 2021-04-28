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
using Microsoft.AspNetCore.Http;
using System.IO;
using Models.InputModel;
using Models.Users.Roles;
using ExcelDataReader;
using Models.Users.Teacher;
using Newtonsoft.Json;

namespace Virgol.Controllers
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
        private readonly LDAP_db ldap;
        

        SchoolService schoolService;
        ClassScheduleService scheduleService;
        ManagerService managerService;
        UserService UserService;
        AdministratorService administratorService;
        PaymentService PaymentService;
        MoodleApi moodleApi;
        public AdministratorController(UserManager<UserModel> _userManager 
                                , SignInManager<UserModel> _signinManager
                                , RoleManager<IdentityRole<int>> _roleManager
                                , AppDbContext _appdbContext , AppDbContextBackup _appDBBackup
                                , IHttpContextAccessor httpContext)
        {
            userManager = _userManager;
            roleManager = _roleManager;
            signInManager =_signinManager;
            appDbContext = _appdbContext;
            appDbContextBackup = _appDBBackup;

            moodleApi = new MoodleApi(AppSettings.GetValueFromDatabase(appDbContext , "Token_moodle"));

            schoolService = new SchoolService(appDbContext);
            
            scheduleService = new ClassScheduleService(appDbContext , moodleApi);
            //scheduleService = new ClassScheduleService(appDbContext);

            managerService = new ManagerService(appDbContext);
            UserService = new UserService(userManager , appDbContext);
            ldap = new LDAP_db(appDbContext);
            administratorService = new AdministratorService(appDbContext , moodleApi);
            PaymentService = new PaymentService(appDbContext , userManager , httpContext.HttpContext.Request.Host.Value);
        }
#region Users

    public class NewUserInput
    {
        public UserModel userData {get;set;}
        public List<string> roles {get;set;}
        public string password {get;set;}
    }

    [HttpPost]
    public async Task<IActionResult> CreateNewUser([FromBody]NewUserInput userInput)
    {
        try
        {
            foreach (var role in userInput.roles)
            {
                if(await roleManager.FindByNameAsync(role) == null)
                {
                    IdentityRole<int> newRole = new IdentityRole<int>();
                    newRole.Name = role;

                    await roleManager.CreateAsync(newRole);
                }
            }
            
            UserDataModel userDataModel = new UserDataModel();

            var serialized = JsonConvert.SerializeObject(userInput.userData);
            userDataModel = JsonConvert.DeserializeObject<UserDataModel>(serialized);

            List<UserDataModel> results = await UserService.CreateUser(new List<UserDataModel> {userDataModel} , userInput.roles , 0 , userInput.password);

            return Ok(results);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.StackTrace);
            throw;
        }
    }
    public async Task<IActionResult> ChangePassword(string IdNumber , string schoolId , string newPassword)
    {
        try
        {
            if(newPassword.Length < 8)
                return BadRequest("ظول پسورد باید حداقل 8 عدد باشد");

            List<UserModel> users = new List<UserModel>();

            if(!string.IsNullOrEmpty(IdNumber))
            {
                UserModel user = appDbContext.Users.Where(x => x.MelliCode == IdNumber).FirstOrDefault();
                users.Add(user);
            }
            else
            {
                users = appDbContext.Users.Where(x => x.SchoolId == int.Parse(schoolId)).ToList();
            }

            foreach(var user in users)
            {
                if(user != null)
                {
                    string token = await userManager.GeneratePasswordResetTokenAsync(user);
                    IdentityResult chngPassword = await userManager.ResetPasswordAsync(user , token , newPassword);
                    if(chngPassword.Succeeded)
                    {
                        ldap.ChangePassword(user.UserName , newPassword);
                    }
                }
            }

            return Ok(true);
        }
        catch (System.Exception ex)
        {
            return BadRequest(ex.Message);
            throw;
        }
    }

    public async Task<IActionResult> to10Mellicode(int schoolId)
    {
        try
        {
            List<UserModel> users = appDbContext.Users.Where(x => x.SchoolId == schoolId).ToList();
            List<UserModel> incorrectUser = new List<UserModel>();
            List<string> onlyusers = new List<string>();

            foreach(var user in users)
            {
                if(user.MelliCode.Length == 10)
                {
                    //incorrectUser.Add(user);
                    // if(users.Where(x => x.MelliCode == "0" + user.MelliCode).FirstOrDefault() == null)
                    //     onlyusers.Add(user.MelliCode);
                    
                    UserModel userOld = user;
                    userOld.MelliCode = user.MelliCode.Remove(0 , 1);

                    await UserService.DeleteUser(userOld);
                }
            }

        
            return Ok(onlyusers);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
            throw;
        }
    }

#endregion

#region Admin
        [HttpGet]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetAdmins()
        {
            try
            {
                List<UserModel> admins = await UserService.GetUsersInRole(Roles.Admin);
                return Ok(admins);
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

                AdminDetail lastSchoolType = appDbContext.AdminDetails.OrderByDescending(x => x.SchoolsType).FirstOrDefault();
                //newAdmin.UserType = Roles.Admin;
                newAdmin.ConfirmedAcc = true;
                IdentityResult result = await userManager.CreateAsync(newAdmin , password);

                if(result.Succeeded)
                {
                    newAdmin.Id = (await userManager.FindByNameAsync(newAdmin.UserName)).Id;
                    await userManager.AddToRolesAsync(newAdmin , new string[]{"User" , "Admin"});

                    int adminCatId = await moodleApi.CreateCategory(model.SchoolTypeName);

                    AdminDetail adminDetail = new AdminDetail();
                    adminDetail.UserId = newAdmin.Id;
                    adminDetail.SchoolsType = model.schoolType;
                    if(model.schoolType == 0)
                        adminDetail.SchoolsType = lastSchoolType.SchoolsType + 1;

                    adminDetail.TypeName = model.SchoolTypeName;
                    adminDetail.SchoolLimit = model.schoolLimit;
                    adminDetail.orgMoodleId = adminCatId;

                    await appDbContext.AdminDetails.AddAsync(adminDetail);
                    await appDbContext.SaveChangesAsync();
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
        public async Task<IActionResult> EditAdmin([FromBody]Admin_InputData model)
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
                    await appDbContext.SaveChangesAsync();
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
                UserModel userModel = appDbContext.Users.Where(x => x.Id == adminId).FirstOrDefault();

                AdminDetail adminDetail = appDbContext.AdminDetails.Where(x => x.UserId == adminId).FirstOrDefault();
                if(adminDetail != null)
                {
                    await moodleApi.DeleteCategory(adminDetail.orgMoodleId);

                    appDbContext.Schools.RemoveRange(appDbContext.Schools.Where(x => x.SchoolType == adminDetail.SchoolsType).ToList());
                    await appDbContext.SaveChangesAsync();
                }

                await UserService.DeleteUser(userModel);


                return Ok(true);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
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


        [HttpPost]
        [ProducesResponseType(typeof(List<string>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddBulkLessons([FromForm]IFormCollection Files )
        {
            try
            {
                //Username and password Default is MelliCode

                //1 - Read data from excel
                //2 - Check valid data
                //3 - Add user to Database
                //3.1 - don't add duplicate username 

                bool FileOk = await UploadFile(Files.Files[0] , "BulkLessons.xlsx");

                if(FileOk)
                {
                    System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

                    using (var stream = System.IO.File.Open("BulkData\\BulkLessons.xlsx", FileMode.Open, FileAccess.Read))
                    {
                        using (var excelData = ExcelReaderFactory.CreateReader(stream))
                        {
                            excelData.Read(); //Ignore column header name

                            List<LessonModel> excelLessons = new List<LessonModel>();

                            while (excelData.Read()) //Each row of the file
                            {
                                try
                                {
                                    LessonModel currentLesson = new LessonModel
                                    {
                                        LessonName = excelData.GetValue(0).ToString(),
                                        OrgLessonName = excelData.GetValue(1).ToString(),
                                        Vahed = int.Parse(excelData.GetValue(2).ToString()),
                                        LessonCode = excelData.GetValue(3).ToString(),
                                        Grade_Id = int.Parse(excelData.GetValue(4).ToString())
                                    };

                                    excelLessons.Add(currentLesson);
                                }
                                catch(Exception ex){}
                            }

                            appDbContext.Lessons.AddRange(excelLessons);
                            await appDbContext.SaveChangesAsync();
                        }
                    }
                    return Ok(true);
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
        public async Task<IActionResult> EditStudyFields([FromBody]StudyFieldModel model)
        {
            try
            {
                StudyFieldModel study = appDbContext.StudyFields.Where(x => x.Id == model.Id).FirstOrDefault();

                if(study != null)
                {
                    study.Base_Id = (model.Base_Id != 0 ? model.Base_Id : study.Base_Id);
                    study.StudyFieldName = (model.StudyFieldName != "" ? model.StudyFieldName : study.StudyFieldName);

                    appDbContext.StudyFields.Update(model);
                    await appDbContext.SaveChangesAsync();

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
        public async Task<IActionResult> EditGrades([FromBody]GradeModel model)
        {
            try
            {
                GradeModel grade = appDbContext.Grades.Where(x => x.Id == model.Id).FirstOrDefault();

                if(grade != null && appDbContext.Grades.Where(x => x.GradeName == model.GradeName).FirstOrDefault() == null)
                {
                    grade.GradeName = (model.GradeName != "" ? model.GradeName : grade.GradeName);
                    grade.StudyField_Id = (model.StudyField_Id != 0 ? model.StudyField_Id : grade.StudyField_Id);

                    appDbContext.Grades.Update(grade);
                    await appDbContext.SaveChangesAsync();

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
                List<EnrolUser> data = new List<EnrolUser>();

                List<School_Class> school_Classes = appDbContext.School_Classes.Where(x => x.Grade_Id == newStudyF.Grade_Id).ToList();

                foreach (var classs in school_Classes)
                {
                    School_Lessons lessons = new School_Lessons{classId = classs.Id , Lesson_Id = newStudyF.Id , School_Id = classs.School_Id};
                    appDbContext.School_Lessons.Add(lessons);
                    await appDbContext.SaveChangesAsync();

                    School_Grades grade = appDbContext.School_Grades.Where(x => x.Grade_Id == model.Grade_Id && x.School_Id == classs.School_Id).FirstOrDefault();
                    SchoolModel school = appDbContext.Schools.Where(x => x.Id == classs.School_Id).FirstOrDefault();

                    await UpdateSchoolMoodle(grade , school , data);
                }

                
                await moodleApi.AssignUsersToCourse(data);
                
                return Ok(true);
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
        public async Task<IActionResult> EditLessons([FromBody]LessonModel model)
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
                    await appDbContext.SaveChangesAsync();

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

    public async Task<IActionResult> FixStudentsRole()
    {
        try
        {
            UserService UserService = new UserService(userManager , appDbContext);
            List<UserModel> users = appDbContext.Users.ToList();

            DateTime before = DateTime.Now;

            foreach (var user in users)
            {
                if(UserService.HasRole(user , Roles.User , true))
                {
                    await userManager.AddToRoleAsync(user , Roles.Student);
                }
            }
            
            DateTime after = DateTime.Now;

            TimeSpan elapsed = (after - before);

            return Ok("Done ! \n Elapsed Time :" + elapsed);
                        
        }
        catch (Exception ex)
        {
            return BadRequest(ex.StackTrace);
            throw;
        }

    }

    public async Task<IActionResult> SyncMoodleLDAP()
    {
        List<UserModel> users = appDbContext.Users.Where(x => x.UserName != "Admin").ToList();

        return Ok(await UserService.SyncUserData(users));
    }

    public async Task<IActionResult> SyncUsersWithMoodle()
    {
        
        List<UserModel> users = appDbContext.Users.Where(x => x.Moodle_Id == 0).ToList();

        return Ok(await UserService.SyncUserData(users , true));
        
    }

    public async Task<IActionResult> RecreateMoodle(int schoolType , int desiredSchoolId)
    {
        try
        {
            List<AdminDetail> adminDetails = appDbContext.AdminDetails.ToList();

            AdminDetail adminDetail = appDbContext.AdminDetails.Where(x => x.SchoolsType == schoolType).FirstOrDefault();

            MoodleApi moodleApi = new MoodleApi(AppSettings.GetValueFromDatabase(appDbContext , "Token_moodle"));
            List<EnrolUser> enrolsData = new List<EnrolUser>();

            List<UserModel> usersData = new List<UserModel>();
            
            // foreach (var adminDetail in adminDetails)
            // {
                if(!await moodleApi.CategoryExist(adminDetail.orgMoodleId))
                {
                    int adminCatId = await moodleApi.CreateCategory(adminDetail.TypeName);
                    adminDetail.orgMoodleId = adminCatId;

                    appDbContext.AdminDetails.Update(adminDetail);
                    await appDbContext.SaveChangesAsync();
                }

                List<SchoolModel> schools = new List<SchoolModel>();
                if(desiredSchoolId != 0 )
                {
                    schools = appDbContext.Schools.Where(x => x.Id == desiredSchoolId).ToList();
                    adminDetail = appDbContext.AdminDetails.Where(x => x.SchoolsType == schools.FirstOrDefault().SchoolType).FirstOrDefault();
                }
                else
                {
                    schools = appDbContext.Schools.Where(x => x.SchoolType == adminDetail.SchoolsType).ToList();
                }
                
                foreach (var school in schools)
                {
                    if(!await moodleApi.CategoryExist(school.Moodle_Id))
                    {
                        int schoolId = await moodleApi.CreateCategory(school.SchoolName , adminDetail.orgMoodleId);
                        school.Moodle_Id = schoolId;

                        appDbContext.Schools.Update(school);
                        await appDbContext.SaveChangesAsync();
                    }

                    List<School_Bases> baseModels = appDbContext.School_Bases.Where(x => x.School_Id == school.Id).ToList();
                    foreach (var baseModel in baseModels)
                    {
                        string baseName = appDbContext.Bases.Where(x => x.Id == baseModel.Base_Id).FirstOrDefault().BaseName;

                        if(!await moodleApi.CategoryExist(baseModel.Moodle_Id))
                        {
                            int baseId = await moodleApi.CreateCategory(baseName , school.Moodle_Id );
                            baseModel.Moodle_Id = baseId;

                            appDbContext.School_Bases.Update(baseModel);
                            await appDbContext.SaveChangesAsync();
                        }

                        if(baseModel.Base_Id == 28)
                        {
                            School_Grades freeGrade = new School_Grades();
                            freeGrade.Grade_Id = 0;
                            freeGrade.Moodle_Id = baseModel.Moodle_Id;
                            freeGrade.School_Id = school.Id;
                            await UpdateSchoolMoodle(freeGrade , school , enrolsData);
                        }
                        else
                        {
                            List<School_StudyFields> schoolStudyFields = appDbContext.School_StudyFields.Where(x => x.School_Id == school.Id).ToList();
                            List<StudyFieldModel> studyFields = appDbContext.StudyFields.Where(x => x.Base_Id == baseModel.Base_Id).ToList();
                            foreach (var schoolStudyF in schoolStudyFields)
                            {
                                StudyFieldModel studyField = studyFields.Where(x => x.Id == schoolStudyF.StudyField_Id).FirstOrDefault();
                                if(studyField != null)
                                {
                                    if(!await moodleApi.CategoryExist(schoolStudyF.Moodle_Id))
                                    {
                                        int studyFId = await moodleApi.CreateCategory(studyField.StudyFieldName , baseModel.Moodle_Id);
                                        schoolStudyF.Moodle_Id = studyFId;

                                        appDbContext.School_StudyFields.Update(schoolStudyF);
                                        await appDbContext.SaveChangesAsync();
                                    }

                                    List<School_Grades> school_Grades = appDbContext.School_Grades.Where(x => x.School_Id == school.Id).ToList();
                                    List<GradeModel> gradeModels = appDbContext.Grades.Where(x => x.StudyField_Id == studyField.Id).ToList();
                                    foreach (var schollGrade in school_Grades)
                                    {
                                        GradeModel gradeModel = gradeModels.Where(x => x.Id == schollGrade.Grade_Id).FirstOrDefault();
                                        if(gradeModel != null)
                                        {
                                            if(!await moodleApi.CategoryExist(schollGrade.Moodle_Id))
                                            {
                                                int gradeId = await moodleApi.CreateCategory(gradeModel.GradeName , schoolStudyF.Moodle_Id);
                                                schollGrade.Moodle_Id = gradeId;

                                                appDbContext.School_Grades.Update(schollGrade);
                                                await appDbContext.SaveChangesAsync();
                                            }

                                            await UpdateSchoolMoodle(schollGrade , school , enrolsData);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            //}
            
            await moodleApi.AssignUsersToCourse(enrolsData);
            
            return Ok(true);
        }
        catch(Exception ex)
        {
            return BadRequest(ex.StackTrace);
        }
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
    
#region FixInteruptData

    [HttpGet]
    public async Task<IActionResult> FixRecordURLBBB(int schoolId)
    {
        try
        {
            var meetings = appDbContext.Meetings.Where(x => x.RecordId == null && x.ServiceId != 0).ToList();
            if(schoolId != 0)
                meetings = meetings.Where(x => x.SchoolId == schoolId).ToList();

            foreach (var meeting in meetings)
            {
                ServicesModel serviceModel = appDbContext.Services.Where(x => x.Id == meeting.ServiceId).FirstOrDefault();
                if(meeting.MeetingId != null && meeting.ServiceType == ServiceType.BBB)
                {
                    BBBApi bBApi = new BBBApi(appDbContext);
                    bBApi.SetConnectionInfo(serviceModel.Service_URL , serviceModel.Service_Key);

                    RecordsResponse response = await bBApi.GetMeetingRecords(meeting.MeetingId.ToString());

                    if(response != null)
                    {
                        Recordings recordings = (response).recordings;

                        if(recordings != null)
                        {
                            List<RecordInfo> records = recordings.recording;
                            if(records.Count > 0)
                            {
                                meeting.RecordId = records[0].recordID;
                                meeting.RecordURL = records[0].playback.format[0].url;

                                appDbContext.Meetings.Update(meeting);
                                await appDbContext.SaveChangesAsync();
                            }
                        }
                    }
                }
            }

            return Ok(true);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.StackTrace);
            throw;
        }
    }
    [HttpGet]
    public async Task<IActionResult> FixSchedulesLessonId([FromBody]List<int> classesId)
    {
        try
        {  
            List<Class_WeeklySchedule> classSchedules = new List<Class_WeeklySchedule>();

            foreach (var classId in classesId)
            {
                classSchedules = appDbContext.ClassWeeklySchedules.Where(x => x.ClassId == classId).ToList();
                foreach (var schedule in classSchedules)
                {
                    School_Lessons schoolLesson = appDbContext.School_Lessons.Where(x => x.classId == schedule.ClassId && x.Lesson_Id == schedule.LessonId).FirstOrDefault();

                    if(schoolLesson == null)
                    {
                        string lessonCode = appDbContext.Lessons.Where(x => x.Id == schedule.LessonId).FirstOrDefault().LessonCode;
                        List<LessonModel> lessons = appDbContext.Lessons.Where(x => x.LessonCode == lessonCode).ToList();

                        School_Class schoolClass = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault();

                        LessonModel lesson = lessons.Where(x => x.Grade_Id == schoolClass.Grade_Id).FirstOrDefault();

                        schedule.LessonId = lesson.Id;

                        schoolLesson = appDbContext.School_Lessons.Where(x => x.classId == schedule.ClassId && x.Lesson_Id == schedule.LessonId).FirstOrDefault();

                        if(schoolLesson == null)
                        {
                            bool addResult = await administratorService.AddLessonToClass(lesson , schoolClass , true);
                        }
                    }
                }
            }

            appDbContext.ClassWeeklySchedules.UpdateRange(classSchedules);
            await appDbContext.SaveChangesAsync();
            
            return Ok(true);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.StackTrace);
        }
    }
    
    [HttpPost]
    public async Task<IActionResult> FixMultipleStudent(int classId = 0)
    {
        try
        {
            List<School_studentClass> studentClasses = appDbContext.School_StudentClasses.ToList();

            if(classId != 0)
                studentClasses = studentClasses.Where(x => x.ClassId == classId).ToList();

            var groupedStudent = studentClasses.GroupBy(x => x.UserId).Select(x => x.ToList());
            groupedStudent = groupedStudent.Where(x => x.Count > 1);

            foreach (var duplicates in groupedStudent)
            {
                var firstResult = duplicates.FirstOrDefault();

                var duplicateList = duplicates.Where(x => x.Id != firstResult.Id).ToList();

                appDbContext.School_StudentClasses.RemoveRange(duplicateList);
            }

            await appDbContext.SaveChangesAsync();
            return Ok(groupedStudent);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
            throw;
        }
    }

    [HttpPost]
    public async Task<IActionResult> OptimizeDatabase()
    {
        try
        {
            

            var groupedSchStudents = appDbContext.School_StudentClasses.GroupBy(x => x.UserId).Select(x => x.Key).ToList();
            groupedSchStudents.Sort();

            foreach (var studentId in groupedSchStudents)
            {
                UserModel student = appDbContext.Users.Where(x => x.Id == studentId).FirstOrDefault();
                if(student == null)
                {
                    School_studentClass studentClass = appDbContext.School_StudentClasses.Where(x => x.UserId == studentId).FirstOrDefault();
                    if(studentClass != null)
                        appDbContext.School_StudentClasses.Remove(studentClass);
                    
                    await appDbContext.SaveChangesAsync();
                }
            }

            var groupedLesson = appDbContext.School_Lessons.GroupBy(x => x.School_Id).Select(x => x.Key).ToList();
            groupedLesson.Sort();

            foreach (var schoolId in groupedLesson)
            {
                SchoolModel school = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault();
                if(school == null)
                {
                    List<School_Lessons> lessons = appDbContext.School_Lessons.Where(x => x.School_Id == schoolId).ToList();
                    appDbContext.School_Lessons.RemoveRange(lessons);
                    
                    await appDbContext.SaveChangesAsync();
                }
            }

            var groupedClass = appDbContext.School_Classes.GroupBy(x => x.School_Id).Select(x => x.Key).ToList();
            groupedClass.Sort();

            foreach (var schoolId in groupedClass)
            {
                SchoolModel school = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault();
                if(school == null)
                {
                    List<School_Class> classes = appDbContext.School_Classes.Where(x => x.School_Id == schoolId).ToList();
                    appDbContext.School_Classes.RemoveRange(classes);

                    await appDbContext.SaveChangesAsync();
                }
            }

            var groupedParticipant = appDbContext.ParticipantInfos.GroupBy(x => x.MeetingId).Select(x => x.Key).ToList();
            groupedParticipant.Sort();

            foreach (var meetingId in groupedParticipant)
            {
                Meeting meeting = appDbContext.Meetings.Where(x => x.Id == meetingId).FirstOrDefault();
                if(meeting == null)
                {
                    List<ParticipantInfo> participants = appDbContext.ParticipantInfos.Where(x => x.MeetingId == meetingId).ToList();
                    appDbContext.ParticipantInfos.RemoveRange(participants);

                    await appDbContext.SaveChangesAsync();
                }
            }

            var groupedLesson_Class = appDbContext.School_Lessons.GroupBy(x => x.classId).Select(x => x.Key).ToList();
            groupedLesson_Class.Sort();

            foreach (var classId in groupedLesson_Class)
            {
                School_Class schoolClass = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault();
                if(schoolClass == null)
                {
                    List<School_studentClass> studentClasses = appDbContext.School_StudentClasses.Where(x => x.ClassId == classId).ToList();
                    appDbContext.School_StudentClasses.RemoveRange(studentClasses);

                    List<Class_WeeklySchedule> schedules = appDbContext.ClassWeeklySchedules.Where(x => x.ClassId == classId).ToList();
                    appDbContext.ClassWeeklySchedules.RemoveRange(schedules);
                    
                    List<School_Lessons> lessons = appDbContext.School_Lessons.Where(x => x.classId == classId).ToList();
                    appDbContext.School_Lessons.RemoveRange(lessons);
                    
                    await appDbContext.SaveChangesAsync();
                }
            }

            var groupedMeeting = appDbContext.Meetings.GroupBy(x => x.ScheduleId).Select(x => x.Key).ToList();
            groupedMeeting.Sort();

            foreach (var scheduleId in groupedMeeting)
            {
                Class_WeeklySchedule schedule = appDbContext.ClassWeeklySchedules.Where(x => x.Id == scheduleId).FirstOrDefault();
                if(schedule == null)
                {
                    List<Meeting> meetings = appDbContext.Meetings.Where(x => x.ScheduleId == scheduleId).ToList();

                    foreach (var meeting in meetings)
                    {
                        List<ParticipantInfo> participants = appDbContext.ParticipantInfos.Where(x => x.MeetingId == meeting.Id).ToList();
                        appDbContext.ParticipantInfos.RemoveRange(participants);
                    }

                    appDbContext.Meetings.RemoveRange(meetings);

                    await appDbContext.SaveChangesAsync();
                }
            }

            var groupedTeacherDetail = appDbContext.TeacherDetails.Select(x => x.TeacherId).ToList();
            groupedTeacherDetail.Sort();

            foreach (var teacherId in groupedTeacherDetail)
            {
                UserModel teacher = appDbContext.Users.Where(x => x.Id == teacherId).FirstOrDefault();
                if(teacher == null)
                {
                    TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == teacherId).FirstOrDefault();

                    if(teacherDetail != null)
                        appDbContext.TeacherDetails.Remove(teacherDetail);

                    await appDbContext.SaveChangesAsync();
                }
            }

            var groupedTeacher = appDbContext.ClassWeeklySchedules.GroupBy(x => x.TeacherId).Select(x => x.Key).ToList();
            groupedTeacher.Sort();

            foreach (var teacherId in groupedTeacher)
            {
                UserModel teacher = appDbContext.Users.Where(x => x.Id == teacherId).FirstOrDefault();
                if(teacher == null)
                {
                    List<Class_WeeklySchedule> schedules= appDbContext.ClassWeeklySchedules.Where(x => x.TeacherId == teacherId).ToList();
                    appDbContext.ClassWeeklySchedules.RemoveRange(schedules);

                    TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == teacherId).FirstOrDefault();

                    if(teacherDetail != null)
                        appDbContext.TeacherDetails.Remove(teacherDetail);

                    await appDbContext.SaveChangesAsync();
                }
            }

            var groupedManager = appDbContext.ManagerDetails.Select(x => x.UserId).ToList();
            groupedManager.Sort();

            foreach (var managerId in groupedManager)
            {
                UserModel manager = appDbContext.Users.Where(x => x.Id == managerId).FirstOrDefault();
                if(manager == null)
                {
                    ManagerDetail managerDetail = appDbContext.ManagerDetails.Where(x => x.UserId == managerId).FirstOrDefault();

                    if(managerDetail != null)
                        appDbContext.ManagerDetails.Remove(managerDetail);

                    await appDbContext.SaveChangesAsync();
                }
            }

            var groupedAdmin = appDbContext.AdminDetails.Select(x => x.UserId).ToList();
            groupedAdmin.Sort();

            foreach (var adminId in groupedAdmin)
            {
                UserModel admin = appDbContext.Users.Where(x => x.Id == adminId).FirstOrDefault();
                if(admin == null)
                {
                    AdminDetail adminDetail = appDbContext.AdminDetails.Where(x => x.UserId == adminId).FirstOrDefault();

                    if(adminDetail != null)
                        appDbContext.AdminDetails.Remove(adminDetail);

                    await appDbContext.SaveChangesAsync();
                }
            }

            var groupedNews = appDbContext.News.Select(x => x.AutherId).ToList();
            groupedNews.Sort();

            foreach (var newsAutherId in groupedNews)
            {
                UserModel auther = appDbContext.Users.Where(x => x.Id == newsAutherId).FirstOrDefault();
                if(auther == null)
                {
                    List<NewsModel> news = appDbContext.News.Where(x => x.AutherId == newsAutherId).ToList();
                    appDbContext.News.RemoveRange(news);

                    await appDbContext.SaveChangesAsync();
                }
            }

            var groupedStudent = appDbContext.StudentDetails.Select(x => x.UserId).ToList();
            groupedStudent.Sort();

            foreach (var stId in groupedStudent)
            {
                UserModel student = appDbContext.Users.Where(x => x.Id == stId).FirstOrDefault();
                if(student == null)
                {
                    StudentDetail studentDetail = appDbContext.StudentDetails.Where(x => x.UserId == stId).FirstOrDefault();

                    if(studentDetail != null)
                        appDbContext.StudentDetails.Remove(studentDetail);

                    await appDbContext.SaveChangesAsync();
                }
            }



 
            return Ok("Done !");
        }
        catch (Exception ex)
        {
            return BadRequest("Failed ! " + Environment.NewLine + ex.StackTrace);
            throw;
        }
    }

    public async Task<IActionResult> ConfirmManagerAccount()
    {
        try
        {
            List<ManagerDetail> managers = appDbContext.ManagerDetails.ToList();
            foreach (var manager in managers)
            {
                UserModel managerModel = appDbContext.Users.Where(x => x.Id == manager.UserId).FirstOrDefault();
                if(managerModel != null)
                {
                    managerModel.ConfirmedAcc = true;
                    appDbContext.Users.Update(managerModel);
                }
            }

            
            await appDbContext.SaveChangesAsync();

            return Ok("Done !");
        }
        catch (System.Exception)
        {
            return BadRequest("Failed !");
            throw;
        }
    }

    public async Task<IActionResult> FixMeetingId()
    {
        try
        {
            List<Meeting> meetings = appDbContext.Meetings.Where(x => x.MeetingId.Contains("|adobe")).ToList();
            foreach (var meeting in meetings)
            {
                try
                {
                    string id = meeting.MeetingId.Split("|adobe")[0];
                    meeting.MeetingId = id;
                }
                catch(Exception)
                {}
            }

            appDbContext.UpdateRange(meetings);
            await appDbContext.SaveChangesAsync();

            return Ok(true);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
            throw;
        }
    }

    public async Task<IActionResult> FixMeetingServiceId()
    {
        try
        {
            int bbbService = appDbContext.Services.Where(x => x.ServiceType == ServiceType.BBB).FirstOrDefault().Id;
            int adobeService = appDbContext.Services.Where(x => x.ServiceType == ServiceType.AdobeConnect).FirstOrDefault().Id;

            List<Meeting> meetings = appDbContext.Meetings.ToList();
            foreach (var meeting in meetings)
            {
                if(meeting.ServiceId != 0)
                {
                    meeting.SchoolId = meeting.ServiceId;
                }

                if(meeting.ServiceType == ServiceType.BBB)
                    meeting.ServiceId = bbbService;

                if(meeting.ServiceType == ServiceType.AdobeConnect)
                    meeting.ServiceId = adobeService;
            }

            appDbContext.Meetings.UpdateRange(meetings);
            await appDbContext.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

#endregion

#region Payments
    public async Task<IActionResult> VerifyPayment(int paymentId)
    {
        try
        {
            PaymentsModel payments = appDbContext.Payments.Where(x => x.Id == paymentId).FirstOrDefault();

            VerifyPayResponseModel responseModel = await PaymentService.VerifyPayment(payments.refId.ToString() , paymentId);

            if(responseModel == null)
                return BadRequest("پرداخت با مشکل روبرو شد");
                
            if(responseModel.amount == payments.amount)
            {
                bool result = await PaymentService.UpdateSchoolBalance(payments);

                if(result)
                    return Ok("پرداخت با موفقیت انجام شد");

                return Ok("پرداخت با موفقیت انجام شد");
            }

            return BadRequest(responseModel.errorMessage);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
#endregion

#region Functions
    ///<param name="CategoryId">
    ///Default is set to -1 and if Used this methode to add Student this property should set to Category Id
    ///</param>
    ///<param name="UserType">
    ///Set UserType from UserType class Teacher,Student,...
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

    [ApiExplorerSettings(IgnoreApi = true)]
    async Task<bool> UpdateSchoolMoodle(School_Grades schollGrade , SchoolModel school , List<EnrolUser> enrolsData)
    {
        try
        {
            List<School_Class> school_Classes = appDbContext.School_Classes.Where(x => x.School_Id == school.Id && x.Grade_Id == schollGrade.Grade_Id).ToList();
            foreach (var schoolClass in school_Classes)
            {
                if(!await moodleApi.CategoryExist(schoolClass.Moodle_Id))
                {
                    int classId = await moodleApi.CreateCategory(schoolClass.ClassName , schollGrade.Moodle_Id);
                    schoolClass.Moodle_Id = classId;

                    appDbContext.School_Classes.Update(schoolClass);
                    await appDbContext.SaveChangesAsync();
                }

                List<School_Lessons> school_Lessons = appDbContext.School_Lessons.Where(x => x.School_Id == school.Id && x.classId == schoolClass.Id).ToList();
                List<LessonModel> lessons = appDbContext.Lessons.Where(x => x.Grade_Id == schollGrade.Grade_Id).ToList();

                
                foreach (var schoolLesson in school_Lessons)
                {
                    LessonModel lesson = lessons.Where(x => x.Id == schoolLesson.Lesson_Id).FirstOrDefault();
                    if(lesson != null)
                    {
                        bool visible = false;
                        Class_WeeklySchedule schedule = appDbContext.ClassWeeklySchedules.Where(x => x.ClassId == schoolClass.Id && x.LessonId == lesson.Id).FirstOrDefault();

                        if(!await moodleApi.CourseExist(schoolLesson.Moodle_Id))
                        {
                            int moodleId = await moodleApi.CreateCourse(lesson.LessonName + " (" + school.Moodle_Id + "-" + schoolClass.Moodle_Id + ")"
                                                                            , lesson.LessonName + " (" + school.SchoolName + "-" + schoolClass.ClassName + ")" 
                                                                            , schoolClass.Moodle_Id , visible);
                            schoolLesson.Moodle_Id = moodleId;

                            appDbContext.School_Lessons.Update(schoolLesson);
                            await appDbContext.SaveChangesAsync();
                        }

                        if(schedule != null)
                        {
                            UserModel teacher = appDbContext.Users.Where(x => x.Id == schedule.TeacherId).FirstOrDefault();

                            if(teacher != null)
                            {
                                int teacherMoodleid = await moodleApi.GetUserId(teacher.MelliCode);
                                if(teacherMoodleid == -1)
                                {
                                    teacherMoodleid = await moodleApi.CreateUser(teacher);
                                    teacher.Moodle_Id = teacherMoodleid;

                                    appDbContext.Users.Update(teacher);
                                    await appDbContext.SaveChangesAsync();
                                }
                                else if(teacherMoodleid != teacher.Moodle_Id)
                                {
                                    teacher.Moodle_Id = teacherMoodleid;

                                    appDbContext.Users.Update(teacher);
                                    await appDbContext.SaveChangesAsync();
                                }


                                await moodleApi.setCourseVisible(schoolLesson.Moodle_Id , true);
                                
                                EnrolUser enrolTeacher = new EnrolUser();
                                enrolTeacher.lessonId = schoolLesson.Moodle_Id;
                                enrolTeacher.UserId = teacher.Moodle_Id;
                                enrolTeacher.RoleId = 3;

                                enrolsData.Add(enrolTeacher);
                            }
                        }

                        UserModel manager = appDbContext.Users.Where(x => x.Id == school.ManagerId).FirstOrDefault();
                        
                        if(manager != null)
                        {
                            int managerMoodleid = await moodleApi.GetUserId(manager.MelliCode);

                            if(managerMoodleid == -1)
                            {
                                managerMoodleid = await moodleApi.CreateUser(manager);
                                manager.Moodle_Id = managerMoodleid;

                                appDbContext.Users.Update(manager);
                                await appDbContext.SaveChangesAsync();
                            }
                            else if(managerMoodleid != manager.Moodle_Id)
                            {
                                manager.Moodle_Id = managerMoodleid;

                                appDbContext.Users.Update(manager);
                                await appDbContext.SaveChangesAsync();
                            }

                            EnrolUser enrol = new EnrolUser();
                            enrol.lessonId = schoolLesson.Moodle_Id;
                            enrol.UserId = manager.Moodle_Id;
                            enrol.RoleId = 3;

                            enrolsData.Add(enrol);
                        }
                    
                        List<School_studentClass> studentClasses = appDbContext.School_StudentClasses.Where(x => x.ClassId == schoolClass.Id).ToList();
                        foreach (var student in studentClasses)
                        {
                            
                            UserModel studentModel = appDbContext.Users.Where(x => x.Id == student.UserId).FirstOrDefault();
                            if(studentModel != null)
                            {
                                int studentMoodleid = await moodleApi.GetUserId(studentModel.MelliCode);

                                if(studentMoodleid == -1)
                                {
                                    studentMoodleid = await moodleApi.CreateUser(studentModel);
                                    studentModel.Moodle_Id = studentMoodleid;

                                    appDbContext.Users.Update(studentModel);
                                    await appDbContext.SaveChangesAsync();
                                }
                                else if(studentMoodleid != studentModel.Moodle_Id)
                                {
                                    studentModel.Moodle_Id = studentMoodleid;

                                    appDbContext.Users.Update(studentModel);
                                    await appDbContext.SaveChangesAsync();
                                }


                                EnrolUser enrol = new EnrolUser();
                                enrol.lessonId = schoolLesson.Moodle_Id;
                                enrol.UserId = studentModel.Moodle_Id;
                                enrol.RoleId = 5;

                                enrolsData.Add(enrol);
                            }

                        }
                            

                        
                    }
                }
            }
            return true;
        }
        catch
        {
            return false;
        }
    }
    
   
#endregion

    }
}
        
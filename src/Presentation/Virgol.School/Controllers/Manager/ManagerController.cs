using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Models;
using Models.MoodleApiResponse;
using Microsoft.AspNetCore.Identity;
using Models.User;
using ExcelDataReader;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using lms_with_moodle.Helper;
using Microsoft.Extensions.Options;
using Models.Teacher;
using Microsoft.AspNetCore.Http;
using Models.InputModel;

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = "Manager")]
    public class ManagerController : ControllerBase
    {
        
        private readonly AppSettings appSettings;
        private readonly UserManager<UserModel> userManager;
        private readonly AppDbContext appDbContext;
        private readonly SignInManager<UserModel> signInManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;

        MoodleApi moodleApi;
        LDAP_db ldap;
        
        public ManagerController(UserManager<UserModel> _userManager 
                                , SignInManager<UserModel> _signinManager
                                , RoleManager<IdentityRole<int>> _roleManager
                                , AppDbContext dbContext
                                , IOptions<AppSettings> _appsetting)
        {
            userManager = _userManager;
            appDbContext = dbContext;
            signInManager =_signinManager;
            roleManager = _roleManager;
            appSettings = _appsetting.Value;

            moodleApi = new MoodleApi(appSettings);
            ldap = new LDAP_db(appSettings);

            
        }


#region CompleteInforamtion

        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult CompleteInfo([FromBody]UserModel managerInfo)
        {
            try
            {
                UserModel originalMInfo = appDbContext.Users.Where(x => x.Id == managerInfo.Id).FirstOrDefault();

                originalMInfo.PhoneNumber = (managerInfo.PhoneNumber != null ? managerInfo.PhoneNumber : originalMInfo.PhoneNumber);
                originalMInfo.FirstName = (managerInfo.FirstName != null ? managerInfo.FirstName : originalMInfo.FirstName);
                originalMInfo.LastName = (managerInfo.LastName != null ? managerInfo.LastName : originalMInfo.LastName);

                appDbContext.Users.Update(originalMInfo);
                appDbContext.SaveChanges();

                return Ok(originalMInfo);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
#endregion

#region News

        [HttpGet]
        [ProducesResponseType(typeof(NewsModel), 200)]
        public IActionResult GetIncommingNews()
        {
   
            int managerRoleId = roleManager.FindByNameAsync("Manager").Result.Id;

            List<NewsModel> allowedNews = appDbContext.News.Where(x => x.AccessRoleId.Contains(managerRoleId.ToString())).ToList();

            return Ok(allowedNews);
        }

        [HttpGet]
        [ProducesResponseType(typeof(NewsModel), 200)]
        public IActionResult GetMyNews()
        {
            string IdNumber = userManager.GetUserId(User);
            int UserId = appDbContext.Users.Where(x => x.MelliCode == IdNumber).FirstOrDefault().Id;

            List<NewsModel> myNews = appDbContext.News.Where(x => x.AutherId == UserId).ToList();

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
                string IdNumber = userManager.GetUserId(User);
                int UserId = appDbContext.Users.Where(x => x.MelliCode == IdNumber).FirstOrDefault().Id;

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

#endregion

#region Classes

        [HttpGet]
        [ProducesResponseType(typeof(List<GradeModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GradesList()
        {
            try
            {   
                //We set IdNumber as userId in Token
                string ManagerIdNumber = userManager.GetUserId(User);
                int managerId = appDbContext.Users.Where(x => x.MelliCode == ManagerIdNumber).FirstOrDefault().Id;

                SchoolModel school = appDbContext.Schools.Where(x => x.ManagerId == managerId).FirstOrDefault();

                List<School_Grades> grades = appDbContext.School_Grades.Where(x => x.School_Id == school.Id).ToList();

                List<GradeModel> gradeModels = new List<GradeModel>();
                List<CategoryDetail_moodle> categoryDetails = await moodleApi.GetAllCategories(school.Moodle_Id);

                foreach (var grade in grades)
                {   
                    GradeModel gradeModel = appDbContext.Grades.Where(x => x.Id == grade.Grade_Id).FirstOrDefault();
                    gradeModel.NM_GradeMoodleId = categoryDetails.Where(x => x.name == gradeModel.GradeName).FirstOrDefault().id;
                    
                    gradeModels.Add(gradeModel);
                }

                return Ok(gradeModels);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<School_Class>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult ClassList(int gradeId)
        {
            try
            {   
                string ManagerIdNumber = userManager.GetUserId(User);
                int managerId = appDbContext.Users.Where(x => x.MelliCode == ManagerIdNumber).FirstOrDefault().Id;
                SchoolModel school = appDbContext.Schools.Where(x => x.ManagerId == managerId).FirstOrDefault();

                return Ok(appDbContext.School_Classes.Where(x => x.School_Id == school.Id && x.Grade_Id == gradeId));
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddNewClass([FromBody]ClassData classModel)
        {
            try
            {
                int grade_moodleId = appDbContext.School_Grades.Where(x => x.Grade_Id == classModel.gradeId).FirstOrDefault().Moodle_Id;

                string ManagerIdNumber = userManager.GetUserId(User);
                int managerId = appDbContext.Users.Where(x => x.MelliCode == ManagerIdNumber).FirstOrDefault().Id;
                SchoolModel school = appDbContext.Schools.Where(x => x.ManagerId == managerId).FirstOrDefault();

                int classMoodleId = await moodleApi.CreateCategory(classModel.ClassName , grade_moodleId);
                if(classMoodleId != -1)
                {
                    string gradeName = moodleApi.getCategoryDetail(grade_moodleId).Result.Name;
                    //Retreive gradeId in our database
                    int gradeId = appDbContext.Grades.Where(x => x.GradeName == gradeName).FirstOrDefault().Id;

                    List<LessonModel> lessons = appDbContext.Lessons.Where(x => x.Grade_Id == gradeId).ToList();
                    foreach (var lesson in lessons)
                    {
                        await moodleApi.CreateCourse(lesson.LessonName + " (" + school.Moodle_Id + "-" + classMoodleId + ")", lesson.LessonName , classMoodleId);
                    }

                    School_Class schoolClass = new School_Class();
                    schoolClass.ClassName = classModel.ClassName;
                    schoolClass.Grade_Id = gradeId;
                    schoolClass.Grade_MoodleId = grade_moodleId;
                    schoolClass.Moodle_Id = classMoodleId;
                    schoolClass.School_Id = school.Id;

                    appDbContext.School_Classes.Add(schoolClass);
                    appDbContext.SaveChanges();

                    schoolClass.Id = appDbContext.School_Classes.OrderByDescending(x => x.Id).FirstOrDefault().Id;

                    return Ok(schoolClass);
                }

                return BadRequest("ایجاد کلاس با مشکل مواجه شد");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpPost]
        [ProducesResponseType(typeof(School_Class), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> EditClass([FromBody]ClassData inputClassData)
        {
            try
            {
                string ManagerIdNumber = userManager.GetUserId(User);
                int managerId = appDbContext.Users.Where(x => x.MelliCode == ManagerIdNumber).FirstOrDefault().Id;

                SchoolModel school = appDbContext.Schools.Where(x => x.ManagerId == managerId).FirstOrDefault();

                School_Class schoolClass = appDbContext.School_Classes.Where(x => x.Id == inputClassData.Id).FirstOrDefault();
                int grade_moodleId = appDbContext.School_Grades.Where(x => x.Grade_Id == inputClassData.gradeId).FirstOrDefault().Moodle_Id;

                schoolClass.ClassName = (inputClassData.ClassName != "" ? inputClassData.ClassName : schoolClass.ClassName);
                
                if(schoolClass != null)
                {
                    if(grade_moodleId != 0 && grade_moodleId != schoolClass.Grade_MoodleId)
                    {
                        await moodleApi.DeleteCategory(schoolClass.Moodle_Id);

                        int newClassMoodleId = await moodleApi.CreateCategory(schoolClass.ClassName , grade_moodleId);
                        if(newClassMoodleId != -1)
                        {
                            string gradeName = moodleApi.getCategoryDetail(grade_moodleId).Result.Name;
                            int gradeId = appDbContext.Grades.Where(x => x.GradeName == gradeName).FirstOrDefault().Id;

                            List<LessonModel> lessons = appDbContext.Lessons.Where(x => x.Grade_Id == gradeId).ToList();
                            foreach (var lesson in lessons)
                            {
                                await moodleApi.CreateCourse(lesson.LessonName + " (" + school.Moodle_Id + "-" + newClassMoodleId + ")" , lesson.LessonName , newClassMoodleId);
                            }

                            schoolClass.Grade_Id = gradeId;
                            schoolClass.Grade_MoodleId = grade_moodleId;
                            schoolClass.Moodle_Id = newClassMoodleId;
                        }         
                    }
                    else
                    {
                        CategoryDetail oldClass = new CategoryDetail();
                        oldClass.Id = schoolClass.Moodle_Id;
                        oldClass.Name = schoolClass.ClassName;
                        oldClass.ParentCategory = schoolClass.Grade_MoodleId;
                        
                        await moodleApi.EditCategory(oldClass);
                    }

                    appDbContext.School_Classes.Update(schoolClass);
                    appDbContext.SaveChanges();
                }


                return Ok(schoolClass);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpDelete]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> DeleteClass([FromBody]int classId)
        {
            try
            {
                School_Class schoolClass = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault();
                await moodleApi.DeleteCategory(schoolClass.Moodle_Id);

                appDbContext.School_Classes.Remove(schoolClass);
                appDbContext.SaveChanges();

                return Ok(true);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

#endregion    

#region UserAction


        [HttpGet]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetAllStudent() 
        {
            try
            {
                string ManagerIdNumber = userManager.GetUserId(User);
                int schoolId = appDbContext.Users.Where(x => x.MelliCode == ManagerIdNumber).FirstOrDefault().SchoolId;

                List<UserModel> AllStudent = appDbContext.Users.Where(x => x.userTypeId == UserType.Student && x.ConfirmedAcc && x.SchoolId == schoolId).ToList();

                return Ok(AllStudent);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<UserDataModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetNewUsers()
        {
            try
            {
                List<UserModel> NewUsers = appDbContext.Users.Where(x => x.ConfirmedAcc == false).ToList();
                List<UserDataModel> users = new List<UserDataModel>();

                foreach (var user in NewUsers)
                {
                    StudentDetail userDetail = new StudentDetail();
                    userDetail = appDbContext.StudentDetails.Where(x => x.UserId == user.Id).FirstOrDefault();

                    UserDataModel dataModel= new UserDataModel();
                    dataModel.Id = user.Id;
                    dataModel.FirstName = user.FirstName;
                    dataModel.LastName = user.LastName;
                    dataModel.PhoneNumber = user.PhoneNumber;
                    dataModel.MelliCode = user.MelliCode;
                    dataModel.Moodle_Id = user.Moodle_Id;
                    dataModel.UserName = user.UserName;

                    dataModel.userDetail = userDetail;

                    users.Add(dataModel);
                }

                return Ok(users);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    

        [HttpPost]
        [ProducesResponseType(typeof(List<string>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddBulkUser([FromForm]IFormCollection Files , int CategoryId = -1)
        {
            try
            {
                //Username and password Default is MelliCode

                //1 - Read data from excel
                //2 - Check valid data
                //3 - Add user to Database
                //3.1 - don't add duplicate username 

                bool FileOk = await UploadFile(Files.Files[0] , "BulkUserData.xlsx");

                if(FileOk)
                {
                    var errors = await CreateBulkUser(UserType.Student , "BulkUserData.xlsx" , CategoryId);
                    return Ok(errors);
                }

                return BadRequest("آپلود فایل با مشکل مواجه شد");
                
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> DeleteStudents([FromBody]List<int> studentIds)
        {
            try
            {
                MyUserManager myUserManager = new MyUserManager(userManager , appSettings);

                foreach (int studentId in studentIds)
                {
                    UserModel student = appDbContext.Users.Where(x => x.Id == studentId).FirstOrDefault();

                    await myUserManager.DeleteUser(student);
                    
                }

                return Ok(true);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [ProducesResponseType(typeof(List<string>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddBulkTeacher([FromForm]IFormCollection Files)
        {
            try
            {
                bool FileOk = await UploadFile(Files.Files[0] , "BulkTeacher.xlsx");

                if(FileOk)
                {
                    var errors = CreateBulkUser(UserType.Teacher , "BulkTeacher.xlsx");
                    return Ok(errors);
                }
                return BadRequest("آپلود فایل با مشکل مواجه شد");
                
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        public class InputId
        {
            public int[] UsersId {get; set;}
        }
        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> ConfirmUsers([FromBody]List<int> usersId)
        {
            try
            {
                List<EnrolUser> enrolUsers = new List<EnrolUser>();

                foreach(var id in usersId)
                {
                    
                    StudentDetail userDetail = appDbContext.StudentDetails.Where(x => x.UserId == id).FirstOrDefault();
                    var SelectedUser = appDbContext.Users.Where(user => user.Id == id).FirstOrDefault();
                    SelectedUser.ConfirmedAcc = true;

                    UserDataModel user = new UserDataModel();
                    user.FirstName = SelectedUser.FirstName;
                    user.LastName = SelectedUser.LastName;
                    user.MelliCode = SelectedUser.MelliCode;
                    user.userDetail = userDetail;

                    ldap.AddUserToLDAP(user);

                    bool createUser = await moodleApi.CreateUsers(new List<UserModel>(){SelectedUser});

                    if(createUser)
                    {
                        int userMoodle_id = await moodleApi.GetUserId(SelectedUser.MelliCode);
                        if(userMoodle_id != -1)
                        {
                            SelectedUser.Moodle_Id = userMoodle_id;
                            appDbContext.Users.Update(SelectedUser);

                            EnrolUser enrolUser = new EnrolUser();
                            enrolUser.CategoryId = userDetail.BaseId;
                            enrolUser.RoleId = 5;
                            enrolUser.UserId = userMoodle_id;

                            enrolUsers.Add(enrolUser);

                            FarazSmsApi smsApi = new FarazSmsApi(appSettings);
                            String welcomeMessage = string.Format("{0} {1} عزیز ثبت نام شما با موفقیت انجام شد \n" +
                                                                    "نام کاربری و رمز عبور شما کدملی شما میباشد" , SelectedUser.FirstName , SelectedUser.LastName);

                            smsApi.SendSms(new string[] {SelectedUser.PhoneNumber} , welcomeMessage);


                        }
                    }
                }

                await AssignUsersToCategory(enrolUsers.ToArray());
                appDbContext.SaveChanges();

                return Ok(true);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        //For assign teacher or student to Course :
        //Teacher Role = 3
        //Student Role = 5
        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AssignUsersToCategory([FromBody]EnrolUser[] users)
        {
            try
            {
                List<CourseDetail> courses = await moodleApi.GetAllCourseInCat(users[0].CategoryId); //because All user will be add to same category
                List<EnrolUser> enrolsData = new List<EnrolUser>();

                foreach(var enrolUser in users)
                {
                    foreach(var course in courses)
                    {
                        EnrolUser enrolInfo = new EnrolUser();
                        enrolInfo.CourseId = course.id;
                        enrolInfo.RoleId = enrolUser.RoleId;
                        enrolInfo.UserId = enrolUser.UserId;

                        enrolsData.Add(enrolInfo);
                    }

                    
                }

                await moodleApi.AssignUsersToCourse(enrolsData);
                return Ok(true);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> UnAssignUsersFromCategory([FromBody]EnrolUser[] users)
        {
            try
            {
                List<CourseDetail> courses = await moodleApi.GetAllCourseInCat(users[0].CategoryId); //because All user will be remove from same category
                List<EnrolUser> enrolsData = new List<EnrolUser>();
                    
                foreach(var enrolUser in users)
                {

                    foreach(var course in courses)
                    {
                        EnrolUser enrolInfo = new EnrolUser();
                        enrolInfo.CourseId = course.id;
                        enrolInfo.UserId = enrolUser.UserId;

                        enrolsData.Add(enrolInfo);
                    }
                }

                bool result = await moodleApi.UnAssignUsersFromCourse(enrolsData);
                return Ok(result);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(bool), 400)]
        public async Task<IActionResult> AssignUsersToCourse([FromBody]EnrolUser[] users)
        {
            bool result = await moodleApi.AssignUsersToCourse(users.ToList());
            
            foreach(var enrolUser in users)
            {
                if(enrolUser.RoleId == 3)
                {
                    //Initialize teacherCourse Info
                    TeacherCourseInfo teacherCourseInfo = new TeacherCourseInfo();
                    teacherCourseInfo.CourseId = enrolUser.CourseId;
                    teacherCourseInfo.TeacherId = enrolUser.UserId;//if we set teacher UserId came from our database

                    appDbContext.TeacherCourse.Add(teacherCourseInfo);
                    appDbContext.SaveChanges();
                }
            }

            if(result)
            {
                return Ok(true);
            }
            else
            {
                return BadRequest(false);
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> UnAssignFromCourse([FromBody]EnrolUser user)
        {
            try
            {
                //UserId is id in moodle
                bool resultUnAssign = await moodleApi.UnAssignUsersFromCourse(new List<EnrolUser>() {user});

                if(user.RoleId == 3)
                {
                    TeacherCourseInfo teacherCourse = appDbContext.TeacherCourse.Where(x => x.CourseId == user.CourseId).FirstOrDefault(); //Because every course should have one teacher

                    appDbContext.TeacherCourse.Remove(teacherCourse);
                    appDbContext.SaveChanges();
                }

                return Ok(true);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
#endregion

#region Teacher

        [HttpGet]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult TeacherList()
        {
            try
            {
                return Ok(appDbContext.Users.Where(user => user.userTypeId == UserType.Teacher).ToList());
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [ProducesResponseType(typeof(UserModel), 200)]
        [ProducesResponseType(typeof(IEnumerable<IdentityError>), 400)]
        public async Task<IActionResult> AddNewTeacher([FromBody]UserDataModel teacher)
        {
            try
            {
                teacher.UserName = teacher.MelliCode;
                teacher.userTypeId = UserType.Teacher;
                teacher.ConfirmedAcc = true;
                
                IdentityResult resultCreate = userManager.CreateAsync(teacher , teacher.MelliCode).Result;

                if(resultCreate.Succeeded)
                {
                    bool resultAddRTeacher = userManager.AddToRoleAsync(teacher , "Teacher").Result.Succeeded;
                    bool resultAddRUser = userManager.AddToRoleAsync(teacher , "User").Result.Succeeded;

                    int userId = userManager.FindByNameAsync(teacher.MelliCode).Result.Id;

                    StudentDetail userDetail = new StudentDetail();
                    userDetail = teacher.userDetail;

                    if(userDetail != null)
                    {
                        appDbContext.StudentDetails.Add(userDetail);
                    }

                    ldap.AddUserToLDAP(teacher);

                    bool userToMoodle = await moodleApi.CreateUsers(new List<UserModel>() {teacher});

                    if(userToMoodle)
                    {
                        int userMoodle_id = await moodleApi.GetUserId(teacher.MelliCode);
                        teacher.Moodle_Id = userMoodle_id;
                        appDbContext.Users.Update(teacher);

                        appDbContext.SaveChanges();
                    }
                    
                    return Ok(appDbContext.Users.Where(x => x.MelliCode == teacher.MelliCode).FirstOrDefault());
                }

                return BadRequest(resultCreate.Errors);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult EditTeacher([FromBody]UserModel teacher)
        {
            try
            {
                UserModel userModel = appDbContext.Users.Where(x => x.Id == teacher.Id).FirstOrDefault();
                userModel.FirstName = teacher.FirstName;
                userModel.LastName = teacher.LastName;
                userModel.MelliCode = teacher.MelliCode;
                userModel.PhoneNumber = teacher.PhoneNumber;

                appDbContext.Users.Update(userModel);
                appDbContext.SaveChanges();

                UserModel editedTeacher = appDbContext.Users.Where(x => x.MelliCode == teacher.MelliCode).FirstOrDefault();
                return Ok(editedTeacher);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpDelete]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> DeleteTeacher([FromBody]List<int> teacherIds)
        {
            try
            {
                MyUserManager myUserManager = new MyUserManager(userManager , appSettings);

                foreach (int teacherId in teacherIds)
                {
                    UserModel teacher = appDbContext.Users.Where(x => x.Id == teacherId).FirstOrDefault();

                    await myUserManager.DeleteUser(teacher);

                    appDbContext.TeacherCourse.RemoveRange(appDbContext.TeacherCourse.Where(x => x.TeacherId == teacher.Id));
                    appDbContext.SaveChanges();
                    
                }

                return Ok(true);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

#endregion
    
#region Courses


        // [HttpPut]
        // [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        // [ProducesResponseType(typeof(string), 400)]
        // public async Task<IActionResult> AddCoursesToCategory([FromBody]List<int> CourseIds , int CategoryId)
        // {
        //     string error = await moodleApi.AddCoursesToCategory(CourseIds , CategoryId);
        //     List<CourseDetail> AllcourseDetails = await moodleApi.GetAllCourseInCat(CategoryId);
        //     List<CourseDetail> newcourseDetails = new List<CourseDetail>();

        //     foreach (var course in AllcourseDetails)
        //     {
        //         if(CourseIds.Where(x => x == course.id).FirstOrDefault() != 0)
        //         {
        //             newcourseDetails.Add(course);
        //         }
        //     }
        //     if(error == null)
        //     {
        //         return Ok(newcourseDetails);
        //     }
        //     else
        //     {
        //         return BadRequest(error);
        //     }
            
        // }

        // [HttpPost]
        // [ProducesResponseType(typeof(bool), 200)]
        // [ProducesResponseType(typeof(string), 400)]
        // public async Task<IActionResult> RemoveCourseFromCategory(int courseId )
        // {
        //     string error = await moodleApi.RemoveCourseFromCategory(courseId);
            
        //     if(error == null)
        //     {
        //         return Ok(true);
        //     }
        //     else
        //     {
        //         return BadRequest(error);
        //     }
            
        // }

   
        // [HttpGet]
        // [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        // [ProducesResponseType(typeof(string), 400)]
        // public async Task<IActionResult> GetAllCourseInCat(int CategoryId)
        // {
        //     try
        //     {
        //         if(CategoryId != 0)
        //         {
        //             List<CourseDetail> response = await moodleApi.GetAllCourseInCat(CategoryId);

        //             List<CourseDetail> result = new List<CourseDetail>();

        //             foreach(var course in response)
        //             {
        //                 TeacherModel_View Teacher = new TeacherModel_View();
        //                 Teacher = appDbContext.TeacherView.Where(x => x.CourseId == course.id).FirstOrDefault();

        //                 if(Teacher != null)
        //                 {
        //                     string TeacherName = Teacher.FirstName + " " + Teacher.LastName;

        //                     course.TeacherName = TeacherName;
        //                     course.TeacherId = Teacher.TeacherId;
        //                 }
        //                 else
        //                 {
        //                     course.TeacherName = "ندارد";
        //                     course.TeacherId = 0;
        //                 }

        //                 result.Add(course);
        //             }

        //             return Ok(result);
        //         }
        //         else
        //         {
        //             return BadRequest("Category ID shouldn't be 0");
        //         }
        //     }
        //     catch(Exception ex)
        //     {
        //         return BadRequest(ex.Message);
        //     }
        // }
        
        // [HttpPut]
        // [ProducesResponseType(typeof(CourseDetail), 200)]
        // [ProducesResponseType(typeof(string), 400)]
        // public async Task<IActionResult> AddNewCourse([FromBody]CourseDetail course)
        // {
        //     try
        //     {
                
        //         int CourseId = await moodleApi.CreateCourse(course.shortname , (course.categoryId != 0 ? course.categoryId : 1));
        //         UserModel Teacher = appDbContext.Users.Where(x => x.Id == course.TeacherId).FirstOrDefault();

        //         if(CourseId != -1)
        //         {
        //             if(course.TeacherId != 0)
        //             {
                        
        //                 //Initialize teacherCourse Info
        //                 TeacherCourseInfo teacherCourseInfo = new TeacherCourseInfo();
        //                 teacherCourseInfo.CourseId = CourseId;
        //                 teacherCourseInfo.TeacherId = course.TeacherId;

        //                 EnrolUser CurrentTeacher = new EnrolUser();
        //                 CurrentTeacher.CourseId = CourseId;
        //                 CurrentTeacher.RoleId = 3;

        //                 //Get teacher id from moodle database by its MelliCode from our database
        //                 int TeacherId = await moodleApi.GetUserId(Teacher.MelliCode);
        //                 CurrentTeacher.UserId = Teacher.Id;

        //                 bool result = await moodleApi.AssignUsersToCourse(new List<EnrolUser>(){CurrentTeacher});

        //                 appDbContext.TeacherCourse.Add(teacherCourseInfo);
        //                 appDbContext.SaveChanges();
        //             }

        //             CourseDetail courseDetail = course;
        //             courseDetail.id = CourseId;
                    
        //             return Ok(courseDetail);
        //         }
        //         else
        //         {
        //             return BadRequest("مشکلی در ثبت درس در مودل بوجود آمده است");
        //         }
        //     }
        //     catch(Exception ex)
        //     {
        //         return BadRequest(ex.Message);
        //     }
        // }

        // //For add course to category just set category id other wise category id not set
        // [HttpPost]
        // [ProducesResponseType(typeof(CourseDetail), 200)]
        // [ProducesResponseType(typeof(string), 400)]
        // public async Task<IActionResult> EditCourse([FromBody]CourseDetail course)
        // {
        //     try
        //     {
        //         //Previous teacher
        //         TeacherCourseInfo teacherCourseInfo = appDbContext.TeacherCourse.Where(x => x.CourseId == course.id).FirstOrDefault();

        //         CourseDetail courseDetail = await moodleApi.GetCourseDetail(course.id);
        //         course.categoryId = (course.categoryId == 0 ? courseDetail.categoryId : course.categoryId);
        //         course.shortname = (string.IsNullOrWhiteSpace(course.shortname) ? courseDetail.shortname : course.shortname);

        //         if(teacherCourseInfo != null)
        //             course.TeacherId = (course.TeacherId == 0 ? teacherCourseInfo.TeacherId : course.TeacherId);
                
        //         string response = await moodleApi.EditCourse(course);


        //         UserModel Teacher = appDbContext.Users.Where(x => x.Id == course.TeacherId).FirstOrDefault();

        //         if(string.IsNullOrEmpty(response))
        //         {
        //             //Initialize teacherCourse Info

        //             UserModel previousTeacherInfo = null;

        //             if(teacherCourseInfo == null && Teacher != null)
        //             {
        //                 teacherCourseInfo = new TeacherCourseInfo();
        //                 teacherCourseInfo.CourseId = course.id;
        //                 teacherCourseInfo.TeacherId = Teacher.Id;

        //                 appDbContext.TeacherCourse.Add(teacherCourseInfo);
        //                 appDbContext.SaveChanges();

                        
        //             }

        //             if(teacherCourseInfo != null)
        //             {
        //                 previousTeacherInfo = appDbContext.Users.Where(x => x.Id == teacherCourseInfo.TeacherId).FirstOrDefault();
        //             }

        //             EnrolUser previousTeacher = null;
        //             //Get teacher id from moodle database by its MelliCode from our database

        //             if(previousTeacherInfo != null)
        //             {
        //                 previousTeacher = new EnrolUser();

        //                 int previousTeacherId = await moodleApi.GetUserId(previousTeacherInfo.MelliCode); //Teacher id in moodle
        //                 previousTeacher.UserId = previousTeacherId;
        //                 previousTeacher.CourseId = course.id;
        //                 previousTeacher.RoleId = 3;
        //             }

                    
        //             EnrolUser newTeacher = null;

        //             if(Teacher != null)
        //             {
        //                 newTeacher = new EnrolUser();
        //                 //Get teacher id from moodle database by its MelliCode from our database
        //                 int TeacherId = await moodleApi.GetUserId(Teacher.MelliCode); //Teacher id in moodle

        //                 newTeacher.CourseId = course.id;
        //                 newTeacher.RoleId = 3;
        //                 newTeacher.UserId = TeacherId;
        //             }

        //             bool resultUnAssign = true;
        //             if(previousTeacher != null)
        //             {
        //                 resultUnAssign = await moodleApi.UnAssignUsersFromCourse(new List<EnrolUser>() {previousTeacher});
        //             }

        //             if(newTeacher != null)
        //             {
        //                 if(resultUnAssign)
        //                 {
        //                     bool resultAssign = await moodleApi.AssignUsersToCourse(new List<EnrolUser>() {newTeacher});
        //                     if(resultAssign)
        //                     {
        //                         teacherCourseInfo.TeacherId = course.TeacherId;
        //                         appDbContext.TeacherCourse.Update(teacherCourseInfo);
        //                         appDbContext.SaveChanges();
                                
        //                     }
        //                 }
        //             }
            

        //             return Ok(course);
        //         }
        //         else
        //         {
        //             return BadRequest("در ویرایش درس در سرور مودل مشکلی پیش آمد");
        //         }
        //     }
        //     catch(Exception ex)
        //     {
        //         return BadRequest(ex.Message);
        //     }
        // }


        // [HttpPost]
        // [ProducesResponseType(typeof(bool), 200)]
        // [ProducesResponseType(typeof(string), 400)]
        // public async Task<IActionResult> DeleteCourse([FromBody]CourseDetail _modelCourse)
        // {
        //     try
        //     {
                
        //         string result = await moodleApi.DeleteCourse(_modelCourse.id);

        //         if(result == null)
        //         {
        //             TeacherCourseInfo Course = appDbContext.TeacherCourse.Where(x => x.CourseId == _modelCourse.id).FirstOrDefault();
        //             if(Course != null)
        //             {
        //                 appDbContext.TeacherCourse.Remove(Course);
        //                 appDbContext.SaveChanges();
        //             }

        //             return Ok(_modelCourse);
        //         }
        //         else
        //         {
        //             return BadRequest(result);
        //         }
        //     }
        //     catch(Exception ex)
        //     {
        //         return BadRequest(ex.Message);
        //     }
        // }

#endregion
    
#region Categories

    // [HttpGet]
    // [ProducesResponseType(typeof(List<CategoryDetail>), 200)]
    // [ProducesResponseType(typeof(string), 400)]
    // public async Task<IActionResult> GetAllCategory()
    // {
    //     try
    //     {
            
    //         List<CategoryDetail_moodle> result = await moodleApi.GetAllCategories();
    //         List<CategoryDetail> Categories = new List<CategoryDetail>();

    //         foreach(var cat in result)
    //         {
    //             if(cat.id != 1)  // Miscellaneous Category
    //             {
    //                 CategoryDetail cateDetail = new CategoryDetail();
    //                 cateDetail.Id = cat.id;
    //                 cateDetail.Name = cat.name;
    //                 cateDetail.CourseCount = cat.coursecount;

    //                 Categories.Add(cateDetail);
    //             }
    //         }

    //         return Ok(Categories);
    //     }
    //     catch(Exception ex)
    //     {
    //         return BadRequest(ex.Message);
    //     }
    // }

    // [HttpPut]
    // [ProducesResponseType(typeof(CategoryDetail), 200)]
    // [ProducesResponseType(typeof(bool), 400)]
    // public async Task<IActionResult> AddNewCategory([FromBody]CategoryDetail Category)
    // {
    //     try
    //     {
    //         int categoryId = await moodleApi.CreateCategory(Category.Name , Category.ParentCategory);

    //         if(categoryId != -1)
    //         {
    //             Category.Id = categoryId;

    //             return Ok(Category);
    //         }
    //         else
    //         {
    //             return BadRequest(false);
    //         }
    //     }
    //     catch(Exception ex)
    //     {
    //         return BadRequest(ex.Message);
    //     }
    // }

    // [HttpPost]
    // [ProducesResponseType(typeof(CategoryDetail), 200)]
    // [ProducesResponseType(typeof(bool), 400)]
    // public async Task<IActionResult> EditCategory([FromBody]CategoryDetail Category)
    // {
    //     try
    //     {
    //         bool result = await moodleApi.EditCategory(Category);

    //         if(result)
    //         {
    //             return Ok(Category);
    //         }
    //         else
    //         {
    //             return BadRequest(false);
    //         }
    //     }
    //     catch(Exception ex)
    //     {
    //         return BadRequest(ex.Message);
    //     }
    // }

    // [HttpPost]
    // [ProducesResponseType(typeof(bool), 200)]
    // [ProducesResponseType(typeof(bool), 400)]
    // public async Task<IActionResult> DeleteCategory([FromBody]CategoryDetail Category)
    // {
    //     try
    //     {
            
    //         bool result = await moodleApi.DeleteCategory(Category.Id);

    //         if(result)
    //         {
    //             return Ok(true);
    //         }
    //         else
    //         {
    //             return BadRequest(false);
    //         }
    //     }
    //     catch(Exception ex)
    //     {
    //         return BadRequest(ex.Message);
    //     }
    // }

#endregion
    
#region Functions
        ///<param name="CategoryId">
        ///Default is set to -1 and if Used this methode to add Student this property should set to Category Id
        ///</param>
        ///<param name="userTypeId">
        ///Set userTypeId from UserType class Teacher,Student,...
        ///</param>
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<string[]> CreateBulkUser(int userTypeId , string fileName , int CategoryId = -1)
        {
            //Username and password Default is MelliCode

            //1 - Read data from excel
            //2 - Check valid data
            //3 - Add user to Database
            //3.1 - don't add duplicate username 


            List<UserDataModel> users = new List<UserDataModel>();
            List<string> errors = new List<string>();

            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

            using (var stream = System.IO.File.Open(fileName, FileMode.Open, FileAccess.Read))
            {
                using (var excelData = ExcelReaderFactory.CreateReader(stream))
                {
                    excelData.Read(); //Ignore column header name

                    while (excelData.Read()) //Each row of the file
                    {
                        UserDataModel selectedUser = new UserDataModel
                        {
                            FirstName = excelData.GetValue(0).ToString(),
                            LastName = excelData.GetValue(1).ToString(),
                            MelliCode = excelData.GetValue(2).ToString(),
                            PhoneNumber = excelData.GetValue(3).ToString(),
                            Email = (excelData.GetValue(4) != null ? excelData.GetValue(4).ToString() : ""),
                            userDetail = new StudentDetail(){
                                LatinFirstname = excelData.GetValue(5).ToString(),
                                LatinLastname = excelData.GetValue(6).ToString()
                            }
                        };

                        selectedUser.ConfirmedAcc = true;
                        selectedUser.UserName = selectedUser.MelliCode;
                        selectedUser.userTypeId = userTypeId;

                        if(await userManager.FindByNameAsync(selectedUser.UserName) == null)//Check for duplicate Username
                        {
                            users.Add(selectedUser);
                        }
                        else
                        {
                            errors.Add(" معلم با کد ملی " + selectedUser.MelliCode + "موجود میباشد");
                        }
                    }

                    List<UserModel> userModels = new List<UserModel>();

                    foreach(var user in users)
                    {
                        bool result = userManager.CreateAsync(user , user.MelliCode).Result.Succeeded;
                        if(result)
                        {
                            if(userManager.AddToRolesAsync(user , new string[]{"User" , (userTypeId == UserType.Teacher ? "Teacher" : null)}).Result.Succeeded)
                            {
                                ldap.AddUserToLDAP(user);
                            }
                        }
                        userModels.Add(user);//Use for add user to moodle
                    }

                    await moodleApi.CreateUsers(userModels);

                    foreach(var user in userModels)
                    {
                        int userMoodle_id = await moodleApi.GetUserId(user.MelliCode);
                        user.Moodle_Id = userMoodle_id;
                        appDbContext.Users.Update(user);
                    }

                    appDbContext.SaveChanges();
                }
            }

            return errors.ToArray();
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<bool> UploadFile(IFormFile file , string FileName)
        {
            bool result = false;

            if (file != null)
            {
                if (file.Length > 0)
                {
                    string path = Path.Combine(Request.Host.Value, "BulkUserData");

                    var fs = new FileStream(Path.Combine("BulkUserData", FileName), FileMode.Create);
                    await file.CopyToAsync(fs);

                    result = true;
                }
            }

            return result;
        }

#endregion
    }
}
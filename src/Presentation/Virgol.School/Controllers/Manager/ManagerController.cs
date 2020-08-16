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
using Models.Users.Teacher;
using Microsoft.AspNetCore.Http;
using Models.InputModel;
using Newtonsoft.Json;

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
        MyUserManager myUserManager;
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
            ldap = new LDAP_db(appSettings , appDbContext);

            myUserManager = new MyUserManager(userManager , appSettings , appDbContext);

            
        }


        [HttpGet]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult getManagerDashboardInfo()
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel userModel = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();
                ManagerDetail managerDetail = appDbContext.ManagerDetails.Where(x => x.UserId == userModel.Id).FirstOrDefault();

                SchoolModel school = appDbContext.Schools.Where(x => x.Id == userModel.SchoolId).FirstOrDefault();

                int classCount = appDbContext.School_Classes.Where(x => x.School_Id == school.Id).Count();
                int studentsCount = appDbContext.Users.Where(x => x.SchoolId == school.Id && x.userTypeId == (int)UserType.Student).Count();

                List<UserModel> allTeachers = appDbContext.Users.Where(user => user.userTypeId == (int)UserType.Teacher).ToList();
                List<UserModel> result = new List<UserModel>();

                foreach (var teacher in allTeachers)
                {
                    string schoolIds = appDbContext.TeacherDetails.Where(x => x.TeacherId == teacher.Id).FirstOrDefault().SchoolsId;
                    if(schoolIds.Split(',').Where(x => x == school.Id.ToString()).FirstOrDefault() != null)
                    {
                        result.Add(teacher);
                    }
                }

                int teacherCount = result.Count;

                int onlineClass = 0;

                return Ok(new{
                    classCount,
                    studentsCount,
                    teacherCount,
                    onlineClass,
                    school
                });
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
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

#region Students
        [HttpGet]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetAllStudent() 
        {
            try
            {
                string ManagerUserName = userManager.GetUserId(User);
                int schoolId = appDbContext.Users.Where(x => x.UserName == ManagerUserName).FirstOrDefault().SchoolId;

                List<UserModel> AllStudent = appDbContext.Users.Where(x => x.userTypeId == (int)UserType.Student && x.ConfirmedAcc && x.SchoolId == schoolId).ToList();
                List<UserDataModel> result = new List<UserDataModel>();

                foreach (var student in AllStudent)
                {
                    UserDataModel userDataModel = new UserDataModel();

                    var serializedParent = JsonConvert.SerializeObject(student); 
                    UserDataModel studentVW = JsonConvert.DeserializeObject<UserDataModel>(serializedParent);

                    StudentDetail studentDetail = appDbContext.StudentDetails.Where(x => x.UserId == student.Id).FirstOrDefault();
                    if(student.LatinFirstname != null)
                    {
                        studentVW.completed = true;
                    }
                    studentVW.userDetail = studentDetail;

                    result.Add(studentVW);
                }

                return Ok(result);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [ProducesResponseType(typeof(UserModel), 200)]
        [ProducesResponseType(typeof(IEnumerable<IdentityError>), 400)]
        public async Task<IActionResult> AddNewStudent([FromBody]UserDataModel student)
        {
            try
            {
                string userNameManager = userManager.GetUserId(User);
                int schoolId = appDbContext.Users.Where(x => x.UserName == userNameManager).FirstOrDefault().SchoolId;

                student.SchoolId = schoolId;
                student.UserName = student.MelliCode;
                student.userTypeId = (int)UserType.Student;
                student.ConfirmedAcc = true;
                
                

                if(myUserManager.CheckPhoneInterupt(student.PhoneNumber))
                    return BadRequest("شماره همراه دانش آموز قبلا در سیستم ثبت شده است");

                if(myUserManager.CheckPhoneInterupt(student.userDetail.FatherPhoneNumber))
                    return BadRequest("شماره همراه ولی قبلا در سیستم ثبت شده است");

                IdentityResult resultCreate = userManager.CreateAsync(student , student.MelliCode).Result;

                if(resultCreate.Succeeded)
                {
                    bool resultAddRUser = userManager.AddToRoleAsync(student , "User").Result.Succeeded;

                    int userId = userManager.FindByNameAsync(student.MelliCode).Result.Id;

                    StudentDetail userDetail = new StudentDetail();
                    userDetail = student.userDetail;

                    if(userDetail != null)
                    {
                        userDetail.UserId = userId;
                        appDbContext.StudentDetails.Add(userDetail);
                    }

                    bool ldapUser = ldap.AddUserToLDAP(student);

                    bool userToMoodle = false;

                    if(ldapUser)
                    {
                        userToMoodle = await moodleApi.CreateUsers(new List<UserModel>() {student});
                    }

                    if(userToMoodle)
                    {
                        int userMoodle_id = await moodleApi.GetUserId(student.MelliCode);
                        student.Moodle_Id = userMoodle_id;
                        appDbContext.Users.Update(student);

                        appDbContext.SaveChanges();

                        return Ok(appDbContext.Users.Where(x => x.MelliCode == student.MelliCode).FirstOrDefault());
                    }
                    
                    return BadRequest("مشکلی در ثبت دانش آموز بوجود آمد");
                    
                }

                if(resultCreate.Errors.ToList()[0].Code == "PasswordTooShort")
                    return BadRequest("کد ملی به درستی وارد نشده است");

                if(resultCreate.Errors.ToList()[0].Code == "DuplicateUserName")
                    return BadRequest("کد ملی وارد شده تکراریست");

                return BadRequest(resultCreate.Errors.ToList()[0].Description);
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

                bool FileOk = await FileController.UploadFile(Files.Files[0] , Files.Files[0].FileName);

                if(FileOk)
                {
                    string userName = userManager.GetUserId(User);
                    int schoolId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().SchoolId;

                    var errors = await CreateBulkUser((int)UserType.Student , Files.Files[0].FileName , schoolId);
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
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult EditStudent([FromBody]UserDataModel student)
        {
            try
            {
                // var serializedParent = JsonConvert.SerializeObject(input); 
                // UserDataModel student = JsonConvert.DeserializeObject<UserDataModel>(serializedParent);

                UserModel userModel = appDbContext.Users.Where(x => x.Id == student.Id).FirstOrDefault();
                userModel.FirstName = student.FirstName;
                userModel.LastName = student.LastName;

                if(student.PhoneNumber != userModel.PhoneNumber)
                {
                    if(!myUserManager.CheckPhoneInterupt(student.PhoneNumber))
                        return BadRequest("شماره همراه دانش آموز قبلا در سیستم ثبت شده است");
                }

                userModel.PhoneNumber = student.PhoneNumber;
                 
                StudentDetail studentDetail = appDbContext.StudentDetails.Where(x => x.UserId == student.Id).FirstOrDefault();
                studentDetail.FatherName = student.userDetail.FatherName;

                if(student.userDetail.FatherPhoneNumber != studentDetail.FatherPhoneNumber)
                {
                    if(!myUserManager.CheckPhoneInterupt(student.PhoneNumber))
                        return BadRequest("شماره همراه ولی قبلا در سیستم ثبت شده است");
                }
                
                studentDetail.FatherPhoneNumber = student.userDetail.FatherPhoneNumber;

                appDbContext.Users.Update(userModel);
                appDbContext.StudentDetails.Update(studentDetail);
                appDbContext.SaveChanges();

                var serializedParent = JsonConvert.SerializeObject(userModel); 
                student = JsonConvert.DeserializeObject<UserDataModel>(serializedParent);
                student.userDetail = studentDetail;

                return Ok(student);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    

        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> DeleteStudents([FromBody]int[] studentIds)
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


#endregion

#region UserAction

        [HttpGet]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetUserInfo(int userId)
        {
            try
            {
                string idNumber = userManager.GetUserId(User);
                int schoolId = appDbContext.Users.Where(x => x.UserName == idNumber).FirstOrDefault().SchoolId;

                UserModel userModel = appDbContext.Users.Where(user => user.SchoolId == schoolId && user.Id == userId).FirstOrDefault();
                UserModel teacherModel = appDbContext.Users.Where(user => user.Id == userId).FirstOrDefault();

                if(teacherModel.userTypeId == (int)UserType.Teacher)
                {
                    TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == teacherModel.Id).FirstOrDefault();
                    if(teacherDetail.SchoolsId.Contains(schoolId + ","))
                    {
                        userModel = teacherModel;
                    }
                    else
                    {
                        return BadRequest("شما اجازه ویرایش این معلم را ندارید");
                    }
                }

                if(userModel.userTypeId == (int)UserType.Student)
                {
                    StudentDetail studentDetail = appDbContext.StudentDetails.Where(x => x.UserId == userId).FirstOrDefault();

                     return Ok(new{
                         userModel,
                         studentDetail = studentDetail
                     });
                }

                return Ok(userModel);
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

                    bool ldapUser = ldap.AddUserToLDAP(user);
                    
                    bool createUser = false;
                    if(ldapUser)
                    {
                        createUser = await moodleApi.CreateUsers(new List<UserModel>(){SelectedUser});
                    }

                    if(createUser)
                    {
                        int userMoodle_id = await moodleApi.GetUserId(SelectedUser.MelliCode);
                        if(userMoodle_id != -1)
                        {
                            SelectedUser.Moodle_Id = userMoodle_id;
                            appDbContext.Users.Update(SelectedUser);

                            EnrolUser enrolUser = new EnrolUser();
                            enrolUser.gradeId = userDetail.BaseId;
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

                //await AssignUsersToCategory(enrolUsers.ToArray());
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
                //کلی اشتباه منظقی هست در کد باید اصلاح شود
                List<CourseDetail> courses = await moodleApi.GetAllCourseInCat(users[0].gradeId); //because All user will be add to same category
                List<EnrolUser> enrolsData = new List<EnrolUser>();

                foreach(var enrolUser in users)
                {
                    foreach(var course in courses)
                    {
                        EnrolUser enrolInfo = new EnrolUser();
                        enrolInfo.lessonId = course.id;
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
                List<CourseDetail> courses = await moodleApi.GetAllCourseInCat(users[0].gradeId); //because All user will be remove from same category
                List<EnrolUser> enrolsData = new List<EnrolUser>();
                    
                foreach(var enrolUser in users)
                {

                    foreach(var course in courses)
                    {
                        EnrolUser enrolInfo = new EnrolUser();
                        enrolInfo.lessonId = course.id;
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
                    teacherCourseInfo.CourseId = enrolUser.lessonId;
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
                    TeacherCourseInfo teacherCourse = appDbContext.TeacherCourse.Where(x => x.CourseId == user.lessonId).FirstOrDefault(); //Because every course should have one teacher

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

        [HttpPost]
        [ProducesResponseType(typeof(List<string>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddBulkTeacher([FromForm]IFormCollection Files)
        {
            try
            {
                bool FileOk = await FileController.UploadFile(Files.Files[0] , Files.Files[0].FileName);

                if(FileOk)
                {
                    string userName = userManager.GetUserId(User);
                    int schoolId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().SchoolId;

                    var users = await CreateBulkUser((int)UserType.Teacher , Files.Files[0].FileName , schoolId);

                    return Ok(users);
                }
                return BadRequest("آپلود فایل با مشکل مواجه شد");
                
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult TeacherList()
        {
            try
            {
                string idNumber = userManager.GetUserId(User);
                int schoolId = appDbContext.Users.Where(x => x.UserName == idNumber).FirstOrDefault().SchoolId;

                List<UserDataModel> result = new List<UserDataModel>();
                List<UserModel> allTeachers = appDbContext.Users.Where(user => user.userTypeId == (int)UserType.Teacher).ToList();

                foreach (var teacher in allTeachers)
                {
                    var serializedParent = JsonConvert.SerializeObject(teacher); 
                    UserDataModel teacherVW = JsonConvert.DeserializeObject<UserDataModel>(serializedParent);

                    TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == teacher.Id).FirstOrDefault();
                    if(teacherDetail.SchoolsId.Contains(schoolId.ToString() + ","))
                    {
                        if(teacher.LatinFirstname != null)
                        {
                            teacherVW.completed = true;
                        }
                        teacherVW.teacherDetail = teacherDetail;
                        result.Add(teacherVW);
                    }
                }

                return Ok(result);
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
                string userNameManager = userManager.GetUserId(User);
                int schoolId = appDbContext.Users.Where(x => x.UserName == userNameManager).FirstOrDefault().SchoolId;

                teacher.UserName = teacher.MelliCode;
                teacher.userTypeId = (int)UserType.Teacher;
                teacher.ConfirmedAcc = true;
                
                if(!myUserManager.CheckPhoneInterupt(teacher.PhoneNumber))
                    return BadRequest("شماره همراه معلم قبلا در سیستم ثبت شده است");

                IdentityResult resultCreate = userManager.CreateAsync(teacher , teacher.MelliCode).Result;

                if(resultCreate.Succeeded)
                {
                    bool resultAddRTeacher = userManager.AddToRoleAsync(teacher , "Teacher").Result.Succeeded;
                    bool resultAddRUser = userManager.AddToRoleAsync(teacher , "User").Result.Succeeded;

                    int teacherId = userManager.FindByNameAsync(teacher.MelliCode).Result.Id;

                    bool ldapUser = ldap.AddUserToLDAP(teacher);

                    bool userToMoodle = false;

                    if(ldapUser)
                    {
                        userToMoodle = await moodleApi.CreateUsers(new List<UserModel>() {teacher});
                    }

                    if(userToMoodle)
                    {
                        int userMoodle_id = await moodleApi.GetUserId(teacher.MelliCode);
                        teacher.Moodle_Id = userMoodle_id;

                        TeacherDetail teacherDetail = new TeacherDetail();
                        teacherDetail.TeacherId = teacherId;
                        teacherDetail.SchoolsId = schoolId.ToString() + ',';

                        appDbContext.Users.Update(teacher);
                        appDbContext.TeacherDetails.Add(teacherDetail);
                        appDbContext.SaveChanges();

                        return Ok(appDbContext.Users.Where(x => x.MelliCode == teacher.MelliCode).FirstOrDefault());
                    }
                    
                    //if we arrive this point it means error occured and revert any databse actio
                    await userManager.DeleteAsync(teacher);
                    return BadRequest("مشکلی در ثبت معلم بوجود آمد");
                    
                }
                else if(userManager.FindByNameAsync(teacher.MelliCode).Result != null)//this Teacher exist in database
                {
                    int teacherId = userManager.FindByNameAsync(teacher.MelliCode).Result.Id;

                    TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == teacherId).FirstOrDefault();
                    teacherDetail.TeacherId = teacherId;
                    teacherDetail.SchoolsId += schoolId.ToString() + ',';

                    appDbContext.TeacherDetails.Update(teacherDetail);
                    appDbContext.SaveChanges();

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

                if(appDbContext.Users.Where(x => x.MelliCode == teacher.MelliCode).FirstOrDefault() != null && userModel.MelliCode != teacher.MelliCode)
                    return BadRequest("معلم با کد ملی وارد شده وجود دارد");

                userModel.FirstName = teacher.FirstName;
                userModel.LastName = teacher.LastName;
                userModel.UserName = teacher.MelliCode;
                
                if(teacher.PhoneNumber != userModel.PhoneNumber)
                {
                    if(!myUserManager.CheckPhoneInterupt(userModel.PhoneNumber))
                        return BadRequest("شماره همراه وارد شده قبلا در سیستم ثبت شده است");
                }

                ldap.EditEntry(userModel.MelliCode , "uniqueIdentifier" , teacher.MelliCode );

                userModel.MelliCode = teacher.MelliCode;
                userModel.PhoneNumber = teacher.PhoneNumber;

                appDbContext.Users.Update(userModel);
                appDbContext.SaveChanges();

                UserModel editedTeacher = appDbContext.Users.Where(x => x.MelliCode == teacher.MelliCode).FirstOrDefault();
                userManager.UpdateNormalizedUserNameAsync(editedTeacher);

                return Ok(editedTeacher);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> DeleteTeacher([FromBody]List<int> teacherIds)
        {
            try
            {
                string userNameManager = userManager.GetUserId(User);
                int schoolId = appDbContext.Users.Where(x => x.UserName == userNameManager).FirstOrDefault().SchoolId;

                MyUserManager myUserManager = new MyUserManager(userManager , appSettings);

                foreach (int teacherId in teacherIds)
                {
                    UserModel teacher = appDbContext.Users.Where(x => x.Id == teacherId).FirstOrDefault();
                    TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == teacherId).FirstOrDefault();
                    teacherDetail.SchoolsId = teacherDetail.SchoolsId.Replace(schoolId.ToString() + "," , "");

                    List<EnrolUser> unEnrolData = new List<EnrolUser>();
                    List<Class_WeeklySchedule> schedules = appDbContext.ClassWeeklySchedules.Where(x => x.TeacherId == teacherId).ToList();
                    foreach (var schedule in schedules)
                    {
                        School_Class schoolClass = appDbContext.School_Classes.Where(x => x.Id == schedule.ClassId).FirstOrDefault();
                        int teacherSchoolId = schoolClass.School_Id;

                        if(teacherSchoolId == schoolId)
                        {
                            EnrolUser unEnrol = new EnrolUser();
                            unEnrol.UserId = teacher.Moodle_Id;
                            unEnrol.lessonId = appDbContext.School_Lessons.Where(x => x.School_Id == schoolId && x.classId == schoolClass.Id && x.Lesson_Id == schedule.LessonId).FirstOrDefault().Moodle_Id;

                            unEnrolData.Add(unEnrol);
                            appDbContext.ClassWeeklySchedules.Remove(schedule);
                        }
                    }

                    await moodleApi.UnAssignUsersFromCourse(unEnrolData);
                    // await myUserManager.DeleteUser(teacher);

                    // appDbContext.TeacherCourse.RemoveRange(appDbContext.TeacherCourse.Where(x => x.TeacherId == teacher.Id));

                    appDbContext.TeacherDetails.Update(teacherDetail);
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
    
#region Classes

        [HttpGet]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult getStudentsClass(int classId)
        {
            try
            {   
                string userName = userManager.GetUserId(User);
                int managerId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;
                //We set IdNumber as userId in Token
                List<School_studentClass> studentClass = appDbContext.School_StudentClasses.Where(x => x.ClassId == classId).ToList();
                List<UserModel> users = new List<UserModel>();
                foreach (var user in studentClass)
                {
                    UserModel student = appDbContext.Users.Where(x => x.Id == user.UserId).FirstOrDefault();
                    users.Add(student);
                }

                return Ok(users);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AssignUserListToClass([FromBody]List<int> studentIds , int classId)
        {
            try
            {   
                int schoolId = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault().School_Id;

                List<UserDataModel> userModels = new List<UserDataModel>();
                List<UserModel> result = new List<UserModel>();
                BulkData data = new BulkData();

                foreach(var studentId in studentIds)
                {
                    UserModel studentModel = appDbContext.Users.Where(x => x.Id == studentId).FirstOrDefault();
                    var serialized = JsonConvert.SerializeObject(studentModel);
                    UserDataModel dataModel = JsonConvert.DeserializeObject<UserDataModel>(serialized);

                    dataModel.userDetail = appDbContext.StudentDetails.Where(x => x.UserId == studentId).FirstOrDefault();
                    
                    userModels.Add(dataModel);
                    result.Add(studentModel);
                }

                int classMoodleId = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault().Moodle_Id;

                List<School_studentClass> studentClasses = new List<School_studentClass>();
                List<CourseDetail> courses = await moodleApi.GetAllCourseInCat(classMoodleId); //because All user will be add to same category
                List<EnrolUser> enrolsData = new List<EnrolUser>();

                foreach (var user in userModels)
                {
                    
                    UserModel student = appDbContext.Users.Where(x => x.MelliCode == user.MelliCode).FirstOrDefault();
                    int userid = student.Id;

                    School_studentClass studentClass = new School_studentClass();

                    studentClass.ClassId = classId;
                    studentClass.UserId = userid;

                    if(appDbContext.School_StudentClasses.Where(x => x.UserId == userid && x.ClassId == classId).FirstOrDefault() == null)
                    {
                        if(appDbContext.Users.Where(x => x.Id == studentClass.UserId && x.SchoolId == schoolId).FirstOrDefault() != null)
                        {
                            studentClasses.Add(studentClass);
                        }
                    }

                    foreach(var course in courses)
                    {
                        EnrolUser enrolInfo = new EnrolUser();
                        enrolInfo.lessonId = course.id;
                        enrolInfo.RoleId = 5;
                        enrolInfo.UserId = student.Moodle_Id;

                        enrolsData.Add(enrolInfo);
                    }  
                }

                await moodleApi.AssignUsersToCourse(enrolsData);

                appDbContext.School_StudentClasses.AddRange(studentClasses);
                appDbContext.SaveChanges();

                return Ok(result);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AssignUserToClass([FromForm]IFormCollection Files , int classId)
        {
            try
            {   
                bool FileOk = await FileController.UploadFile(Files.Files[0] , Files.Files[0].FileName);

                List<UserDataModel> userModels = new List<UserDataModel>();
                BulkData data = new BulkData();

                int schoolId = 0;
                if(FileOk)
                {
                    string userName = userManager.GetUserId(User);
                    schoolId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().SchoolId;

                    data = await CreateBulkUser((int)UserType.Student , Files.Files[0].FileName , schoolId);
                    userModels = data.usersData;
                }

                int classMoodleId = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault().Moodle_Id;

                List<School_studentClass> studentClasses = new List<School_studentClass>();
                List<CourseDetail> courses = await moodleApi.GetAllCourseInCat(classMoodleId); //because All user will be add to same category
                List<EnrolUser> enrolsData = new List<EnrolUser>();

                foreach (var user in userModels)
                {
                    
                    UserModel student = appDbContext.Users.Where(x => x.MelliCode == user.MelliCode).FirstOrDefault();
                    int userid = student.Id;

                    School_studentClass studentClass = new School_studentClass();

                    studentClass.ClassId = classId;
                    studentClass.UserId = userid;

                    if(appDbContext.School_StudentClasses.Where(x => x.UserId == userid && x.ClassId == classId).FirstOrDefault() == null)
                    {
                        if(appDbContext.Users.Where(x => x.Id == studentClass.UserId && x.SchoolId == schoolId).FirstOrDefault() != null)
                        {
                            studentClasses.Add(studentClass);
                        }
                    }

                    foreach(var course in courses)
                    {
                        EnrolUser enrolInfo = new EnrolUser();
                        enrolInfo.lessonId = course.id;
                        enrolInfo.RoleId = 5;
                        enrolInfo.UserId = student.Moodle_Id;

                        enrolsData.Add(enrolInfo);
                    }  
                }

                await moodleApi.AssignUsersToCourse(enrolsData);

                appDbContext.School_StudentClasses.AddRange(studentClasses);
                appDbContext.SaveChanges();

                return Ok(data);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> UnAssignUserFromClass([FromBody]List<int> userIds , int classId)
        {
            try
            {   
                int classMoodleId = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault().Moodle_Id;

                List<School_studentClass> studentClasses = new List<School_studentClass>();
                List<CourseDetail> courses = await moodleApi.GetAllCourseInCat(classMoodleId); //because All user will be add to same category
                List<EnrolUser> enrolsData = new List<EnrolUser>();

                foreach (var userid in userIds)
                {
                    School_studentClass studentClass = appDbContext.School_StudentClasses.Where(x => x.UserId == userid && x.ClassId == classId).FirstOrDefault();

                    studentClasses.Add(studentClass);

                    foreach(var course in courses)
                    {
                        EnrolUser enrolInfo = new EnrolUser();
                        enrolInfo.lessonId = course.id;
                        enrolInfo.UserId = userid;

                        enrolsData.Add(enrolInfo);
                    }  
                }

                await moodleApi.UnAssignUsersFromCourse(enrolsData);

                appDbContext.School_StudentClasses.RemoveRange(studentClasses);
                appDbContext.SaveChanges();

                return Ok(true);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

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
        public async Task<BulkData> CreateBulkUser(int userTypeId , string fileName , int schoolId)
        {
            try
            {
                //Username and password Default is MelliCode

                //1 - Read data from excel
                //2 - Check valid data
                //3 - Add user to Database
                //3.1 - don't add duplicate username 
                int sexuality = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault().sexuality;

                List<UserDataModel> excelUsers = FileController.excelReader_Users(fileName , (userTypeId == (int)UserType.Teacher)).usersData;
                List<UserDataModel> newUsers = new List<UserDataModel>();
                List<UserDataModel> duplicateTeacher = new List<UserDataModel>();

                List<UserModel> usersMoodle = new List<UserModel>();
                List<string> errors = new List<string>();
                
                foreach (var selectedUser in excelUsers)
                {

                    selectedUser.ConfirmedAcc = true;
                    selectedUser.UserName = selectedUser.MelliCode;
                    selectedUser.userTypeId = userTypeId;
                    selectedUser.Sexuality = sexuality;
                    selectedUser.SchoolId = schoolId;

                    if(await userManager.FindByNameAsync(selectedUser.UserName) == null)//Check for duplicate Username
                    {
                        newUsers.Add(selectedUser);
                    }
                    else
                    {
                        if(userTypeId == (int)UserType.Teacher)
                        {
                            duplicateTeacher.Add(selectedUser);
                        }
                        errors.Add(" کاربر با کد ملی " + selectedUser.MelliCode + "موجود میباشد");
                    }

                }

                foreach(var user in newUsers)
                {
                    bool result = userManager.CreateAsync(user , user.MelliCode).Result.Succeeded;
                    if(result)
                    {
                        List<string> roles = new List<string>();

                        roles.Add("User");

                        if(userTypeId == (int)UserType.Teacher)
                        {
                            roles.Add("Teacher");
                        }

                        if(userManager.AddToRolesAsync(user , roles).Result.Succeeded)
                        {
                            ldap.AddUserToLDAP(user);
                        }
                    }
                    usersMoodle.Add(user);//Use for add user to moodle
                }

                await moodleApi.CreateUsers(usersMoodle);

                foreach(var user in newUsers)
                {
                    int userId = appDbContext.Users.Where(x => x.MelliCode == user.MelliCode).FirstOrDefault().Id;
                    if(userTypeId == (int)UserType.Student)
                    {
                        StudentDetail studentDetail = new StudentDetail();
                        studentDetail.UserId = userId;
                        if(user.userDetail.FatherName != null)
                        {
                            studentDetail.FatherName = user.userDetail.FatherName;
                        }
                        
                        appDbContext.StudentDetails.Add(studentDetail);
                    }
                    else if(userTypeId == (int)UserType.Teacher)
                    {
                        TeacherDetail teacherDetail = new TeacherDetail();
                        teacherDetail.TeacherId = userId;
                        teacherDetail.SchoolsId = schoolId.ToString() + ',';
                        if(user.userDetail != null)
                        {
                            teacherDetail.personalIdNUmber = user.teacherDetail.personalIdNUmber;
                        }

                        appDbContext.TeacherDetails.Add(teacherDetail);
                    }

                    int userMoodle_id = await moodleApi.GetUserId(user.MelliCode);
                    user.Moodle_Id = userMoodle_id;

                    appDbContext.Users.Update(user);
                    
                }

                foreach (var teacher in duplicateTeacher)
                {
                    int teacherId = appDbContext.Users.Where(x => x.MelliCode == teacher.MelliCode).FirstOrDefault().Id;

                    TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == teacherId).FirstOrDefault();
                    teacherDetail.SchoolsId += schoolId.ToString() + ',';
                }
                
                appDbContext.SaveChanges();

                BulkData bulkData = new BulkData();
                bulkData.allCount = excelUsers.Count;
                bulkData.duplicateCount = excelUsers.Count - newUsers.Count;
                bulkData.newCount = newUsers.Count;
                bulkData.usersData = excelUsers;
                bulkData.errors = errors;

                return bulkData;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                BulkData bulkData = new BulkData();
                bulkData.errors = new List<string>{ex.Message};

                return null;
            }
        }
        
#endregion
    }
}
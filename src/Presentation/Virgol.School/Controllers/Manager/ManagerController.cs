using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Models;
using Microsoft.AspNetCore.Identity;
using Models.User;
using Microsoft.AspNetCore.Authorization;
using lms_with_moodle.Helper;
using Microsoft.Extensions.Options;
using Models.Users.Teacher;
using Microsoft.AspNetCore.Http;
using Models.InputModel;
using Newtonsoft.Json;
using Models.Users.Roles;

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = Roles.Manager + "," + Roles.CoManager)]
    public class ManagerController : ControllerBase
    {
        
        private readonly AppSettings appSettings;
        private readonly UserManager<UserModel> userManager;
        private readonly AppDbContext appDbContext;
        private readonly SignInManager<UserModel> signInManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;

        MoodleApi moodleApi;
        UserService UserService;
        MeetingService meetingService;
        ManagerService managerService;
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

            moodleApi = new MoodleApi();
            ldap = new LDAP_db(appDbContext);

            UserService = new UserService(userManager , appDbContext);
            managerService = new ManagerService(appDbContext);
            meetingService = new MeetingService(appDbContext , UserService); 
        }


        [HttpGet]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult getManagerDashboardInfo()
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel userModel = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();

                SchoolModel school = appDbContext.Schools.Where(x => x.Id == userModel.SchoolId).FirstOrDefault();

                int classCount = appDbContext.School_Classes.Where(x => x.School_Id == school.Id).Count();
                int studentsCount = appDbContext.StudentViews.Where(x => x.schoolid == school.Id).Count();

                List<TeacherViewModel> allTeachers = appDbContext.TeacherViews.ToList();
                List<TeacherViewModel> result = new List<TeacherViewModel>();

                foreach (var teacher in allTeachers)
                {
                    string schoolIds = teacher.SchoolsId;
                    if(schoolIds.Split(',').Where(x => x == school.Id.ToString()).FirstOrDefault() != null)
                    {
                        result.Add(teacher);
                    }
                }

                int teacherCount = result.Count;
                
                int onlineClass = 0;

                List<MeetingView> onlineClassList = meetingService.GetAllActiveMeeting(userModel.Id);

                onlineClass = onlineClassList.Count;

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
        [Authorize(Roles = Roles.Manager)]
        public async Task<IActionResult> CompleteInfo([FromBody]UserModel managerInfo)
        {
            try
            {
                UserModel originalMInfo = appDbContext.Users.Where(x => x.Id == managerInfo.Id).FirstOrDefault();

                originalMInfo.PhoneNumber = (managerInfo.PhoneNumber != null ? managerInfo.PhoneNumber : originalMInfo.PhoneNumber);
                originalMInfo.FirstName = (managerInfo.FirstName != null ? managerInfo.FirstName : originalMInfo.FirstName);
                originalMInfo.LastName = (managerInfo.LastName != null ? managerInfo.LastName : originalMInfo.LastName);

                appDbContext.Users.Update(originalMInfo);
                await appDbContext.SaveChangesAsync();

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
        public IActionResult GetAllStudent(bool IsForAssign) 
        {
            try
            {
                string ManagerUserName = userManager.GetUserId(User);
                int schoolId = appDbContext.Users.Where(x => x.UserName == ManagerUserName).FirstOrDefault().SchoolId;

                List<StudentViewModel> AllStudent = appDbContext.StudentViews.Where(x => x.schoolid == schoolId).ToList();
                List<StudentViewModel> result = new List<StudentViewModel>();

                if(IsForAssign)
                {
                    result = appDbContext.StudentViews.Where(x => x.schoolid == schoolId && x.ClassId == null).ToList();
                }
                else
                {
                    result = AllStudent;
                }

                result = result.OrderBy(x => x.LastName).ToList();
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
        [Authorize(Roles = Roles.Manager)]
        public async Task<IActionResult> AddNewStudent([FromBody]UserDataModel student)
        {
            try
            {
                string userNameManager = userManager.GetUserId(User);
                int schoolId = appDbContext.Users.Where(x => x.UserName == userNameManager).FirstOrDefault().SchoolId;

                student.SchoolId = schoolId;
                student.UserName = student.MelliCode;
                student.ConfirmedAcc = true;
                
                if(UserService.CheckMelliCodeInterupt(student.MelliCode , 0))
                    return BadRequest("کد ملی وارد شده تکراریست");

                List<UserDataModel> result = await UserService.CreateUser(new List<UserDataModel>{student} , new List<string>{Roles.Student} , schoolId );

                if(result.Count > 0)
                {
                    return Ok(result[0]);
                }

                return BadRequest("در ثبت دانش آموز مشکلی بوجود آمد");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpPost]
        [ProducesResponseType(typeof(List<string>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Manager)]
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

                    var errors = await CreateBulkUser(Roles.Student , Files.Files[0].FileName , schoolId);
                    if(errors != null)
                    {
                        return Ok(errors);
                    }
                    else
                    {
                        return BadRequest("خطا در بارگذاری اطلاعات لطفا اطلاعات را بررسی کرده و دوباره تلاش نمایید");
                    }
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
        [Authorize(Roles = Roles.Manager)]
        public async Task<IActionResult> EditStudent([FromBody]UserDataModel student)
        {
            try
            {


                UserModel userModel = appDbContext.Users.Where(x => x.Id == student.Id).FirstOrDefault();
    
                if(student.MelliCode != userModel.MelliCode)
                {
                    if(UserService.CheckMelliCodeInterupt(student.MelliCode , userModel.Id))
                        return BadRequest("کد ملی وارد شده تکراریست");

                }

                if(student.PhoneNumber != userModel.PhoneNumber)
                {
                    if(UserService.CheckPhoneInterupt(student.PhoneNumber))
                        return BadRequest("شماره همراه دانش آموز قبلا در سیستم ثبت شده است");
                }
                 
                StudentDetail studentDetail = appDbContext.StudentDetails.Where(x => x.UserId == student.Id).FirstOrDefault();
                studentDetail.FatherName = student.studentDetail.FatherName;

                if(student.studentDetail.FatherPhoneNumber != studentDetail.FatherPhoneNumber)
                {
                    if(UserService.CheckPhoneInterupt(student.studentDetail.FatherPhoneNumber))
                        return BadRequest("شماره همراه ولی قبلا در سیستم ثبت شده است");
                }
                
                studentDetail.FatherPhoneNumber = student.studentDetail.FatherPhoneNumber;

                List<UserDataModel> result = await UserService.EditUsers(new List<UserDataModel>{student});

                if(result.Count > 0)
                {
                    return Ok(result);
                }

                return BadRequest("مشکلی در ویرایش دانش آموز بوجود آمده");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    

        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Manager)]
        public async Task<IActionResult> DeleteStudents([FromBody]int[] studentIds)
        {
            try
            {
                UserService UserService = new UserService(userManager);

                foreach (int studentId in studentIds)
                {
                    UserModel student = appDbContext.Users.Where(x => x.Id == studentId).FirstOrDefault();

                    await UserService.DeleteUser(student);
                    
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

                StudentViewModel studentView = appDbContext.StudentViews.Where(x => x.Id == userId).FirstOrDefault();
                TeacherViewModel teacherView = appDbContext.TeacherViews.Where(x => x.Id == userId).FirstOrDefault();

                if(teacherView != null)
                {
                    if(teacherView.SchoolsId.Contains(schoolId + ","))
                    {
                        return Ok(teacherView);
                    }
                    else
                    {
                        return BadRequest("شما اجازه ویرایش این معلم را ندارید");
                    }
                }
                else if(studentView != null)
                {
                    return Ok(studentView);
                }

                return BadRequest("خطایی رخ داد لطفا دوباره وارد سامانه شوید");
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

                    dataModel.studentDetail = userDetail;

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
        [Authorize(Roles = Roles.Manager)]
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
                    user.studentDetail = userDetail;

                    var serialized = JsonConvert.SerializeObject(user);
                    UserModel userModel = JsonConvert.DeserializeObject<UserModel>(serialized);


                    bool ldapUser = await ldap.AddUserToLDAP(userModel , false);
                    
                    int moodleId = -1;

                    if(ldapUser)
                    {
                        moodleId = await moodleApi.CreateUser(userModel);
                        userModel.Moodle_Id = moodleId;


                    }

                    if(moodleId != -1)
                    {
                        int userMoodle_id = await moodleApi.GetUserId(SelectedUser.MelliCode);
                        //int userMoodle_id = 0;
                        if(userMoodle_id != -1)
                        {
                            SelectedUser.Moodle_Id = userMoodle_id;
                            appDbContext.Users.Update(SelectedUser);

                            EnrolUser enrolUser = new EnrolUser();
                            enrolUser.gradeId = userDetail.BaseId;
                            enrolUser.RoleId = 5;
                            enrolUser.UserId = userMoodle_id;

                            enrolUsers.Add(enrolUser);

                            FarazSmsApi smsApi = new FarazSmsApi();
                            String welcomeMessage = string.Format("{0} {1} عزیز ثبت نام شما با موفقیت انجام شد \n" +
                                                                    "نام کاربری و رمز عبور شما کدملی شما میباشد" , SelectedUser.FirstName , SelectedUser.LastName);

                            //smsApi.SendSms(new string[] {SelectedUser.PhoneNumber} , welcomeMessage);


                        }
                    }
                }

                //await AssignUsersToCategory(enrolUsers.ToArray());
                await appDbContext.SaveChangesAsync();

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
        [Authorize(Roles = Roles.Manager)]
        public IActionResult AssignUsersToCategory([FromBody]EnrolUser[] users)
        {
            try
            {
                //کلی اشتباه منظقی هست در کد باید اصلاح شود
                // List<CourseDetail> courses = await moodleApi.GetAllCourseInCat(users[0].gradeId); //because All user will be add to same category
                // List<EnrolUser> enrolsData = new List<EnrolUser>();

                // foreach(var enrolUser in users)
                // {
                //     foreach(var course in courses)
                //     {
                //         EnrolUser enrolInfo = new EnrolUser();
                //         enrolInfo.lessonId = course.id;
                //         enrolInfo.RoleId = enrolUser.RoleId;
                //         enrolInfo.UserId = enrolUser.UserId;

                //         enrolsData.Add(enrolInfo);
                //     }  
                // }

                // await moodleApi.AssignUsersToCourse(enrolsData);
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
        [Authorize(Roles = Roles.Manager)]
        public IActionResult UnAssignUsersFromCategory([FromBody]EnrolUser[] users)
        {
            try
            {
                // List<CourseDetail> courses = await moodleApi.GetAllCourseInCat(users[0].gradeId); //because All user will be remove from same category
                // List<EnrolUser> enrolsData = new List<EnrolUser>();
                    
                // foreach(var enrolUser in users)
                // {

                //     foreach(var course in courses)
                //     {
                //         EnrolUser enrolInfo = new EnrolUser();
                //         enrolInfo.lessonId = course.id;
                //         enrolInfo.UserId = enrolUser.UserId;

                //         enrolsData.Add(enrolInfo);
                //     }
                // }

                // bool result = await moodleApi.UnAssignUsersFromCourse(enrolsData);
                bool result = true;
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
        [Authorize(Roles = Roles.Manager)]
        public IActionResult AssignUsersToCourse([FromBody]EnrolUser[] users)
        {
            // bool result = await moodleApi.AssignUsersToCourse(users.ToList());
            bool result = true;
            
            // foreach(var enrolUser in users)
            // {
            //     if(enrolUser.RoleId == 3)
            //     {
            //         //Initialize teacherCourse Info
            //         TeacherCourseInfo teacherCourseInfo = new TeacherCourseInfo();
            //         teacherCourseInfo.CourseId = enrolUser.lessonId;
            //         teacherCourseInfo.TeacherId = enrolUser.UserId;//if we set teacher UserId came from our database

            //         appDbContext.TeacherCourse.Add(teacherCourseInfo);
            //         await appDbContext.SaveChangesAsync();
            //     }
            // }

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
        [Authorize(Roles = Roles.Manager)]
        public IActionResult UnAssignFromCourse([FromBody]EnrolUser user)
        {
            try
            {
                //UserId is id in moodle
                // bool resultUnAssign = await moodleApi.UnAssignUsersFromCourse(new List<EnrolUser>() {user});
                bool resultUnAssign = true;

                // if(user.RoleId == 3)
                // {
                //     TeacherCourseInfo teacherCourse = appDbContext.TeacherCourse.Where(x => x.CourseId == user.lessonId).FirstOrDefault(); //Because every course should have one teacher

                //     appDbContext.TeacherCourse.Remove(teacherCourse);
                //     await appDbContext.SaveChangesAsync();
                // }

                return Ok(resultUnAssign);
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
        [Authorize(Roles = Roles.Manager)]
        public async Task<IActionResult> AddBulkTeacher([FromForm]IFormCollection Files)
        {
            try
            {
                bool FileOk = await FileController.UploadFile(Files.Files[0] , Files.Files[0].FileName);

                if(FileOk)
                {
                    string userName = userManager.GetUserId(User);
                    int schoolId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().SchoolId;

                    var users = await CreateBulkUser(Roles.Teacher , Files.Files[0].FileName , schoolId);

                    if(users != null)
                    {
                        return Ok(users);
                    }
                    else
                    {
                        return BadRequest("خطا در بارگذاری اطلاعات لطفا اطلاعات را بررسی کرده و دوباره تلاش نمایید");
                    }
                    
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

                List<TeacherViewModel> result = new List<TeacherViewModel>();
                List<TeacherViewModel> allTeachers = appDbContext.TeacherViews.ToList();

                foreach (var teacher in allTeachers)
                {
                    if(teacher.SchoolsId.Contains(schoolId.ToString() + ","))
                    {
                        result.Add(teacher);
                    }
                }

                result = result.OrderBy(x => x.LastName).ToList();
                return Ok(result);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(UserModel), 200)]
        [ProducesResponseType(typeof(IEnumerable<IdentityError>), 400)]
        [Authorize(Roles = Roles.Manager)]
        public IActionResult CheckNewTeacher(string MelliCode)
        {
            try
            {
                UserModel newTeacher = appDbContext.Users.Where(x => x.MelliCode == MelliCode).FirstOrDefault();

                if(newTeacher != null && !UserService.HasRole(newTeacher , Roles.Teacher))
                {
                    return BadRequest("کد ملی وارد شده مربوط به شخص دیگری است"); 
                }

                return Ok(newTeacher);

            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpPut]
        [ProducesResponseType(typeof(UserModel), 200)]
        [ProducesResponseType(typeof(IEnumerable<IdentityError>), 400)]
        [Authorize(Roles = Roles.Manager)]
        public async Task<IActionResult> AddNewTeacher([FromBody]UserDataModel teacher)
        {
            try
            {
                string userNameManager = userManager.GetUserId(User);
                int schoolId = appDbContext.Users.Where(x => x.UserName == userNameManager).FirstOrDefault().SchoolId;

                teacher.UserName = teacher.MelliCode;
                //teacher.UserType = Roles.Teacher;
                teacher.ConfirmedAcc = true;
                
                if(UserService.CheckPhoneInterupt(teacher.PhoneNumber))
                {
                    return BadRequest("شماره همراه معلم قبلا در سیستم ثبت شده است");
                }

                UserModel newTeacher = userManager.FindByNameAsync(teacher.MelliCode).Result;

                if(newTeacher != null && !UserService.HasRole(newTeacher , Roles.Teacher))
                {
                    return BadRequest("کد ملی وارد شده مربوط به شخص دیگری است"); 
                }

                List<UserDataModel> result = new List<UserDataModel>();

                if(newTeacher != null)
                {
                    teacher.FirstName = newTeacher.FirstName;
                    teacher.LastName = newTeacher.LastName;
                    teacher.Id = newTeacher.Id;
                    
                    teacher.teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == teacher.Id).FirstOrDefault();
                    result = await UserService.EditUsers(new List<UserDataModel>{teacher} , schoolId , true);
                }
                else
                {
                    result = await UserService.CreateUser(new List<UserDataModel>{teacher} , new List<string>{Roles.Teacher} , schoolId);
                }

                if(result.Count > 0)
                {
                    return Ok("معلم با موفقیت افزوده شد");
                }

                return BadRequest("در افزودن معلم مشکلی بوجود آمد");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Manager)]
        public async Task<IActionResult> EditTeacher([FromBody]UserDataModel inputModel)
        {
            try
            {
                UserModel userModel = appDbContext.Users.Where(x => x.Id == inputModel.Id).FirstOrDefault();

                if(userModel.MelliCode != inputModel.MelliCode)
                {
                    if(UserService.CheckMelliCodeInterupt(inputModel.MelliCode , inputModel.Id))
                        return BadRequest(" کد ملی وارد شده وجود دارد");
                }

                if(inputModel.PhoneNumber != userModel.PhoneNumber)
                {
                    if(UserService.CheckPhoneInterupt(inputModel.PhoneNumber))
                        return BadRequest("شماره همراه وارد شده قبلا در سیستم ثبت شده است");
                }

                List<UserDataModel> result = await UserService.EditUsers(new List<UserDataModel>{inputModel});

                if(result.Count > 0)
                {
                    return Ok("معلم با موفقیت ویرایش شد");
                }

                return BadRequest("ویرایش معلم با مشکل مواجه شد");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Manager)]
        public async Task<IActionResult> DeleteTeacher([FromBody]List<int> teacherIds)
        {
            try
            {
                string userNameManager = userManager.GetUserId(User);
                UserModel manager = appDbContext.Users.Where(x => x.UserName == userNameManager).FirstOrDefault();
                SchoolModel school = appDbContext.Schools.Where(x => x.ManagerId == manager.Id).FirstOrDefault();

                int schoolId = (school != null ? school.Id : -1);

                if(schoolId == -1)
                {
                    return BadRequest("شما دسترسی به حذف معلم ندارید");
                }

                UserService UserService = new UserService(userManager);

                foreach (int teacherId in teacherIds)
                {
                    UserModel teacher = appDbContext.Users.Where(x => x.Id == teacherId).FirstOrDefault();
                    
                    TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == teacherId).FirstOrDefault();
                    teacherDetail.SchoolsId = teacherDetail.setTeacherSchoolIds(teacherDetail.getTeacherSchoolIds().Where(x => x != schoolId).ToList());

                    List<EnrolUser> unEnrolData = new List<EnrolUser>();
                    
                    List<ClassScheduleView> schedules = appDbContext.ClassScheduleView.Where(x => x.TeacherId == teacherId && x.School_Id == schoolId).ToList();
                    foreach (var schedule in schedules)
                    {
                        try
                        {
                            EnrolUser unEnrol = new EnrolUser();
                            unEnrol.UserId = teacher.Moodle_Id;
                            unEnrol.lessonId = appDbContext.School_Lessons.Where(x => x.School_Id == schoolId && x.classId == schedule.ClassId && x.Lesson_Id == schedule.LessonId).FirstOrDefault().Moodle_Id;

                            unEnrolData.Add(unEnrol);
                            //appDbContext.ClassWeeklySchedules.Remove(schedule);                             
                        }
                        catch(Exception){}

                    }

                    await moodleApi.UnAssignUsersFromCourse(unEnrolData);
                    //await UserService.DeleteUser(teacher);

                    // appDbContext.TeacherCourse.RemoveRange(appDbContext.TeacherCourse.Where(x => x.TeacherId == teacher.Id));

                    appDbContext.TeacherDetails.Update(teacherDetail);
                    await appDbContext.SaveChangesAsync();
                    
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
                List<StudentViewModel> studentClass = appDbContext.StudentViews.Where(x => x.ClassId == classId).ToList();

                studentClass = studentClass.OrderBy(x => x.LastName).ToList();

                return Ok(studentClass);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Manager)]
        public async Task<IActionResult> AssignUserListToClass([FromBody]List<int> studentIds , int classId)
        {
            try
            {   
                int schoolId = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault().School_Id;

                List<UserModel> result = new List<UserModel>();

                foreach(var studentId in studentIds)
                {
                    UserModel studentModel = appDbContext.Users.Where(x => x.Id == studentId).FirstOrDefault();

                    result.Add(studentModel);
                }

                await managerService.AssignUsersToClass(result , classId);

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
        [Authorize(Roles = Roles.Manager)]
        public async Task<IActionResult> AssignUserToClass([FromForm]IFormCollection Files , int classId)
        {
            try
            {   
                bool FileOk = await FileController.UploadFile(Files.Files[0] , Files.Files[0].FileName);

                List<UserDataModel> userDataModels = new List<UserDataModel>();
                List<UserModel> userModels = new List<UserModel>();
                BulkData data = new BulkData();

                int schoolId = 0;
                if(FileOk)
                {
                    string userName = userManager.GetUserId(User);
                    schoolId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().SchoolId;

                    data = await CreateBulkUser(Roles.Student , Files.Files[0].FileName , schoolId);
                    userDataModels = data.usersData;
                }

                foreach (var user in userDataModels)
                {
                    var serialized = JsonConvert.SerializeObject(user);
                    UserModel userModel = JsonConvert.DeserializeObject<UserModel>(serialized);
                    userModels.Add(userModel);
                }

                await managerService.AssignUsersToClass(userModels , classId);

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
        [Authorize(Roles = Roles.Manager)]
        public async Task<IActionResult> UnAssignUserFromClass([FromBody]List<int> userIds , int classId)
        {
            try
            {   
                int classMoodleId = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault().Moodle_Id;

                List<Class_WeeklySchedule> schedules = appDbContext.ClassWeeklySchedules.Where(x => x.ClassId == classId).ToList();
                List<EnrolUser> unEnrolsData = new List<EnrolUser>();

                List<School_studentClass> removedStudents = new List<School_studentClass>();
                foreach (var userid in userIds)
                {
                    int moodelId = appDbContext.Users.Where(x => x.Id == userid).FirstOrDefault().Moodle_Id;

                    School_studentClass student = appDbContext.School_StudentClasses.Where(x => x.UserId == userid).FirstOrDefault();
                    if(student != null)
                    {
                        foreach(var course in schedules)
                        {
                            School_Lessons lesson = appDbContext.School_Lessons.Where(x => x.classId == classId && x.Lesson_Id == course.LessonId).FirstOrDefault();
                            EnrolUser enrolInfo = new EnrolUser();
                            enrolInfo.lessonId = lesson.Moodle_Id;
                            enrolInfo.UserId = moodelId;

                            unEnrolsData.Add(enrolInfo);

                            removedStudents.Add(student);
                        }  
                    }
                }

                await moodleApi.UnAssignUsersFromCourse(unEnrolsData);

                appDbContext.School_StudentClasses.RemoveRange(removedStudents);
                await appDbContext.SaveChangesAsync();

                return Ok(true);
            }
            catch(Exception ex)
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
        public async Task<BulkData> CreateBulkUser(string userType , string fileName , int schoolId)
        {
            try
            {
                //Username and password Default is MelliCode

                //1 - Read data from excel
                //2 - Check valid data
                //3 - Add user to Database
                //3.1 - don't add duplicate username 
                int sexuality = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault().sexuality;

                List<UserDataModel> excelUsers = FileController.excelReader_Users(fileName , (userType == Roles.Teacher)).usersData;
                List<UserDataModel> newUsers = new List<UserDataModel>();
                List<UserDataModel> correctUser = new List<UserDataModel>();
                List<UserDataModel> duplicateUser = new List<UserDataModel>();

                List<UserModel> usersMoodle = new List<UserModel>();
                List<string> errors = new List<string>();
                
                foreach (var selectedUser in excelUsers)
                {
                    try
                    {
                        selectedUser.ConfirmedAcc = true;
                        selectedUser.UserName = selectedUser.MelliCode;
                        //selectedUser.UserType = userType;
                        selectedUser.SchoolId = schoolId;

                        UserModel userModel = await userManager.FindByNameAsync(selectedUser.UserName);

                        if(userModel == null)//Check for duplicate Username
                        {                        
                            if(!UserService.CheckMelliCodeInterupt(selectedUser.MelliCode , 0))
                            {
                                if(selectedUser.PhoneNumber == null)
                                {
                                    newUsers.Add(selectedUser);
                                }
                                if(selectedUser.PhoneNumber != null && !UserService.CheckPhoneInterupt(selectedUser.PhoneNumber))
                                {
                                    newUsers.Add(selectedUser);
                                }
                            }
                        }
                        else
                        {
                            selectedUser.Id = userModel.Id;
                            duplicateUser.Add(selectedUser);
                            errors.Add(" کاربر با کد ملی " + selectedUser.MelliCode + "موجود میباشد");
                        }
                    }catch{}

                }
                
                correctUser = await UserService.CreateUser(newUsers , new List<string>{userType} , schoolId);
                await UserService.EditUsers(duplicateUser , schoolId , userType == Roles.Teacher);

                BulkData bulkData = new BulkData();
                bulkData.allCount = excelUsers.Count;
                bulkData.duplicateCount = duplicateUser.Count;
                bulkData.badDataCount = newUsers.Count - correctUser.Count;
                bulkData.newCount = correctUser.Count;
                bulkData.usersData = excelUsers;
                bulkData.errors = errors;

                return bulkData;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);

                BulkData bulkData = new BulkData();
                bulkData.errors = new List<string>{"خطا در بارگذاری اطلاعات لطفا بعدا تلاش نمایید"};

                return null;
            }
        }
        
#endregion
    }
}
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
    [Authorize(Roles = "Manager,Admin")]
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
    
#region UserAction


        [HttpGet]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetAllStudent() 
        {
            try
            {
                
                string strRoleId = await roleManager.GetRoleIdAsync(new IdentityRole<int>{Name = "Manager"});
                int roleId = int.Parse(strRoleId);
                var userInRole = appDbContext.UserRoles.Where(x => x.RoleId == roleId);
                List<UserModel> mangers = new List<UserModel>();
                foreach (var user in userInRole)
                {
                    UserModel manager = appDbContext.Users.Where(x => x.Id == user.UserId).FirstOrDefault();
                    mangers.Add(manager);
                }

                List<UserModel> AllStudent = appDbContext.Users.Where(x => !x.IsTeacher && x.ConfirmedAcc && x.UserName != "Admin").ToList();

                List<UserModel> Result = new List<UserModel>();

               //Remove Manager from result

                foreach(var Student in AllStudent)
                {
                    if(mangers.Where(x => x.Id == Student.Id) == null)
                        Result.Add(Student);
                }

                return Ok(Result);
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
                    UserDetail userDetail = new UserDetail();
                    userDetail = appDbContext.UserDetails.Where(x => x.UserId == user.Id).FirstOrDefault();

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
                    var errors = await CreateBulkUser(false , "BulkUserData.xlsx" , CategoryId);
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
        public async Task<IActionResult> AddBulkTeacher([FromForm]IFormCollection Files)
        {
            try
            {
                bool FileOk = await UploadFile(Files.Files[0] , "BulkTeacher.xlsx");

                if(FileOk)
                {
                    var errors = CreateBulkUser(true , "BulkTeacher.xlsx");
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
                    
                    UserDetail userDetail = appDbContext.UserDetails.Where(x => x.UserId == id).FirstOrDefault();
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
                return Ok(appDbContext.Users.Where(user => user.IsTeacher).ToList());
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
                teacher.IsTeacher = true;
                teacher.ConfirmedAcc = true;
                
                IdentityResult resultCreate = userManager.CreateAsync(teacher , teacher.MelliCode).Result;

                if(resultCreate.Succeeded)
                {
                    bool resultAddRTeacher = userManager.AddToRoleAsync(teacher , "Teacher").Result.Succeeded;
                    bool resultAddRUser = userManager.AddToRoleAsync(teacher , "User").Result.Succeeded;

                    int userId = userManager.FindByNameAsync(teacher.MelliCode).Result.Id;

                    UserDetail userDetail = new UserDetail();
                    userDetail = teacher.userDetail;

                    if(userDetail != null)
                    {
                        appDbContext.UserDetails.Add(userDetail);
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
        public async Task<IActionResult> DeleteTeacher(int teacherId)
        {
            try
            {
                UserModel teacher = appDbContext.Users.Where(x => x.Id == teacherId).FirstOrDefault();

                await userManager.RemoveFromRoleAsync(teacher , "User");
                await userManager.RemoveFromRoleAsync(teacher , "Teacher");
                await userManager.DeleteAsync(teacher);
            
                appDbContext.SaveChanges();

                return Ok(true);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

#endregion
    
#region Courses


        [HttpPut]
        [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddCoursesToCategory([FromBody]List<int> CourseIds , int CategoryId)
        {
            string error = await moodleApi.AddCoursesToCategory(CourseIds , CategoryId);
            List<CourseDetail> AllcourseDetails = await moodleApi.GetAllCourseInCat(CategoryId);
            List<CourseDetail> newcourseDetails = new List<CourseDetail>();

            foreach (var course in AllcourseDetails)
            {
                if(CourseIds.Where(x => x == course.id).FirstOrDefault() != 0)
                {
                    newcourseDetails.Add(course);
                }
            }
            if(error == null)
            {
                return Ok(newcourseDetails);
            }
            else
            {
                return BadRequest(error);
            }
            
        }

        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> RemoveCourseFromCategory(int courseId )
        {
            string error = await moodleApi.RemoveCourseFromCategory(courseId);
            
            if(error == null)
            {
                return Ok(true);
            }
            else
            {
                return BadRequest(error);
            }
            
        }

   
        [HttpGet]
        [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetAllCourseInCat(int CategoryId)
        {
            try
            {
                if(CategoryId != 0)
                {
                    List<CourseDetail> response = await moodleApi.GetAllCourseInCat(CategoryId);

                    List<CourseDetail> result = new List<CourseDetail>();

                    foreach(var course in response)
                    {
                        TeacherModel_View Teacher = new TeacherModel_View();
                        Teacher = appDbContext.TeacherView.Where(x => x.CourseId == course.id).FirstOrDefault();

                        if(Teacher != null)
                        {
                            string TeacherName = Teacher.FirstName + " " + Teacher.LastName;

                            course.TeacherName = TeacherName;
                            course.TeacherId = Teacher.TeacherId;
                        }
                        else
                        {
                            course.TeacherName = "ندارد";
                            course.TeacherId = 0;
                        }

                        result.Add(course);
                    }

                    return Ok(result);
                }
                else
                {
                    return BadRequest("Category ID shouldn't be 0");
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpPut]
        [ProducesResponseType(typeof(CourseDetail), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddNewCourse([FromBody]CourseDetail course)
        {
            try
            {
                
                int CourseId = await moodleApi.CreateCourse(course.shortname , (course.categoryId != 0 ? course.categoryId : 1));
                UserModel Teacher = appDbContext.Users.Where(x => x.Id == course.TeacherId).FirstOrDefault();

                if(CourseId != -1)
                {
                    if(course.TeacherId != 0)
                    {
                        
                        //Initialize teacherCourse Info
                        TeacherCourseInfo teacherCourseInfo = new TeacherCourseInfo();
                        teacherCourseInfo.CourseId = CourseId;
                        teacherCourseInfo.TeacherId = course.TeacherId;

                        EnrolUser CurrentTeacher = new EnrolUser();
                        CurrentTeacher.CourseId = CourseId;
                        CurrentTeacher.RoleId = 3;

                        //Get teacher id from moodle database by its MelliCode from our database
                        int TeacherId = await moodleApi.GetUserId(Teacher.MelliCode);
                        CurrentTeacher.UserId = Teacher.Id;

                        bool result = await moodleApi.AssignUsersToCourse(new List<EnrolUser>(){CurrentTeacher});

                        appDbContext.TeacherCourse.Add(teacherCourseInfo);
                        appDbContext.SaveChanges();
                    }

                    CourseDetail courseDetail = course;
                    courseDetail.id = CourseId;
                    
                    return Ok(courseDetail);
                }
                else
                {
                    return BadRequest("مشکلی در ثبت درس در مودل بوجود آمده است");
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //For add course to category just set category id other wise category id not set
        [HttpPost]
        [ProducesResponseType(typeof(CourseDetail), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> EditCourse([FromBody]CourseDetail course)
        {
            try
            {
                //Previous teacher
                TeacherCourseInfo teacherCourseInfo = appDbContext.TeacherCourse.Where(x => x.CourseId == course.id).FirstOrDefault();

                CourseDetail courseDetail = await moodleApi.GetCourseDetail(course.id);
                course.categoryId = (course.categoryId == 0 ? courseDetail.categoryId : course.categoryId);
                course.shortname = (string.IsNullOrWhiteSpace(course.shortname) ? courseDetail.shortname : course.shortname);

                if(teacherCourseInfo != null)
                    course.TeacherId = (course.TeacherId == 0 ? teacherCourseInfo.TeacherId : course.TeacherId);
                
                string response = await moodleApi.EditCourse(course);


                UserModel Teacher = appDbContext.Users.Where(x => x.Id == course.TeacherId).FirstOrDefault();

                if(string.IsNullOrEmpty(response))
                {
                    //Initialize teacherCourse Info

                    UserModel previousTeacherInfo = null;

                    if(teacherCourseInfo == null && Teacher != null)
                    {
                        teacherCourseInfo = new TeacherCourseInfo();
                        teacherCourseInfo.CourseId = course.id;
                        teacherCourseInfo.TeacherId = Teacher.Id;

                        appDbContext.TeacherCourse.Add(teacherCourseInfo);
                        appDbContext.SaveChanges();

                        
                    }

                    if(teacherCourseInfo != null)
                    {
                        previousTeacherInfo = appDbContext.Users.Where(x => x.Id == teacherCourseInfo.TeacherId).FirstOrDefault();
                    }

                    EnrolUser previousTeacher = null;
                    //Get teacher id from moodle database by its MelliCode from our database

                    if(previousTeacherInfo != null)
                    {
                        previousTeacher = new EnrolUser();

                        int previousTeacherId = await moodleApi.GetUserId(previousTeacherInfo.MelliCode); //Teacher id in moodle
                        previousTeacher.UserId = previousTeacherId;
                        previousTeacher.CourseId = course.id;
                        previousTeacher.RoleId = 3;
                    }

                    
                    EnrolUser newTeacher = null;

                    if(Teacher != null)
                    {
                        newTeacher = new EnrolUser();
                        //Get teacher id from moodle database by its MelliCode from our database
                        int TeacherId = await moodleApi.GetUserId(Teacher.MelliCode); //Teacher id in moodle

                        newTeacher.CourseId = course.id;
                        newTeacher.RoleId = 3;
                        newTeacher.UserId = TeacherId;
                    }

                    bool resultUnAssign = true;
                    if(previousTeacher != null)
                    {
                        resultUnAssign = await moodleApi.UnAssignUsersFromCourse(new List<EnrolUser>() {previousTeacher});
                    }

                    if(newTeacher != null)
                    {
                        if(resultUnAssign)
                        {
                            bool resultAssign = await moodleApi.AssignUsersToCourse(new List<EnrolUser>() {newTeacher});
                            if(resultAssign)
                            {
                                teacherCourseInfo.TeacherId = course.TeacherId;
                                appDbContext.TeacherCourse.Update(teacherCourseInfo);
                                appDbContext.SaveChanges();
                                
                            }
                        }
                    }
            

                    return Ok(course);
                }
                else
                {
                    return BadRequest("در ویرایش درس در سرور مودل مشکلی پیش آمد");
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> DeleteCourse([FromBody]CourseDetail _modelCourse)
        {
            try
            {
                
                string result = await moodleApi.DeleteCourse(_modelCourse.id);

                if(result == null)
                {
                    TeacherCourseInfo Course = appDbContext.TeacherCourse.Where(x => x.CourseId == _modelCourse.id).FirstOrDefault();
                    if(Course != null)
                    {
                        appDbContext.TeacherCourse.Remove(Course);
                        appDbContext.SaveChanges();
                    }

                    return Ok(_modelCourse);
                }
                else
                {
                    return BadRequest(result);
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

#endregion
    
#region Categories

    [HttpGet]
    [ProducesResponseType(typeof(List<CategoryDetail>), 200)]
    [ProducesResponseType(typeof(string), 400)]
    public async Task<IActionResult> GetAllCategory()
    {
        try
        {
            
            List<CategoryDetail_moodle> result = await moodleApi.GetAllCategories();
            List<CategoryDetail> Categories = new List<CategoryDetail>();

            foreach(var cat in result)
            {
                if(cat.id != 1)  // Miscellaneous Category
                {
                    CategoryDetail cateDetail = new CategoryDetail();
                    cateDetail.Id = cat.id;
                    cateDetail.Name = cat.name;

                    Categories.Add(cateDetail);
                }
            }

            return Ok(Categories);
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut]
    [ProducesResponseType(typeof(CategoryDetail), 200)]
    [ProducesResponseType(typeof(bool), 400)]
    public async Task<IActionResult> AddNewCategory([FromBody]CategoryDetail Category)
    {
        try
        {
            int categoryId = await moodleApi.CreateCategory(Category.Name , Category.ParentCategory);

            if(categoryId != -1)
            {
                Category.Id = categoryId;

                return Ok(Category);
            }
            else
            {
                return BadRequest(false);
            }
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(CategoryDetail), 200)]
    [ProducesResponseType(typeof(bool), 400)]
    public async Task<IActionResult> EditCategory([FromBody]CategoryDetail Category)
    {
        try
        {
            bool result = await moodleApi.EditCategory(Category);

            if(result)
            {
                return Ok(Category);
            }
            else
            {
                return BadRequest(false);
            }
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    [ProducesResponseType(typeof(bool), 200)]
    [ProducesResponseType(typeof(bool), 400)]
    public async Task<IActionResult> DeleteCategory([FromBody]CategoryDetail Category)
    {
        try
        {
            
            bool result = await moodleApi.DeleteCategory(Category.Id);

            if(result)
            {
                return Ok(true);
            }
            else
            {
                return BadRequest(false);
            }
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
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<string[]> CreateBulkUser(bool IsTeacher , string fileName , int CategoryId = -1)
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
                            userDetail = new UserDetail(){
                                LatinFirstname = excelData.GetValue(5).ToString(),
                                LatinLastname = excelData.GetValue(6).ToString()
                            }
                        };

                        selectedUser.ConfirmedAcc = true;
                        selectedUser.UserName = selectedUser.MelliCode;
                        selectedUser.IsTeacher = IsTeacher;

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
                            if(userManager.AddToRolesAsync(user , new string[]{"User" , (IsTeacher ? "Teacher" : null)}).Result.Succeeded)
                            {
                                ldap.AddUserToLDAP(user);
                            }
                        }
                        userModels.Add(user);//Use for add user to moodle
                    }

                    await moodleApi.CreateUsers(userModels);
                    List<EnrolUser> enrolUsers = new List<EnrolUser>();

                    foreach(var user in userModels)
                    {
                        int userMoodle_id = await moodleApi.GetUserId(user.MelliCode);
                        user.Moodle_Id = userMoodle_id;
                        appDbContext.Users.Update(user);

                        if(IsTeacher)
                        {
                            EnrolUser enrolUser = new EnrolUser();
                            enrolUser.RoleId = 5;
                            enrolUser.CategoryId = CategoryId;
                            enrolUser.UserId = userMoodle_id;

                            enrolUsers.Add(enrolUser);
                        }
                    }

                    await moodleApi.AssignUsersToCourse(enrolUsers);
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
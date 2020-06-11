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

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        
        private readonly AppSettings appSettings;
        private readonly UserManager<UserModel> userManager;
        private readonly AppDbContext appDbContext;
        private readonly SignInManager<UserModel> signInManager;

        MoodleApi moodleApi;
        LDAP_db ldap;
        
        public AdminController(UserManager<UserModel> _userManager 
                                , SignInManager<UserModel> _signinManager
                                , AppDbContext dbContext
                                , IOptions<AppSettings> _appsetting)
        {
            userManager = _userManager;
            appDbContext = dbContext;
            signInManager =_signinManager;
            appSettings = _appsetting.Value;

            moodleApi = new MoodleApi(appSettings);
            ldap = new LDAP_db(appSettings);
        }
    
#region UserAction

        [HttpGet]
        public IActionResult GetNewUsers()
        {
            try
            {
                List<UserModel> NewUsers = appDbContext.Users.Where(x => x.ConfirmedAcc == false).ToList();
                return Ok(NewUsers);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut]
        public async Task<IActionResult> AddBulkUser()
        {
            try
            {
                //Username and password Default is MelliCode

                //1 - Read data from excel
                //2 - Check valid data
                //3 - Add user to Database
                //3.1 - don't add duplicate username 

                List<UserModel> users = new List<UserModel>();
                List<string> errors = new List<string>();
                var fileName = "./ExcelData/Users.xlsx";

                System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
                using (var stream = System.IO.File.Open(fileName, FileMode.Open, FileAccess.Read))
                {
                    using (var excelData = ExcelReaderFactory.CreateReader(stream))
                    {
                        excelData.Read(); //Ignore column header name

                        while (excelData.Read()) //Each row of the file
                        {
                            UserModel selectedUser = new UserModel
                            {
                                FirstName = excelData.GetValue(0).ToString(),
                                LastName = excelData.GetValue(1).ToString(),
                                MelliCode = excelData.GetValue(2).ToString(),
                                PhoneNumber = excelData.GetValue(3).ToString(),
                                Email = (excelData.GetValue(4) != null ? excelData.GetValue(4).ToString() : "")
                            };
                            selectedUser.ConfirmedAcc = true;
                            selectedUser.UserName = selectedUser.MelliCode;

                            if(await userManager.FindByNameAsync(selectedUser.UserName) == null)
                            {
                                users.Add(selectedUser);
                            }
                            else
                            {
                                errors.Add(" کاربر با کد ملی " + selectedUser.MelliCode + "موجود میباشد");
                            }
                        }

                        foreach(var user in users)
                        {
                            bool result = userManager.CreateAsync(user , user.MelliCode).Result.Succeeded;
                            if(result)
                            {
                                if(userManager.AddToRoleAsync(user , "User").Result.Succeeded)
                                {
                                    ldap.AddUserToLDAP(user);
                                }
                            }
                            
                        }
                    }
                }
                return Ok(errors);
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
        public IActionResult ConfirmUsers(int UserId)
        {
            try
            {
                var SelectedUser = appDbContext.Users.Where(user => user.Id == UserId).FirstOrDefault();

                SelectedUser.ConfirmedAcc = true;
                ldap.AddUserToLDAP(SelectedUser);

                appDbContext.Users.Update(SelectedUser);
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
        public async Task<IActionResult> AssignUserToCourse([FromBody]EnrolUser[] users)
        {
            bool result = await moodleApi.AssignUsersToCourse(users.ToList());

            if(result)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<IActionResult> UnAssignFromCourse([FromBody]EnrolUser user)
        {
            try
            {
                bool resultUnAssign = await moodleApi.UnAssignUserFromCourse(user.UserId , user.CourseId);
                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
#endregion

#region Teacher

        [HttpGet]
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
        public IActionResult AddNewTeacher([FromBody]UserModel teacher)
        {
            try
            {
                teacher.UserName = teacher.MelliCode;
                teacher.IsTeacher = true;
                
                userManager.CreateAsync(teacher , teacher.MelliCode);
                userManager.AddToRoleAsync(teacher , "Teacher");
                userManager.AddToRoleAsync(teacher , "User");
                appDbContext.SaveChanges();

                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpPost]
        public IActionResult EditTeacher([FromBody]UserModel teacher)
        {
            try
            {
                appDbContext.Users.Update(teacher);
                appDbContext.SaveChanges();

                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpDelete]
        public IActionResult DeleteTeacher(int teacherId)
        {
            try
            {
                UserModel teacher = appDbContext.Users.Where(x => x.Id == teacherId).FirstOrDefault();

                userManager.RemoveFromRoleAsync(teacher , "User");
                userManager.RemoveFromRoleAsync(teacher , "Teacher");
                userManager.DeleteAsync(teacher);
            
                appDbContext.SaveChanges();

                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

#endregion
    
#region Courses

        [HttpGet]
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
                            string TeacherName = Teacher.Firstname + Teacher.Lastname;

                            course.TeacherName = TeacherName;
                            course.TeacherId = Teacher.Id;
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
        public async Task<IActionResult> AddNewCourse([FromBody]CourseDetail course)
        {
            try
            {
                
                int CourseId = await moodleApi.CreateCourse(course.shortname , (course.categoryId != 0 ? course.categoryId : 1));
                UserModel Teacher = appDbContext.Users.Where(x => x.Id == course.TeacherId).FirstOrDefault();

                if(CourseId != -1)
                {
                    //Initialize teacherCourse Info
                    TeacherCourseInfo teacherCourseInfo = new TeacherCourseInfo();
                    teacherCourseInfo.CourseId = CourseId;
                    teacherCourseInfo.TeacherId = course.TeacherId;

                    //Get teacher id from moodle database by its MelliCode from our database
                    List<EnrolUser> Teachers = new List<EnrolUser>();
                    EnrolUser CurrentTeacher = new EnrolUser();
                    CurrentTeacher.CourseId = CourseId;
                    CurrentTeacher.RoleId = 3;

                    int TeacherId = await moodleApi.GetUserId(Teacher.MelliCode);
                    CurrentTeacher.UserId = TeacherId;

                    Teachers.Add(CurrentTeacher);

                    bool result = await moodleApi.AssignUsersToCourse(Teachers);

                    appDbContext.TeacherCourse.Add(teacherCourseInfo);
                    appDbContext.SaveChanges();

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

        [HttpDelete]
        public async Task<IActionResult> DeleteCourse([FromBody]CourseDetail course)
        {
            try
            {
                
                string result = await moodleApi.DeleteCourse(course.id);

                if(result == null)
                {
                    UserModel Teacher = appDbContext.Users.Where(x => x.Id == course.TeacherId).FirstOrDefault();
                    appDbContext.Remove(Teacher);
                    appDbContext.SaveChanges();

                    return Ok(true);
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

        //For add course to category just set category id other wise category id not set
        [HttpPost]
        public async Task<IActionResult> EditCourse([FromBody]CourseDetail course)
        {
            try
            {
                
                string response = await moodleApi.EditCourse(course);

                UserModel Teacher = appDbContext.Users.Where(x => x.Id == course.TeacherId).FirstOrDefault();

                if(string.IsNullOrEmpty(response))
                {
                    //Initialize teacherCourse Info
                    TeacherCourseInfo teacherCourseInfo = appDbContext.TeacherCourse.Where(x => x.CourseId == course.id).FirstOrDefault();
                    teacherCourseInfo.TeacherId = course.TeacherId;

                    //Get teacher id from moodle database by its MelliCode from our database
                    List<EnrolUser> Teachers = new List<EnrolUser>();
                    EnrolUser CurrentTeacher = new EnrolUser();
                    CurrentTeacher.CourseId = course.id;
                    CurrentTeacher.RoleId = 3;

                    int TeacherId = await moodleApi.GetUserId(Teacher.MelliCode); //Teacher id in moodle
                    CurrentTeacher.UserId = TeacherId;

                    Teachers.Add(CurrentTeacher);

                    bool resultUnAssign = await moodleApi.UnAssignUserFromCourse(CurrentTeacher.UserId , CurrentTeacher.CourseId);
                    if(resultUnAssign)
                    {
                        bool resultAssign = await moodleApi.AssignUsersToCourse(Teachers);
                        if(resultAssign)
                        {
                            appDbContext.TeacherCourse.Update(teacherCourseInfo);
                            appDbContext.SaveChanges();
                            return Ok(true);
                        }
                    }

                    return Ok(false);
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
    
#region Categories

    [HttpGet]
    public async Task<IActionResult> GetAllCategory()
    {
        try
        {
            
            List<CategoryDetail_moodle> result = await moodleApi.GetAllCategories();
            List<CategoryDetail> Categories = new List<CategoryDetail>();

            foreach(var cat in result)
            {
                if(cat.id != "1")  // Miscellaneous Category
                {
                    CategoryDetail cateDetail = new CategoryDetail();
                    cateDetail.Id = int.Parse(cat.id);
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
    public async Task<IActionResult> AddNewCategory([FromBody]CategoryDetail Category)
    {
        try
        {
            
            bool result = await moodleApi.CreateCategory(Category.Name , Category.ParentCategory);

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

    [HttpPost]
    public async Task<IActionResult> EditCategory([FromBody]CategoryDetail Category)
    {
        try
        {
            
            bool result = await moodleApi.EditCategory(Category);

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

    [HttpPost]
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
    
    }
}
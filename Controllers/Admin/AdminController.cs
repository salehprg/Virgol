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
using Helper;
using Microsoft.Extensions.Options;
using lms_with_moodle.Helper;

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
            MoodleApi api = new MoodleApi();
            bool result = await api.AssignUsersToCourse(users.ToList());

            if(result)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

#endregion

#region Teacher

        [HttpGet]
        public IActionResult TeacherList()
        {
            try
            {
                return Ok(appDbContext.Teachers.ToList());
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public IActionResult AddNewTeacher([FromBody]TeacherModel teacher)
        {
            try
            {
                appDbContext.Teachers.Add(teacher);
                appDbContext.SaveChanges();

                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpPost]
        public IActionResult EditTeacher([FromBody]TeacherModel teacher)
        {
            try
            {
                appDbContext.Teachers.Update(teacher);
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
                TeacherModel teacher = appDbContext.Teachers.Where(x => x.Id == teacherId).FirstOrDefault();

                appDbContext.Teachers.Remove(teacher);
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
        public async Task<IActionResult> GetAllCourseIncat(int CategoryId)
        {
            try
            {
                MoodleApi moodleApi = new MoodleApi();
                List<CourseDetail> result = await moodleApi.GetAllCourseInCat(CategoryId);

                return Ok(result);
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
                MoodleApi moodleApi = new MoodleApi();
                bool result = await moodleApi.CreateCourse(course.shortname , course.categoryId);

                if(result)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest();
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
                MoodleApi moodleApi = new MoodleApi();
                string result = await moodleApi.DeleteCourse(course.id);

                if(result == null)
                {
                    return Ok();
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
                MoodleApi moodleApi = new MoodleApi();
                string result = await moodleApi.EditCourse(course);

                if(result == null)
                {
                    return Ok();
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
    public async Task<IActionResult> GetAllCategory()
    {
        try
        {
            MoodleApi moodleApi = new MoodleApi();
            List<AllCourseCatDetail_moodle> result = await moodleApi.GetAllCategories();
            List<CategoryDetail> Categories = new List<CategoryDetail>();

            foreach(var cat in result)
            {
                CategoryDetail cateDetail = new CategoryDetail();
                cateDetail.Id = int.Parse(cat.id);
                cateDetail.Name = cat.categoryname;

                Categories.Add(cateDetail);
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
            MoodleApi moodleApi = new MoodleApi();
            bool result = await moodleApi.CreateCategory(Category.Name , Category.ParentCategory);

            if(result)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
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
            MoodleApi moodleApi = new MoodleApi();
            bool result = await moodleApi.EditCategory(Category);

            if(result)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteCategory([FromBody]CategoryDetail Category)
    {
        try
        {
            MoodleApi moodleApi = new MoodleApi();
            bool result = await moodleApi.DeleteCategory(Category.Id);

            if(result)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
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
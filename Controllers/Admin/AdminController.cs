using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Models;
using Microsoft.AspNetCore.Identity;
using Models.User;
using ExcelDataReader;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using Novell.Directory.Ldap;

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<UserModel> userManager;
        private readonly AppDbContext appDbContext;
        private readonly SignInManager<UserModel> signInManager;

        LdapConnection ldapConn;
        public AdminController(UserManager<UserModel> _userManager 
                                , SignInManager<UserModel> _signinManager
                                , AppDbContext dbContext)
        {
            userManager = _userManager;
            appDbContext = dbContext;
            signInManager =_signinManager;

            // Creating an LdapConnection instance 
            ldapConn= new LdapConnection();
            ldapConn.Connect("localhost", 10389);
            //Bind function will Bind the user object Credentials to the Server
            ldapConn.Bind("uid=admin,ou=system" ,"secret");

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
                                    AddUserToLDAP(user);
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
        public async Task<IActionResult> ConfirmUsers([FromBody]InputId input)
        {
            try
            {
                var SelectedUsers = appDbContext.Users.Where(user => input.UsersId.Contains(user.Id)).ToList();
                foreach(var user in SelectedUsers)
                {
                    user.ConfirmedAcc = true;
                    AddUserToLDAP(user);
                }

                appDbContext.Users.UpdateRange(SelectedUsers);
                await appDbContext.SaveChangesAsync();

                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        bool AddUserToLDAP(UserModel user)
        {
            try
            {
                //Creates the List attributes of the entry and add them to attribute set 
                LdapAttributeSet attributeSet = new LdapAttributeSet();
                attributeSet.Add( new LdapAttribute("objectclass", "inetOrgPerson"));
                attributeSet.Add( new LdapAttribute("cn", user.FirstName));
                attributeSet.Add( new LdapAttribute("sn", user.LastName));
                attributeSet.Add( new LdapAttribute("employeenumber", user.MelliCode));
                attributeSet.Add( new LdapAttribute("mail", user.Email));
                attributeSet.Add( new LdapAttribute("userPassword", user.MelliCode));

                // DN of the entry to be added
                string containerName = "ou=users,o=LMS";
                string dn = "uid=" + user.MelliCode + "," + containerName;      
                LdapEntry newEntry = new LdapEntry( dn, attributeSet );

                //Add the entry to the directory
                ldapConn.Add( newEntry );

                return true;
            }
            catch
            {
                return false;
            }
        }


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
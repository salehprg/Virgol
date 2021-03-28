using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Models;
using Microsoft.AspNetCore.Identity;
using Models.User;

using Microsoft.AspNetCore.Authorization;
using Virgol.Helper;
using Microsoft.Extensions.Options;
using Models.Users.Roles;

namespace Virgol.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = Roles.api)]
    public class ContactController : ControllerBase
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
        
        public ContactController(UserManager<UserModel> _userManager 
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

            moodleApi = new MoodleApi(AppSettings.GetValueFromDatabase(appDbContext , "Token_moodle"));
            ldap = new LDAP_db(appDbContext);

            UserService = new UserService(userManager , appDbContext);
            managerService = new ManagerService(appDbContext);
            meetingService = new MeetingService(appDbContext , UserService); 
        }

        public async Task<IActionResult> GetContacts(string username)
        {
            try
            {
                if(string.IsNullOrEmpty(username))
                    return BadRequest("مقدار 'username' تنظیم نشده است");

                string[] emailInfo = username.Split('@');
                string email = username;
                if(emailInfo.Length == 1)
                {
                    email += "@vir-gol.ir";
                }

                UserModel userModel = appDbContext.Users.Where(x => x.UserName == username || x.Email == email).FirstOrDefault();
                List<string> roles = await UserService.GetUserRoles(userModel);

                if(userModel == null || string.IsNullOrEmpty(userModel.LatinFirstname) || string.IsNullOrEmpty(userModel.LatinLastname))
                    return Unauthorized("اطلاعات حساب درخواستی موجود نمیباشد یا هنوز در سامانه احراز هویت نشده است");
                    
                List<GroupModel> groups = new List<GroupModel>();
                List<ContactModel> contacts = new List<ContactModel>();

                if(UserService.HasRole(userModel , Roles.Manager , roles))
                {
                    SchoolModel school = appDbContext.Schools.Where(x => x.ManagerId == userModel.Id).FirstOrDefault();
                    List<School_Class> classes = appDbContext.School_Classes.Where(x => x.School_Id == school.Id).ToList();

                    GroupModel tempGroup = new GroupModel();
                    foreach (var classs in classes)
                    {
                        
                        tempGroup = new GroupModel();

                        List<StudentViewModel> students = appDbContext.StudentViews.Where(x => x.ClassId == classs.Id).ToList();

                        contacts = new List<ContactModel>();
                        foreach (var student in students)
                        {
                            UserModel studentModel = appDbContext.Users.Where(x => x.Id == student.Id).FirstOrDefault();
                            if(studentModel != null && studentModel.LatinFirstname != null && studentModel.LatinLastname != null)
                            {
                                ContactModel tempContact = new ContactModel();
                                tempContact.email = studentModel.Email;
                                tempContact.groupId = classs.Id;
                                tempContact.uid = studentModel.Id;
                                tempContact.userName = studentModel.UserName;

                                contacts.Add(tempContact);
                            }
                        }

                        tempGroup.contacts = contacts;
                        tempGroup.groupId = classs.Id;
                        tempGroup.groupName = classs.ClassName;

                        groups.Add(tempGroup);
                    }

                    tempGroup = new GroupModel();
                    contacts = new List<ContactModel>();

                    List<TeacherDetail> teacherDetails = appDbContext.TeacherDetails.ToList();
                    List<TeacherDetail> teachers = new List<TeacherDetail>();

                    foreach (var teacherDetail in teacherDetails)
                    {
                        if(teacherDetail.getTeacherSchoolIds().Any(x => x == school.Id))
                        {
                            teachers.Add(teacherDetail);
                        }
                    }
                    

                    foreach (var teacher in teachers)
                    {
                        ContactModel tempContact = new ContactModel();
                        UserModel teacherModel = appDbContext.Users.Where(x => x.Id == teacher.TeacherId).FirstOrDefault();

                        if(teacherModel != null && teacherModel.LatinFirstname != null && teacherModel.LatinLastname != null)
                        {
                            tempContact.email = teacherModel.Email;
                            tempContact.groupId = school.Id;
                            tempContact.uid = teacherModel.Id;
                            tempContact.userName = teacherModel.UserName;

                            contacts.Add(tempContact);
                        }
                    }

                    tempGroup.contacts = contacts;
                    tempGroup.groupId = school.Id;
                    tempGroup.groupName = "معلم ها";

                    groups.Add(tempGroup);
                }

                if(UserService.HasRole(userModel , Roles.Teacher , roles))
                {
                    TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == userModel.Id).FirstOrDefault();
                    if(teacherDetail != null)
                    {
                        List<int> schoolIds = teacherDetail.getTeacherSchoolIds();
                        foreach (var schoolId in schoolIds)
                        {
                            SchoolModel school = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault();
                            List<ClassScheduleView> classSchedules = appDbContext.ClassScheduleView.Where(x => x.School_Id == school.Id && 
                                                                                                                x.TeacherId == userModel.Id).ToList();
                            
                            
                            var groupedId = classSchedules.GroupBy(g => g.ClassId)
                            .Select(s => s.First()).Select(x => x.ClassId)
                            .ToList();

                            foreach (var classId in groupedId)
                            {
                                GroupModel tempGroup = new GroupModel();

                                School_Class classs = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault();

                                List<StudentViewModel> students = appDbContext.StudentViews.Where(x => x.ClassId == classId).ToList();

                                contacts = new List<ContactModel>();
                                foreach (var student in students)
                                {
                                    UserModel studentModel = appDbContext.Users.Where(x => x.Id == student.Id).FirstOrDefault();
                                    if(studentModel != null && studentModel.LatinFirstname != null && studentModel.LatinLastname != null)
                                    {
                                        ContactModel tempContact = new ContactModel();
                                        tempContact.email = studentModel.Email;
                                        tempContact.groupId = classs.Id;
                                        tempContact.uid = studentModel.Id;
                                        tempContact.userName = studentModel.UserName;

                                        contacts.Add(tempContact);
                                    }
                                }

                                tempGroup.contacts = contacts;
                                tempGroup.groupId = classs.Id;
                                tempGroup.groupName = classs.ClassName + " - " + school.SchoolName;

                                groups.Add(tempGroup);
                            }
                        }
                    }
                    
                }

                if(UserService.HasRole(userModel , Roles.Student , roles))
                {
                    School_studentClass studentClass = appDbContext.School_StudentClasses.Where(x => x.UserId == userModel.Id).FirstOrDefault();
                    if(studentClass != null)
                    {
                        int classId = studentClass.ClassId;
                        School_Class schoolClasss = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault();

                        List<StudentViewModel> students = appDbContext.StudentViews.Where(x => x.ClassId == classId).ToList();

                        GroupModel tempGroup = new GroupModel();

                        contacts = new List<ContactModel>();
                        foreach (var student in students)
                        {
                            UserModel studentModel = appDbContext.Users.Where(x => x.Id == student.Id).FirstOrDefault();
                            if(studentModel != null && studentModel.LatinFirstname != null && studentModel.LatinLastname != null)
                            {
                                ContactModel tempContact = new ContactModel();
                                tempContact.email = studentModel.Email;
                                tempContact.groupId = classId;
                                tempContact.uid = studentModel.Id;
                                tempContact.userName = studentModel.UserName;

                                contacts.Add(tempContact);
                            }
                        }

                        tempGroup.contacts = contacts;
                        tempGroup.groupId = classId;
                        tempGroup.groupName = schoolClasss.ClassName;

                        groups.Add(tempGroup);

                        List<ClassScheduleView> teacherSchs = appDbContext.ClassScheduleView.Where(x => x.ClassId == classId).ToList();
                        
                        var groupedTeacher = teacherSchs.GroupBy(g => g.TeacherId)
                            .Select(s => s.First()).Select(x => x.TeacherId)
                            .ToList();

                        tempGroup = new GroupModel();

                        foreach (var teacherId in groupedTeacher)
                        {
                            contacts = new List<ContactModel>();
                            UserModel teacherModel = appDbContext.Users.Where(x => x.Id == teacherId).FirstOrDefault();
                            if(teacherModel != null && teacherModel.LatinFirstname != null && teacherModel.LatinLastname != null)
                            {
                                ContactModel tempContact = new ContactModel();
                                tempContact.email = teacherModel.Email;
                                tempContact.groupId = userModel.Id;//It means teacher group Id is unique for every Student
                                tempContact.uid = teacherModel.Id;
                                tempContact.userName = teacherModel.UserName;

                                contacts.Add(tempContact);
                            }
                        }

                        tempGroup.contacts = contacts;
                        tempGroup.groupId = userModel.Id;
                        tempGroup.groupName = "معلم های من";
                        groups.Add(tempGroup);
                    }
                }

                return Ok(groups);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
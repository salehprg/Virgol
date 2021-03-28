using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

using Virgol.Helper;

using Models;
using Models.User;
using Models.Users.Roles;

namespace Virgol.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize( Roles = Roles.Teacher + "," + Roles.Manager + "," + Roles.CoManager)]
    public class TeacherController : ControllerBase
    {
        private readonly AppSettings appSettings;
        private readonly AppDbContext appDbContext;
        private readonly UserManager<UserModel> userManager;
        
        public TeacherController(AppDbContext dbContext
                                , IOptions<AppSettings> _appsetting
                                , RoleManager<IdentityRole<int>> _roleManager
                                , UserManager<UserModel> _userManager)
        {
            appDbContext = dbContext;
            appSettings = _appsetting.Value;
            userManager = _userManager;

        }

        [HttpPost]
        public async Task<IActionResult> SetMeetingService(string serviceName)
        {
            try
            {
                string UserName = userManager.GetUserId(User);
                UserModel userModel = appDbContext.Users.Where(x => x.UserName == UserName).FirstOrDefault();

                TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == userModel.Id).FirstOrDefault();

                if(serviceName == ServiceType.BBB || serviceName == ServiceType.AdobeConnect)
                {
                    teacherDetail.MeetingService = serviceName;
                    appDbContext.Update(teacherDetail);

                    await appDbContext.SaveChangesAsync();

                    return Ok("سرویس با موفقیت تغییر یافت");
                }
                else 
                {
                    return BadRequest("نام سرویس دهنده به درستی وارد نشده است");
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);

                return BadRequest("تغییر سرویس با مشکل مواجه شد");
            }
        }
        
        [HttpGet]
        [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        public IActionResult GetSchoolList()
        {
            try
            {
                string userName = userManager.GetUserId(User);
                int teacherId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;
                TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == teacherId).FirstOrDefault();

                List<int> schoolIds = teacherDetail.getTeacherSchoolIds();
                List<SchoolModel> schools = new List<SchoolModel>();

                foreach (var schoolId in schoolIds)
                {
                    SchoolModel school = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault();
                    if(school != null)
                    {
                        schools.Add(school);
                    }
                }

                return Ok(schools);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);

                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        public async Task<IActionResult> GetClassBook(int scheduleId)
        {
            try
            {
                //userManager getuserid get MelliCode field of user beacause we set in token
                string userName = userManager.GetUserId(User);
                int teacherId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;

                List<ClassBook> classBooks = new List<ClassBook>();
                List<Meeting> meetings = new List<Meeting>();

                ClassScheduleView classSchedule = appDbContext.ClassScheduleView.Where(x => x.Id == scheduleId).FirstOrDefault();
                //int classId = appDbContext.ClassWeeklySchedules.Where(x => x.Id == scheduleId).FirstOrDefault().ClassId;

                List<ClassScheduleView> schedules = appDbContext.ClassScheduleView.Where(x => x.TeacherId == classSchedule.TeacherId && x.LessonId == classSchedule.LessonId && x.ClassId == classSchedule.ClassId).ToList();

                foreach (var schedule in schedules)
                {
                    meetings.AddRange(appDbContext.Meetings.Where(x => x.ScheduleId == schedule.Id).ToList());
                }

                List<School_studentClass> students = appDbContext.School_StudentClasses.Where(x => x.ClassId == classSchedule.ClassId).ToList();
                List<School_studentClass> removedStudents = new List<School_studentClass>();

                foreach (var student in students)
                {
                    UserModel studentModel = appDbContext.Users.Where(x => x.Id == student.UserId).FirstOrDefault();
                    ClassBook classBook = new ClassBook();
                    if(studentModel != null)
                    {
                        classBook.AbsentCount = meetings.Count;
                        classBook.Email = studentModel.Email;
                        classBook.FirstName = studentModel.FirstName;
                        classBook.LastName = studentModel.LastName;
                        classBook.MelliCode = studentModel.MelliCode;
                        classBook.Score = 0;
                        classBook.UserId = studentModel.Id;

                        classBooks.Add(classBook);
                    }
                    else
                    {
                        removedStudents.Add(student);
                    }
                }

                if(removedStudents.Count > 0)
                {
                    appDbContext.School_StudentClasses.RemoveRange(removedStudents);
                    await appDbContext.SaveChangesAsync();
                }
                
                List<ParticipantView> result = new List<ParticipantView>();

                foreach (var meeting in meetings)
                {
                    List<ParticipantView> participantViews = appDbContext.ParticipantViews.Where(x => x.MeetingId == meeting.Id).ToList();

                    ClassBook classBook = new ClassBook();

                    foreach (var participant in participantViews)
                    {
                        classBook = classBooks.Where(x => x.UserId == participant.UserId).FirstOrDefault();
                        if(classBook != null && participant.IsPresent)
                        {
                            classBook.AbsentCount--;
                        }

                        if(classBook != null)
                        {
                            if(classBook.ParticipantDetail == null)  
                                classBook.ParticipantDetail = new List<ParticipantView>();

                            classBook.ParticipantDetail.Add(participant);
                        }
                    }

                }

                // var groupedUser = result
                //         .GroupBy(x => x.UserId)
                //         .Select(grp => grp.ToList())
                //         .ToList();

                var lessonDetail = appDbContext.ClassScheduleView.Where(x => x.Id == scheduleId).FirstOrDefault();
                return Ok(new {
                    classBooks,
                    lessonDetail
                    });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


    }
}
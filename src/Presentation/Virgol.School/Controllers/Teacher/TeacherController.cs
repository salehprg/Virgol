using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using System.Net;
using System.Security.Cryptography;
using System.Net.Http;
using System.Net.Http.Headers;
using Models.MoodleApiResponse;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Options;

using lms_with_moodle.Helper;

using Models;
using Models.User;
using Microsoft.AspNetCore.Http;
using System.IO;
using Models.MoodleApiResponse.Activity_Grade_Info;

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize( Roles = Roles.Teacher + "," + Roles.Manager + "," + Roles.CoManager)]
    public class TeacherController : ControllerBase
    {
        private readonly AppSettings appSettings;
        private readonly AppDbContext appDbContext;
        private readonly UserManager<UserModel> userManager;

        //MoodleApi moodleApi;
        
        public TeacherController(AppDbContext dbContext
                                , IOptions<AppSettings> _appsetting
                                , RoleManager<IdentityRole<int>> _roleManager
                                , UserManager<UserModel> _userManager)
        {
            appDbContext = dbContext;
            appSettings = _appsetting.Value;
            userManager = _userManager;

            //moodleApi = new MoodleApi();

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
        public IActionResult GetClassBook(int lessonId)
        {
            try
            {
                //userManager getuserid get MelliCode field of user beacause we set in token
                string userName = userManager.GetUserId(User);
                int teacherId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;

                List<ClassBook> classBooks = new List<ClassBook>();
                List<MeetingView> meetings = appDbContext.MeetingViews.Where(x => x.ScheduleId == lessonId).ToList();

                int classId = appDbContext.ClassWeeklySchedules.Where(x => x.Id == lessonId).FirstOrDefault().ClassId;

                List<School_studentClass> students = appDbContext.School_StudentClasses.Where(x => x.ClassId == classId).ToList();

                foreach (var student in students)
                {
                    UserModel studentModel = appDbContext.Users.Where(x => x.Id == student.UserId).FirstOrDefault();
                    ClassBook classBook = new ClassBook();

                    classBook.AbsentCount = meetings.Count;
                    classBook.Email = studentModel.Email;
                    classBook.FirstName = studentModel.FirstName;
                    classBook.LastName = studentModel.LastName;
                    classBook.MelliCode = studentModel.MelliCode;
                    classBook.Score = 0;
                    classBook.UserId = studentModel.Id;

                    classBooks.Add(classBook);
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

                var lessonDetail = appDbContext.ClassScheduleView.Where(x => x.Id == lessonId).FirstOrDefault();
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

        [HttpGet]
        [Authorize( Roles = Roles.Teacher)]
        [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        public IActionResult GetScheduleList()
        {
            try
            {   
                string userName = userManager.GetUserId(User);
                int teacherId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;
                //We set IdNumber as userId in Token
                
                List<ClassScheduleView> classScheduleViews = appDbContext.ClassScheduleView.Where(x => x.TeacherId == teacherId).ToList();
                var groupedSchedule = new List<ClassScheduleView>();

                foreach (var schedule in classScheduleViews)
                {
                    //int moodleId = appDbContext.School_Lessons.Where(x => x.classId == schedule.ClassId && x.Lesson_Id == schedule.LessonId).FirstOrDefault().Moodle_Id;
                    int moodleId = 0;
                    schedule.moodleUrl = AppSettings.moddleCourseUrl + moodleId;

                    if(groupedSchedule.Where(x => x.ClassId == schedule.ClassId && x.LessonId == schedule.LessonId).FirstOrDefault() == null)
                    {
                        groupedSchedule.Add(schedule);
                    }
                }

                

                return Ok(groupedSchedule);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
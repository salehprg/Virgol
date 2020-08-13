using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Novell.Directory.Ldap;
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
    [Authorize(Roles = "Teacher")]
    public class TeacherController : ControllerBase
    {
        private readonly AppSettings appSettings;
        private readonly AppDbContext appDbContext;
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;

        MoodleApi moodleApi;
        LDAP_db ldap;
        
        public TeacherController(AppDbContext dbContext
                                , IOptions<AppSettings> _appsetting
                                , RoleManager<IdentityRole<int>> _roleManager
                                , UserManager<UserModel> _userManager)
        {
            appDbContext = dbContext;
            appSettings = _appsetting.Value;
            userManager = _userManager;

            moodleApi = new MoodleApi(appSettings);
            ldap = new LDAP_db(appSettings);

        }

#region Meeting
        
        [HttpPost]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public async Task<IActionResult> StartMeeting(int lessonId) 
        {
            try
            {
                string userName = userManager.GetUserId(User);
                int teacherId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;

                ClassScheduleView classSchedule = appDbContext.ClassScheduleView.Where(x => x.Id == lessonId).FirstOrDefault();
                int moodleId = appDbContext.School_Lessons.Where(x => x.classId == classSchedule.ClassId && x.Lesson_Id == classSchedule.LessonId).FirstOrDefault().Moodle_Id;

                CourseDetail lessonDetail = await moodleApi.GetCourseDetail(moodleId);

                DateTime timeNow = DateTime.Now;
                string meetingId = lessonId.ToString() + timeNow.Hour.ToString() + timeNow.Minute.ToString() + timeNow.Second.ToString();

                BBBApi bbbApi = new BBBApi(appSettings);
                MeetingsResponse response = await bbbApi.CreateRoom(lessonDetail.displayname , meetingId);

                if(response.returncode != "FAILED")
                {
                    Meeting meeting = new Meeting();
                    meeting.BBB_MeetingId = meetingId;
                    meeting.MeetingName = lessonDetail.displayname;
                    meeting.LessonId = lessonId;
                    meeting.TeacherId = teacherId;

                    appDbContext.Meetings.Add(meeting);
                    appDbContext.SaveChanges();

                    return Ok();
                }
                
                return BadRequest("در ایجاد کلاس مشکلی پیش آمد");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public async Task<IActionResult> JoinMeeting(string meetingId) 
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel teacher = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();
                int teacherId = teacher.Id;

                Meeting meeting = appDbContext.Meetings.Where(x => x.BBB_MeetingId == meetingId && x.TeacherId == teacherId).FirstOrDefault();
                if(meeting == null)
                    BadRequest("کلاس انتخاب شده اشتباه است");

                BBBApi bbbApi = new BBBApi(appSettings);
                string classUrl = await bbbApi.JoinRoom(true , meeting.BBB_MeetingId,teacher.FirstName + " " + teacher.LastName);

                if(classUrl != null)
                {
                    return Ok(classUrl);
                }
                
                return BadRequest("در ورود  کلاس مشکلی پیش آمد");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public IActionResult GetRecentClass() 
        {
            try
            {
                string userName = userManager.GetUserId(User);
                int teacherId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;

                int currentHour = DateTime.Now.Hour;
                List<ClassScheduleView> classes = appDbContext.ClassScheduleView.Where(x => x.TeacherId == teacherId && x.StartHour >= currentHour).ToList();
                List<Meeting> activeMeetings = appDbContext.Meetings.Where(x => x.TeacherId == teacherId && !x.Finished).ToList();

                List<ClassScheduleView> result = new List<ClassScheduleView>();
                //Remove active meeting from all meeting
                foreach (var schedule in classes)
                {
                    if(activeMeetings.Where(x => x.LessonId == schedule.Id).FirstOrDefault() == null)
                    {
                        School_Class classInfo = appDbContext.School_Classes.Where(x => x.Id == schedule.ClassId).FirstOrDefault();
                        schedule.className = classInfo.ClassName;
                        SchoolModel schoolInfo = appDbContext.Schools.Where(x => x.Id == classInfo.School_Id).FirstOrDefault();
                        schedule.schoolName = schoolInfo.SchoolName;

                        result.Add(schedule);
                    }
                }

                result = result.OrderBy(x => x.StartHour).Take(5).ToList();

                return Ok(result);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<Meeting>), 200)]
        public IActionResult GetMeetingList() 
        {
            try
            {
                //userManager getuserid get MelliCode field of user beacause we set in token
                string userName = userManager.GetUserId(User);
                int teacherId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;

                List<Meeting> Meetings = appDbContext.Meetings.Where(x => x.TeacherId == teacherId && !x.Finished).ToList();

                foreach (var meeting in Meetings)
                {
                    ClassScheduleView classs = appDbContext.ClassScheduleView.Where(x => x.Id == meeting.LessonId).FirstOrDefault();

                    School_Class classInfo = appDbContext.School_Classes.Where(x => x.Id == classs.ClassId).FirstOrDefault();
                    meeting.className = classInfo.ClassName;
                    SchoolModel schoolInfo = appDbContext.Schools.Where(x => x.Id == classInfo.School_Id).FirstOrDefault();
                    meeting.schoolName = schoolInfo.SchoolName;

                }

                return Ok(Meetings);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<Participant_View>), 200)]
        public IActionResult GetMeetingDetail(int MeetingId) 
        {
            try
            {
                Meeting meeting = appDbContext.Meetings.Where(x => x.Id == MeetingId).FirstOrDefault();
                List<ParticipantInfo> attendees = appDbContext.ParticipantInfos.Where(x => x.MeetingId == MeetingId).ToList();
                List<Participant_View> Result = new List<Participant_View>();

                foreach (var attendee in attendees)
                {
                    Participant_View participant = new Participant_View();
                    UserModel user = appDbContext.Users.Where(x => x.Moodle_Id == attendee.Moodle_Id).FirstOrDefault();

                    participant.FirstName = user.FirstName;
                    participant.LasstName = user.LastName;
                    participant.IdNumber = user.MelliCode;
                    participant.PresentPercent = ((float)attendee.PresentCount / (float)meeting.CheckCount) * 100;

                    participant.IsPresent = (participant.PresentPercent < 75 ? false : true);

                    Result.Add(participant);
                }

                return Ok(Result);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
#endregion

#region Category
        [HttpGet]
        [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        public async Task<IActionResult> GetCetegoryNames()
        {
            
            //userManager getuserid get MelliCode field of user beacause we set in token
            int UserId = await moodleApi.GetUserId(userManager.GetUserId(User));

            if(UserId != -1)
            {
                List<CourseDetail> userCourses = await moodleApi.getUserCourses(UserId);
                var groupedCategory = userCourses.GroupBy(course => course.categoryId).ToList(); //لیستی برای بدست اوردن ایدی دسته بندی ها

                List<CategoryDetail> categoryDetails = new List<CategoryDetail>();

                foreach(var id in groupedCategory)
                {
                    CategoryDetail categoryDetail = await moodleApi.getCategoryDetail(id.Key);
                    categoryDetail.CourseCount = id.Count();
                    
                    categoryDetails.Add(categoryDetail);
                }

                return Ok(categoryDetails.Where(x => x.ParentCategory != 0).ToList());
            }
            else{
                return BadRequest();
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        public async Task<IActionResult> GetCoursesInCategory(int CategoryId)
        {
            
            int UserId = await moodleApi.GetUserId(userManager.GetUserId(User));

            if(UserId != -1)
            {
                List<CourseDetail> userCourses = await moodleApi.getUserCourses(UserId);

                userCourses = userCourses.Where(course => course.categoryId == CategoryId).ToList(); //Categories Courses by Categoty Id
                userCourses.ForEach(x => x.CourseUrl = appSettings.moddleCourseUrl + x.id);

                return Ok(userCourses);
            }
            else
            {
                return BadRequest();
            }
        }

#endregion

#region Grades
        [HttpGet]
        [ProducesResponseType(typeof(List<ScoresReport>), 200)]
        public async Task<IActionResult> GetGradesInCourse(int CourseId) 
        {
            try
            {
                List<AssignmentGrades_moodle> allGrades = await moodleApi.getAllGradesInCourse(CourseId);
                List<ScoresReport> gradeReports = new List<ScoresReport>();

                foreach(var grade in allGrades)
                {
                    ScoresReport gradeReport = new ScoresReport();

                    List<ScoreDetails> scoreDetails = new List<ScoreDetails>();
                    float totalGrade = 0;

                    foreach(var detail in grade.gradeitems.Where(x => x.itemmodule == "quiz" || x.itemmodule == "assign"))
                    {
                        ScoreDetails gradeDetail = new ScoreDetails();
                        gradeDetail.ActivityGrade = detail.graderaw;
                        gradeDetail.ActivityName = detail.itemname;

                        scoreDetails.Add(gradeDetail);

                        totalGrade += detail.graderaw;
                    }

                    gradeReport.FullName = grade.userfullname;
                    gradeReport.scoreDetails = scoreDetails;
                    gradeReport.TotalGrade = totalGrade;

                    gradeReports.Add(gradeReport);
                }
                
                return Ok(gradeReports);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
#endregion

    }
}
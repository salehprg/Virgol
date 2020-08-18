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
using Newtonsoft.Json;

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class MeetingController : ControllerBase
    {
        private readonly AppSettings appSettings;
        private readonly AppDbContext appDbContext;
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;

        MoodleApi moodleApi;
        LDAP_db ldap;
        
        public MeetingController(AppDbContext dbContext
                                , IOptions<AppSettings> _appsetting
                                , RoleManager<IdentityRole<int>> _roleManager
                                , UserManager<UserModel> _userManager)
        {
            appDbContext = dbContext;
            appSettings = _appsetting.Value;
            userManager = _userManager;

            moodleApi = new MoodleApi(appSettings);
            ldap = new LDAP_db(appSettings , appDbContext);

        }

#region Meeting
        
        [HttpPost]
        [Authorize(Roles = "Teacher")]
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
                    meeting.StartTime = DateTime.Now;
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
        [Authorize(Roles = "User,Teacher")]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public async Task<IActionResult> JoinMeeting(string meetingId) 
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel user = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();
                int userId = user.Id;
                bool isTeacher = user.userTypeId == (int)UserType.Teacher;

                Meeting meeting;
                if(isTeacher)
                {
                    meeting = appDbContext.Meetings.Where(x => x.BBB_MeetingId == meetingId && x.TeacherId == userId).FirstOrDefault();
                }
                else
                {
                    meeting = appDbContext.Meetings.Where(x => x.BBB_MeetingId == meetingId).FirstOrDefault();
                }

                if(meeting == null)
                    BadRequest("کلاس انتخاب شده اشتباه است");

                BBBApi bbbApi = new BBBApi(appSettings);
                string classUrl = await bbbApi.JoinRoom(isTeacher , meeting.BBB_MeetingId , user.FirstName + " " + user.LastName , user.Id.ToString());

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

        [HttpPost]
        [Authorize(Roles = "Teacher")]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public async Task<IActionResult> EndMeeting(string bbbMeetingId) 
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel user = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();
                int userId = user.Id;
                bool isTeacher = user.userTypeId == (int)UserType.Teacher;

                Meeting meeting = new Meeting();
                if(isTeacher)
                {
                    meeting = appDbContext.Meetings.Where(x => x.BBB_MeetingId == bbbMeetingId && x.TeacherId == userId).FirstOrDefault();
                }

                if(meeting == null)
                    BadRequest("کلاس انتخاب شده اشتباه است");

                BBBApi bbbApi = new BBBApi(appSettings);
                bool resultEnd = await bbbApi.EndRoom(bbbMeetingId);

                if(resultEnd)
                {
                    Meeting oldMeeting = appDbContext.Meetings.Where(x => x.BBB_MeetingId == bbbMeetingId).FirstOrDefault();

                    oldMeeting.Finished = true;
                    oldMeeting.EndTime = DateTime.Now;
                    appDbContext.Meetings.Update(oldMeeting);
                    appDbContext.SaveChanges();

                    return Ok("کلاس با موفقیت پایان یافت لطفا چند لحطه صبر نمایید");
                }
                
                return BadRequest("در اتمام کلاس مشکلی پیش آمد");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Authorize(Roles = "User,Teacher")]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public IActionResult GetRecentClass() 
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel user = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();
                int userId = user.Id;
                bool isTeacher = user.userTypeId == (int)UserType.Teacher;

                int currentHour = DateTime.Now.Hour;
                float currentTime = DateTime.Now.Hour + (float)DateTime.Now.Minute / 60;
                
                int dayOfWeek = (int)DateTime.Now.DayOfWeek + 2;
                dayOfWeek = (dayOfWeek > 7 ? dayOfWeek - 7 : dayOfWeek);

                List<MeetingVW> meetingVWs = new List<MeetingVW>();

                if(isTeacher)
                {
                    List<ClassScheduleView> classes = appDbContext.ClassScheduleView.Where(x => x.TeacherId == userId && x.StartHour >= currentTime && x.DayType == dayOfWeek ).ToList();
                    List<Meeting> activeMeetings = appDbContext.Meetings.Where(x => x.TeacherId == userId && !x.Finished).ToList();
                    
                    //Remove active meeting from all meeting
                    foreach (var schedule in classes)
                    {
                        if(activeMeetings.Where(x => x.LessonId == schedule.Id).FirstOrDefault() == null)
                        {
                            MeetingVW meetingVW = new MeetingVW();

                            School_Class classInfo = appDbContext.School_Classes.Where(x => x.Id == schedule.ClassId).FirstOrDefault();
                            meetingVW.className = classInfo.ClassName;
                            SchoolModel schoolInfo = appDbContext.Schools.Where(x => x.Id == classInfo.School_Id).FirstOrDefault();
                            meetingVW.schoolName = schoolInfo.SchoolName;

                            meetingVW.meetingDetail = schedule;

                            meetingVWs.Add(meetingVW);
                        }
                    }

                    meetingVWs = meetingVWs.OrderBy(x => x.meetingDetail.StartHour).Take(5).ToList();

                    return Ok(meetingVWs);
                }
                else
                {
                    School_studentClass school_Student = appDbContext.School_StudentClasses.Where(x => x.UserId == userId).FirstOrDefault();
                    if(school_Student != null)
                    {
                        int userClass = school_Student.ClassId;
                        List<ClassScheduleView> classes = appDbContext.ClassScheduleView.Where(x => x.ClassId == userClass).ToList();
                        List<Meeting> activeMeetings = appDbContext.Meetings.Where(x => !x.Finished).ToList();
                        
                        foreach (var schedule in classes)
                        {
                            MeetingVW meetingVW = new MeetingVW();
                            Meeting meeting = activeMeetings.Where(x => x.LessonId == schedule.Id).FirstOrDefault();
                            if(meeting != null)
                            {
                                var serialized = JsonConvert.SerializeObject(meeting);
                                meetingVW = JsonConvert.DeserializeObject<MeetingVW>(serialized);

                                School_Class classInfo = appDbContext.School_Classes.Where(x => x.Id == schedule.ClassId).FirstOrDefault();
                                meetingVW.className = classInfo.ClassName;
                                SchoolModel schoolInfo = appDbContext.Schools.Where(x => x.Id == classInfo.School_Id).FirstOrDefault();
                                meetingVW.schoolName = schoolInfo.SchoolName;

                                meetingVW.meetingDetail = schedule;

                                meetingVWs.Add(meetingVW);
                            }
                        }
                    }

                    return  Ok(meetingVWs);
                }

               
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Authorize(Roles = "Teacher")]
        [ProducesResponseType(typeof(List<Meeting>), 200)]
        public IActionResult GetMeetingList() 
        {
            try
            {
                //userManager getuserid get MelliCode field of user beacause we set in token
                string userName = userManager.GetUserId(User);
                int teacherId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;

                List<MeetingVW> meetingVWs = new List<MeetingVW>();
                List<Meeting> Meetings = appDbContext.Meetings.Where(x => x.TeacherId == teacherId && !x.Finished).ToList();

                foreach (var meeting in Meetings)
                {
                    MeetingVW meetingVW = new MeetingVW();
                    var serialized = JsonConvert.SerializeObject(meeting);
                    meetingVW = JsonConvert.DeserializeObject<MeetingVW>(serialized);

                    ClassScheduleView classs = appDbContext.ClassScheduleView.Where(x => x.Id == meeting.LessonId).FirstOrDefault();
                    
                    School_Class classInfo = appDbContext.School_Classes.Where(x => x.Id == classs.ClassId).FirstOrDefault();
                    meetingVW.className = classInfo.ClassName;
                    SchoolModel schoolInfo = appDbContext.Schools.Where(x => x.Id == classInfo.School_Id).FirstOrDefault();
                    meetingVW.schoolName = schoolInfo.SchoolName;

                    meetingVW.meetingDetail = classs;

                    meetingVWs.Add(meetingVW);

                }

                return Ok(meetingVWs);
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
                    UserModel user = appDbContext.Users.Where(x => x.Moodle_Id == attendee.UserId).FirstOrDefault();

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

    }
}
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
using System.Globalization;

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

#region AfterMeeting
        [HttpGet]
        [Authorize(Roles = "Teacher")]
        [ProducesResponseType(typeof(List<ParticipantView>), 200)]
        public async Task<IActionResult> GetParticipantList(int meetingId) 
        {
            string userName = userManager.GetUserId(User);
            int userId = appDbContext.Users.Where(x => x.MelliCode == userName).FirstOrDefault().Id;

            List<ParticipantView> participantViews = appDbContext.ParticipantViews.Where(x => x.MeetingId == meetingId && x.UserId != userId).ToList();
            return Ok(participantViews);
        }

        [HttpPost]
        [Authorize(Roles = "Teacher")]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public async Task<IActionResult> SetPresentStatus(List<ParticipantView> students) 
        {
            foreach (var student in students)
            {
                ParticipantInfo participantInfo = appDbContext.ParticipantInfos.Where(x => x.Id == student.Id).FirstOrDefault();
                participantInfo.IsPresent = student.IsPresent;
                
                appDbContext.ParticipantInfos.Update(participantInfo);
            }

            await appDbContext.SaveChangesAsync();
            return Ok(true);
        }

        [HttpGet]
        [Authorize(Roles = "User")]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public async Task<IActionResult> SubmitReview(int meetingId , int Score , string description) 
        {
            //After finished meeting Student can Submit a review
            return Ok();
        }

#endregion

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

                DateTime timeNow = MyDateTime.Now();

                float currentTime = timeNow.Hour + ((float)timeNow.Minute / 60);
                float duration = (classSchedule.EndHour - currentTime) * 60;

                List<Meeting> meetings = appDbContext.Meetings.Where(x => x.TeacherId == teacherId && x.LessonId == lessonId).ToList();
                int newMeetingNo = meetings.Count + 1;

                string meetingName = lessonDetail.displayname + " جلسه " + newMeetingNo;

                Meeting meeting = new Meeting();
                meeting.MeetingName = meetingName;
                meeting.StartTime = timeNow;
                meeting.LessonId = lessonId;
                meeting.TeacherId = teacherId;

                appDbContext.Meetings.Add(meeting);
                appDbContext.SaveChanges();

                string callBackUrl = Request.Scheme + "://" + Request.Host.Value + "/meetingResponse/" + meeting.Id;

                BBBApi bbbApi = new BBBApi(appSettings);
                MeetingsResponse response = await bbbApi.CreateRoom(meetingName , meeting.Id.ToString() , (int)duration , callBackUrl);

                meeting.Id = meeting.Id;

                if(response.returncode != "FAILED")
                {
                    meeting.BBB_MeetingId = meeting.Id.ToString();
                    appDbContext.Meetings.Update(meeting);
                    await appDbContext.SaveChangesAsync();
                
                    return Ok();
                }

                appDbContext.Remove(meeting);
                await appDbContext.SaveChangesAsync();
                
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

                MeetingsResponse meetingsResponse = bbbApi.GetMeetings().Result; 
                List<MeetingInfo> newMeetingList = new List<MeetingInfo>();

                if(meetingsResponse.meetings != null)
                    newMeetingList = meetingsResponse.meetings.meeting; 

                if(!resultEnd && newMeetingList.Where(x => x.meetingID == bbbMeetingId).FirstOrDefault() == null)// it means this class Closed by Moderator and Currently Open in Our Db
                {
                    resultEnd = true;
                }

                if(resultEnd)
                {
                    meeting.Finished = true;
                    meeting.EndTime = MyDateTime.Now();
                    appDbContext.Meetings.Update(meeting);
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

                DateTime currentDateTime = MyDateTime.Now();
                Console.WriteLine(currentDateTime);

                float currentTime = currentDateTime.Hour + ((float)currentDateTime.Minute / 60);
                
                int dayOfWeek = MyDateTime.convertDayOfWeek(currentDateTime);

                List<ClassScheduleView> schedules = appDbContext.ClassScheduleView.Where(x => (currentTime <= x.EndHour && currentTime >= (x.StartHour - 0.25))   && x.DayType == dayOfWeek).ToList();
                List<MeetingView> recentClasses = new List<MeetingView>();
                List<Meeting> activeMeetings = appDbContext.Meetings.Where(x => !x.Finished).ToList();

                if(isTeacher)
                {
                    schedules = schedules.Where(x => x.TeacherId == userId).ToList();
                    activeMeetings = activeMeetings.Where(x => x.TeacherId == userId ).ToList();
                }
                else
                {
                    School_studentClass school_Student = appDbContext.School_StudentClasses.Where(x => x.UserId == userId).FirstOrDefault();
                    int classId = 0;

                    if(school_Student != null)
                    {
                        classId = school_Student.ClassId;
                    }

                    schedules = schedules.Where(x => x.ClassId == classId).ToList();
                }

                foreach (var schedule in schedules)
                {
                    Meeting meeting = activeMeetings.Where(x => x.LessonId == schedule.Id).FirstOrDefault();

                    if(isTeacher)
                    {
                        if(meeting == null)
                        {
                            var serialized = JsonConvert.SerializeObject(schedule);
                            MeetingView meetingVW = JsonConvert.DeserializeObject<MeetingView>(serialized);

                            recentClasses.Add(meetingVW);
                        }
                    }
                    else
                    {
                        var serialized = JsonConvert.SerializeObject(schedule);
                        MeetingView meetingVW = JsonConvert.DeserializeObject<MeetingView>(serialized);

                        if(meeting != null)
                        {
                            meetingVW.BBB_MeetingId = meeting.BBB_MeetingId;
                            meetingVW.MeetingName = meeting.MeetingName;
                        }

                        recentClasses.Add(meetingVW);
                    }
                }

                                
                foreach (var classs in recentClasses)
                {
                    if(classs.BBB_MeetingId != null)
                    {
                        classs.started = true;
                    }
                    else
                    {
                        classs.started = false;
                    }
                }
            
                recentClasses = recentClasses.OrderBy(x => x.StartHour).Take(5).ToList();

                return Ok(recentClasses);
            }
            catch(Exception ex)
            {
                Console.WriteLine("Back : Error" + ex.Message);

                return BadRequest(ex.Message);
            }
        }
        
        [HttpGet]
        [Authorize(Roles = "Manager")]
        [ProducesResponseType(typeof(List<ParticipantView>), 200)]
        public IActionResult GetAllActiveMeeting() 
        {
            string userName = userManager.GetUserId(User);
            int managerId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;
            int schoolId = appDbContext.Schools.Where(x => x.ManagerId == managerId).FirstOrDefault().Id;

            List<School_Class> classes = appDbContext.School_Classes.Where(x => x.School_Id == schoolId).ToList();
            
            DateTime currentDateTime = MyDateTime.Now();

            float currentTime = currentDateTime.Hour + ((float)currentDateTime.Minute / 60);

            int dayOfWeek = MyDateTime.convertDayOfWeek(currentDateTime);

            List<MeetingView> result = new List<MeetingView>();

            foreach (var classs in classes)
            {
                List<ClassScheduleView> schedules = appDbContext.ClassScheduleView.Where(x => x.ClassId == classs.Id && x.DayType == dayOfWeek).ToList();
                List<MeetingView> activeMeetings = appDbContext.MeetingViews.Where(x => x.ClassId == classs.Id && !x.Finished).ToList();

                foreach (var schedule in schedules)
                {
                    MeetingView meetingVW = activeMeetings.Where(x => x.LessonId == schedule.Id).FirstOrDefault();
                    if(meetingVW == null)
                    {
                        meetingVW = new MeetingView();

                        var serialized = JsonConvert.SerializeObject(schedule);
                        meetingVW = JsonConvert.DeserializeObject<MeetingView>(serialized);
                    }

                    result.Add(meetingVW);
                }
            }
        

            var groupedMeetings = result
                    .GroupBy(x => x.ClassId)
                    .Select(grp => grp.ToList())
                    .ToList();

            return Ok(groupedMeetings);
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

                List<MeetingView> meetingViews = appDbContext.MeetingViews.Where(x => x.TeacherId == teacherId && x.Finished == false).ToList();
                    
                return Ok(meetingViews);
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

        [HttpGet]
        [Authorize(Roles = "Teacher")]
        [ProducesResponseType(typeof(List<Meeting>), 200)]
        public async Task<IActionResult> GetRecordList(int meetingId) 
        {
            try
            {

                BBBApi bBApi = new BBBApi(appSettings);
                List<RecordInfo> recordsResponses = (await bBApi.GetMeetingRecords(meetingId.ToString())).recordings.recording;
                    
                return Ok(recordsResponses);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

#endregion

    }
}
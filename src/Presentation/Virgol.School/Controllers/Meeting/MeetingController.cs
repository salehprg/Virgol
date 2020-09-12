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
        private readonly AppDbContext appDbContext;
        private readonly UserManager<UserModel> userManager;
        private readonly MeetingService MeetingService;

        MoodleApi moodleApi;
        LDAP_db ldap;
        
        public MeetingController(AppDbContext dbContext
                                , RoleManager<IdentityRole<int>> _roleManager
                                , UserManager<UserModel> _userManager)
        {
            appDbContext = dbContext;
            userManager = _userManager;

            moodleApi = new MoodleApi();
            ldap = new LDAP_db(appDbContext);
            MeetingService = new MeetingService(appDbContext);

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
            int classId = appDbContext.MeetingViews.Where(x => x.Id == meetingId).FirstOrDefault().ClassId;
            
            List<School_studentClass> studentClasses = appDbContext.School_StudentClasses.Where(x => x.ClassId == classId).ToList();

            foreach (var student in studentClasses)
            {
                if(participantViews.Where(x => x.UserId == student.UserId).FirstOrDefault() == null)
                {
                    ParticipantInfo participant = new ParticipantInfo();
                    participant.IsPresent = false;
                    participant.MeetingId = meetingId;
                    participant.PresentCount = 0;
                    participant.UserId = student.UserId;

                    appDbContext.ParticipantInfos.Add(participant);
                }
            }
            await appDbContext.SaveChangesAsync();
            participantViews = appDbContext.ParticipantViews.Where(x => x.MeetingId == meetingId && x.UserId != userId).ToList();

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
        public IActionResult SubmitReview(int meetingId , int Score , string description) 
        {
            //After finished meeting Student can Submit a review
            return Ok();
        }

#endregion

#region Meeting

        [HttpPost]
        [Authorize(Roles = "Teacher,Manager,Admin")]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public async Task<IActionResult> CreatePrivateRoom(string roomName) 
        {
            try
            {
                string userName = userManager.GetUserId(User);
                int userId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;

                Meeting meeting = await MeetingService.StartPrivateMeeting(roomName , userId);

                if(meeting != null)
                {
                    return Ok(meeting);
                }

                return BadRequest("درایجاد کلاس خصوصی مشکلی پیش آمد");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Authorize(Roles = "Teacher")]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public async Task<IActionResult> StartMeeting(int lessonId) 
        {
            try
            {
                string userName = userManager.GetUserId(User);
                int teacherId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;

                Console.WriteLine(teacherId);

                ClassScheduleView classSchedule = appDbContext.ClassScheduleView.Where(x => x.Id == lessonId).FirstOrDefault();
                
                Console.WriteLine(classSchedule.Id);

                bool mixed = (classSchedule.MixedId != 0 ? true : false); // if Teacher start mixed class

                if(mixed)//if Teacher start Mixed Meeting
                {
                    int parentId = await MeetingService.StartSingleMeeting(classSchedule , teacherId);
                    List<ClassScheduleView> mixedSchedules = appDbContext.ClassScheduleView.Where(x => x.MixedId == classSchedule.MixedId).ToList();

                    Console.WriteLine("Get mixed");
                    foreach (var schedule in mixedSchedules)
                    {
                        await MeetingService.StartMixedMeeting(schedule , teacherId , parentId);
                    }
                }
                else
                {
                    Console.WriteLine("Start Single");
                    int meetingId = await MeetingService.StartSingleMeeting(classSchedule , teacherId);
                    Console.WriteLine("mId = " + meetingId);
                }

                return Ok(true);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Source);
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
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
                
                string URL = await MeetingService.JoinMeeting(user , meetingId);

                if(URL != null)
                {
                    return Ok(URL);
                }

                return BadRequest("در ورود به کلاس مشکلی پیش آمد لطفا چند دقیقه دیگر دوباره تلاش نمایید");
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

                bool isTeacher = user.userTypeId == (int)UserType.Teacher;

                bool result = await MeetingService.EndMeeting(bbbMeetingId , user.Id);

                if(result)
                    return Ok("کلاس با موفقیت پایان یافت لطفا چند لحظه صبر نمایید");
                
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

                List<MeetingView> recentClasses = MeetingService.GetComingMeeting(user);
                                
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
                    MeetingView meetingVW = activeMeetings.Where(x => x.ScheduleId == schedule.Id).FirstOrDefault();
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
                UserModel user = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();

                List<MeetingView> meetingViews = MeetingService.GetActiveMeeting(user);
                    
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

                BBBApi bBApi = new BBBApi();
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
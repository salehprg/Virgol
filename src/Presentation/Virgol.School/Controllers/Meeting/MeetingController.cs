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
using Newtonsoft.Json;
using System.Globalization;

namespace lms_with_moodle.Controllers
{
    
    [ApiController]
    [Authorize(Roles = Roles.User)]
    [Route("api/[controller]/[action]")]
    public class MeetingController : ControllerBase
    {
        private readonly AppDbContext appDbContext;
        private readonly UserManager<UserModel> userManager;
        private readonly MeetingService meetingService;
        UserService UserService;

        
        public MeetingController(AppDbContext dbContext
                                , RoleManager<IdentityRole<int>> _roleManager
                                , UserManager<UserModel> _userManager)
        {
            appDbContext = dbContext;
            userManager = _userManager;

            UserService = new UserService(userManager , appDbContext);
            meetingService = new MeetingService(appDbContext , UserService);

        }

#region AfterMeeting
        [HttpGet]
        [Authorize(Roles = Roles.Teacher)]
        [ProducesResponseType(typeof(List<ParticipantView>), 200)]
        public async Task<IActionResult> GetParticipantList(int meetingId) 
        {
            string userName = userManager.GetUserId(User);
            int userId = appDbContext.Users.Where(x => x.MelliCode == userName).FirstOrDefault().Id;

            Meeting meeting = appDbContext.Meetings.Where(x => x.Id == meetingId).FirstOrDefault();

            if(meeting != null)
            {
                string bbbId = meeting.MeetingId;
                
                try
                {
                    await meetingService.EndMeeting(bbbId , userId);
                }catch{}
            }

            List<ParticipantView> participantViews = appDbContext.ParticipantViews.Where(x => x.MeetingId == meetingId && x.UserId != userId).ToList();
            int? classId = appDbContext.MeetingViews.Where(x => x.Id == meetingId).FirstOrDefault().ClassId;
            
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
        [Authorize(Roles = Roles.Teacher)]
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
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public IActionResult SubmitReview(int meetingId , int Score , string description) 
        {
            //After finished meeting Student can Submit a review
            return Ok();
        }

#endregion

#region Meeting

    #region Private

        [HttpPut]
        [Authorize(Roles = Roles.Teacher + "," + Roles.Manager + "," + Roles.Admin)]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public async Task<IActionResult> CreatePrivateRoom(string roomName) 
        {
            try
            {
                string userName = userManager.GetUserId(User);
                int userId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;

                Meeting meeting = await meetingService.StartPrivateMeeting(roomName , userId);

                if(meeting != null)
                {
                    return Ok(meeting);
                }

                return BadRequest("درایجاد کلاس خصوصی مشکلی پیش آمد");
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public async Task<IActionResult> JoinPrivateRoom(string roomGUID) 
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel user = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();

                Meeting meeting = appDbContext.Meetings.Where(x => x.MeetingId == roomGUID).FirstOrDefault();

                if(meeting != null)
                {
                    string url = await meetingService.JoinMeeting(user , meeting.MeetingId , true);

                    if(url != null)
                    {
                        return Ok(url);
                    }
                }

                return BadRequest("کلاس مورد نظر وجود ندارد");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    #endregion

    #region Meeting Action

        [HttpPost]
        [Authorize(Roles = Roles.Teacher)]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public async Task<IActionResult> StartMeeting(int lessonId) 
        {
            try
            {
                string serviceType = ServiceType.BBB;

                string userName = userManager.GetUserId(User);
                int teacherId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;


                ClassScheduleView classSchedule = appDbContext.ClassScheduleView.Where(x => x.Id == lessonId).FirstOrDefault();
                
                bool mixed = (classSchedule.MixedId != 0 ? true : false); // if Teacher start mixed class

                if(mixed)//if Teacher start Mixed Meeting
                {
                    MixedSchedule mixedSchedule = appDbContext.MixedSchedules.Where(x => x.Id == classSchedule.MixedId).FirstOrDefault();

                    if(mixedSchedule != null)
                    {
                        classSchedule.OrgLessonName = mixedSchedule.MixedName;

                        int parentId = await meetingService.StartSingleMeeting(classSchedule , teacherId);
                        //Get all schedules have same MixedId according to Selected Schedule
                        List<ClassScheduleView> mixedSchedules = appDbContext.ClassScheduleView.Where(x => x.MixedId == classSchedule.MixedId).ToList();

                        foreach (var schedule in mixedSchedules)
                        {
                            schedule.OrgLessonName = mixedSchedule.MixedName;
                            await meetingService.StartMixedMeeting(schedule , teacherId , parentId , serviceType);
                        }
                    }
                }
                else
                {
                    int meetingId = await meetingService.StartSingleMeeting(classSchedule , teacherId);
                }

                return Ok(true);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = Roles.Teacher + "," + Roles.User)]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public async Task<IActionResult> JoinMeeting(string meetingId) 
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel user = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();
                
                string URL = await meetingService.JoinMeeting(user , meetingId);

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
        [Authorize(Roles = Roles.Teacher)]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public async Task<IActionResult> EndMeeting(string bbbMeetingId) 
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel user = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();

                bool isTeacher = UserService.HasRole(user , Roles.Teacher);

                if(isTeacher)
                {
                    bool result = await meetingService.EndMeeting(bbbMeetingId , user.Id);

                    if(result)
                        return Ok("کلاس با موفقیت پایان یافت لطفا چند لحظه صبر نمایید");
                    
                    return BadRequest("در اتمام کلاس مشکلی پیش آمد");
                }

                return Unauthorized("شما دسترسی این کار را ندارید");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Authorize(Roles = Roles.Manager + "," + Roles.CoManager)]
        [ProducesResponseType(typeof(List<ParticipantView>), 200)]
        public IActionResult GetAllActiveMeeting() 
        {
            string userName = userManager.GetUserId(User);
            int managerId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;
            
            List<MeetingView> result = meetingService.GetAllActiveMeeting(managerId);

            result = result.OrderBy(x => x.ClassName).ToList();
            
            var groupedMeetings = result
                    .GroupBy(x => x.ClassId)
                    .Select(grp => grp.ToList())
                    .ToList();

            return Ok(groupedMeetings);
        }

        [HttpGet]
        [Authorize(Roles = Roles.Teacher)]
        [ProducesResponseType(typeof(List<Meeting>), 200)]
        public IActionResult GetMeetingList() 
        {
            try
            {
                //userManager getuserid get MelliCode field of user beacause we set in token
                string userName = userManager.GetUserId(User);
                UserModel user = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();

                List<MeetingView> meetingViews = meetingService.GetActiveMeeting(user);

                meetingViews = meetingViews.OrderBy(x => x.DayType).ToList();


                meetingViews = meetingViews.OrderBy(x => x.StartHour).ToList();

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

    #endregion
#endregion

        [HttpGet]
        [Authorize(Roles = Roles.User + "," + Roles.Teacher)]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public IActionResult GetRecentClass() 
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel user = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();
                int userId = user.Id;
                bool isTeacher = UserService.HasRole(user , Roles.Teacher);

                DateTime currentDateTime = MyDateTime.Now();
                float currentTime = currentDateTime.Hour + ((float)currentDateTime.Minute / 60);
                int dayOfWeek = MyDateTime.convertDayOfWeek(currentDateTime);

                List<MeetingView> recentClasses = meetingService.GetComingMeeting(user);
                                
                if(!isTeacher)
                {
                    recentClasses = recentClasses.Where(x => x.DayType == dayOfWeek).ToList();
                }

                foreach (var classs in recentClasses)
                {
                    if(!isTeacher)
                    {
                        if(currentTime <= classs.EndHour && currentTime >= (classs.StartHour - 0.25))
                        {
                            if(classs.MeetingId != null)
                            {
                                classs.started = true;
                            }
                            else
                            {
                                classs.started = false;
                            }
                        }
                    }
                    else
                    {
                        if(classs.MeetingId != null)
                        {
                            classs.started = true;
                        }
                        else
                        {
                            classs.started = false;
                        }
                    }
                }
            
                recentClasses = recentClasses.OrderBy(x => x.DayType).ToList();

                var groupedMeetings = recentClasses
                    .GroupBy(x => x.DayType).Select(grp => grp.ToList()).ToList();

                for (int i = 0; i <  groupedMeetings.Count ; i++)
                {
                    groupedMeetings[i] = groupedMeetings[i].OrderBy(x => x.StartHour).ToList();
                }

                var result = new List<MeetingView>();

                groupedMeetings.ForEach(x => result.AddRange(x));

                return Ok(result);
            }
            catch(Exception ex)
            {
                Console.WriteLine("Back : Error" + ex.Message);
                Console.WriteLine(ex.StackTrace);

                return BadRequest(ex.Message);
            }
        }
        
#region Recordings

        [HttpGet]
        [ProducesResponseType(typeof(List<Meeting>), 200)]
        public async Task<IActionResult> GetRecordList(int scheduleId) 
        {
            try
            {
                BBBApi bBApi = new BBBApi(appDbContext , scheduleId);
                List<Meeting> meetings = new List<Meeting>();

                ClassScheduleView classSchedule = appDbContext.ClassScheduleView.Where(x => x.Id == scheduleId).FirstOrDefault();

                //Get schedule ids that same lessonId and TeacherId to specific classSchedule
                List<ClassScheduleView> schedules = appDbContext.ClassScheduleView.Where(x => x.TeacherId == classSchedule.TeacherId && x.LessonId == classSchedule.LessonId && x.ClassId == classSchedule.ClassId).ToList();

                foreach (var schedule in schedules)
                {
                    meetings.AddRange(appDbContext.Meetings.Where(x => x.ScheduleId == schedule.Id).ToList());
                }

                List<RecordInfo> recordsResponses = new List<RecordInfo>();
                
                meetings = meetings.OrderBy(x => x.Id).ToList();
                foreach (var meeting in meetings)
                {
                    if(meeting.MeetingId != null)
                    {
                        Recordings recordings = (await bBApi.GetMeetingRecords(meeting.MeetingId.ToString())).recordings;

                        if(recordings != null)
                        {
                            List<RecordInfo> records = recordings.recording;
                            if(records.Count > 0)
                            {
                                records[0].name = classSchedule.OrgLessonName;
                                records[0].url = records[0].playback.format[0].url;
                                records[0].date = meeting.StartTime;

                                recordsResponses.AddRange(records);
                            }
                        }
                    }
                    
                }
                
                    
                return Ok(recordsResponses);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> EditRecording(int recordId)
        {
            try
            {
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message)             ;
                Console.WriteLine(ex.StackTrace);

                return BadRequest(ex.Message);
                throw;
            }
        }
#endregion

#region PreSlide

        public async Task<IActionResult> UploadPreSlide([FromForm]IFormCollection preSlide)
        {
            try
            {
                string userName = userManager.GetUserId(User);
                int userId = appDbContext.Users.Where(x => x.MelliCode == userName).FirstOrDefault().Id;

                bool FileOk = await FileController.UploadFile(preSlide.Files[0] , preSlide.Files[0].FileName , "PreSlides");

                if(FileOk)
                {
                    DocumentModel document = new DocumentModel();
                    document.docName = "PreSlides" + preSlide.Files[0].FileName;
                    document.userId = userId;
                    document.uploadTime = MyDateTime.Now();
                    
                    await appDbContext.Documents.AddAsync(document);
                    await appDbContext.SaveChangesAsync();

                    return Ok(true);
                }

                return Ok(false);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);

                return BadRequest(ex.Message);
            }
                
        }
#endregion
    
    }
}
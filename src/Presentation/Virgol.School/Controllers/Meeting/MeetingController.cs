using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

using Virgol.Helper;

using Models;
using Models.User;
using Microsoft.AspNetCore.Http;
using Models.Users.Roles;

namespace Virgol.Controllers
{
    
    [ApiController]
    [Authorize]
    [Route("api/[controller]/[action]")]
    public class MeetingController : ControllerBase
    {
        private readonly AppDbContext appDbContext;
        private readonly UserManager<UserModel> userManager;
        private readonly MeetingService meetingService;
        UserService UserService;
        SchoolService schoolService;

        
        public MeetingController(AppDbContext dbContext
                                , RoleManager<IdentityRole<int>> _roleManager
                                , UserManager<UserModel> _userManager)
        {
            appDbContext = dbContext;
            userManager = _userManager;

            UserService = new UserService(userManager , appDbContext);
            meetingService = new MeetingService(appDbContext , UserService);
            schoolService = new SchoolService(appDbContext);

        }

#region AfterMeeting
        [HttpGet]
        [Authorize(Roles = Roles.Teacher + " , " + Roles.Manager)]
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
                    if(!meeting.Finished)
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
        [Authorize(Roles = Roles.Teacher + " , " + Roles.Manager)]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public async Task<IActionResult> SetPresentStatus(List<ParticipantView> students) 
        {
            foreach (var student in students)
            {
                ParticipantInfo participantInfo = appDbContext.ParticipantInfos.Where(x => x.Id == student.Id).FirstOrDefault();
                if(participantInfo != null)
                {
                    participantInfo.IsPresent = student.IsPresent;
                    
                    appDbContext.ParticipantInfos.Update(participantInfo);
                }
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
        public async Task<IActionResult> CreatePrivateRoom(string roomName , int schoolId) 
        {
            try
            {
                //return BadRequest("درحال حاضر امکان ایجاد کلاس خصوصی وجود ندارد");

                if(schoolId == 0)
                    return BadRequest("یک مدرسه را برای سرور کلاس انتخاب کنید");

                string userName = userManager.GetUserId(User);
                UserModel userModel = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();
                int userId = userModel.Id;

                TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == userId).FirstOrDefault();
                List<int> schoolIds = teacherDetail.getTeacherSchoolIds();

                if(!schoolIds.Any(x => x == schoolId))
                    return BadRequest("اجازه ساخت کلاس با سرور مدرسه مورد نظر را ندارید");
                
                SchoolModel school = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault();
                roomName = roomName + " - " + school.SchoolName + " - " + userModel.LastName;

                List<Meeting> checkDuplicates = appDbContext.Meetings.Where(x => x.MeetingName.Contains(roomName)).ToList();

                if(checkDuplicates.Count >= 1)
                {
                    roomName += string.Format(" ({0})" , checkDuplicates.Count + 1);
                }

                string serviceType = (string.IsNullOrEmpty(teacherDetail.MeetingService) ? ServiceType.BBB : teacherDetail.MeetingService);

                List<ServicesModel> serviceModel = schoolService.GetSchoolMeetingServices(school.Id);

                ServicesModel bbbServiceModel = serviceModel.Where(x => x.ServiceType == ServiceType.BBB).FirstOrDefault();
                ServicesModel adobeServiceModel = serviceModel.Where(x => x.ServiceType == ServiceType.AdobeConnect).FirstOrDefault();

                ServicesModel selectedService = null;

                if(serviceType == ServiceType.AdobeConnect && adobeServiceModel == null)
                {
                    return BadRequest("مدرسه از سرویس دهنده ادوب کانکت پشتیبانی نمیکند");
                }
                else if(serviceType == ServiceType.AdobeConnect)
                {
                    selectedService = adobeServiceModel;
                }

                if(serviceType == ServiceType.BBB && bbbServiceModel == null)
                {
                    return BadRequest("مدرسه از سرویس دهنده بیگ بلو باتن پشتیبانی نمیکند");
                }
                else if(serviceType == ServiceType.BBB)
                {
                    selectedService = bbbServiceModel;
                }
                
                Meeting meeting = await meetingService.StartPrivateMeeting(school , roomName , userId , selectedService);

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
                return BadRequest("مشکلی در ساخت کلاس خصوصی بوجود آمد");
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

                Meeting meeting = appDbContext.Meetings.Where(x => x.MeetingId == roomGUID || x.MeetingId.Contains(roomGUID + "|")).FirstOrDefault();

                if(meeting != null)
                {
                    string url = await meetingService.JoinMeeting(user , meeting.Id.ToString() , true);

                    if(url != null)
                    {
                        return Ok(url);
                    }
                }
                else
                {
                    return BadRequest("کلاس مورد نظر وجود ندارد");
                }

                return BadRequest("مشکلی در ورود به جلسه رخ داد");
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
                Meeting meeting = appDbContext.Meetings.Where(x => x.ScheduleId == lessonId & !x.Finished).FirstOrDefault();
                if(meeting != null)
                    return BadRequest("کلاس درحال برگذاری میباشد");


                string userName = userManager.GetUserId(User);
                int teacherId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;

                TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == teacherId).FirstOrDefault();
                string serviceType = (string.IsNullOrEmpty(teacherDetail.MeetingService) ? ServiceType.BBB : teacherDetail.MeetingService);

                ClassScheduleView classSchedule = appDbContext.ClassScheduleView.Where(x => x.Id == lessonId).FirstOrDefault();
                SchoolModel school = appDbContext.Schools.Where(x => x.Id == classSchedule.School_Id).FirstOrDefault();

                bool mixed = (classSchedule.MixedId != 0 ? true : false); // if Teacher start mixed class

                List<ServicesModel> serviceModel = schoolService.GetSchoolMeetingServices(school.Id);

                ServicesModel bbbServiceModel = serviceModel.Where(x => x.ServiceType == ServiceType.BBB).FirstOrDefault();
                ServicesModel adobeServiceModel = serviceModel.Where(x => x.ServiceType == ServiceType.AdobeConnect).FirstOrDefault();

                ServicesModel selectedService = null;

                if(serviceType == ServiceType.AdobeConnect && adobeServiceModel == null)
                {
                    return BadRequest("مدرسه از سرویس دهنده ادوب کانکت پشتیبانی نمیکند");
                }
                else if(serviceType == ServiceType.AdobeConnect)
                {
                    selectedService = adobeServiceModel;
                }

                if(serviceType == ServiceType.BBB && bbbServiceModel == null)
                {
                    return BadRequest("مدرسه از سرویس دهنده بیگ بلو باتن پشتیبانی نمیکند");
                }
                else if(serviceType == ServiceType.BBB)
                {
                    selectedService = bbbServiceModel;
                }


                if(mixed)//if Teacher start Mixed Meeting
                {
                    MixedSchedule mixedSchedule = appDbContext.MixedSchedules.Where(x => x.Id == classSchedule.MixedId).FirstOrDefault();

                    if(mixedSchedule != null)
                    {
                        //Console.WriteLine("Going to start Meeting");
                        
                        Meeting parent = await meetingService.StartSingleMeeting(classSchedule , teacherId , selectedService , mixedSchedule.MixedName);
                        //Get all schedules have same MixedId according to Selected Schedule
                        if(parent != null)
                        {
                            mixedSchedule.MeetingId = parent.Id;
                            
                            appDbContext.MixedSchedules.Update(mixedSchedule);
                            await appDbContext.SaveChangesAsync();

                            meeting = parent;
                        }
                        else
                        {
                            return BadRequest("جوابی از سرور ارائه دهنده دریافت نشد");
                        }
                    }
                }
                else
                {
                    //Console.WriteLine("Going to start Meeting");
                    meeting = await meetingService.StartSingleMeeting(classSchedule , teacherId , selectedService);

                    if(meeting == null)
                        Console.WriteLine("Adobe Server isn't available.");
                }

                if(meeting == null)
                    return BadRequest("درحال حاضر سرور مورد نظر در دسترس نمیباشد. لطفا از سرویس دیگری استفاده نمایید");

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
        [Authorize]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public async Task<IActionResult> JoinMeeting(string meetingId) 
        {
            try
            {
                string userName = userManager.GetUserId(User);
                UserModel user = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault();
                
                string URL = await meetingService.JoinMeeting(user , meetingId);
                
                if(URL == "1")
                    return BadRequest("کلاس هنوز آغاز نشده است");

                if(URL != null)
                {
                    return Ok(URL);
                }

                return BadRequest("کلاس مورد نظر پایان یافته است لطفا صبر کنید تا ارائه دهنده دوباره آنرا ایجاد نماید");
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
                    Meeting meeting = appDbContext.Meetings.Where(x => x.MeetingId == bbbMeetingId).FirstOrDefault();

                
                    if(meeting != null && !meeting.Private)
                    {
                        Class_WeeklySchedule schedule = appDbContext.ClassWeeklySchedules.Where(x => x.Id == meeting.ScheduleId).FirstOrDefault();
                        
                        if(schedule.MultiTeacher && meeting.TeacherId != user.Id)
                            return Unauthorized("شما اجازه بستن این کلاس را ندارید");
                    }

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

                List<MeetingView> result = meetingViews.GroupBy(x => x.MeetingId).Select(y => y.First()).ToList();

                return Ok(result);
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
        [Authorize(Roles = Roles.Student + "," + Roles.Teacher)]
        [ProducesResponseType(typeof(List<ClassScheduleView>), 200)]
        public IActionResult GetRecentClass() 
        {
            try
            {
                UserModel user  = UserService.GetUserModel(User);
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
                    if(!isTeacher || classs.teacherAsStudent)
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
                
                List<Meeting> meetings = new List<Meeting>();

                ClassScheduleView classSchedule = appDbContext.ClassScheduleView.Where(x => x.Id == scheduleId).FirstOrDefault();

                //Get schedule ids that same lessonId and TeacherId to specific classSchedule
                List<ClassScheduleView> schedules = new List<ClassScheduleView>();
                UserModel userModel = UserService.GetUserModel(User);

                if(UserService.HasRole(userModel , Roles.Teacher))
                {
                    schedules = appDbContext.ClassScheduleView.Where(x => x.TeacherId == classSchedule.TeacherId && x.LessonId == classSchedule.LessonId && x.ClassId == classSchedule.ClassId).ToList();
                }
                else
                {
                    schedules = appDbContext.ClassScheduleView.Where(x => x.LessonId == classSchedule.LessonId && x.ClassId == classSchedule.ClassId).ToList();
                }

                foreach (var schedule in schedules)
                {
                    meetings.AddRange(appDbContext.Meetings.Where(x => x.ScheduleId == schedule.Id).ToList());
                }

                List<RecordedMeeting> recordsResponses = new List<RecordedMeeting>();
                
                meetings = meetings.OrderBy(x => x.Id).ToList();

                foreach (var meeting in meetings)
                {
                    RecordedMeeting temp = new RecordedMeeting();
                    temp.recordsInfo = new List<RecordInfo>();
                    
                    ParticipantInfo participantInfo = appDbContext.ParticipantInfos.Where(x => x.UserId == userModel.Id && x.MeetingId == meeting.Id).FirstOrDefault();
                    temp.participant = participantInfo;
                    
                    ServicesModel serviceModel = appDbContext.Services.Where(x => x.Id == meeting.ServiceId).FirstOrDefault();
                    if(serviceModel != null)
                    {
                        string[] splitted = serviceModel.Service_URL.Split("/bigbluebutton/api");
                        string baseURl = splitted[0];
                        if(!string.IsNullOrEmpty(meeting.RecordId))
                            meeting.downloadURL = string.Format("{0}/download/presentation/{1}/{1}.mp4" , baseURl , meeting.RecordId);

                        temp.meeting = meeting;
                    }

                    // if(meeting.MeetingId != null && meeting.ServiceType == ServiceType.BBB)
                    // {
                    //     BBBApi bBApi = new BBBApi(appDbContext , scheduleId);

                    //     RecordsResponse response = await bBApi.GetMeetingRecords(meeting.MeetingId.ToString());

                    //     if(response != null)
                    //     {
                    //         Recordings recordings = (response).recordings;

                    //         if(recordings != null)
                    //         {
                    //             List<RecordInfo> records = recordings.recording;
                    //             if(records.Count > 0)
                    //             {
                    //                 foreach (var record in records)
                    //                 {
                    //                     record.name = classSchedule.OrgLessonName;
                    //                     record.url = record.playback.format[0].url;
                    //                     record.date = meeting.StartTime;
                    //                     string[] splitted = serviceModel.Service_URL.Split("/bigbluebutton/api");
                    //                     string baseURl = splitted[0];
                    //                     record.downloadURL = string.Format("{0}/download/presentation/{1}/{1}.mp4" , baseURl , record.recordID);
                    //                 }

                    //                 temp.recordsInfo.AddRange(records);
                    //             }
                    //         }
                    //     }
                    // }

                    // if(meeting.MeetingId != null && meeting.ServiceType == ServiceType.AdobeConnect)
                    // {
                    //     AdobeApi adobeApi = new AdobeApi(serviceModel.Service_URL , serviceModel.Service_Login , serviceModel.Service_Key);
                    //     RecordList recordList = adobeApi.GetRecordings(meeting.MeetingId);

                    //     RecordedMeeting recordedMeeting = new RecordedMeeting();
                    //     recordedMeeting.meeting = meeting;
                        
                    //     List<RecordInfo> recordInfos = new List<RecordInfo>();
                    //     if(recordList != null && recordList.recordings.scoInfo != null)
                    //     {
                    //         RecordInfo recordInfo = new RecordInfo{date = recordList.recordings.scoInfo.dateCreated , 
                    //                                         name = meeting.MeetingName ,
                    //                                         url = recordList.recordings.scoInfo.urlPath ,
                    //                                         recordID = recordList.recordings.scoInfo.scoId};
                    //         //recordInfo.downloadURL = string.Format("{0}/download/presentation/{1}/{1}.mp4" , serviceModel.Service_URL , recordInfo.recordID);
                    //         recordInfos.Add(recordInfo);

                    //         RecordsResponse response = new RecordsResponse();
                    //         response.recordings = new Recordings{recording = recordInfos};
                    //     }
                        
                    //     recordedMeeting.recordsInfo = recordInfos;


                    //     recordsResponses.Add(recordedMeeting);
                    // }
                    
                    recordsResponses.Add(temp);
                }
                
                    
                return Ok(recordsResponses);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public IActionResult EditRecording(int recordId)
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

        [HttpDelete]
        public async Task<IActionResult> RemoveRecording(string recordId)
        {
            try
            {
                UserModel userModel = UserService.GetUserModel(User);

                Meeting meeting = appDbContext.Meetings.Where(x => x.RecordId == recordId).FirstOrDefault();
                if(meeting == null)
                    return BadRequest("جلسه مورد نظر یافت نشد");

                if(meeting.TeacherId != userModel.Id)
                    return BadRequest("شما اجازه دسترسی به این جلسه را ندارید");

               bool result = await meetingService.RemoveRecording(meeting.RecordId);

               return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest("پردازش درخواست با مشکل مواجه شد");
            }
        }
#endregion

#region PreSlide

        public IActionResult GetSlides()
        {
            try
            {
                UserModel userModel = UserService.GetUserModel(User);
                List<DocumentModel> documents = appDbContext.Documents.Where(x => x.userId == userModel.Id || x.shareType == ShareType.publicly).ToList();
                TeacherDetail teacher = appDbContext.TeacherDetails.Where(x => x.TeacherId == userModel.Id).FirstOrDefault();
                if(teacher != null)
                {
                    List<int> schoolIds = teacher.getTeacherSchoolIds();
                    foreach (var schoolId in schoolIds)
                    {
                        documents.AddRange(appDbContext.Documents.Where(x => x.subSpaceId == schoolId || x.shareType == ShareType.schoolly).ToList());
                    }
                    List<int> classIds = appDbContext.ClassWeeklySchedules.Where(x => x.TeacherId == userModel.Id).Select(x => x.ClassId).Distinct().ToList();
                    foreach (var schoolId in schoolIds)
                    {
                        documents.AddRange(appDbContext.Documents.Where(x => x.subSpaceId == schoolId || x.shareType == ShareType.schoolly).ToList());
                    }
                }

                return Ok(documents);
            }
            catch (Exception ex)
            {
                return BadRequest("دریافت اطلاعات با خطا مواجه شد");
            }
        }
        public async Task<IActionResult> UploadPreSlide([FromForm]IFormCollection preSlide , string shareType)
        {
            try
            {
                string userName = userManager.GetUserId(User);
                int userId = appDbContext.Users.Where(x => x.MelliCode == userName).FirstOrDefault().Id;

                double miliseconds = (MyDateTime.Now() - new DateTime(1970, 1, 1)).TotalMilliseconds;
                string hashName = SHA1Creator.sha1Creator(preSlide.Files[0].FileName + miliseconds.ToString() + MyDateTime.Now().ToLongTimeString());
                bool FileOk = await FileController.UploadFile(preSlide.Files[0] , hashName , "PreSlides");

                if(FileOk)
                {
                    DocumentModel document = new DocumentModel();
                    document.hashName = hashName;
                    document.docName = "PreSlides" + preSlide.Files[0].FileName;
                    document.userId = userId;
                    document.shareType = shareType;
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
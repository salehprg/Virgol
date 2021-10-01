using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Virgol.Helper;
using Models.Users.Roles;
using Models;
using Models.User;
using Newtonsoft.Json;
using Virgol.School.Models;

public class MeetingService {
    AppDbContext appDbContext;
    UserService UserService;
    SchoolService schoolService;
    public MeetingService(AppDbContext _appDbContext , UserService _userService)
    {
        appDbContext = _appDbContext;
        UserService = _userService;

        schoolService = new SchoolService(appDbContext);
    }

#region Private Functions
    
    #region Start Meeting
    private async Task<Meeting> CreateInDb(ClassScheduleView classSchedule , int teacherId , ServicesModel servicesModel  , string meetingName = "")
    {
        try
        {
            int scheduleId = classSchedule.Id;
            
            string displayName = string.Format("{0} - {1} ({2})" , classSchedule.OrgLessonName , classSchedule.SchoolName , classSchedule.ClassName);

            DateTime timeNow = MyDateTime.Now();

            List<ClassScheduleView> scheduleViews = appDbContext.ClassScheduleView.Where(x => x.LessonId == classSchedule.LessonId && x.ClassId == classSchedule.ClassId && x.TeacherId == classSchedule.TeacherId).ToList();
            
            List<Meeting> result = new List<Meeting>();
            List<Meeting> meetings = appDbContext.Meetings.Where(x => x.TeacherId == teacherId).ToList();

            foreach (var schedule in scheduleViews)
            {
                result.AddRange(meetings.Where(x => x.ScheduleId == schedule.Id).ToList());
            }

            int newMeetingNo = result.Count + 1;

            if(meetingName == "")
                meetingName = displayName ;

            Meeting meeting = new Meeting();
            meeting.nameWithoutCounter = meetingName;

            //Display meeting name Without number Just for main adobe meeting
            if(servicesModel.ServiceType == ServiceType.AdobeConnect && newMeetingNo != 1)
            {
                meetingName += " جلسه " + newMeetingNo;
            }
            else if(servicesModel.ServiceType == ServiceType.BBB)
            {
                meetingName += " جلسه " + newMeetingNo;
            }
                
            meeting.MeetingName = meetingName;
            meeting.StartTime = timeNow;
            meeting.ScheduleId = scheduleId;
            meeting.SchoolId = classSchedule.School_Id;
            meeting.TeacherId = teacherId;
            meeting.ServiceType = servicesModel.ServiceType;
            meeting.ServerURL = servicesModel.Service_URL;
            meeting.Finished = false;

            await appDbContext.Meetings.AddAsync(meeting);
            appDbContext.SaveChanges();

            return meeting;
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return null;
        }
    }
    private async Task<bool> CreateRoom(Meeting meeting , float duration , ServicesModel serviceModel , SchoolModel school,  string customMeetingId = "")
    {
        string callBackUrl = AppSettings.ServerRootUrl;

        if(meeting.Private)
            callBackUrl = AppSettings.ServerRootUrl;

        duration += (duration != 0 ? 5 : 0); // add 5 minutes Additional to the end of class
        //duration = 0; // add 5 minutes Additional to the end of class

        bool result = false;
        MeetingInfoResponse adobe_MeetingInfo = new MeetingInfoResponse();
        List<ServicesModel> servicesModel = schoolService.GetSchoolMeetingServices(school.Id);

        if(serviceModel == null)
        {
            return false;
        }

        meeting.ServiceId = serviceModel.Id;

        if(serviceModel.ServiceType == ServiceType.BBB)
        {
            BBBApi bbbApi = new BBBApi(appDbContext);
            UserModel manager = appDbContext.Users.Where(x => x.Id == school.ManagerId).FirstOrDefault(); 
            bbbApi.SetConnectionInfo(serviceModel.Service_URL , serviceModel.Service_Key , manager);

            Console.WriteLine("Set Connection");
            Console.WriteLine("URL: " + serviceModel.Service_URL + " Secret : " + serviceModel.Service_Key);

            MeetingsResponse bbb_response = await bbbApi.CreateRoom(meeting.MeetingName , 
                                                                    (customMeetingId == "" ? meeting.Id.ToString() : customMeetingId) , 
                                                                    callBackUrl , (int)duration , school.EnableRecord , school.DefaultSlideURL);

            Console.WriteLine("Room in BBB Created");
            if(bbb_response == null)
            {
                result = false;
                return false;
            }

            result = true;
        }

        if(serviceModel.ServiceType == ServiceType.AdobeConnect)
        {
            AdobeApi adobeApi = new AdobeApi(serviceModel.Service_URL , serviceModel.Service_Login , serviceModel.Service_Key);
            adobe_MeetingInfo = adobeApi.StartMeeting(meeting.nameWithoutCounter);
            
            if(adobe_MeetingInfo == null)
            {
                return false;
            }

            if(adobe_MeetingInfo.status.code == "ok")
            {
                result = true;
                meeting.MeetingId = adobe_MeetingInfo.scoInfo.scoId;
            }
        }


        if(result = true && !meeting.Private)
        {
            if(serviceModel.ServiceType == ServiceType.BBB)
            {
                meeting.MeetingId = meeting.Id.ToString();
            }

            appDbContext.Meetings.Update(meeting);
            await appDbContext.SaveChangesAsync();


            return true;
        }
        else if(result = true && meeting.Private)
        {
            if(serviceModel.ServiceType == ServiceType.AdobeConnect)
            {
                meeting.MeetingId = customMeetingId + "|" + adobe_MeetingInfo.scoInfo.scoId;
            }

            appDbContext.Meetings.Update(meeting);
            await appDbContext.SaveChangesAsync();
            
            return true;
        }

        return false;
    }
    private async Task<Meeting> StartMeeting(ClassScheduleView classSchedule , int teacherId , ServicesModel serviceModel, string meetingName = "" )
    {
        try
        {
            Meeting meeting = await CreateInDb(classSchedule , teacherId , serviceModel , meetingName);

            if(meeting == null)
            {
                return null;
            }

            DateTime timeNow = MyDateTime.Now();
            float currentTime = timeNow.Hour + ((float)timeNow.Minute / 60);

            float duration = Math.Abs((classSchedule.EndHour - currentTime)) * 60;
            int dayofWeek = MyDateTime.convertDayOfWeek(timeNow);

            if(classSchedule.DayType > dayofWeek)//Start meeting for tommorow
            {
                duration = 0.0f;
                duration += (24 - currentTime) * 60;
                duration += classSchedule.EndHour * 60;
            }

            bool result = false , createRoom = true;

            List<Meeting> adobeMeetings = appDbContext.Meetings.Where(x => x.ScheduleId == classSchedule.Id && x.TeacherId == teacherId && x.ServiceType == serviceModel.ServiceType && x.MeetingId != null).ToList();
            Meeting mainAdobeMeeting = adobeMeetings.FirstOrDefault();
            //Just for Optimizing Meeting
            if(mainAdobeMeeting != null && serviceModel.ServiceType == ServiceType.AdobeConnect)
            {
                AdobeApi adobeApi = new AdobeApi(serviceModel.Service_URL , serviceModel.Service_Login , serviceModel.Service_Key);

                string scoId = mainAdobeMeeting.MeetingId;

                if(adobeApi.Login(serviceModel.Service_Login , serviceModel.Service_Key))
                {
                    MeetingInfoResponse response = adobeApi.FindScoInfo(scoId);

                    if(response.scoInfo != null)
                    {
                        meeting.MeetingId = mainAdobeMeeting.MeetingId;

                        result = true;
                        createRoom = false;
                    }
                    else
                    {
                        adobeMeetings.ForEach(x => x.MeetingId = null);
                        createRoom = true;
                    }

                    appDbContext.Meetings.Update(meeting);
                    await appDbContext.SaveChangesAsync();
                }
            }

            MeetingView meetingView = appDbContext.MeetingViews.Where(x => x.Id == meeting.Id).FirstOrDefault();
            SchoolModel school = appDbContext.Schools.Where(x => x.Id == meetingView.School_Id).FirstOrDefault();
            
            if(createRoom)
            {
                result = await CreateRoom(meeting , duration , serviceModel , school);
            }

            if(result)
            {
                return meeting;
            }
            
            appDbContext.Remove(meeting);
            await appDbContext.SaveChangesAsync();

            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return null;
        }
    }
    
    #endregion
    
    #region Schedules
    private List<ClassScheduleView> getSchedules(UserModel user)
    {
        DateTime currentDateTime = MyDateTime.Now();

        int userId = user.Id;

        bool isTeacher = UserService.HasRole(user , Roles.Teacher);

        float currentTime = currentDateTime.Hour + ((float)currentDateTime.Minute / 60);
        int dayOfWeek = MyDateTime.convertDayOfWeek(currentDateTime);
        int dayOfTommorow = MyDateTime.convertDayOfWeek(currentDateTime.AddDays(1));

        // List<ClassScheduleView> schedules = appDbContext.ClassScheduleView.Where(x => (currentTime <= x.EndHour && currentTime >= (x.StartHour - 0.25))  && x.DayType == dayOfWeek 
        //                                                                                 || x.DayType == dayOfWeek + 1).ToList();

        int weekType = MyDateTime.OddEven_Week(MyDateTime.Now());

        List<ClassScheduleView> schedules = appDbContext.ClassScheduleView.Where(x => ((currentTime <= x.EndHour && x.DayType == dayOfWeek ) || x.DayType == dayOfTommorow) && (x.weekly == 0 || x.weekly == weekType)).ToList();                                                                          
        List<MeetingView> recentClasses = new List<MeetingView>();
        List<ClassScheduleView> result = new List<ClassScheduleView>();

        if(isTeacher)
        {

            result.AddRange(schedules.Where(x => x.TeacherId == userId).ToList());

            List<ClassScheduleView> truncated = new List<ClassScheduleView>();

            List<MultiTeacherSchedules> multiSchedules = appDbContext.MultiTeacherSchedules.Where(x => x.TeacherId == user.Id).ToList();

            foreach (var multiSchedule in multiSchedules)
            {
                ClassScheduleView scheduleView = appDbContext.ClassScheduleView.Where(x => x.Id == multiSchedule.ScheduleId).FirstOrDefault();
                scheduleView.TeacherId = user.Id;
                scheduleView.FirstName = user.FirstName;
                scheduleView.FirstName = user.LastName;

                result.Add(scheduleView);
            }

            result = result.Distinct().ToList();
            
            foreach (var schedule in result)
            {
                //Add one Of the same Schedules that have same MixedId 
                //Ex -> sch1 : MixedID = 1 , sch2 : MixedID = 1 , sch3 : MixedID = 0 , sch4 : MixedID = 0
                //Result -> sch1 , sch3 , sch4 

                ClassScheduleView truncate = truncated.Where(x => x.MixedId == schedule.MixedId).FirstOrDefault();

                if(schedule.MixedId != 0)
                {
                    schedule.OrgLessonName = appDbContext.MixedSchedules.Where(x => x.Id == schedule.MixedId).FirstOrDefault().MixedName;
                }

                if(truncate == null)
                {
                    truncated.Add(schedule);
                }
                else if(truncate.MixedId == 0)
                {
                    truncated.Add(schedule);
                }
            }

            result = truncated;

            School_studentClass school_Student = appDbContext.School_StudentClasses.Where(x => x.UserId == userId).FirstOrDefault();
            int classId = 0;

            if(school_Student != null)
            {
                classId = school_Student.ClassId;
                List<ClassScheduleView> teacherAsStudentSchedules = schedules.Where(x => x.ClassId == classId).ToList();
                teacherAsStudentSchedules.ForEach(x => x.teacherAsStudent = true);
                foreach (var teacherAsStdnts in teacherAsStudentSchedules)
                {
                    if(isTeacher && teacherAsStdnts.TeacherId == userId)
                        teacherAsStdnts.teacherAsStudent = false;

                    if(result.Where(x => x.Id == teacherAsStdnts.Id).FirstOrDefault() == null)
                    {
                        result.Add(teacherAsStdnts);
                    }

                }
                
                
            }
        }
        else
        {
            List<School_studentClass> school_Students = appDbContext.School_StudentClasses.Where(x => x.UserId == userId).ToList();

            foreach (var school_Student in school_Students)
            {
                int classId = 0;

                if(school_Student != null)
                {
                    classId = school_Student.ClassId;
                }

                result.AddRange(schedules.Where(x => x.ClassId == classId).ToList());

                List<ExtraLesson> extraLessons = appDbContext.ExtraLessons.Where(x => x.UserId == userId).ToList();
                foreach (var extraLesson in extraLessons)
                {
                    List<ClassScheduleView> extraLessonSchedule = appDbContext.ClassScheduleView.Where(x => x.ClassId == extraLesson.ClassId && x.LessonId == extraLesson.lessonId).ToList();
                    extraLessonSchedule = extraLessonSchedule.Where(x => ((currentTime <= x.EndHour && x.DayType == dayOfWeek ) || x.DayType == dayOfTommorow) && (x.weekly == 0 || x.weekly == weekType)).ToList();                                                                          
                    
                    result.AddRange(extraLessonSchedule);
                }
            }
        }

        result.Distinct();
        return result;
    }
    private List<Meeting> getActiveMeeting(UserModel user)
    {
        List<Meeting> activeMeetings = appDbContext.Meetings.Where(x => !x.Finished).ToList();
        bool isTeacher = UserService.HasRole(user , Roles.Teacher);

        List<Meeting> result = new List<Meeting>();

        // if(isTeacher)
        // {
        //     result.AddRange(activeMeetings.Where(x => x.TeacherId == user.Id ).ToList());

        //     School_studentClass school_Student = appDbContext.School_StudentClasses.Where(x => x.UserId == user.Id).FirstOrDefault();
        //     int classId = 0;

        //     if(school_Student != null)
        //     {
        //         classId = school_Student.ClassId;
        //         List<ClassScheduleView> teacherAsStudentSchedules = schedules.Where(x => x.ClassId == classId).ToList();

        //         result.AddRange(activeMeetings.Where(x => x.ScheduleId == classId).ToList();

        //         teacherAsStudentSchedules.ForEach(x => x.teacherAsStudent = true);
        //         result.AddRange(teacherAsStudentSchedules);
        //     }

            
        // }

        return activeMeetings;
    }
    private MeetingView handleStudentMeeting(Meeting meeting , MeetingView meetingVW)
    {
        if(meeting != null)
        {
            meetingVW.MeetingId = meeting.MeetingId;
            meetingVW.MeetingName = meeting.MeetingName;
            meetingVW.ServiceType = meeting.ServiceType;
        }

        return meetingVW;
    }
    // private List<MeetingView> handleTeacherMeeting(ClassScheduleView schedule , MeetingView meetingVW)
    // {
    //     List<MeetingView> result = new List<MeetingView>();

    //     MixedSchedule mixedSchedule = appDbContext.MixedSchedules.Where(x => x.ScheduleId == x.ParentId && x.ScheduleId == schedule.Id).FirstOrDefault();
    //     if(mixedSchedule != null)
    //     {
    //         meetingVW.mixed = false;
    //         result.Add(meetingVW);//Parent schedule

    //         meetingVW.OrgLessonName = mixedSchedule.MixedName;
    //         meetingVW.mixed = true;
    //         //Mixed Schedule Will be add to List
    //     }
        
    //     result.Add(meetingVW);

    //     return result;
    // }

    #endregion

#endregion

    public async Task<Meeting> StartPrivateMeeting(SchoolModel school , string meetingName , int userId , ServicesModel serviceModel)
    {   
        DateTime timeNow = MyDateTime.Now();

        Meeting meeting = new Meeting();
        meeting.MeetingName = meetingName;
        meeting.ServiceType = serviceModel.ServiceType;
        meeting.StartTime = timeNow;
        //We set ScheduleId as School Id for future use
        meeting.SchoolId = school.Id;
        meeting.TeacherId = userId;
        meeting.Private = true;
        meeting.MeetingId = RandomPassword.GenerateGUID(true , true , true);

        appDbContext.Meetings.Add(meeting);
        await appDbContext.SaveChangesAsync();

        bool result = await CreateRoom(meeting , 0 , serviceModel , school , meeting.MeetingId);

        if(meeting != null && result)
        {
            return meeting;
        }

        return null;
    }

    public async Task<Meeting> StartSingleMeeting(ClassScheduleView classSchedule , int teacherId , ServicesModel serviceModel , string meetingName = "")
    {   
        Meeting meeting = await StartMeeting(classSchedule , teacherId , serviceModel , meetingName);

        if(meeting != null)
        {
            return meeting;
        }

        return null;
    }
    public async Task<int> StartMixedMeeting(ClassScheduleView classSchedule , int teacherId , int parentMeetingId , ServicesModel serviceModel , string meetingName)
    {
        Meeting meeting = await CreateInDb(classSchedule , teacherId , serviceModel , meetingName);
        Meeting parentMeeting = appDbContext.Meetings.Where(x => x.Id == parentMeetingId).FirstOrDefault();

        meeting.StartTime = parentMeeting.StartTime;
        meeting.MeetingId = parentMeeting.MeetingId;
        
        appDbContext.Meetings.Update(meeting);
        await appDbContext.SaveChangesAsync();

        return (meeting != null ? meeting.Id : -1);
    }
    public async Task<string> JoinMeeting(UserModel user , string MeetingId , bool privatee = false)
    {
        int userId = user.Id;

        int meetingId = 0;
        int.TryParse(MeetingId , out meetingId);
        Meeting meeting = new Meeting();

        if(meetingId == 0)
        {
            meeting = appDbContext.Meetings.Where(x => x.MeetingId == MeetingId).FirstOrDefault();
        }
        else
        {
            meeting = appDbContext.Meetings.Where(x => x.Id == meetingId).FirstOrDefault();
        }
        
        if(meeting == null)
            return null;

        bool isModerator = (user.Id == meeting.TeacherId || UserService.HasRole(user , Roles.Manager));

        Meeting temp = appDbContext.Meetings.Where(x => x.ScheduleId == meeting.ScheduleId && !x.Finished).FirstOrDefault();
        if(temp != null)
            meeting = temp;
        else
        {
            if(!isModerator)
                return "1";
        }

        string classUrl = "";
        MeetingView meetingView = appDbContext.MeetingViews.Where(x => x.Id == meeting.Id).FirstOrDefault();
        SchoolModel school = new SchoolModel();

        if(!meeting.Private)
        {
            school = appDbContext.Schools.Where(x => x.Id == meetingView.School_Id).FirstOrDefault();
        }
        else
        {
            school = appDbContext.Schools.Where(x => x.Id == meeting.SchoolId).FirstOrDefault();
        }

        if(school == null)
            return null;

        List<ServicesModel> servicesModel = schoolService.GetSchoolMeetingServices(school.Id);
        ServicesModel serviceModel = servicesModel.Where(x => x.ServiceType == meeting.ServiceType).FirstOrDefault();
        UserModel manager = appDbContext.Users.Where(x => x.Id == school.ManagerId).FirstOrDefault(); 

        if(meeting.ServiceType == ServiceType.AdobeConnect)
        {
            AdobeApi adobeApi = new AdobeApi(serviceModel.Service_URL , serviceModel.Service_Login , serviceModel.Service_Key);
            string scoId = (meeting.Private ? meeting.MeetingId.Split("|")[1] : meeting.MeetingId.Split("|")[0]);

            //await UserService.SyncUserData(new List<UserModel> {user});

            classUrl = adobeApi.JoinMeeting(scoId , user.UserName , user.MelliCode , isModerator);
        }
        else if(meeting.ServiceType == ServiceType.BBB)
        {
            BBBApi bbbApi = new BBBApi(appDbContext);
            if(meeting.Private)
            {
                bbbApi.SetConnectionInfo(serviceModel.Service_URL , serviceModel.Service_Key , manager);
            }
            else
            {
                bbbApi.SetConnectionInfo(meeting.ScheduleId);
            }

            MeetingsResponse meetingsResponse = bbbApi.GetMeetings().Result; 
            List<MeetingInfo> newMeetingList = new List<MeetingInfo>();
            if(meetingsResponse.meetings != null)
                newMeetingList = meetingsResponse.meetings.meeting;
            
            if(newMeetingList.Where(x => x.meetingID == meeting.MeetingId).FirstOrDefault() == null)
            {
                await EndMeeting(meeting.MeetingId , meeting.TeacherId);

                if(isModerator)
                {
                    ClassScheduleView schedule = appDbContext.ClassScheduleView.Where(x => x.Id == meeting.ScheduleId).FirstOrDefault();

                    bool mixed = (schedule.MixedId != 0 ? true : false); // if Teacher start mixed class

                    if(mixed)
                    {
                        MixedSchedule mixedSchedule = appDbContext.MixedSchedules.Where(x => x.Id == schedule.MixedId).FirstOrDefault();
                        if(mixedSchedule != null)
                        {

                            meeting = await StartSingleMeeting(schedule , meeting.TeacherId , serviceModel , mixedSchedule.MixedName);
                            //Get all schedules have same MixedId according to Selected Schedule
                            if(meeting != null)
                            {
                                mixedSchedule.MeetingId = meeting.Id;
                                
                                appDbContext.MixedSchedules.Update(mixedSchedule);
                                await appDbContext.SaveChangesAsync();
                            }
                        }
                    }
                    else
                    {
                        meeting = await StartSingleMeeting(schedule , meeting.TeacherId , serviceModel);
                    }
                }
            }

            classUrl = await bbbApi.JoinRoom(isModerator , meeting.MeetingId , user.FirstName + " " + user.LastName , user.Id.ToString());

            if(classUrl == "")
            {
                ServicesModel alternateServer = servicesModel.Where(x => x.Service_URL == meeting.ServerURL).FirstOrDefault();
                if(alternateServer != null)
                {
                    bbbApi.SetConnectionInfo(alternateServer.Service_URL , alternateServer.Service_Key , manager);
                    classUrl = await bbbApi.JoinRoom(isModerator , meeting.MeetingId , user.FirstName + " " + user.LastName , user.Id.ToString());
                }
            }
        }

        if(classUrl != "")
        {
            return classUrl;
        }

        return null;
    }

    public async Task<bool> EndMeeting(string bbbMeetingId , int userId)
    {
        Meeting meeting = new Meeting();
        meeting = appDbContext.Meetings.Where(x => x.MeetingId == bbbMeetingId && x.TeacherId == userId).FirstOrDefault();

        if(meeting == null)
        {
            meeting = appDbContext.Meetings.Where(x => x.Id == int.Parse(bbbMeetingId) && x.TeacherId == userId).FirstOrDefault();
        }

        if(meeting == null || meeting.Id == 0)
        {
            return false;
        }
        
        int schoolId = 0;
        if(meeting.Private)
        {
            schoolId = meeting.SchoolId;
        }
        else
        {
            ClassScheduleView scheduleData = appDbContext.ClassScheduleView.Where(x => x.Id == meeting.ScheduleId).FirstOrDefault();

            if(scheduleData != null)
            {
                schoolId = scheduleData.School_Id;
            }
        }

        SchoolModel school = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault();
        if(meeting.Private)
        {
            //We set School id as Schedule Id in CreatePrivateRoom
            school = appDbContext.Schools.Where(x => x.Id == meeting.SchoolId).FirstOrDefault();
        }
        
        bool resultEnd = false;

        if(school == null)
        {
            resultEnd = true;
        }


        if(meeting.ServiceType == ServiceType.BBB && !resultEnd)
        {
            List<ServicesModel> servicesModel = schoolService.GetSchoolMeetingServices(school.Id);
            UserModel manager = appDbContext.Users.Where(x => x.Id == school.ManagerId).FirstOrDefault(); 
            ServicesModel serviceModel = servicesModel.Where(x => x.ServiceType == ServiceType.BBB).FirstOrDefault();

            BBBApi bbbApi = new BBBApi(appDbContext);
            if(meeting.Private)
            {
                bbbApi.SetConnectionInfo(serviceModel.Service_URL , serviceModel.Service_Key , manager);
            }
            else
            {
                bbbApi.SetConnectionInfo(meeting.ScheduleId);
            }

            
            MeetingsResponse meetingsResponse = null;
            bool onAlternateEnd = false;
            if(!resultEnd)
            {
                ServicesModel alternate = servicesModel.Where(x => x.Service_URL == meeting.ServerURL).FirstOrDefault();
                if(alternate != null)
                {
                    bbbApi.SetConnectionInfo(alternate.Service_URL , alternate.Service_Key , manager);
                }
                resultEnd = await bbbApi.EndRoom(bbbMeetingId);
                if(resultEnd)
                {
                    meetingsResponse = bbbApi.GetMeetings().Result; 
                    onAlternateEnd = true;
                }
            }

            if(!onAlternateEnd)
                meetingsResponse = bbbApi.GetMeetings().Result; 

            List<MeetingInfo> newMeetingList = new List<MeetingInfo>();

            if(meetingsResponse.meetings != null)
            {
                newMeetingList = meetingsResponse.meetings.meeting; 
            }

            if(!resultEnd && newMeetingList.Where(x => x.meetingID == bbbMeetingId).FirstOrDefault() == null)// it means this class Closed by Moderator and Currently Open in Our Db
            {
                resultEnd = true;
            }
        }

        if(meeting.ServiceType == ServiceType.AdobeConnect && !resultEnd)
        {
            resultEnd = true;
        }
        

        if(resultEnd)
        {
            meeting.Finished = true;
            meeting.EndTime = MyDateTime.Now();
            
            appDbContext.Meetings.UpdateRange(meeting);
            await appDbContext.SaveChangesAsync();

            return true;
        }
        
        return false;
    }


    public async Task<bool> RemoveRecording(string RecordId)
    {
        try
        {
            Meeting meeting = appDbContext.Meetings.Where(x => x.RecordId == RecordId).FirstOrDefault();

            if(meeting != null)
            {
                bool result = false;

                ServicesModel servicesModel = appDbContext.Services.Where(x => x.Id == meeting.ServiceId).FirstOrDefault();
                if(servicesModel.ServiceType == ServiceType.BBB)
                {
                    BBBApi bBBApi = new BBBApi(appDbContext);
                    bBBApi.SetConnectionInfo(servicesModel.Service_URL , servicesModel.Service_Key);
                    result = await bBBApi.DeleteRecording(meeting.RecordId);

                    if(!result)
                    {
                        // Try alternate Server URL
                        servicesModel = appDbContext.Services.Where(x => x.Service_URL == meeting.ServerURL).FirstOrDefault();
                        bBBApi.SetConnectionInfo(servicesModel.Service_URL , servicesModel.Service_Key);
                        result = await bBBApi.DeleteRecording(meeting.RecordId);

                    }
                }

                if(result)
                {
                    meeting.RecordURL = null;
                    meeting.RecordId = null;

                    appDbContext.Meetings.Update(meeting);
                }

                return result;
            }

            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return false;
        }
    }
    public List<MeetingView> GetActiveMeeting(UserModel user)
    {   
        List<MeetingView> meetingViews = appDbContext.MeetingViews.Where(x => x.Finished == false).ToList();

        List<MeetingView> result = new List<MeetingView>();
        result.AddRange(meetingViews.Where(x => x.TeacherId == user.Id).ToList());

        List<MultiTeacherSchedules> multiSchedules = appDbContext.MultiTeacherSchedules.Where(x => x.TeacherId == user.Id).ToList();
        
        foreach (var schedule in multiSchedules)
        {
            MeetingView temp = meetingViews.Where(x => x.ScheduleId == schedule.ScheduleId).FirstOrDefault();
            
            if(temp != null)
                result.Add(temp);
        }
        
        return result;
    }
    
    public List<MeetingView> GetComingMeeting(UserModel user)
    {
        List<MeetingView> result = new List<MeetingView>();

        List<ClassScheduleView> schedules = getSchedules(user);
        List<Meeting> activeMeetings = getActiveMeeting(user);

        bool isTeacher = UserService.HasRole(user , Roles.Teacher);

        foreach (var schedule in schedules)
        {
            Meeting meeting = new Meeting();

            meeting = activeMeetings.Where(x => x.ScheduleId == schedule.Id).FirstOrDefault();

            if(schedule.MixedId != 0)
            {  
                int meetingId = appDbContext.MixedSchedules.Where(x => x.Id == schedule.MixedId).FirstOrDefault().MeetingId;
                meeting = activeMeetings.Where(x => x.Id == meetingId).FirstOrDefault();
            }

            var serialized = JsonConvert.SerializeObject(schedule);
            MeetingView meetingVW = JsonConvert.DeserializeObject<MeetingView>(serialized);

            if(!isTeacher || schedule.teacherAsStudent)
            {
                meetingVW = handleStudentMeeting(meeting , meetingVW);

                if(schedule.teacherAsStudent)
                    meetingVW.teacherAsStudent = true;
                    
                result.Add(meetingVW);
            }
            else
            {
                if(meeting == null)//it means this meeting not yet Started
                {
                    //MeetingView meetingView = handleTeacherMeeting(schedule , meetingVW);

                    result.Add(meetingVW);
                }
            }
        }

        return result;
    }

    public List<MeetingView> GetAllActiveMeeting(int managerId , int  schoolId = 0)
    {
        UserModel userModel = appDbContext.Users.Where(x => x.Id == managerId).FirstOrDefault();

        if(schoolId == 0)
        {
            SchoolModel schoolModel = appDbContext.Schools.Where(x => x.ManagerId == managerId).FirstOrDefault();
            if(schoolModel != null)
                schoolId = schoolModel.Id;
            else
            {
                schoolModel = appDbContext.Schools.Where(x => x.Id == userModel.SchoolId).FirstOrDefault();
                
                if(schoolModel !=null)
                    schoolId = schoolModel.Id;
            }
        }

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

        return result;
    }

    public List<MeetingView> GetAllMeeting()
    {
        List<MeetingView> meetingViews = new List<MeetingView>();

        return meetingViews;
    }

}
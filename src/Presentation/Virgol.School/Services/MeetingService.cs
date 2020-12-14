using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using lms_with_moodle.Helper;
using Models.Users.Roles;
using Models;
using Models.User;
using Newtonsoft.Json;

public class MeetingService {
    AppDbContext appDbContext;
    UserService UserService;
    public MeetingService(AppDbContext _appDbContext , UserService _userService)
    {
        appDbContext = _appDbContext;
        UserService = _userService;

    }

#region Private Functions
    
    #region Start Meeting
    private async Task<Meeting> CreateInDb(ClassScheduleView classSchedule , int teacherId , string serviceType  , string meetingName = "")
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

            //Display meeting name Without number Just for main adobe meeting
            if(serviceType == ServiceType.AdobeConnect && newMeetingNo != 1)
            {
                meetingName += " جلسه " + newMeetingNo;
            }
            else if(serviceType == ServiceType.BBB)
            {
                meetingName += " جلسه " + newMeetingNo;
            }
                

            Meeting meeting = new Meeting();
            meeting.MeetingName = meetingName;
            meeting.StartTime = timeNow;
            meeting.ScheduleId = scheduleId;
            meeting.TeacherId = teacherId;
            meeting.ServiceType = serviceType;
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
    private async Task<bool> CreateRoom(Meeting meeting , float duration , string serviceType , SchoolModel school,  string customMeetingId = "")
    {
        string callBackUrl = AppSettings.ServerRootUrl + "/meetingResponse/" + meeting.Id;

        if(meeting.Private)
            callBackUrl = AppSettings.ServerRootUrl;

        duration += (duration != 0 ? 5 : 0); // add 5 minutes Additional to the end of class
        //duration = 0; // add 5 minutes Additional to the end of class

        MeetingsResponse bbb_response = new MeetingsResponse();
        MeetingInfoResponse adobe_MeetingInfo = new MeetingInfoResponse();

        if(serviceType == ServiceType.BBB)
        {
            if(string.IsNullOrEmpty(school.bbbURL) || string.IsNullOrEmpty(school.bbbSecret))
            {
                return false;
            }

            BBBApi bbbApi = new BBBApi(appDbContext);
            bbbApi.SetConnectionInfo(school.bbbURL , school.bbbSecret);
            bbb_response = await bbbApi.CreateRoom(meeting.MeetingName , (customMeetingId == "" ? meeting.Id.ToString() : customMeetingId) , callBackUrl , (int)duration);

            if(bbb_response == null)
            {
                return false;
            }
        }
        else if(serviceType == ServiceType.AdobeConnect)
        {
            if(string.IsNullOrEmpty(school.AdobeUrl))
            {
                return false;
            }

            AdobeApi adobeApi = new AdobeApi(school.AdobeUrl);
            adobe_MeetingInfo = adobeApi.StartMeeting(meeting.MeetingName);
            
            if(adobe_MeetingInfo == null)
            {
                return false;
            }

            if(adobe_MeetingInfo.status.code == "ok")
            {
                bbb_response.returncode = "SUCCEED";
                meeting.MeetingId = adobe_MeetingInfo.scoInfo.scoId + "|" + ServiceType.AdobeConnect;
            }
        }


        if(bbb_response.returncode != "FAILED" && !meeting.Private)
        {
            if(serviceType == ServiceType.BBB)
            {
                meeting.MeetingId = meeting.Id.ToString();
            }

            appDbContext.Meetings.Update(meeting);
            await appDbContext.SaveChangesAsync();


            return true;
        }
        else if(bbb_response.returncode != "FAILED" && meeting.Private)
        {
            if(serviceType == ServiceType.AdobeConnect)
            {
                meeting.MeetingId = customMeetingId + "|" + adobe_MeetingInfo.scoInfo.scoId + "|" + ServiceType.AdobeConnect;
            }

            appDbContext.Meetings.Update(meeting);
            await appDbContext.SaveChangesAsync();
            
            return true;
        }

        return false;
    }
    private async Task<Meeting> StartMeeting(ClassScheduleView classSchedule , int teacherId , string serviceType, string meetingName = "" )
    {
        try
        {
            Meeting mainAdobeMeeting = appDbContext.Meetings.Where(x => x.ScheduleId == classSchedule.Id && x.TeacherId == teacherId).FirstOrDefault();
            Meeting meeting = await CreateInDb(classSchedule , teacherId , serviceType , meetingName);

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

            MeetingView meetingView = appDbContext.MeetingViews.Where(x => x.Id == meeting.Id).FirstOrDefault();
            SchoolModel school = appDbContext.Schools.Where(x => x.Id == meetingView.School_Id).FirstOrDefault();

            bool result = false , createRoom = true;

            //Just for Optimizing Meeting
            if(mainAdobeMeeting != null && serviceType == ServiceType.AdobeConnect)
            {
                AdobeApi adobeApi = new AdobeApi(school.AdobeUrl);

                string scoId = "";
                try{scoId =  mainAdobeMeeting.MeetingId.Split("|")[0];}catch{}

                if(adobeApi.Login("admin@legace.ir" , "Connectpass.24"))
                {
                    MeetingInfoResponse response = adobeApi.FindScoInfo(scoId);

                    if(response.scoInfo != null)
                    {
                        meeting.MeetingId = mainAdobeMeeting.MeetingId;

                        appDbContext.Meetings.Update(meeting);
                        await appDbContext.SaveChangesAsync();

                        result = true;
                        createRoom = false;
                    }
                    else
                    {
                        createRoom = true;
                    }
                }
            }

            if(createRoom)
            {
                result = await CreateRoom(meeting , duration , serviceType , school);
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

        List<ClassScheduleView> schedules = appDbContext.ClassScheduleView.Where(x => (currentTime <= x.EndHour && (x.DayType == dayOfWeek || x.DayType == dayOfTommorow) && (x.weekly == 0 || x.weekly == weekType))).ToList();                                                                          
        List<MeetingView> recentClasses = new List<MeetingView>();
        

        if(isTeacher)
        {
            schedules = schedules.Where(x => x.TeacherId == userId).ToList();

            List<ClassScheduleView> truncated = new List<ClassScheduleView>();

            foreach (var schedule in schedules)
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

            schedules = truncated;
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

        return schedules;
    }
    private List<Meeting> getActiveMeeting(UserModel user)
    {
        List<Meeting> activeMeetings = appDbContext.Meetings.Where(x => !x.Finished).ToList();
        bool isTeacher = UserService.HasRole(user , Roles.Teacher);

        if(isTeacher)
        {
            activeMeetings = activeMeetings.Where(x => x.TeacherId == user.Id ).ToList();
        }

        return activeMeetings;
    }
    private MeetingView handleStudentMeeting(Meeting meeting , MeetingView meetingVW)
    {
        if(meeting != null)
        {
            meetingVW.MeetingId = meeting.MeetingId;
            meetingVW.MeetingName = meeting.MeetingName;
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

    public async Task<Meeting> StartPrivateMeeting(SchoolModel school , string meetingName , int userId , string serviceType)
    {   
        DateTime timeNow = MyDateTime.Now();

        Meeting meeting = new Meeting();
        meeting.MeetingName = meetingName;
        meeting.ServiceType = serviceType;
        meeting.StartTime = timeNow;
        //We set ScheduleId as School Id for future use
        meeting.ScheduleId = school.Id;
        meeting.TeacherId = userId;
        meeting.Private = true;
        meeting.MeetingId = RandomPassword.GenerateGUID(true , true , true);

        appDbContext.Meetings.Add(meeting);
        await appDbContext.SaveChangesAsync();

        bool result = await CreateRoom(meeting , 0 , serviceType , school , meeting.MeetingId);

        if(meeting != null && result)
        {
            return meeting;
        }

        return null;
    }

    public async Task<int> StartSingleMeeting(ClassScheduleView classSchedule , int teacherId , string ServiceType , string meetingName = "")
    {   
        Meeting meeting = await StartMeeting(classSchedule , teacherId , ServiceType , meetingName);

        if(meeting != null)
        {
            return meeting.Id;
        }

        return -1;
    }
    public async Task<int> StartMixedMeeting(ClassScheduleView classSchedule , int teacherId , int parentMeetingId , string serviceType , string meetingName)
    {
        Meeting meeting = await CreateInDb(classSchedule , teacherId , serviceType , meetingName);
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
        

        bool isModerator = (user.Id == meeting.TeacherId || UserService.HasRole(user , Roles.Manager));

        if(meeting == null)
            return null;

        string classUrl = "";
        MeetingView meetingView = appDbContext.MeetingViews.Where(x => x.Id == meeting.Id).FirstOrDefault();
        SchoolModel school = new SchoolModel();

        if(!meeting.Private)
        {
            school = appDbContext.Schools.Where(x => x.Id == meetingView.School_Id).FirstOrDefault();
        }
        else
        {
            //We set School id as Schedule Id in CreatePrivateRoom
            school = appDbContext.Schools.Where(x => x.Id == meeting.ScheduleId).FirstOrDefault();
        }

        if(school == null)
            return null;

        if(meeting.ServiceType == ServiceType.AdobeConnect)
        {
            AdobeApi adobeApi = new AdobeApi(school.AdobeUrl);
            string scoId = (meeting.Private ? meeting.MeetingId.Split("|")[1] : meeting.MeetingId.Split("|")[0]);

            //await UserService.SyncUserData(new List<UserModel> {user});

            classUrl = adobeApi.JoinMeeting(scoId , user.UserName , user.MelliCode , isModerator);
        }
        else if(meeting.ServiceType == ServiceType.BBB)
        {
            BBBApi bbbApi = new BBBApi(appDbContext);
            if(meeting.Private)
            {
                bbbApi.SetConnectionInfo(school.bbbURL , school.bbbSecret);
            }
            else
            {
                bbbApi.SetConnectionInfo(meeting.ScheduleId);
            }
            
            classUrl = await bbbApi.JoinRoom(isModerator , meeting.MeetingId , user.FirstName + " " + user.LastName , user.Id.ToString());
        }

        if(classUrl != "")
        {
            return classUrl;
        }

        return null;
    }
    public async Task<bool> EndMeeting(string bbbMeetingId , int teacherId)
    {
        Meeting meeting = new Meeting();
        meeting = appDbContext.Meetings.Where(x => x.MeetingId == bbbMeetingId && x.TeacherId == teacherId).FirstOrDefault();

        if(meeting == null)
        {
            meeting = appDbContext.Meetings.Where(x => x.Id == int.Parse(bbbMeetingId) && x.TeacherId == teacherId).FirstOrDefault();
        }

        if(meeting == null || meeting.Id == 0)
        {
            return false;
        }
        
        SchoolModel school = new SchoolModel();
        if(meeting.Private)
        {
            //We set School id as Schedule Id in CreatePrivateRoom
            school = appDbContext.Schools.Where(x => x.Id == meeting.ScheduleId).FirstOrDefault();
        }
        
        bool resultEnd = false;

        if(school == null)
        {
            resultEnd = true;
        }

        if(meeting.ServiceType == ServiceType.BBB && !resultEnd)
        {
            BBBApi bbbApi = new BBBApi(appDbContext);
            if(meeting.Private)
            {
                bbbApi.SetConnectionInfo(school.bbbURL , school.bbbSecret);
            }
            else
            {
                bbbApi.SetConnectionInfo(meeting.ScheduleId);
            }

            resultEnd = await bbbApi.EndRoom(bbbMeetingId);

            MeetingsResponse meetingsResponse = bbbApi.GetMeetings().Result; 
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


    public List<MeetingView> GetActiveMeeting(UserModel user)
    {   
        List<MeetingView> meetingViews = appDbContext.MeetingViews.Where(x => x.TeacherId == user.Id && x.Finished == false).ToList();
                    
        return meetingViews;
    }
    
    public List<MeetingView> GetComingMeeting(UserModel user)
    {
        List<MeetingView> result = new List<MeetingView>();

        List<ClassScheduleView> schedules = getSchedules(user);
        List<Meeting> activeMeetings = getActiveMeeting(user);

        bool isTeacher = UserService.HasRole(user , Roles.Teacher);

        foreach (var schedule in schedules)
        {
            Meeting meeting = activeMeetings.Where(x => x.ScheduleId == schedule.Id).FirstOrDefault();

            if(schedule.MixedId != 0)
            {  
                int meetingId = appDbContext.MixedSchedules.Where(x => x.Id == schedule.MixedId).FirstOrDefault().MeetingId;
                meeting = activeMeetings.Where(x => x.Id == meetingId).FirstOrDefault();
            }

            var serialized = JsonConvert.SerializeObject(schedule);
            MeetingView meetingVW = JsonConvert.DeserializeObject<MeetingView>(serialized);

            if(!isTeacher)
            {
                meetingVW = handleStudentMeeting(meeting , meetingVW);

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

    public List<MeetingView> GetAllActiveMeeting(int managerId)
    {
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

        return result;
    }

    public List<MeetingView> GetAllMeeting()
    {
        List<MeetingView> meetingViews = new List<MeetingView>();

        return meetingViews;
    }

}
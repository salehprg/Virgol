using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using lms_with_moodle.Helper;
using Microsoft.AspNetCore.Http;
using Models;
using Models.User;
using Newtonsoft.Json;

public class MeetingService {
    AppDbContext appDbContext;
    public MeetingService(AppDbContext _appDbContext)
    {
        appDbContext = _appDbContext;

    }

#region Private Functions
    
    #region Start Meeting
    private async Task<Meeting> CreateInDb(ClassScheduleView classSchedule , int teacherId , string serviceType  , string meetingName = "")
    {
        try
        {
            int scheduleId = classSchedule.Id;
            int moodleId = appDbContext.School_Lessons.Where(x => x.classId == classSchedule.ClassId && x.Lesson_Id == classSchedule.LessonId).FirstOrDefault().Moodle_Id;

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
                meetingName = displayName + " جلسه " + newMeetingNo;

            Meeting meeting = new Meeting();
            meeting.MeetingName = meetingName;
            meeting.StartTime = timeNow;
            meeting.ScheduleId = scheduleId;
            meeting.TeacherId = teacherId;
            meeting.ServiceType = serviceType;
            meeting.Finished = false;

            appDbContext.Meetings.Add(meeting);
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
    private async Task<bool> CreateRoom(Meeting meeting , float duration , string serviceType , string bbbMeetingId = "")
    {
        string callBackUrl = AppSettings.ServerRootUrl + "/meetingResponse/" + meeting.Id;

        if(meeting.Private)
            callBackUrl = AppSettings.ServerRootUrl;

        duration += (duration != 0 ? 5 : 0); // add 5 minutes Additional to the end of class
        //duration = 0; // add 5 minutes Additional to the end of class

        MeetingsResponse response = new MeetingsResponse();

        if(serviceType == ServiceType.BBB)
        {
            BBBApi bbbApi = new BBBApi(appDbContext , meeting.ScheduleId);
            response = await bbbApi.CreateRoom(meeting.MeetingName , (bbbMeetingId == "" ? meeting.Id.ToString() : bbbMeetingId) , callBackUrl , (int)duration);
        }
        else if(serviceType == ServiceType.AdobeConnect)
        {
            AdobeApi adobeApi = new AdobeApi();
            MeetingInfoResponse meetingInfo = adobeApi.StartMeeting(meeting.MeetingName);

            if(meetingInfo.status.code == "ok")
            {
                response.returncode = "SUCCEED";
                meeting.MeetingId = meetingInfo.scoInfo.scoId;
            }
        }


        if(response.returncode != "FAILED" && !meeting.Private)
        {
            if(serviceType == ServiceType.BBB)
            {
                meeting.MeetingId = meeting.Id.ToString();
            }

            appDbContext.Meetings.Update(meeting);
            await appDbContext.SaveChangesAsync();


            return true;
        }
        else if(response.returncode != "FAILED" && meeting.Private)
        {
            return true;
        }

        return false;
    }
    private async Task<Meeting> StartMeeting(ClassScheduleView classSchedule , int teacherId , string serviceType  , string meetingName = "")
    {
        Meeting meeting = await CreateInDb(classSchedule , teacherId , serviceType);


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

        bool result = await CreateRoom(meeting , duration , serviceType);


        if(result)
        {
            return meeting;
        }
        
        appDbContext.Remove(meeting);
        await appDbContext.SaveChangesAsync();

        return null;
    }
    
    #endregion
    
    #region Schedules
    private List<ClassScheduleView> getSchedules(UserModel user)
    {
        DateTime currentDateTime = MyDateTime.Now();

        int userId = user.Id;

        bool isTeacher = user.userTypeId == (int)UserType.Teacher;

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
                    schedule.OrgLessonName = appDbContext.MixedSchedules.Where(x => x.Id == schedule.Id).FirstOrDefault().MixedName;
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
        bool isTeacher = user.userTypeId == (int)UserType.Teacher;

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

    public async Task<Meeting> StartPrivateMeeting(string meetingName , int userId)
    {   
        DateTime timeNow = MyDateTime.Now();

        Meeting meeting = new Meeting();
        meeting.MeetingName = meetingName;
        meeting.StartTime = timeNow;
        meeting.ScheduleId = 0;
        meeting.TeacherId = userId;
        meeting.Private = true;
        meeting.MeetingId = RandomPassword.GenerateGUID(true , true , true);

        appDbContext.Meetings.Add(meeting);
        appDbContext.SaveChanges();

        await CreateRoom(meeting , 0 , meeting.MeetingId);

        if(meeting != null)
        {
            return meeting;
        }

        return null;
    }

    public async Task<int> StartSingleMeeting(ClassScheduleView classSchedule , int teacherId , string serviceType)
    {   
        Meeting meeting = await StartMeeting(classSchedule , teacherId , serviceType);

        if(meeting != null)
        {
            return meeting.Id;
        }

        return -1;
    }
    public async Task<int> StartMixedMeeting(ClassScheduleView classSchedule , int teacherId , int parentMeetingId , string serviceType)
    {
        Meeting meeting = await CreateInDb(classSchedule , teacherId , serviceType);
        Meeting parentMeeting = appDbContext.Meetings.Where(x => x.Id == parentMeetingId).FirstOrDefault();

        meeting.StartTime = parentMeeting.StartTime;
        meeting.MeetingId = parentMeeting.MeetingId;
        
        appDbContext.Meetings.Update(meeting);
        await appDbContext.SaveChangesAsync();

        return (meeting != null ? meeting.Id : -1);
    }
    public async Task<string> JoinMeeting(UserModel user , string bbbMeetingId , bool privatee = false)
    {
        int userId = user.Id;

        Meeting meeting = appDbContext.Meetings.Where(x => x.MeetingId == bbbMeetingId).FirstOrDefault();

        if(meeting != null)
        {
            meeting = appDbContext.Meetings.Where(x => x.MeetingId == bbbMeetingId).FirstOrDefault();
        }

        bool isModerator = (user.Id == meeting.TeacherId || user.userTypeId == (int)UserType.Manager);

        if(meeting == null)
            return null;

        string classUrl = "";

        if(meeting.ServiceType == ServiceType.BBB)
        {
            BBBApi bbbApi = new BBBApi(appDbContext , meeting.ScheduleId);
            classUrl = await bbbApi.JoinRoom(isModerator , meeting.MeetingId , user.FirstName + " " + user.LastName , user.Id.ToString());
        }
        else if(meeting.ServiceType == ServiceType.AdobeConnect)
        {
            AdobeApi adobeApi = new AdobeApi();
            classUrl = adobeApi.JoinMeeting(meeting.MeetingId , user.UserName , user.MelliCode , isModerator);
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
            meeting = appDbContext.Meetings.Where(x => x.Id == int.Parse(bbbMeetingId) && x.TeacherId == teacherId).FirstOrDefault();

        if(meeting == null || meeting.Id == 0)
            return false;

        BBBApi bbbApi = new BBBApi(appDbContext , meeting.ScheduleId);
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
            int parsedId = 0;
            int.TryParse(bbbMeetingId , out parsedId);

            List<Meeting> oldMeetings = appDbContext.Meetings.Where(x => x.MeetingId == bbbMeetingId || x.Id == parsedId).ToList();// Use for mixed meeting Id

            foreach (var oldMeeting in oldMeetings)
            {
                oldMeeting.Finished = true;
                oldMeeting.EndTime = MyDateTime.Now();
            }
            
            appDbContext.Meetings.UpdateRange(oldMeetings);
            appDbContext.SaveChanges();

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

        bool isTeacher = (user.userTypeId == (int)UserType.Teacher ? true : false);

        foreach (var schedule in schedules)
        {
            Meeting meeting = activeMeetings.Where(x => x.ScheduleId == schedule.Id).FirstOrDefault();

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
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
    MoodleApi moodleApi;
    public MeetingService(AppDbContext _appDbContext)
    {
        appDbContext = _appDbContext;
        moodleApi = new MoodleApi();
    }

#region Private Functions
    
    #region Start Meeting
    private async Task<Meeting> CreateInDb(ClassScheduleView classSchedule , int teacherId , string meetingName = "")
    {
        try
        {
            int scheduleId = classSchedule.Id;
            int moodleId = appDbContext.School_Lessons.Where(x => x.classId == classSchedule.ClassId && x.Lesson_Id == classSchedule.LessonId).FirstOrDefault().Moodle_Id;

            CourseDetail lessonDetail = await moodleApi.GetCourseDetail(moodleId);

            DateTime timeNow = MyDateTime.Now();

            List<Meeting> meetings = appDbContext.Meetings.Where(x => x.TeacherId == teacherId && x.ScheduleId == scheduleId).ToList();
            int newMeetingNo = meetings.Count + 1;

            if(meetingName == "")
                meetingName = lessonDetail.displayname + " جلسه " + newMeetingNo;

            Meeting meeting = new Meeting();
            meeting.MeetingName = meetingName;
            meeting.StartTime = timeNow;
            meeting.ScheduleId = scheduleId;
            meeting.TeacherId = teacherId;

            appDbContext.Meetings.Add(meeting);
            appDbContext.SaveChanges();

            return meeting;
        }
        catch
        {
            return null;
        }
    }
    private async Task<bool> CreateRoom(Meeting meeting , float duration)
    {
        string callBackUrl = AppSettings.BBBCallBackUrl + meeting.Id;

        BBBApi bbbApi = new BBBApi();
        MeetingsResponse response = await bbbApi.CreateRoom(meeting.MeetingName , meeting.Id.ToString() , (int)duration , callBackUrl);

        if(response.returncode != "FAILED")
        {
            meeting.BBB_MeetingId = meeting.Id.ToString();
            appDbContext.Meetings.Update(meeting);
            await appDbContext.SaveChangesAsync();
        
            return true;
        }

        return false;
    }
    private async Task<Meeting> StartMeeting(ClassScheduleView classSchedule , int teacherId , string meetingName = "")
    {
        Meeting meeting = await CreateInDb(classSchedule , teacherId);

        DateTime timeNow = MyDateTime.Now();
        float currentTime = timeNow.Hour + ((float)timeNow.Minute / 60);
        float duration = (classSchedule.EndHour - currentTime) * 60;

        bool result = await CreateRoom(meeting , duration);

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

        List<ClassScheduleView> schedules = appDbContext.ClassScheduleView.Where(x => (currentTime <= x.EndHour && currentTime >= (x.StartHour - 0.25))   && x.DayType == dayOfWeek).ToList();
        List<MeetingView> recentClasses = new List<MeetingView>();
        

        if(isTeacher)
        {
            schedules = schedules.Where(x => x.TeacherId == userId).ToList();

            List<ClassScheduleView> truncated = new List<ClassScheduleView>();

            foreach (var schedule in schedules)
            {
                ClassScheduleView truncate = truncated.Where(x => x.MixedId == schedule.MixedId).FirstOrDefault();

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
            meetingVW.BBB_MeetingId = meeting.BBB_MeetingId;
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


    public async Task<int> StartSingleMeeting(ClassScheduleView classSchedule , int teacherId)
    {   
        Meeting meeting = await StartMeeting(classSchedule , teacherId);

        if(meeting != null)
        {
            return meeting.Id;
        }

        return -1;
    }
    public async Task<int> StartMixedMeeting(ClassScheduleView classSchedule , int teacherId , int parentMeetingId)
    {
        Meeting meeting = await CreateInDb(classSchedule , teacherId);
        Meeting parentMeeting = appDbContext.Meetings.Where(x => x.Id == parentMeetingId).FirstOrDefault();

        meeting.StartTime = parentMeeting.StartTime;
        meeting.BBB_MeetingId = parentMeeting.BBB_MeetingId;
        
        appDbContext.Meetings.Update(meeting);
        await appDbContext.SaveChangesAsync();

        return (meeting != null ? meeting.Id : -1);
    }
    public async Task<string> JoinMeeting(UserModel user , string meetingId)
    {
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
            return null;

        BBBApi bbbApi = new BBBApi();
        string classUrl = await bbbApi.JoinRoom(isTeacher , meeting.BBB_MeetingId , user.FirstName + " " + user.LastName , user.Id.ToString());

        if(classUrl != null)
        {
            return classUrl;
        }

        return null;
    }
    public async Task<bool> EndMeeting(string bbbMeetingId , int teacherId)
    {
        Meeting meeting = new Meeting();
        meeting = appDbContext.Meetings.Where(x => x.BBB_MeetingId == bbbMeetingId && x.TeacherId == teacherId).FirstOrDefault();

        if(meeting == null)
            meeting = appDbContext.Meetings.Where(x => x.Id == int.Parse(bbbMeetingId) && x.TeacherId == teacherId).FirstOrDefault();

        if(meeting == null || meeting.Id == 0)
            return false;

        BBBApi bbbApi = new BBBApi();
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
            List<Meeting> oldMeetings = appDbContext.Meetings.Where(x => x.BBB_MeetingId == bbbMeetingId || x.Id == int.Parse(bbbMeetingId)).ToList();// Use for mixed meeting Id

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
    public List<MeetingView> GetAllMeeting()
    {
        List<MeetingView> meetingViews = new List<MeetingView>();

        return meetingViews;
    }

}
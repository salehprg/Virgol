using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Virgol.Helper;
using Models;
using Models.User;

public class ClassScheduleService {

    AppDbContext appDbContext;
    MoodleApi moodleApi;

    //public ClassScheduleService (AppDbContext _appDbContext , MoodleApi _moodleApi)
    public ClassScheduleService (AppDbContext _appDbContext , MoodleApi _moodleApi)
    {
        appDbContext = _appDbContext;
        moodleApi = _moodleApi;
    }

    public string CheckInteruptSchedule(Class_WeeklySchedule classSchedule)
    {
        List<Class_WeeklySchedule> classInterupts = appDbContext.ClassWeeklySchedules.Where(x => x.ClassId == classSchedule.ClassId &&
                                                                            x.DayType == classSchedule.DayType && //Check same day
                                                                            ((x.StartHour >= classSchedule.StartHour && x.StartHour < classSchedule.EndHour) || // Check oldClass Start time between new class Time
                                                                                (x.StartHour <= classSchedule.StartHour && x.EndHour > classSchedule.StartHour)) // Check newClass Start Time between oldClass Time
                ).ToList();

        if(string.IsNullOrEmpty(classSchedule.CustomLessonName) && classInterupts.Count > 0 && classInterupts.Where(x => x.weekly == classSchedule.weekly || x.weekly == 0).FirstOrDefault() != null)
        {
            return "ساعت ایجاد شده با درس دیگر تداخل دارد";
        }
        else
        {
            List<Class_WeeklySchedule> teacherIntrupts = appDbContext.ClassWeeklySchedules.Where(x => x.TeacherId == classSchedule.TeacherId &&
                                                                    x.DayType == classSchedule.DayType && //Check same day
                                                                    ((x.StartHour >= classSchedule.StartHour && x.StartHour < classSchedule.EndHour) || // Check oldClass Start time between new class Time
                                                                        (x.StartHour <= classSchedule.StartHour && x.EndHour > classSchedule.StartHour)) // Check newClass Start Time between oldClass Time
            ).ToList();
            if(teacherIntrupts.Count > 0 && teacherIntrupts.Where(x => x.weekly == classSchedule.weekly || x.weekly == 0).FirstOrDefault() != null)
            {
                return "ساعت ایجاد شده با درس دیگر این معلم تداخل دارد";
            }
        }

        return "";
    }
    
    public async Task<Class_WeeklySchedule> AddClassSchedule(Class_WeeklySchedule classSchedule)
    {
        try
        {
            int lessonMoodle_Id = appDbContext.School_Lessons.Where(x => x.classId == classSchedule.ClassId && x.Lesson_Id == classSchedule.LessonId).FirstOrDefault().Moodle_Id;

            List<EnrolUser> enrolUsers = new List<EnrolUser>();

            EnrolUser teacher = new EnrolUser();
            teacher.lessonId = lessonMoodle_Id;
            teacher.RoleId = 3;
            teacher.UserId = appDbContext.Users.Where(x => x.Id == classSchedule.TeacherId).FirstOrDefault().Moodle_Id;

            enrolUsers.Add(teacher);

            List<UserModel> users = new List<UserModel>();

            bool enrolment = await moodleApi.AssignUsersToCourse(enrolUsers);
            //bool enrolment = true;

            if(enrolment)
            {
                await appDbContext.ClassWeeklySchedules.AddAsync(classSchedule);
                await appDbContext.SaveChangesAsync();

                await moodleApi.setCourseVisible(lessonMoodle_Id , true);

                return classSchedule;
            }   

            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return null;
        }

    }

    public async Task<bool> RemoveSchedule(Class_WeeklySchedule classSchedule , bool isFreeClass = false)
    {
        try
        {
            School_Lessons school_Lesson = appDbContext.School_Lessons.Where(x => x.Lesson_Id == classSchedule.LessonId && x.classId == classSchedule.ClassId).FirstOrDefault();
            int lessonMoodleId = school_Lesson.Moodle_Id;

            UserModel teacherModel = appDbContext.Users.Where(x => x.Id == classSchedule.TeacherId).FirstOrDefault();

            bool unassignTeacher = false;

            if(teacherModel != null)
            {
                EnrolUser teacher = new EnrolUser();
                teacher.lessonId = lessonMoodleId;
                teacher.UserId = teacherModel.Moodle_Id;
                
                if(teacher.UserId != 0)
                {
                    unassignTeacher = await moodleApi.UnAssignUsersFromCourse(new List<EnrolUser>{teacher});
                    if(teacher.lessonId == -1)
                    {
                        unassignTeacher = true;
                    }
                }
                else
                {
                    teacherModel.Moodle_Id = await moodleApi.CreateUser(teacherModel);
                    unassignTeacher = true;
                }
            }
            //bool unassignTeacher = true;

            if(unassignTeacher)
            {
                if(classSchedule.MixedId != 0)
                {
                    List<Class_WeeklySchedule> schedules = appDbContext.ClassWeeklySchedules.Where(x => x.MixedId == classSchedule.MixedId).ToList();
                    appDbContext.ClassWeeklySchedules.RemoveRange(schedules);
                    
                    MixedSchedule mixed = appDbContext.MixedSchedules.Where(x => x.Id == classSchedule.MixedId).FirstOrDefault();
                    if(mixed != null)
                    {
                        appDbContext.MixedSchedules.Remove(mixed);
                    }
                }
                else
                {
                    appDbContext.ClassWeeklySchedules.Remove(classSchedule);
                }

                await appDbContext.SaveChangesAsync();

                if(appDbContext.ClassWeeklySchedules.Where(x => x.ClassId == classSchedule.ClassId && x.LessonId == classSchedule.LessonId).FirstOrDefault() == null)
                {
                    await moodleApi.setCourseVisible(lessonMoodleId , false);
                }

                List<Meeting> meetings = appDbContext.Meetings.Where(x => x.ScheduleId == classSchedule.Id).ToList();
                foreach (var meeting in meetings)
                {
                    if(meeting != null)
                    {
                        appDbContext.ParticipantInfos.RemoveRange(appDbContext.ParticipantInfos.Where(x => x.MeetingId == meeting.Id).ToList());
                    }
                }

                appDbContext.Meetings.RemoveRange(meetings);
                if(isFreeClass)
                {
                    LessonModel lesson = appDbContext.Lessons.Where(x => x.Id == school_Lesson.Lesson_Id).FirstOrDefault();
                    appDbContext.Lessons.Remove(lesson);
                    appDbContext.School_Lessons.Remove(school_Lesson);
                }

                appDbContext.MultiTeacherSchedules.RemoveRange(appDbContext.MultiTeacherSchedules.Where(x => x.ScheduleId == classSchedule.Id).ToList());

                await appDbContext.SaveChangesAsync();

                return true;
            }
            
            return false;
        }
        catch (Exception)
        {
            return false;
        }
    }
}
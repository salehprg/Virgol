using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using lms_with_moodle.Helper;
using Models;
using Models.User;

public class ClassScheduleService {

    AppDbContext appDbContext;
    //MoodleApi moodleApi;

    //public ClassScheduleService (AppDbContext _appDbContext , MoodleApi _moodleApi)
    public ClassScheduleService (AppDbContext _appDbContext)
    {
        appDbContext = _appDbContext;
        //moodleApi = _moodleApi;
    }

    public object CheckInteruptSchedule(Class_WeeklySchedule classSchedule)
    {
        List<Class_WeeklySchedule> classInterupts = appDbContext.ClassWeeklySchedules.Where(x => x.ClassId == classSchedule.ClassId &&
                                                                            x.DayType == classSchedule.DayType && //Check same day
                                                                            ((x.StartHour >= classSchedule.StartHour && x.StartHour < classSchedule.EndHour) || // Check oldClass Start time between new class Time
                                                                                (x.StartHour <= classSchedule.StartHour && x.EndHour > classSchedule.StartHour)) // Check newClass Start Time between oldClass Time
                ).ToList();

        if(classInterupts.Count > 0 && classInterupts.Where(x => x.weekly == classSchedule.weekly || x.weekly == 0).FirstOrDefault() != null)
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

        return true;
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

            //bool enrolment = await moodleApi.AssignUsersToCourse(enrolUsers);
            bool enrolment = true;

            if(enrolment)
            {
                appDbContext.ClassWeeklySchedules.Add(classSchedule);
                appDbContext.SaveChanges();

               // await moodleApi.setCourseVisible(lessonMoodle_Id , true);

                return classSchedule;
            }   

            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.StackTrace);
            return null;
        }

    }
}
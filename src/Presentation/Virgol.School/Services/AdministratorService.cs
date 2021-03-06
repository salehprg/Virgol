using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Virgol.Helper;
using Models;
using Models.User;

public class AdministratorService {

    AppDbContext appDbContext;
    MoodleApi moodleApi;

    //public ClassScheduleService (AppDbContext _appDbContext , MoodleApi _moodleApi)
    public AdministratorService (AppDbContext _appDbContext , MoodleApi _moodleApi)
    {
        appDbContext = _appDbContext;
        moodleApi = _moodleApi;
    }
    public async Task<bool> AddLessonToClass(LessonModel lesson , School_Class schoolClass , bool moodle_visible)
    {
        try
        {
            SchoolModel school = appDbContext.Schools.Where(x => x.Id == schoolClass.School_Id).FirstOrDefault();

            School_Lessons schoolLesson = new School_Lessons();
            schoolLesson.classId = schoolClass.Id;
            schoolLesson.Lesson_Id = lesson.Id;
            schoolLesson.School_Id = school.Id;

            int moodleId = await moodleApi.CreateCourse(lesson.LessonName + " (" + school.Moodle_Id + "-" + schoolClass.Moodle_Id + ")"
                                                            , lesson.LessonName + " (" + school.SchoolName + "-" + schoolClass.ClassName + ")" 
                                                            , schoolClass.Moodle_Id , moodle_visible);
            schoolLesson.Moodle_Id = moodleId;

            appDbContext.School_Lessons.Add(schoolLesson);
            await appDbContext.SaveChangesAsync();

            Class_WeeklySchedule schedule = appDbContext.ClassWeeklySchedules.Where(x => x.ClassId == schoolClass.Id && x.LessonId == lesson.Id).FirstOrDefault();
            List<EnrolUser> enrolsData = new List<EnrolUser>();

            if(schedule != null)
            {
                UserModel teacher = appDbContext.Users.Where(x => x.Id == schedule.TeacherId).FirstOrDefault();

                if(teacher != null)
                {
                    int teacherMoodleid = teacher.Moodle_Id;

                    EnrolUser enrolTeacher = new EnrolUser();
                    enrolTeacher.lessonId = schoolLesson.Moodle_Id;
                    enrolTeacher.UserId = teacher.Moodle_Id;
                    enrolTeacher.RoleId = 3;

                    enrolsData.Add(enrolTeacher);
                }
            }

            UserModel manager = appDbContext.Users.Where(x => x.Id == school.ManagerId).FirstOrDefault();
            
            if(manager != null)
            {
                int managerMoodleid = manager.Moodle_Id;

                EnrolUser enrol = new EnrolUser();
                enrol.lessonId = schoolLesson.Moodle_Id;
                enrol.UserId = manager.Moodle_Id;
                enrol.RoleId = 3;

                enrolsData.Add(enrol);
            }
        
            List<School_studentClass> studentClasses = appDbContext.School_StudentClasses.Where(x => x.ClassId == schoolClass.Id).ToList();
            foreach (var student in studentClasses)
            {
                UserModel studentModel = appDbContext.Users.Where(x => x.Id == student.UserId).FirstOrDefault();
                if(studentModel != null)
                {
                    int studentMoodleid = studentModel.Moodle_Id;

                    EnrolUser enrol = new EnrolUser();
                    enrol.lessonId = schoolLesson.Moodle_Id;
                    enrol.UserId = studentModel.Moodle_Id;
                    enrol.RoleId = 5;

                    enrolsData.Add(enrol);
                }

            }     

            return true;
        }
        catch (System.Exception)
        {
            return false;
            throw;
        }
    }

}
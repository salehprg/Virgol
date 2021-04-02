using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Virgol.Helper;
using Microsoft.AspNetCore.Identity;
using Models;
using Models.User;
using Models.Users.Roles;
using Virgol.School.Models;

public class ManagerService {
    AppDbContext appDbContext;
    MoodleApi moodleApi;
    UserService userService;
    public ManagerService(AppDbContext _appDbContext , UserManager<UserModel> userManager = null)
    {
        appDbContext = _appDbContext;
        moodleApi = new MoodleApi(AppSettings.GetValueFromDatabase(appDbContext , "Token_moodle"));

        if(userManager != null)
            userService = new UserService(userManager , appDbContext);

    }
    public async Task<bool> AssignUsersToClass(List<UserModel> userModels , int classId)
    {
        School_Class classModel = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault();
        int classMoodleId = classModel.Moodle_Id;

        List<School_studentClass> studentClasses = new List<School_studentClass>();

        List<EnrolUser> enrolsData = new List<EnrolUser>();
        foreach (var user in userModels)
        {
            
            UserModel student = user;
            int userid = student.Id;

            School_studentClass studentClass = new School_studentClass();

            studentClass.ClassId = classId;
            studentClass.UserId = userid;
            

            School_studentClass oldStudentClass = appDbContext.School_StudentClasses.Where(x => x.UserId == userid && x.ClassId == classModel.Id).FirstOrDefault();

            //Prevent from add duplicate user to class
            if(oldStudentClass == null)
            {
                UserModel userModel = appDbContext.Users.Where(x => x.Id == studentClass.UserId).FirstOrDefault();
                bool Isok = false;

                if(userService.HasRole(userModel , Roles.Student))
                {
                    if(userModel.SchoolId == classModel.School_Id)
                    {
                        Isok = true;
                    }
                }
                else
                {
                    TeacherDetail teacher = appDbContext.TeacherDetails.Where(x => x.TeacherId == student.Id).FirstOrDefault();
                    if(teacher.getTeacherSchoolIds().Where(x => x == classModel.School_Id).FirstOrDefault() != 0)
                    {
                        Isok = true;
                    }
                }

                if(Isok)
                {
                    studentClasses.Add(studentClass);

                    List<School_Lessons> lessons = appDbContext.School_Lessons.Where(x => x.classId == classId).ToList();

                    foreach(var lesson in lessons)
                    {
                        EnrolUser enrolInfo = new EnrolUser();
                        enrolInfo.lessonId = lesson.Moodle_Id;
                        enrolInfo.RoleId = 5;
                        enrolInfo.UserId = student.Moodle_Id;

                        enrolsData.Add(enrolInfo);
                    } 
                }

            } 
        }

        await moodleApi.AssignUsersToCourse(enrolsData);

        await appDbContext.School_StudentClasses.AddRangeAsync(studentClasses);
        await appDbContext.SaveChangesAsync();

        return true;
        
    }

    public async Task<bool> AssignUserToExtraLesson(UserModel student , ExtraLesson extraLesson)
    {
        int classId = extraLesson.ClassId;

        School_Class classModel = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault();
        int classMoodleId = classModel.Moodle_Id;
        int userid = student.Id;

        School_studentClass studentClass = new School_studentClass();

        studentClass.ClassId = classId;
        studentClass.UserId = userid;
        

        School_studentClass oldStudentClass = appDbContext.School_StudentClasses.Where(x => x.UserId == userid && x.ClassId == classModel.Id).FirstOrDefault();

        //Prevent from add duplicate user to class
        if(oldStudentClass == null || (oldStudentClass != null && oldStudentClass.ClassId == classId))
        {
            School_Lessons lesson = appDbContext.School_Lessons.Where(x => x.classId == classId && x.Lesson_Id == extraLesson.lessonId).FirstOrDefault();
            List<ExtraLesson> extraLessons = appDbContext.ExtraLessons.Where(x => x.UserId == userid).ToList();

            if(extraLessons.Where(x => x.ClassId == classId && x.lessonId == lesson.Lesson_Id).FirstOrDefault() == null)
            {
                if(appDbContext.Users.Where(x => x.Id == studentClass.UserId && x.SchoolId == classModel.School_Id).FirstOrDefault() != null)
                {
                    
                    EnrolUser enrolInfo = new EnrolUser();
                    enrolInfo.lessonId = lesson.Moodle_Id;
                    enrolInfo.RoleId = 5;
                    enrolInfo.UserId = student.Moodle_Id;

                    await moodleApi.AssignUsersToCourse(new List<EnrolUser>{enrolInfo});

                    extraLesson.UserId = userid;
                }

                await appDbContext.ExtraLessons.AddAsync(extraLesson);
                await appDbContext.School_StudentClasses.AddAsync(studentClass);
                await appDbContext.SaveChangesAsync();

                return true;
            }
        } 

        return false;
        
    }

    public async Task<bool> UnAssignUserFromExtraLesson(UserModel userModel , ExtraLesson extraLesson)
    {
        try
        {   
            int classId = extraLesson.ClassId;
            int userid = userModel.Id;

            int classMoodleId = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault().Moodle_Id;

            Class_WeeklySchedule schedule = appDbContext.ClassWeeklySchedules.Where(x => x.ClassId == classId && x.LessonId == extraLesson.lessonId).FirstOrDefault();

            int moodelId = appDbContext.Users.Where(x => x.Id == userid).FirstOrDefault().Moodle_Id;

            School_studentClass student = appDbContext.School_StudentClasses.Where(x => x.UserId == userid).FirstOrDefault();
            
            School_Lessons lesson = appDbContext.School_Lessons.Where(x => x.classId == classId && x.Lesson_Id == extraLesson.lessonId).FirstOrDefault();
            EnrolUser unEnrolInfo = new EnrolUser();
            unEnrolInfo.lessonId = lesson.Moodle_Id;
            unEnrolInfo.UserId = moodelId;

            await moodleApi.UnAssignUsersFromCourse(new List<EnrolUser>{unEnrolInfo});
            appDbContext.ExtraLessons.Remove(extraLesson);

            if(student != null)
            {
                appDbContext.School_StudentClasses.Remove(student);
            }

            await appDbContext.SaveChangesAsync();


            return true;
        }
        catch(Exception ex)
        {
            return false;
        }
        
    }

}
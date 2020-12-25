using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using lms_with_moodle.Helper;
using Models;
using Models.User;

public class ManagerService {
    AppDbContext appDbContext;
    MoodleApi moodleApi;
    public ManagerService(AppDbContext _appDbContext)
    {
        appDbContext = _appDbContext;
        moodleApi = new MoodleApi();
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
                if(appDbContext.Users.Where(x => x.Id == studentClass.UserId && x.SchoolId == classModel.School_Id).FirstOrDefault() != null)
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

}
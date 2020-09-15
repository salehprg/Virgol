using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using lms_with_moodle.Helper;
using Models;
using Models.User;

public class ManagerService {
    AppDbContext appDbContext;
    //MoodleApi moodleApi;
    public ManagerService(AppDbContext _appDbContext)
    {
        appDbContext = _appDbContext;
        //moodleApi = new MoodleApi();
    }
    public async Task<bool> AssignUsersToClass(List<UserModel> userModels , int classId)
    {
        School_Class classModel = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault();
        int classMoodleId = classModel.Moodle_Id;

        List<School_studentClass> studentClasses = new List<School_studentClass>();
        List<School_studentClass> duplicateStudentClass = new List<School_studentClass>();
        //List<CourseDetail> courses = await moodleApi.GetAllCourseInCat(classMoodleId); //because All user will be add to same category
        List<EnrolUser> enrolsData = new List<EnrolUser>();

        foreach (var user in userModels)
        {
            
            UserModel student = user;
            int userid = student.Id;

            School_studentClass studentClass = new School_studentClass();

            studentClass.ClassId = classId;
            studentClass.UserId = userid;
            

            School_studentClass oldStudentClass = appDbContext.School_StudentClasses.Where(x => x.UserId == userid).FirstOrDefault();

            if(oldStudentClass == null)
            {
                if(appDbContext.Users.Where(x => x.Id == studentClass.UserId && x.SchoolId == classModel.School_Id).FirstOrDefault() != null)
                {
                    studentClasses.Add(studentClass);
                }
                // foreach(var course in courses)
                // {
                //     EnrolUser enrolInfo = new EnrolUser();
                //     enrolInfo.lessonId = course.id;
                //     enrolInfo.RoleId = 5;
                //     enrolInfo.UserId = student.Moodle_Id;

                //     enrolsData.Add(enrolInfo);
                // } 
            } 
        }

        //await moodleApi.AssignUsersToCourse(enrolsData);

        await appDbContext.School_StudentClasses.AddRangeAsync(studentClasses);
        await appDbContext.SaveChangesAsync();

        return true;
        
    }

}
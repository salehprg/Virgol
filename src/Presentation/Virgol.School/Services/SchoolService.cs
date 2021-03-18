using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Virgol.Helper;
using Microsoft.Extensions.Options;
using Models;

public class SchoolService 
{
    private readonly AppDbContext appDbContext;

    MoodleApi moodleApi;
    public SchoolService(AppDbContext _appdbContext)
    {
        appDbContext = _appdbContext;

        moodleApi = new MoodleApi(AppSettings.GetValueFromDatabase(appDbContext , "Token_moodle"));
    }

    public class CreateSchoolResult
    {
        public List<School_Bases> school_Bases;
        public List<School_Grades> school_Grades;
        public List<School_StudyFields> school_StudyFields;
        }

    public List<ServicesModel> GetSchoolMeetingServices(int schoolId)
    {
        try
        {
            List<int> serviceIds = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault().GetServicesId();
            List<ServicesModel> services = new List<ServicesModel>();

            foreach (var srvcId in serviceIds)
            {
                ServicesModel servicesModel = appDbContext.Services.Where(x => x.Id == srvcId).FirstOrDefault();
                if(servicesModel != null)
                {
                    services.Add(servicesModel);
                }
            }

            return services;
        }
        catch (System.Exception)
        {
            
            throw;
        }
    }

    public async Task<SchoolModel> CreateSchool(SchoolModel schoolModel)
    {
        try
        {
            int parentId = 0;
            AdminDetail adminDetail = appDbContext.AdminDetails.Where(x => x.SchoolsType == schoolModel.SchoolType).FirstOrDefault();
            parentId = adminDetail.orgMoodleId;

            int SchoolMoodleId = await moodleApi.CreateCategory(schoolModel.SchoolName , parentId);
            //int SchoolMoodleId = 0;

            if(SchoolMoodleId != -1)
            {
                schoolModel.Moodle_Id = SchoolMoodleId;
                
                await appDbContext.Schools.AddAsync(schoolModel);
                await appDbContext.SaveChangesAsync();

                schoolModel.Id = appDbContext.Schools.OrderByDescending(x => x.Id).FirstOrDefault().Id;

                return schoolModel;
            }

            return null;
        }
        catch
        {
            return null;
        }
        
    }
    
    public async Task<List<School_Bases>> AddBaseToSchool(List<School_Bases> inputData)
    {
        try
        {
            List<School_Bases> school_Bases = new List<School_Bases>();
            int schoolMoodleId = appDbContext.Schools.Where(x => x.Id == inputData[0].School_Id).FirstOrDefault().Moodle_Id;

            foreach (var schoolBase in inputData)
            {
                BaseModel baseModel = appDbContext.Bases.Where(x => x.Id == schoolBase.Base_Id).FirstOrDefault();
                int baseMoodleId = await moodleApi.CreateCategory(baseModel.BaseName , schoolMoodleId);
                //int baseMoodleId = 0;

                School_Bases school_Base = new School_Bases();
                school_Base.Base_Id = schoolBase.Base_Id;
                school_Base.Moodle_Id = baseMoodleId;
                school_Base.School_Id = schoolBase.School_Id;

                school_Bases.Add(school_Base);
            }

            await appDbContext.School_Bases.AddRangeAsync(school_Bases);
            await appDbContext.SaveChangesAsync();

            return school_Bases;
        }
        catch
        {
            return null;
        }
        
    }
    
    public async Task<School_Bases> DeleteBaseFromSchool(int baseId)
    {
        try
        {
            School_Bases schoolBase = appDbContext.School_Bases.Where(x => x.Id == baseId).FirstOrDefault();
            
            bool deleteBase = await moodleApi.DeleteCategory(schoolBase.Moodle_Id);
            //bool deleteBase = true;
            
            if(deleteBase)
            {
                List<StudyFieldModel> studies = appDbContext.StudyFields.Where(x => x.Base_Id == schoolBase.Base_Id).ToList();
                foreach (var study in studies)
                {
                    School_StudyFields schoolStudyField = appDbContext.School_StudyFields.Where(x => x.StudyField_Id == study.Id && x.School_Id == schoolBase.School_Id).FirstOrDefault();
                    List<GradeModel> grades = appDbContext.Grades.Where(x => x.StudyField_Id == study.Id).ToList();
                    
                    foreach (var grade in grades)
                    {
                        School_Grades schoolGrade = appDbContext.School_Grades.Where(x => x.Grade_Id == grade.Id && x.School_Id == schoolBase.School_Id).FirstOrDefault();
                        if(schoolGrade != null)
                        {
                            appDbContext.School_Grades.Remove(schoolGrade);
                            School_Class schoolClass = appDbContext.School_Classes.Where(x => x.Grade_Id == schoolGrade.Grade_Id && x.School_Id == schoolBase.School_Id).FirstOrDefault();
                            if(schoolClass != null)
                            {
                                appDbContext.School_Classes.Remove(schoolClass);
                            }
                        }
                    }

                    if(schoolStudyField != null)
                    {
                        appDbContext.School_StudyFields.Remove(schoolStudyField);
                    }
                }

                appDbContext.School_Bases.Remove(schoolBase);

                await appDbContext.SaveChangesAsync();

                return schoolBase;
            }

            return null;
        }
        catch
        {
            return null;
        }
        
    }
    
    public async Task<List<School_StudyFields>> AddStudyFieldToSchool(List<School_StudyFields> inputData)
    {
        try
        {
            List<School_StudyFields> school_StudyFields = new List<School_StudyFields>();
            List<School_Grades> school_Grades = new List<School_Grades>();

            int schoolId = inputData[0].School_Id;

            foreach (var studyFModel in inputData)
            {
                StudyFieldModel studyField = appDbContext.StudyFields.Where(x => x.Id == studyFModel.StudyField_Id).FirstOrDefault();

                int baseMoodleId = appDbContext.School_Bases.Where(x => x.Base_Id == studyField.Base_Id && x.School_Id == schoolId).FirstOrDefault().Moodle_Id;

                int studyFieldMoodleId = await moodleApi.CreateCategory(studyField.StudyFieldName , baseMoodleId);
                //int studyFieldMoodleId = 0;

                School_StudyFields schoolStudyF = new School_StudyFields();
                schoolStudyF.Moodle_Id = studyFieldMoodleId;
                schoolStudyF.School_Id = schoolId;
                schoolStudyF.StudyField_Id = studyFModel.StudyField_Id;

                school_StudyFields.Add(schoolStudyF);

                List<GradeModel> gradeModels = appDbContext.Grades.Where(x => x.StudyField_Id == studyFModel.StudyField_Id).ToList();
                foreach (var gradeModel in gradeModels)
                { 
                    int gradeIdMoodle = await moodleApi.CreateCategory(gradeModel.GradeName  , schoolStudyF.Moodle_Id);
                    //int gradeIdMoodle = 0;

                    School_Grades school_Grade = new School_Grades();
                    school_Grade.Moodle_Id = gradeIdMoodle;
                    school_Grade.Grade_Id = gradeModel.Id;
                    school_Grade.School_Id = schoolId;

                    school_Grades.Add(school_Grade);

                }

            
            }

            appDbContext.School_StudyFields.AddRange(school_StudyFields);
            appDbContext.School_Grades.AddRange(school_Grades);

            await appDbContext.SaveChangesAsync();

            return school_StudyFields;
        }
        catch(Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return null;
        }
        
    }
    
    public async Task<School_StudyFields> DeleteStudyFieldFromSchool(int studyFieldId)
    {
        try
        {
            School_StudyFields schoolStudyField = appDbContext.School_StudyFields.Where(x => x.Id == studyFieldId).FirstOrDefault();

            bool deleteMoodle = await moodleApi.DeleteCategory(schoolStudyField.Moodle_Id);
            //bool deleteMoodle = true;

            if(deleteMoodle)
            {
                List<GradeModel> grades = appDbContext.Grades.Where(x => x.StudyField_Id == schoolStudyField.StudyField_Id).ToList();
                
                foreach (var grade in grades)
                {
                    School_Grades schoolGrade = appDbContext.School_Grades.Where(x => x.Grade_Id == grade.Id && x.School_Id == schoolStudyField.School_Id).FirstOrDefault();
                    appDbContext.School_Grades.Remove(schoolGrade);
                    
                    School_Class schoolClass = appDbContext.School_Classes.Where(x => x.Grade_Id == schoolGrade.Grade_Id && x.School_Id == schoolStudyField.School_Id).FirstOrDefault();
                    if(schoolClass != null)
                    {
                        appDbContext.School_Classes.Remove(schoolClass);
                    }
                }

                appDbContext.School_StudyFields.Remove(schoolStudyField);

                await appDbContext.SaveChangesAsync();

                return schoolStudyField;
            }

            return null;
        }
        catch
        {
            return null;
        }
        
    }
    
    public async Task<School_Class> AddClass(ClassData classModel , SchoolModel school)
    {
        int classMoodleId = -1;
        School_Grades gradeModel = new School_Grades();

        //It means Going to Create Non-Free Meeting
        if(classModel.gradeId != 0)
        {
            gradeModel = appDbContext.School_Grades.Where(x => x.Grade_Id == classModel.gradeId && x.School_Id == school.Id).FirstOrDefault();

            classMoodleId = await moodleApi.CreateCategory(classModel.ClassName , gradeModel.Moodle_Id);
        }
        else
        {
            classMoodleId = await moodleApi.CreateCategory(classModel.ClassName , school.Moodle_Id);
            gradeModel.Grade_Id = 0;
            gradeModel.Moodle_Id = 0;
        }

        if(classMoodleId != -1)
        {
            List<LessonModel> lessons = (gradeModel.Grade_Id != 0 ? appDbContext.Lessons.Where(x => x.Grade_Id == gradeModel.Grade_Id).ToList() : new List<LessonModel>());
            List<School_Lessons> schoolLessons = new List<School_Lessons>();

            School_Class schoolClass = new School_Class();
            schoolClass.ClassName = classModel.ClassName;
            schoolClass.Grade_Id = gradeModel.Grade_Id;
            schoolClass.Grade_MoodleId = gradeModel.Moodle_Id;
            schoolClass.Moodle_Id = classMoodleId;
            schoolClass.School_Id = school.Id;

            await appDbContext.School_Classes.AddAsync(schoolClass);
            await appDbContext.SaveChangesAsync();


            List<EnrolUser> enrolsManager = new List<EnrolUser>();
            int managerMoodleId = appDbContext.Users.Where(x => x.Id == school.ManagerId).FirstOrDefault().Moodle_Id;
            
            foreach (var lesson in lessons)
            {
                int moodleId = await moodleApi.CreateCourse(lesson.LessonName + " (" + school.Moodle_Id + "-" + classMoodleId + ")", lesson.LessonName + " (" + school.SchoolName + "-" + classModel.ClassName + ")" , classMoodleId);
                //int moodleId = 0;

                School_Lessons schoolLesson = new School_Lessons();
                schoolLesson.Lesson_Id = lesson.Id;
                schoolLesson.Moodle_Id = moodleId;
                schoolLesson.School_Id = school.Id;
                schoolLesson.classId = schoolClass.Id;

                schoolLessons.Add(schoolLesson);

                //Enrol manager to all Lessons

                EnrolUser enrol = new EnrolUser();
                enrol.lessonId = moodleId;
                enrol.UserId = managerMoodleId;
                enrol.RoleId = 3;

                enrolsManager.Add(enrol);
                
            }
            
            appDbContext.School_Lessons.AddRange(schoolLessons);
            await appDbContext.SaveChangesAsync();

            await moodleApi.AssignUsersToCourse(enrolsManager);

            return schoolClass;
        }

        return null;
    }

}
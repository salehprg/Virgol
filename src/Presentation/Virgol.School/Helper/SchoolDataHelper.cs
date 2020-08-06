using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using lms_with_moodle.Helper;
using Microsoft.Extensions.Options;
using Models;

public class SchoolDataHelper {
        private readonly AppDbContext appDbContext;
        private readonly AppSettings appSettings;

        MoodleApi moodleApi;
        public SchoolDataHelper(AppSettings _appsetting
                                , AppDbContext _appdbContext)
        {
            appSettings = _appsetting;
            appDbContext = _appdbContext;

            moodleApi = new MoodleApi(appSettings);
        }

        public class CreateSchoolResult
        {
            public List<School_Bases> school_Bases;
            public List<School_Grades> school_Grades;
            public List<School_StudyFields> school_StudyFields;
        }

        public async Task<SchoolModel> CreateSchool(SchoolModel schoolModel)
        {
            try
            {
                int SchoolMoodleId = await moodleApi.CreateCategory(schoolModel.SchoolName);

                if(SchoolMoodleId != -1)
                {
                    appDbContext.Schools.Add(schoolModel);
                    appDbContext.SaveChanges();

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

                    School_Bases school_Base = new School_Bases();
                    school_Base.Base_Id = schoolBase.Base_Id;
                    school_Base.Moodle_Id = baseMoodleId;
                    school_Base.School_Id = schoolBase.School_Id;

                    school_Bases.Add(school_Base);
                }

                appDbContext.School_Bases.AddRange(school_Bases);
                appDbContext.SaveChanges();

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
                if(deleteBase)
                {
                    List<StudyFieldModel> studies = appDbContext.StudyFields.Where(x => x.Base_Id == schoolBase.Base_Id).ToList();
                    foreach (var study in studies)
                    {
                        School_StudyFields schoolStudyField = appDbContext.School_StudyFields.Where(x => x.StudyField_Id == study.Id).FirstOrDefault();
                        List<GradeModel> grades = appDbContext.Grades.Where(x => x.StudyField_Id == study.Id).ToList();
                        
                        foreach (var grade in grades)
                        {
                            School_Grades schoolGrade = appDbContext.School_Grades.Where(x => x.Grade_Id == grade.Id).FirstOrDefault();
                            if(schoolGrade != null)
                            {
                                appDbContext.School_Grades.Remove(schoolGrade);
                            }
                        }

                        if(schoolStudyField != null)
                        {
                            appDbContext.School_StudyFields.Remove(schoolStudyField);
                        }
                    }

                    appDbContext.School_Bases.Remove(schoolBase);

                    appDbContext.SaveChanges();

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
                    int baseId = appDbContext.StudyFields.Where(x => x.Id == studyFModel.StudyField_Id).FirstOrDefault().Base_Id;
                    int baseMoodleId = appDbContext.School_Bases.Where(x => x.Base_Id == baseId && x.School_Id == schoolId).FirstOrDefault().Moodle_Id;

                    StudyFieldModel studyField = appDbContext.StudyFields.Where(x => x.Id == studyFModel.StudyField_Id).FirstOrDefault();
                    int studyFieldMoodleId = await moodleApi.CreateCategory(studyField.StudyFieldName , baseMoodleId);

                    School_StudyFields schoolStudyF = new School_StudyFields();
                    schoolStudyF.Moodle_Id = studyFieldMoodleId;
                    schoolStudyF.School_Id = schoolId;
                    schoolStudyF.StudyField_Id = studyFModel.StudyField_Id;

                    school_StudyFields.Add(schoolStudyF);

                    List<GradeModel> gradeModels = appDbContext.Grades.Where(x => x.StudyField_Id == studyFModel.StudyField_Id).ToList();
                    foreach (var gradeModel in gradeModels)
                    { 
                        int gradeIdMoodle = await moodleApi.CreateCategory(gradeModel.GradeName  , schoolStudyF.Moodle_Id);

                        School_Grades school_Grade = new School_Grades();
                        school_Grade.Moodle_Id = gradeIdMoodle;
                        school_Grade.Grade_Id = gradeModel.Id;
                        school_Grade.School_Id = schoolId;

                        school_Grades.Add(school_Grade);

                    }

                
                }

                appDbContext.School_StudyFields.AddRange(school_StudyFields);
                appDbContext.School_Grades.AddRange(school_Grades);

                appDbContext.SaveChanges();

                return school_StudyFields;
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
            
        }
        
        public async Task<School_StudyFields> DeleteStudyFieldFromSchool(int studyFieldId)
        {
            try
            {
                School_StudyFields schoolStudyField = appDbContext.School_StudyFields.Where(x => x.Id == studyFieldId).FirstOrDefault();

                bool deleteMoodle = await moodleApi.DeleteCategory(schoolStudyField.Moodle_Id);

                if(deleteMoodle)
                {
                    List<GradeModel> grades = appDbContext.Grades.Where(x => x.StudyField_Id == schoolStudyField.StudyField_Id).ToList();
                    
                    foreach (var grade in grades)
                    {
                        School_Grades schoolGrade = appDbContext.School_Grades.Where(x => x.Grade_Id == grade.Id).FirstOrDefault();
                        appDbContext.School_Grades.Remove(schoolGrade);
                    }

                    appDbContext.School_StudyFields.Remove(schoolStudyField);

                    appDbContext.SaveChanges();

                    return schoolStudyField;
                }

                return null;
            }
            catch
            {
                return null;
            }
            
        }
        


        // public async Task<CreateSchoolResult> CreateSchool_Grade(List<int> baseIds , List<int> studyFIds , List<int> gradeIds , int SchoolMoodleId)
        // {
        //     List<School_Bases> school_Bases = new List<School_Bases>();
        //     List<School_Grades> school_Grades = new List<School_Grades>();
        //     List<School_StudyFields> school_StudyFields = new List<School_StudyFields>();

        //     foreach (var id in baseIds)
        //     {

        //         BaseModel baseModel = appDbContext.Bases.Where(x => x.Id == id).FirstOrDefault();
        //         int baseMoodleId = await moodleApi.CreateCategory(baseModel.BaseName , SchoolMoodleId);

        //         School_Bases school_Base = new School_Bases();
        //         school_Base.Base_Id = id;
        //         school_Base.Moodle_Id = baseMoodleId;
        //         school_Bases.Add(school_Base);
                
        //         List<StudyFieldModel> studyFields = appDbContext.StudyFields.Where(x => x.Base_Id == id).ToList();
        //         if(studyFields != null)
        //         {
        //             foreach (var studyFieldId in studyFIds)
        //             {
        //                 StudyFieldModel study = studyFields.Where(x => x.Id == studyFieldId).FirstOrDefault();
        //                 int studyFMoodleId = await moodleApi.CreateCategory(study.StudyFieldName , baseMoodleId);

        //                 //Add syudyFielsd to school Study Fields List
        //                 School_StudyFields school_StudyField = new School_StudyFields();
        //                 school_StudyField.Moodle_Id = studyFMoodleId;
        //                 school_StudyField.StudyField_Id = studyFieldId;

        //                 school_StudyFields.Add(school_StudyField);


        //                 List<GradeModel> gradeModels = appDbContext.Grades.Where(x => x.StudyField_Id == studyFieldId).ToList();
        //                 foreach (var gradeModel in gradeModels)
        //                 {
        //                     //Just add grades in selected studyField
        //                     int gradeId = gradeIds.Where(x => x == gradeModel.Id).FirstOrDefault();
        //                     if(gradeId > 0)
        //                     {
                                
        //                         int gradeIdMoodle = await moodleApi.CreateCategory(gradeModel.GradeName  , studyFMoodleId);

        //                         School_Grades school_Grade = new School_Grades();
        //                         school_Grade.Moodle_Id = gradeIdMoodle;
        //                         school_Grade.Grade_Id = gradeId;

        //                         school_Grades.Add(school_Grade);

        //                     }
        //                 }
        //             }
        //         }

        //     }

        //     CreateSchoolResult createSchoolResult = new CreateSchoolResult();
        //     createSchoolResult.school_Bases = school_Bases;
        //     createSchoolResult.school_Grades = school_Grades;
        //     createSchoolResult.school_StudyFields = school_StudyFields;

        //     return createSchoolResult;
        // }
}
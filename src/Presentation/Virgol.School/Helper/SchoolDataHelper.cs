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

        public async Task<CreateSchoolResult> CreateSchool_Grade(List<int> baseIds , List<int> studyFIds , List<int> gradeIds , int SchoolMoodleId)
        {
            List<School_Bases> school_Bases = new List<School_Bases>();
            List<School_Grades> school_Grades = new List<School_Grades>();
            List<School_StudyFields> school_StudyFields = new List<School_StudyFields>();

            foreach (var id in baseIds)
            {

                BaseModel baseModel = appDbContext.Bases.Where(x => x.Id == id).FirstOrDefault();
                int baseMoodleId = await moodleApi.CreateCategory(baseModel.BaseName , SchoolMoodleId);

                School_Bases school_Base = new School_Bases();
                school_Base.Base_Id = id;
                school_Base.Moodle_Id = baseMoodleId;
                school_Bases.Add(school_Base);
                
                List<StudyFieldModel> studyFields = appDbContext.StudyFields.Where(x => x.Base_Id == id).ToList();
                if(studyFields != null)
                {
                    foreach (var studyFieldId in studyFIds)
                    {
                        

                        StudyFieldModel study = studyFields.Where(x => x.Id == studyFieldId).FirstOrDefault();
                        int studyFMoodleId = await moodleApi.CreateCategory(study.StudyFieldName , baseMoodleId);

                        //Add syudyFielsd to school Study Fields List
                        School_StudyFields school_StudyField = new School_StudyFields();
                        school_StudyField.Moodle_Id = studyFMoodleId;
                        school_StudyField.StudyField_Id = studyFieldId;

                        school_StudyFields.Add(school_StudyField);


                        List<GradeModel> gradeModels = appDbContext.Grades.Where(x => x.StudyField_Id == studyFieldId).ToList();
                        foreach (var gradeModel in gradeModels)
                        {
                            //Just add grades in selected studyField
                            int gradeId = gradeIds.Where(x => x == gradeModel.Id).FirstOrDefault();
                            if(gradeId > 0)
                            {
                                
                                int gradeIdMoodle = await moodleApi.CreateCategory(gradeModel.GradeName  , studyFMoodleId);

                                School_Grades school_Grade = new School_Grades();
                                school_Grade.Moodle_Id = gradeIdMoodle;
                                school_Grade.Grade_Id = gradeId;

                                school_Grades.Add(school_Grade);

                                List<LessonModel> lessonModels = appDbContext.Lessons.Where(x => x.Grade_Id == gradeId).ToList();
                                foreach (var lesson in lessonModels)
                                {
                                    await moodleApi.CreateCourse(lesson.LessonName ,gradeIdMoodle );
                                }
                            }
                        }
                    }
                }
                else
                {
                    List<GradeModel> gradeModels = appDbContext.Grades.Where(x => x.Base_Id == id).ToList();
                    foreach (var grade in gradeModels)
                    {
                        if(gradeIds.Where(x => x == grade.Id).Count() >= 0)
                        {
                            await moodleApi.CreateCategory(grade.GradeName , baseMoodleId);
                        }
                    }
                }

            }

            CreateSchoolResult createSchoolResult = new CreateSchoolResult();
            createSchoolResult.school_Bases = school_Bases;
            createSchoolResult.school_Grades = school_Grades;
            createSchoolResult.school_StudyFields = school_StudyFields;

            return createSchoolResult;
        }
}
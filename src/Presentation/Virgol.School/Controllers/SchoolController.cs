using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Novell.Directory.Ldap;
using System.Net;
using System.Security.Cryptography;
using System.Net.Http;
using System.Net.Http.Headers;
using Models.MoodleApiResponse;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Options;

using lms_with_moodle.Helper;

using Models;
using Models.User;
using Microsoft.AspNetCore.Http;
using System.IO;
using Models.InputModel;
using static SchoolDataHelper;
using ExcelDataReader;
using Newtonsoft.Json;

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = "Admin,Manager")]
    public class SchoolController : ControllerBase
    {
        private readonly AppSettings appSettings;
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;
        private readonly SignInManager<UserModel> signInManager;
        private readonly AppDbContext appDbContext;

        MoodleApi moodleApi;
        FarazSmsApi SMSApi;
        public SchoolController(UserManager<UserModel> _userManager 
                                , SignInManager<UserModel> _signinManager
                                , RoleManager<IdentityRole<int>> _roleManager
                                , IOptions<AppSettings> _appsetting
                                , AppDbContext _appdbContext)
        {
            userManager = _userManager;
            roleManager = _roleManager;
            signInManager =_signinManager;
            appSettings = _appsetting.Value;
            appDbContext = _appdbContext;

            moodleApi = new MoodleApi(appSettings);
            SMSApi = new FarazSmsApi(appSettings);
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<StudyFieldModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetSchoolInfo(int schoolId)
        {
            try
            {
                //Use when request from managerDashboard
                if(schoolId == 0)
                {
                    string userName = userManager.GetUserId(User);
                    schoolId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().SchoolId;
                }

                if(schoolId == 0)
                    return BadRequest();

                List<School_BasesVW> bases = new List<School_BasesVW>();
                foreach (var basee in appDbContext.School_Bases.Where(x => x.School_Id == schoolId).ToList())
                {
                    var serializedParent = JsonConvert.SerializeObject(basee); 
                    School_BasesVW basesVW  = JsonConvert.DeserializeObject<School_BasesVW>(serializedParent);

                    basesVW.BaseName = appDbContext.Bases.Where(x => x.Id == basee.Base_Id).FirstOrDefault().BaseName;

                    bases.Add(basesVW);
                }

                List<School_StudyFieldsVW> studyFields = new List<School_StudyFieldsVW>();
                foreach (var studyF in appDbContext.School_StudyFields.Where(x => x.School_Id == schoolId).ToList())
                {
                    var serializedParent = JsonConvert.SerializeObject(studyF); 
                    School_StudyFieldsVW studyField  = JsonConvert.DeserializeObject<School_StudyFieldsVW>(serializedParent);

                    studyField.StudyFieldName = appDbContext.StudyFields.Where(x => x.Id == studyF.StudyField_Id).FirstOrDefault().StudyFieldName;

                    studyFields.Add(studyField);
                }

                List<School_GradesVW> grades = new List<School_GradesVW>();
                foreach (var grade in appDbContext.School_Grades.Where(x => x.School_Id == schoolId).ToList())
                {
                    var serializedParent = JsonConvert.SerializeObject(grade); 
                    School_GradesVW gradeVW  = JsonConvert.DeserializeObject<School_GradesVW>(serializedParent);

                    gradeVW.GradeName = appDbContext.Grades.Where(x => x.Id == grade.Grade_Id).FirstOrDefault().GradeName;

                    grades.Add(gradeVW);
                }

                SchoolModel schoolModel = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault();

                UserModel managerInfo = appDbContext.Users.Where(x => x.SchoolId == schoolModel.Id && x.userTypeId == (int)UserType.Manager).FirstOrDefault();
                ManagerDetail managerDetail = new ManagerDetail();
                if(managerInfo != null)
                {
                    managerDetail = appDbContext.ManagerDetails.Where(x => x.UserId == managerInfo.Id).FirstOrDefault();
                }
                else
                {
                    managerInfo = new UserModel();
                }

                return Ok(new{
                    bases,
                    studyFields,
                    grades,
                    schoolModel,
                    managerInfo,
                    managerDetail
                });
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [ProducesResponseType(typeof(List<SchoolModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetSchools()
        {
            try
            {
                List<SchoolVW> schools = new List<SchoolVW>();

                string userIdnumber = userManager.GetUserId(User);
                int userId = appDbContext.Users.Where(x => x.UserName == userIdnumber).FirstOrDefault().Id;
                AdminDetail adminModel = appDbContext.AdminDetails.Where(x => x.UserId == userId).FirstOrDefault();

                string schooltypeName = "";
                if (adminModel.SchoolsType == SchoolType.Sampad)
                {
                    schooltypeName = "سمپاد";
                }
                else if (adminModel.SchoolsType == SchoolType.AmoozeshRahDor)
                {
                    schooltypeName = "آموزش از راه دور";
                }
                else if (adminModel.SchoolsType == SchoolType.Gheyrdolati)
                {
                    schooltypeName = "غیر دولتی";
                }
                else if (adminModel.SchoolsType == SchoolType.Dolati)
                {
                    schooltypeName = "دولتی";
                }

                foreach (var school in appDbContext.Schools.Where(x => x.SchoolType == adminModel.SchoolsType).ToList())
                {
                    var serializedParent = JsonConvert.SerializeObject(school); 
                    SchoolVW schoolVW  = JsonConvert.DeserializeObject<SchoolVW>(serializedParent);

                    UserModel mangerInfo = appDbContext.Users.Where(x => x.Id == school.ManagerId).FirstOrDefault();

                    if(mangerInfo != null)
                    {
                        schoolVW.FirstName = mangerInfo.FirstName;
                        schoolVW.LastName = mangerInfo.LastName;
                    }
                    schoolVW.schoolTypeName = schooltypeName;

                    schools.Add(schoolVW);
                }

                return Ok(schools);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        [ProducesResponseType(typeof(SchoolModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> CreateSchool([FromBody]CreateSchoolData inputData)
        {
            try
            {
                if(string.IsNullOrEmpty(inputData.SchoolName) || string.IsNullOrEmpty(inputData.MelliCode) || string.IsNullOrEmpty(inputData.SchoolIdNumber))
                    return BadRequest("اطلاعات وارد شده کافی نیست");


                string idNumberAdmin = userManager.GetUserId(User);
                int adminId = appDbContext.Users.Where(x => x.UserName == idNumberAdmin).FirstOrDefault().Id;
                AdminDetail adminDetail = appDbContext.AdminDetails.Where(x => x.UserId == adminId).FirstOrDefault();
                int schoolType = adminDetail.SchoolsType;

                if(appDbContext.Schools.Where(x => x.SchoolIdNumber == inputData.SchoolIdNumber).FirstOrDefault() != null)
                    return BadRequest("کد مدرسه وارد شده تکراریست");

                if(appDbContext.Schools.Where(x => x.SchoolType == schoolType).Count() >= adminDetail.SchoolLimit)
                    return BadRequest("شما حداکثر تعداد مدارس خود را ثبت کردید");

                SchoolDataHelper schoolDataHelper = new SchoolDataHelper(appSettings , appDbContext);
                UserModel user = appDbContext.Users.Where(x => x.UserName == inputData.MelliCode).FirstOrDefault();
                bool duplicateManager = user != null;

                if(!duplicateManager)
                {
                    inputData.SchoolType = schoolType;
                    inputData.SchoolIdNumber = ConvertToPersian.PersianToEnglish(inputData.SchoolIdNumber);

                    SchoolModel schoolResult = await schoolDataHelper.CreateSchool(inputData);
                    
                    UserModel manager = new UserModel();
                    manager.FirstName = inputData.FirstName;
                    manager.LastName = inputData.LastName;
                    manager.MelliCode = ConvertToPersian.PersianToEnglish(inputData.MelliCode);
                    manager.UserName = inputData.MelliCode;
                    manager.SchoolId = schoolResult.Id;
                    manager.userTypeId = (int)UserType.Manager;
                    manager.ConfirmedAcc = true;

                    string password = RandomPassword.GeneratePassword(true , true , true , 8);

                    bool resultManager = userManager.CreateAsync(manager , password).Result.Succeeded;

                    if(resultManager)
                    {
                        await userManager.AddToRolesAsync(manager , new string[]{"User" , "Manager"});
                        
                        int managerId = userManager.FindByNameAsync(manager.UserName).Result.Id;

                        ManagerDetail managerDetail = new ManagerDetail();
                        managerDetail.personalIdNumber = ConvertToPersian.PersianToEnglish(inputData.personalIdNumber);
                        managerDetail.UserId = managerId;

                        appDbContext.ManagerDetails.Add(managerDetail);
                        appDbContext.SaveChanges();

                        schoolResult.ManagerId = managerId;

                        appDbContext.Schools.Update(schoolResult);
                        appDbContext.SaveChanges();
                        
                        return Ok(new{
                            manager.MelliCode,
                            password,
                            schoolId = schoolResult.Id
                        });
                    }
                }

                return BadRequest("اطلاعات مدیر وارد شده تکراریست");

            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        //if want use commented Part change inputData ObjectType to SchoolData
        public async Task<IActionResult> EditSchool([FromBody]SchoolModel inputData)
        {
            try
            {
                SchoolModel schoolInfo = appDbContext.Schools.Where(x => x.Id == inputData.Id).FirstOrDefault();

                schoolInfo.SchoolName = (!String.IsNullOrEmpty(inputData.SchoolName) ? inputData.SchoolName : schoolInfo.SchoolName);
                schoolInfo.SchoolType = (inputData.SchoolType != 0 ? inputData.SchoolType : schoolInfo.SchoolType);
                schoolInfo.SelfSign = inputData.SelfSign;

                appDbContext.Schools.Update(schoolInfo);
                // List<School_Bases> previousBases = appDbContext.School_Bases.Where(x => x.School_Id == schoolInfo.Id).ToList();
                // List<School_StudyFields> previousStudyF = appDbContext.School_StudyFields.Where(x => x.School_Id == schoolInfo.Id).ToList();
                // List<School_Grades> previousGrades = appDbContext.School_Grades.Where(x => x.School_Id == schoolInfo.Id).ToList();

                // //Check for add new Base->StudyField->Grade
                // foreach (var newBaseId in inputData.BaseIds)
                // {
                //     if(previousBases.Where(x => x.Base_Id == newBaseId).FirstOrDefault() != null)
                //     {
                //         //Remove same
                //         previousBases.Remove(previousBases.Where(x => x.Id == newBaseId).FirstOrDefault());
                //         inputData.BaseIds.Remove(newBaseId);
                //     }
                // }

                // foreach (var newStudyFId in inputData.StudyFieldIds)
                // {
                //     if(previousStudyF.Where(x => x.StudyField_Id == newStudyFId).FirstOrDefault() != null)
                //     {
                //         //Remove same
                //         previousStudyF.Remove(previousStudyF.Where(x => x.Id == newStudyFId).FirstOrDefault());
                //         inputData.StudyFieldIds.Remove(newStudyFId);
                //     }
                // }

                // foreach (var newGradeId in inputData.GradeIds)
                // {
                //     if(previousGrades.Where(x => x.Grade_Id == newGradeId).FirstOrDefault() != null)
                //     {
                //         //Remove same
                //         previousGrades.Remove(previousGrades.Where(x => x.Id == newGradeId).FirstOrDefault());
                //         inputData.BaseIds.Remove(newGradeId);
                //     }
                // }

                // //Create new data
                // SchoolDataHelper schoolDataHelper = new SchoolDataHelper(appSettings , appDbContext);
                // await schoolDataHelper.CreateSchool_Grade(inputData.BaseIds , inputData.StudyFieldIds , inputData.GradeIds , schoolInfo.Moodle_Id);
                
                // //Remove deleted data from moodle
                // foreach (var prBase in previousBases)
                // {
                //     await moodleApi.DeleteCategory(prBase.Moodle_Id);
                // }
                // foreach (var prStudyF in previousStudyF)
                // {
                //     await moodleApi.DeleteCategory(prStudyF.Moodle_Id);
                // }
                // foreach (var prGrade in previousGrades)
                // {
                //     await moodleApi.DeleteCategory(prGrade.Moodle_Id);
                // }

                // appDbContext.School_Bases.RemoveRange(previousBases);
                // appDbContext.School_StudyFields.RemoveRange(previousStudyF);
                // appDbContext.School_Grades.AddRange(previousGrades);

                appDbContext.SaveChanges();
                

                return Ok("مدرسه با موفقیت ویرایش شد");
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> RemoveSchool(int schoolId)
        {
            try
            {
                if(schoolId == 0)
                    return BadRequest("مدرسه ای انتخاب نشده است");

                SchoolModel school = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault();

                bool removeCat = await moodleApi.DeleteCategory(school.Moodle_Id);

                if(removeCat)
                {
                    UserModel manager = appDbContext.Users.Where(x => x.SchoolId == schoolId && x.userTypeId == (int)UserType.Manager).FirstOrDefault();
                    if(manager != null)
                    {
                        manager.SchoolId = -1;
                        
                        appDbContext.Users.Update(manager);
                    }
                    
                    appDbContext.School_Bases.RemoveRange(appDbContext.School_Bases.Where(x => x.School_Id == school.Id).ToList());
                    appDbContext.School_StudyFields.RemoveRange(appDbContext.School_StudyFields.Where(x => x.School_Id == school.Id).ToList());
                    appDbContext.School_Grades.RemoveRange(appDbContext.School_Grades.Where(x => x.School_Id == school.Id).ToList());
                    appDbContext.School_Classes.RemoveRange(appDbContext.School_Classes.Where(x => x.School_Id == school.Id).ToList());
                    appDbContext.Schools.Remove(school);

                    appDbContext.SaveChanges();

                    return Ok(schoolId);
                }
                
                return BadRequest("مشکلی در حذف مدرسه بوجود آمد");
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

#region Base

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [ProducesResponseType(typeof(List<BaseModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetBases()
        {
            try
            {
                return Ok(appDbContext.Bases.ToList());
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        [ProducesResponseType(typeof(List<School_BasesVW>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddBaseToSchool([FromBody]SchoolData inputData)
        {
            try
            {
                if(inputData.schoolId == 0 || inputData.dataIds == null)
                    return BadRequest("اطلاعات صحیح نمی باشد");

                List<School_Bases> result = new List<School_Bases>();

                foreach (var baseId in inputData.dataIds)
                {
                    if(appDbContext.School_Bases.Where(x => x.Base_Id == baseId && x.School_Id == inputData.schoolId).FirstOrDefault() == null)
                    {
                        BaseModel basee = appDbContext.Bases.Where(x => x.Id == baseId).FirstOrDefault();
                        School_Bases schoolBase = new School_Bases();
                        schoolBase.Base_Id = basee.Id;
                        schoolBase.School_Id = inputData.schoolId;

                        result.Add(schoolBase);
                    }
                }

                SchoolDataHelper schoolDataHelper = new SchoolDataHelper(appSettings , appDbContext);

                List<School_Bases> schoolBases = await schoolDataHelper.AddBaseToSchool(result);

                List<School_BasesVW> basesView = new List<School_BasesVW>();
                foreach (var basee in appDbContext.School_Bases.Where(x => x.School_Id == inputData.schoolId).ToList())
                {
                    var serializedParent = JsonConvert.SerializeObject(basee); 
                    School_BasesVW basesVW  = JsonConvert.DeserializeObject<School_BasesVW>(serializedParent);

                    basesVW.BaseName = appDbContext.Bases.Where(x => x.Id == basee.Base_Id).FirstOrDefault().BaseName;

                    basesView.Add(basesVW);
                }

                return Ok(basesView);

            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [ProducesResponseType(typeof(School_Bases), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> RemoveBaseFromSchool(int baseId)
        {
            try
            {
                SchoolDataHelper schoolDataHelper = new SchoolDataHelper(appSettings , appDbContext);

                School_Bases basee = await schoolDataHelper.DeleteBaseFromSchool(baseId);

                return Ok(baseId);

            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

#endregion

#region StudyField

        
        [HttpGet]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(List<StudyFieldModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetStudyFields(int BaseId)
        {
            try
            {
                if(BaseId != -1)
                {
                    int base_id = appDbContext.School_Bases.Where(x => x.Id == BaseId).FirstOrDefault().Base_Id;

                    List<StudyFieldModel> studies = appDbContext.StudyFields.Where(x => x.Base_Id == base_id).Take(15).ToList();
                    return Ok(studies);
                }
                
                return BadRequest();
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [ProducesResponseType(typeof(List<StudyFieldModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetSchool_StudyFields(int BaseId , int schoolId)
        {
            try
            {
                //Use when request from managerDashboard
                if(schoolId == 0)
                {
                    string userName = userManager.GetUserId(User);
                    schoolId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().SchoolId;
                }

                if(schoolId == 0)
                    return BadRequest();

                if(BaseId != -1)
                {
                    int base_Id = appDbContext.School_Bases.Where(x => x.Id == BaseId).FirstOrDefault().Base_Id;

                    List<StudyFieldModel> studies = appDbContext.StudyFields.Where(x => x.Base_Id == base_Id).ToList();
                    List<School_StudyFieldsVW> result = new List<School_StudyFieldsVW>();

                    foreach (var studyf in studies)
                    {
                        School_StudyFields schoolStudyField = appDbContext.School_StudyFields.Where(x => x.StudyField_Id == studyf.Id && x.School_Id == schoolId).FirstOrDefault();

                        if(schoolStudyField != null)
                        {
                            var serializedParent = JsonConvert.SerializeObject(schoolStudyField); 
                            School_StudyFieldsVW studyVW  = JsonConvert.DeserializeObject<School_StudyFieldsVW>(serializedParent);

                            studyVW.StudyFieldName = appDbContext.StudyFields.Where(x => x.Id == studyf.Id).FirstOrDefault().StudyFieldName;

                            result.Add(studyVW);
                        }
                    }

                    return Ok(result);
                }
                
                return BadRequest();
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpPut]
        [ProducesResponseType(typeof(List<School_StudyFieldsVW>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddStudyFToSchool([FromBody]SchoolData inputData)
        {
            try
            {
                SchoolDataHelper schoolDataHelper = new SchoolDataHelper(appSettings , appDbContext);

                List<School_StudyFields> result = new List<School_StudyFields>();

                foreach (var studyId in inputData.dataIds)
                {
                    if(appDbContext.School_StudyFields.Where(x => x.StudyField_Id == studyId && x.School_Id == inputData.schoolId).FirstOrDefault() == null)
                    {
                        StudyFieldModel studyF = appDbContext.StudyFields.Where(x => x.Id == studyId).FirstOrDefault();

                        School_StudyFields data = new School_StudyFields();
                        data.StudyField_Id = studyF.Id;
                        data.School_Id = inputData.schoolId;

                        result.Add(data);
                    }
                }

                List<School_StudyFields> schoolStudies = await schoolDataHelper.AddStudyFieldToSchool(result);

                List<School_StudyFieldsVW> studies = new List<School_StudyFieldsVW>();

                //Because all studyField in one base Id 
                int baseId = appDbContext.StudyFields.Where(x => x.Id == schoolStudies[0].StudyField_Id).FirstOrDefault().Base_Id;

                foreach (var studyF in appDbContext.School_StudyFields.Where(x => x.School_Id == inputData.schoolId ).ToList())
                {
                    if(appDbContext.StudyFields.Where(x => x.Id == schoolStudies[0].StudyField_Id).FirstOrDefault().Base_Id == baseId)
                    {
                        var serializedParent = JsonConvert.SerializeObject(studyF); 
                        School_StudyFieldsVW studyField  = JsonConvert.DeserializeObject<School_StudyFieldsVW>(serializedParent);

                        studyField.StudyFieldName = appDbContext.StudyFields.Where(x => x.Id == studyF.StudyField_Id).FirstOrDefault().StudyFieldName;

                        studies.Add(studyField);              
                    }
                }

                return Ok(studies);

            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [ProducesResponseType(typeof(School_StudyFields), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> RemoveStudyFFromSchool(int studyFId)
        {
            try
            {
                SchoolDataHelper schoolDataHelper = new SchoolDataHelper(appSettings , appDbContext);

                School_StudyFields studyField = await schoolDataHelper.DeleteStudyFieldFromSchool(studyFId);
                
                return Ok(studyFId);

            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

#endregion
        
#region Grades

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(List<StudyFieldModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetGrade(int StudyFieldId)
        {
            try
            {
                return Ok(appDbContext.Grades.Where(x => x.StudyField_Id == StudyFieldId).ToList().Take(15));
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<StudyFieldModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetSchool_Grades(int StudyFieldId , int schoolId)
        {
            try
            {
                //Use when request from managerDashboard
                if(schoolId == 0)
                {
                    string userName = userManager.GetUserId(User);
                    schoolId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().SchoolId;
                }

                if(schoolId == 0)
                    return BadRequest();

                if(StudyFieldId != -1)
                {
                    int studyField_Id = appDbContext.School_StudyFields.Where(x => x.Id == StudyFieldId).FirstOrDefault().StudyField_Id;

                    List<GradeModel> grades = appDbContext.Grades.Where(x => x.StudyField_Id == studyField_Id).ToList();
                    List<School_GradesVW> result = new List<School_GradesVW>();

                    foreach (var grade in grades)
                    {
                        School_Grades schoolGrade = appDbContext.School_Grades.Where(x => x.Grade_Id == grade.Id && x.School_Id == schoolId).FirstOrDefault();

                        if(schoolGrade != null)
                        {
                            var serializedParent = JsonConvert.SerializeObject(grade); 
                            School_GradesVW gradeVW  = JsonConvert.DeserializeObject<School_GradesVW>(serializedParent);

                            result.Add(gradeVW);
                        }
                    }

                    return Ok(result);
                }
                
                return BadRequest();
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

#endregion
   
#region Lessons

        [HttpGet]
        [ProducesResponseType(typeof(List<LessonModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetLessons(int gradeId)
        {
            try
            {
                return Ok(appDbContext.Lessons.Where(x => x.Grade_Id == gradeId).ToList().Take(20));
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }
    
 #endregion


#region Classes

        [HttpGet]
        [ProducesResponseType(typeof(List<GradeModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GradesList()
        {
            try
            {   
                //We set IdNumber as userId in Token
                string ManagerUserName = userManager.GetUserId(User);
                int managerId = appDbContext.Users.Where(x => x.UserName == ManagerUserName).FirstOrDefault().Id;

                SchoolModel school = appDbContext.Schools.Where(x => x.ManagerId == managerId).FirstOrDefault();

                List<School_GradesVW> grades = new List<School_GradesVW>();
                foreach (var grade in appDbContext.School_Grades.Where(x => x.School_Id == school.Id).ToList())
                {
                    var serializedParent = JsonConvert.SerializeObject(grade); 
                    School_GradesVW gradeVW  = JsonConvert.DeserializeObject<School_GradesVW>(serializedParent);

                    gradeVW.GradeName = appDbContext.Grades.Where(x => x.Id == grade.Grade_Id).FirstOrDefault().GradeName;

                    grades.Add(gradeVW);
                }

                return Ok(grades);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<School_Class>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult ClassList(int gradeId)
        {
            try
            {   
                string ManagerUserName = userManager.GetUserId(User);
                int managerId = appDbContext.Users.Where(x => x.UserName == ManagerUserName).FirstOrDefault().Id;
                SchoolModel school = appDbContext.Schools.Where(x => x.ManagerId == managerId).FirstOrDefault();

                return Ok(appDbContext.School_Classes.Where(x => x.School_Id == school.Id && x.Grade_Id == gradeId));
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddNewClass([FromBody]ClassData classModel , int schoolId)
        {
            try
            {
                if(classModel.ClassName == null)
                    return BadRequest();
                    
                SchoolModel school = new SchoolModel();

                if(schoolId == 0)
                {
                    string ManagerUserName = userManager.GetUserId(User);
                    int managerId = appDbContext.Users.Where(x => x.UserName == ManagerUserName).FirstOrDefault().Id;
                    school = appDbContext.Schools.Where(x => x.ManagerId == managerId).FirstOrDefault();

                    schoolId = school.Id;
                }
                else
                {
                    school = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault();
                }

                School_Grades gradeModel = appDbContext.School_Grades.Where(x => x.Grade_Id == classModel.gradeId && x.School_Id == school.Id).FirstOrDefault();

                int grade_moodleId = gradeModel.Moodle_Id;

                int classMoodleId = await moodleApi.CreateCategory(classModel.ClassName , grade_moodleId);
                if(classMoodleId != -1)
                {
                    List<LessonModel> lessons = appDbContext.Lessons.Where(x => x.Grade_Id == gradeModel.Grade_Id).ToList();
                    List<School_Lessons> schoolLessons = new List<School_Lessons>();

                    School_Class schoolClass = new School_Class();
                    schoolClass.ClassName = classModel.ClassName;
                    schoolClass.Grade_Id = gradeModel.Grade_Id;
                    schoolClass.Grade_MoodleId = grade_moodleId;
                    schoolClass.Moodle_Id = classMoodleId;
                    schoolClass.School_Id = school.Id;

                    appDbContext.School_Classes.Add(schoolClass);
                    appDbContext.SaveChanges();

                    schoolClass.Id = appDbContext.School_Classes.OrderByDescending(x => x.Id).FirstOrDefault().Id;

                    foreach (var lesson in lessons)
                    {
                        int moodleId = await moodleApi.CreateCourse(lesson.LessonName + " (" + school.Moodle_Id + "-" + classMoodleId + ")", lesson.LessonName , classMoodleId);

                        School_Lessons schoolLesson = new School_Lessons();
                        schoolLesson.Lesson_Id = lesson.Id;
                        schoolLesson.Moodle_Id = moodleId;
                        schoolLesson.School_Id = schoolId;
                        schoolLesson.classId = schoolClass.Id;

                        schoolLessons.Add(schoolLesson);
                    }
                    
                    appDbContext.School_Lessons.AddRange(schoolLessons);
                    appDbContext.SaveChanges();

                    schoolClass.Id = appDbContext.School_Classes.OrderByDescending(x => x.Id).FirstOrDefault().Id;

                    return Ok(schoolClass);
                }

                return BadRequest("ایجاد کلاس با مشکل مواجه شد");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpPost]
        [ProducesResponseType(typeof(School_Class), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> EditClass([FromBody]ClassData inputClassData)
        {
            try
            {
                string ManagerUserName = userManager.GetUserId(User);
                int managerId = appDbContext.Users.Where(x => x.UserName == ManagerUserName).FirstOrDefault().Id;

                SchoolModel school = appDbContext.Schools.Where(x => x.ManagerId == managerId).FirstOrDefault();

                School_Class schoolClass = appDbContext.School_Classes.Where(x => x.Id == inputClassData.Id).FirstOrDefault();
                int grade_moodleId = appDbContext.School_Grades.Where(x => x.Grade_Id == inputClassData.gradeId).FirstOrDefault().Moodle_Id;

                schoolClass.ClassName = (inputClassData.ClassName != "" ? inputClassData.ClassName : schoolClass.ClassName);
                
                if(schoolClass != null)
                {
                    if(grade_moodleId != 0 && grade_moodleId != schoolClass.Grade_MoodleId)
                    {
                        await moodleApi.DeleteCategory(schoolClass.Moodle_Id);

                        int newClassMoodleId = await moodleApi.CreateCategory(schoolClass.ClassName , grade_moodleId);
                        if(newClassMoodleId != -1)
                        {
                            string gradeName = moodleApi.getCategoryDetail(grade_moodleId).Result.Name;
                            int gradeId = appDbContext.Grades.Where(x => x.GradeName == gradeName).FirstOrDefault().Id;

                            List<LessonModel> lessons = appDbContext.Lessons.Where(x => x.Grade_Id == gradeId).ToList();
                            foreach (var lesson in lessons)
                            {
                                await moodleApi.CreateCourse(lesson.LessonName + " (" + school.Moodle_Id + "-" + newClassMoodleId + ")" , lesson.LessonName , newClassMoodleId);
                            }

                            schoolClass.Grade_Id = gradeId;
                            schoolClass.Grade_MoodleId = grade_moodleId;
                            schoolClass.Moodle_Id = newClassMoodleId;
                        }         
                    }
                    else
                    {
                        CategoryDetail oldClass = new CategoryDetail();
                        oldClass.Id = schoolClass.Moodle_Id;
                        oldClass.Name = schoolClass.ClassName;
                        oldClass.ParentCategory = schoolClass.Grade_MoodleId;
                        
                        await moodleApi.EditCategory(oldClass);
                    }

                    appDbContext.School_Classes.Update(schoolClass);
                    appDbContext.SaveChanges();
                }


                return Ok(schoolClass);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpDelete]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> DeleteClass(int classId)
        {
            try
            {
                School_Class schoolClass = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault();
                await moodleApi.DeleteCategory(schoolClass.Moodle_Id);

                appDbContext.School_Classes.Remove(schoolClass);
                appDbContext.School_Lessons.RemoveRange(appDbContext.School_Lessons.Where(x => x.classId == schoolClass.Id).ToList());
                appDbContext.SaveChanges();

                return Ok(classId);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

#endregion    
   
    }
}
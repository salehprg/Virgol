using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

using Virgol.Helper;
using Models;
using Models.User;
using Models.Users.Roles;
using Microsoft.AspNetCore.Http;
using Models.InputModel;
using Newtonsoft.Json;
using Virgol.Services;

namespace Virgol.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = Roles.Admin + "," + Roles.Manager + "," + Roles.CoManager)]
    public class SchoolController : ControllerBase
    {
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;
        private readonly SignInManager<UserModel> signInManager;
        private readonly AppDbContext appDbContext;

        MoodleApi moodleApi;
        SchoolService schoolService;
        LDAP_db ldap;
        UserService UserService;
        public SchoolController(UserManager<UserModel> _userManager 
                                , SignInManager<UserModel> _signinManager
                                , RoleManager<IdentityRole<int>> _roleManager
                                , AppDbContext _appdbContext)
        {
            userManager = _userManager;
            roleManager = _roleManager;
            signInManager =_signinManager;
            appDbContext = _appdbContext;

            moodleApi = new MoodleApi(AppSettings.GetValueFromDatabase(appDbContext , "Token_moodle"));
            ldap = new LDAP_db(appDbContext);
            UserService = new UserService(userManager , appDbContext);
            schoolService = new SchoolService(appDbContext);
        }


#region School Info

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

                UserModel managerInfo = appDbContext.Users.Where(x => x.Id == schoolModel.ManagerId).FirstOrDefault();
                ManagerDetail managerDetail = new ManagerDetail();
                if(managerInfo != null)
                {
                    managerDetail = appDbContext.ManagerDetails.Where(x => x.UserId == managerInfo.Id).FirstOrDefault();
                }
                else
                {
                    managerInfo = new UserModel();
                }

                bases = bases.OrderBy(x => x.BaseName).ToList();

                return Ok(new{
                    bases,
                    //studyFields,
                    //grades,
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

        
        [HttpGet]
        [ProducesResponseType(typeof(List<SchoolModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Admin)]
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

                schools = schools.OrderBy(x => x.SchoolName).ToList();
                return Ok(schools);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        
        [ProducesResponseType(typeof(List<string>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> AddBulkSchool([FromForm]IFormCollection Files )
        {
            try
            {
                //Username and password Default is MelliCode

                //1 - Read data from excel
                //2 - Check valid data
                //3 - Add user to Database
                //3.1 - don't add duplicate username 

                bool FileOk = await FileController.UploadFile(Files.Files[0] , Files.Files[0].FileName);

                if(FileOk)
                {
                    string userName = userManager.GetUserId(User);
                    int adminId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;
                    int schoolType = appDbContext.AdminDetails.Where(x => x.UserId == adminId).FirstOrDefault().SchoolsType;

                    var errors = await CreateBulkSchool(Files.Files[0].FileName , schoolType);

                    if(errors)
                        return Ok(errors);

                    return BadRequest("اطلاعات فایل اکسل به درستی وارد نشده است دوباره تلاش نمایید");
                }

                return BadRequest("آپلود فایل با مشکل مواجه شد");
                
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        
        [HttpPut]
        [ProducesResponseType(typeof(SchoolModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> CreateSchool([FromBody]CreateSchoolData inputData)
        {
            try
            {
                if(string.IsNullOrEmpty(inputData.SchoolName) || string.IsNullOrEmpty(inputData.MelliCode) || string.IsNullOrEmpty(inputData.SchoolIdNumber))
                    return BadRequest("اطلاعات وارد شده کافی نیست");

                inputData.SchoolIdNumber = ConvertToPersian.PersianToEnglish(inputData.SchoolIdNumber);
                inputData.MelliCode = ConvertToPersian.PersianToEnglish(inputData.MelliCode);
                inputData.managerPhoneNumber = ConvertToPersian.PersianToEnglish(inputData.managerPhoneNumber);

                string idNumberAdmin = userManager.GetUserId(User);
                UserModel adminModel = appDbContext.Users.Where(x => x.UserName == idNumberAdmin).FirstOrDefault();
                int adminId = adminModel.Id;

                AdminDetail adminDetail = appDbContext.AdminDetails.Where(x => x.UserId == adminId).FirstOrDefault();
                int schoolType = adminDetail.SchoolsType;

                if(appDbContext.Schools.Where(x => x.SchoolIdNumber == inputData.SchoolIdNumber).FirstOrDefault() != null)
                    return BadRequest("کد مدرسه وارد شده تکراریست");

                if(appDbContext.Schools.Where(x => x.SchoolType == schoolType).Count() >= adminDetail.SchoolLimit)
                    return BadRequest("شما حداکثر تعداد مدارس خود را ثبت کردید");

                bool melliCodeInterupt = UserService.CheckMelliCodeInterupt(inputData.MelliCode , 0);
                bool phoneInterupt = UserService.CheckPhoneInterupt(inputData.managerPhoneNumber);

                if(melliCodeInterupt)
                    return BadRequest("کد ملی وارد شده تکراریست");

                if(phoneInterupt)
                    return BadRequest("شماره تلفن وارد شده تکراریست");

                inputData.AutoFill = adminDetail.Autofill;
                inputData.Free = adminDetail.Free;
                inputData.SchoolType = schoolType;
                SchoolModel schoolResult = await schoolService.CreateSchool(inputData);

                ManagerDetail managerDetail = new ManagerDetail();
                managerDetail.personalIdNumber = ConvertToPersian.PersianToEnglish(inputData.personalIdNumber);

                UserModel manager = new UserModel();
                manager.FirstName = inputData.FirstName;
                manager.LatinFirstname = inputData.LatinFirstname;
                manager.LastName = inputData.LastName;
                manager.LatinLastname = inputData.LatinLastname;
                manager.MelliCode = inputData.MelliCode;
                manager.UserName = inputData.MelliCode;
                manager.PhoneNumber = inputData.managerPhoneNumber;
                manager.SchoolId = schoolResult.Id;
                //manager.UserType = Roles.Manager;
                manager.ConfirmedAcc = true;

                string password = RandomPassword.GeneratePassword(true , true , true , 8);

                var serializedParent = JsonConvert.SerializeObject(manager); 
                UserDataModel userData = JsonConvert.DeserializeObject<UserDataModel>(serializedParent);
                userData.managerDetail = managerDetail;

                List<UserDataModel> managerResult = await UserService.CreateUser(new List<UserDataModel>{userData} , new List<string>{Roles.Manager} , schoolResult.Id , password);

                if(managerResult.Count > 0)
                {
                    schoolResult.ManagerId = managerResult[0].Id;

                    appDbContext.Schools.Update(schoolResult);
                    await appDbContext.SaveChangesAsync();
                    
                    SMSService sMSService = new SMSService(appDbContext.SMSServices.Where(x => x.ServiceName == AppSettings.Default_SMSProvider).FirstOrDefault());

                    sMSService.SendSchoolData(adminModel.PhoneNumber , schoolResult.SchoolName , manager.UserName , password  , 
                                                            AppSettings.Default_SMSProvider == "Negin" ? AppSettings.GetValueFromDatabase(appDbContext , Settingkey.Negin_schooldata) : "");
                    //SMSApi.SendSchoolData(manager.PhoneNumber , schoolResult.SchoolName , manager.UserName , password);
                    
                    return Ok(new{
                        manager.MelliCode,
                        password,
                        schoolId = schoolResult.Id
                    });
                }

                await UserService.DeleteUser(manager);
                return BadRequest("ثبت مدیر با مشکل مواجه شد");

            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        
        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Admin)]
        //if want use commented Part change inputData ObjectType to SchoolData
        public async Task<IActionResult> EditSchool([FromBody]SchoolModel inputData)
        {
            try
            {
                SchoolModel schoolInfo = appDbContext.Schools.Where(x => x.Id == inputData.Id).FirstOrDefault();

                schoolInfo.SchoolName = (!String.IsNullOrEmpty(inputData.SchoolName) ? inputData.SchoolName : schoolInfo.SchoolName);
                schoolInfo.SchoolIdNumber = (!String.IsNullOrEmpty(inputData.SchoolIdNumber) ? inputData.SchoolIdNumber : schoolInfo.SchoolIdNumber);
                schoolInfo.SchoolType = (inputData.SchoolType != 0 ? inputData.SchoolType : schoolInfo.SchoolType);
                //schoolInfo.SelfSign = inputData.SelfSign;

                appDbContext.Schools.Update(schoolInfo);

                await appDbContext.SaveChangesAsync();
                

                return Ok("مدرسه با موفقیت ویرایش شد");
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        
        [HttpPost]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Manager)]
        //if want use commented Part change inputData ObjectType to SchoolData
        public async Task<IActionResult> ToggleReminder(bool status)
        {
            try
            {
                string userName = userManager.GetUserId(User);
                int managerId = appDbContext.Users.Where(x => x.UserName == userName).FirstOrDefault().Id;

                SchoolModel schoolInfo = appDbContext.Schools.Where(x => x.ManagerId == managerId).FirstOrDefault();

                schoolInfo.RemindUser = status;
                //schoolInfo.SelfSign = inputData.SelfSign;

                appDbContext.Schools.Update(schoolInfo);

                await appDbContext.SaveChangesAsync();
                

                return Ok("اطلاع رسانی با موفقیت ویرایش شد");
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }


        
        [HttpDelete]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> RemoveSchool(int schoolId)
        {
            try
            {
                if(schoolId == 0)
                    return BadRequest("مدرسه ای انتخاب نشده است");

                SchoolModel school = appDbContext.Schools.Where(x => x.Id == schoolId).FirstOrDefault();

                //bool removeCat = await moodleApi.DeleteCategory(school.Moodle_Id);
                //bool removeCat = true;

                UserModel manager = appDbContext.Users.Where(x => x.Id == school.ManagerId).FirstOrDefault();
                if(manager != null)
                {
                    // manager.SchoolId = 0;
                    // await userManager.RemoveFromRoleAsync(manager , Roles.Manager);
                    // appDbContext.Users.Update(manager);

                    await UserService.DeleteUser(manager);
                    
                }
        
                List<UserModel> students = appDbContext.Users.Where(x => x.SchoolId == school.Id).ToList();
                appDbContext.Users.RemoveRange(students);

                appDbContext.Schools.Remove(school);

                await appDbContext.SaveChangesAsync();

                return Ok(schoolId);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

#endregion

#region Base

        
        [HttpGet]
        [ProducesResponseType(typeof(List<BaseModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult GetBases()
        {
            try
            {
                return Ok(appDbContext.Bases.OrderBy(x => x.BaseName).ToList());
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        
        [HttpPut]
        [ProducesResponseType(typeof(List<School_BasesVW>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Admin)]
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

                if(result.Count == 0)
                    return BadRequest("مقطع(مقاطع) انتخاب شده تکراریست");

                SchoolService SchoolService = new SchoolService(appDbContext);

                List<School_Bases> schoolBases = await SchoolService.AddBaseToSchool(result);

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
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> RemoveBaseFromSchool(int baseId)
        {
            try
            {
                SchoolService SchoolService = new SchoolService(appDbContext);

                School_Bases basee = await SchoolService.DeleteBaseFromSchool(baseId);

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
        [ProducesResponseType(typeof(List<StudyFieldModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult GetStudyFields(int BaseId)
        {
            try
            {
                if(BaseId != -1)
                {
                    int base_id = appDbContext.School_Bases.Where(x => x.Id == BaseId).FirstOrDefault().Base_Id;

                    List<StudyFieldModel> studies = appDbContext.StudyFields.Where(x => x.Base_Id == base_id).OrderBy(x => x.StudyFieldName).ToList();
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

                    return Ok(result.OrderBy(x => x.StudyFieldName));
                }
                
                return BadRequest();
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }


        [Authorize(Roles = Roles.Admin)]
        [HttpPut]
        [ProducesResponseType(typeof(List<School_StudyFieldsVW>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddStudyFToSchool([FromBody]SchoolData inputData)
        {
            try
            {
                SchoolService SchoolService = new SchoolService(appDbContext);

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

                if(result.Count == 0)
                    return BadRequest("رشته(های) انتخاب شده تکراریست");

                List<School_StudyFields> schoolStudies = await SchoolService.AddStudyFieldToSchool(result);

                List<School_StudyFieldsVW> studies = new List<School_StudyFieldsVW>();

                //Because all studyField in one base Id 
                int baseId = appDbContext.StudyFields.Where(x => x.Id == schoolStudies[0].StudyField_Id).FirstOrDefault().Base_Id;

                foreach (var studyF in schoolStudies)
                {
                    if(appDbContext.StudyFields.Where(x => x.Id == studyF.StudyField_Id).FirstOrDefault().Base_Id == baseId)
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

        [Authorize(Roles = Roles.Admin)]
        [HttpDelete]
        [ProducesResponseType(typeof(School_StudyFields), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> RemoveStudyFFromSchool(int studyFId)
        {
            try
            {
                SchoolService SchoolService = new SchoolService(appDbContext);

                School_StudyFields studyField = await SchoolService.DeleteStudyFieldFromSchool(studyFId);
                
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
        [ProducesResponseType(typeof(List<StudyFieldModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult GetGrade(int StudyFieldId)
        {
            try
            {
                return Ok(appDbContext.Grades.Where(x => x.StudyField_Id == StudyFieldId).ToList().Take(15).OrderBy(x => x.GradeName));
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

                    return Ok(result.OrderBy(x => x.GradeName));
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

        [HttpPost]
        [ProducesResponseType(typeof(List<LessonModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetClassesCommonLessons([FromBody]List<int> classIds)
        {
            try
            {
                List<LessonModel> lessons = new List<LessonModel>();

                if(classIds.Count > 0)
                {
                    School_Class classs = appDbContext.School_Classes.Where(x => x.Id == classIds[0]).FirstOrDefault();
                    if(classs != null)
                    {
                        lessons.AddRange(appDbContext.Lessons.Where(x => x.Grade_Id == classs.Grade_Id).ToList());
                    }

                    for (int i = 1; i < classIds.Count ; i++)
                    {
                        classs = appDbContext.School_Classes.Where(x => x.Id == classIds[i]).FirstOrDefault();
                        if(classs != null)
                        {
                            List<LessonModel> newLessons = appDbContext.Lessons.Where(x => x.Grade_Id == classs.Grade_Id).ToList();

                            var result = lessons.Where(x => newLessons.Any(y => y.LessonCode == x.LessonCode)).ToList();

                           //var result = lessons.Intersect(newLessons , new LessonsComperator());
                            lessons = result;
                        }
                    }
                }

                return Ok(lessons);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return BadRequest(ex.Message);
            }
        }

        
    
 #endregion


#region Classes

        [HttpGet]
        [ProducesResponseType(typeof(List<GradeModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GradesList()
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

                return Ok(grades.OrderBy(x => x.GradeName));
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
                UserModel userModel = appDbContext.Users.Where(x => x.UserName == ManagerUserName).FirstOrDefault();
                int managerId = userModel.Id;

                SchoolModel school = appDbContext.Schools.Where(x => x.ManagerId == managerId).FirstOrDefault();
                if(school == null)
                    school = appDbContext.Schools.Where(x => x.Id == userModel.SchoolId).FirstOrDefault();

                List<School_Class> classes = new List<School_Class>();
                if(gradeId != -1)
                {
                    classes = appDbContext.School_Classes.Where(x => x.School_Id == school.Id && x.Grade_Id == gradeId).ToList();
                }
                else
                {
                    classes = appDbContext.School_Classes.Where(x => x.School_Id == school.Id).ToList();
                }

                classes = classes.OrderBy(x => x.ClassName).ToList();
                return Ok(classes);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Admin + "," + Roles.Manager)]
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

                School_Class schoolClass = await schoolService.AddClass(classModel , school);

                return Ok(schoolClass);

            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return BadRequest("ایجاد کلاس با مشکل مواجه شد");
            }
        }
    
        [HttpPost]
        [ProducesResponseType(typeof(School_Class), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Admin + "," + Roles.Manager)]
        public async Task<IActionResult> EditClass(int classId , string className)
        {
            try
            {
                string ManagerUserName = userManager.GetUserId(User);
                int managerId = appDbContext.Users.Where(x => x.UserName == ManagerUserName).FirstOrDefault().Id;

                SchoolModel school = appDbContext.Schools.Where(x => x.ManagerId == managerId).FirstOrDefault();

                School_Class schoolClass = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault();
                
                
                if(schoolClass != null)
                {
                    int classMoodleId = schoolClass.Moodle_Id;

                    schoolClass.ClassName = className;

                    CategoryDetail oldClass = new CategoryDetail();
                    oldClass.Id = classMoodleId;
                    oldClass.Name = schoolClass.ClassName;
                    
                    await moodleApi.EditCategory(oldClass);

                    appDbContext.School_Classes.Update(schoolClass);
                    await appDbContext.SaveChangesAsync();
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
        [Authorize(Roles = Roles.Admin + "," + Roles.Manager)]
        public async Task<IActionResult> DeleteClass(int classId)
        {
            try
            {
                School_Class schoolClass = appDbContext.School_Classes.Where(x => x.Id == classId).FirstOrDefault();
                await moodleApi.DeleteCategory(schoolClass.Moodle_Id);

                appDbContext.School_Classes.Remove(schoolClass);
                appDbContext.ExtraLessons.RemoveRange(appDbContext.ExtraLessons.Where(x => x.ClassId == classId).ToList());
                // appDbContext.ClassWeeklySchedules.RemoveRange(appDbContext.ClassWeeklySchedules.Where(x => x.ClassId == classId).ToList());
                // appDbContext.School_Lessons.RemoveRange(appDbContext.School_Lessons.Where(x => x.classId == classId).ToList());
                // appDbContext.School_StudentClasses.RemoveRange(appDbContext.School_StudentClasses.Where(x => x.ClassId == classId).ToList());
                await appDbContext.SaveChangesAsync();

                return Ok(classId);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

#endregion    
   

#region Functions

        ///<param name="CategoryId">
        ///Default is set to -1 and if Used this methode to add Student this property should set to Category Id
        ///</param>
        ///<param name="UserType">
        ///Set UserType from UserType class Teacher,Student,...
        ///</param>
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<bool> CreateBulkSchool(string fileName , int schoolType)
        {
            try
            {
                //Username and password Default is MelliCode

                //1 - Read data from excel
                //2 - Check valid data
                //3 - Add user to Database
                //3.1 - don't add duplicate username 

                List<CreateSchoolData> createSchoolDatas = FileController.excelReader_School(fileName).schoolData;

                foreach (var schoolData in createSchoolDatas)
                {
                    try
                    {
                        SchoolService SchoolService = new SchoolService(appDbContext);
                        UserModel user = appDbContext.Users.Where(x => x.UserName == schoolData.MelliCode).FirstOrDefault();
                        bool duplicateManager = (user != null);

                        if(!duplicateManager)
                        {
                            schoolData.SchoolType = schoolType;

                            SchoolModel schoolResult = await SchoolService.CreateSchool(schoolData);
                            
                            UserModel manager = new UserModel();
                            manager.FirstName = schoolData.FirstName;
                            manager.LastName = schoolData.LastName;
                            manager.PhoneNumber = schoolData.managerPhoneNumber;
                            manager.MelliCode = schoolData.MelliCode;
                            manager.UserName = schoolData.MelliCode;
                            manager.SchoolId = schoolResult.Id;
                            //manager.UserType = Roles.Manager;
                            manager.ConfirmedAcc = true;

                            //string password = RandomPassword.GeneratePassword(true , true , true , 10);

                            string password = manager.MelliCode;

                            bool resultManager = userManager.CreateAsync(manager , password).Result.Succeeded;

                            if(resultManager)
                            {
                                await userManager.AddToRolesAsync(manager , new string[]{"User" , "Manager"});

                                int userId = userManager.FindByNameAsync(manager.UserName).Result.Id;
                                manager.Id = userId;

                                bool ldapUser = await ldap.AddUserToLDAP(manager , true , password);

                                if(!ldapUser)
                                {
                                    ldapUser = ldap.CheckUserData(manager.UserName);
                                }

                                int userMoodle_id = -1;

                                manager.Moodle_Id = 0;

                                if(ldapUser)
                                {
                                    userMoodle_id = await moodleApi.CreateUser(manager);
                                    //userToMoodle = true;
                                }

                                if(userMoodle_id != -1)
                                {
                                    //int userMoodle_id = await moodleApi.GetUserId(manager.MelliCode);
                                    //int userMoodle_id = 0;

                                    manager.Moodle_Id = userMoodle_id;

                                    appDbContext.Users.Update(manager);

                                    ManagerDetail managerDetail = new ManagerDetail();
                                    managerDetail.personalIdNumber = schoolData.personalIdNumber;
                                    managerDetail.UserId = manager.Id;

                                    appDbContext.ManagerDetails.Add(managerDetail);
                                    await appDbContext.SaveChangesAsync();

                                    schoolResult.ManagerId = manager.Id;

                                    appDbContext.Schools.Update(schoolResult);
                                    await appDbContext.SaveChangesAsync();

                                    //SMSApi.SendSchoolData(manager.PhoneNumber , schoolData.SchoolName , manager.UserName , password);
                                    
                                }
                            }
                        }
                    }
                    catch(Exception ex){
                        Console.WriteLine(ex.Message);
                        Console.WriteLine(ex.StackTrace);
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);

                return false;
            }
        }

#endregion
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;

using Virgol.Helper;

using Models;
using Models.User;
using Models.Users.Roles;
using Microsoft.AspNetCore.Http;
using System.IO;
using Models.InputModel;
using Newtonsoft.Json;
using Virgol.Services;

namespace Virgol.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
   public class UsersController : ControllerBase
    {
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;
        private readonly SignInManager<UserModel> signInManager;
        private readonly AppDbContext appDbContext;
        private readonly LDAP_db ldap;

        //MoodleApi moodleApi;
        UserService UserService;
        public UsersController(UserManager<UserModel> _userManager 
                                , SignInManager<UserModel> _signinManager
                                , RoleManager<IdentityRole<int>> _roleManager
                                , AppDbContext _appdbContext)
        {
            userManager = _userManager;
            roleManager = _roleManager;
            signInManager =_signinManager;
            appDbContext = _appdbContext;


            ldap = new LDAP_db(appDbContext);
            UserService = new UserService(userManager , appDbContext);
        }
        

//Get data fro Enrolled User from Moodle 
#region UserActions
        
        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        public IActionResult GetCetegoryNames()
        {
            
            //userManager getuserid get MelliCode field of user beacause we set in token
            // int UserId = await moodleApi.GetUserId(userManager.GetUserId(User));

            // if(UserId != -1)
            // {
            //     List<CourseDetail> userCourses = await moodleApi.getUserCourses(UserId);
            //     var groupedCategory = userCourses.GroupBy(course => course.categoryId).ToList(); //لیستی برای بدست اوردن ایدی دسته بندی ها

            //     List<CategoryDetail> categoryDetails = new List<CategoryDetail>();

            //     foreach(var id in groupedCategory)
            //     {
            //         List<float> grades = id.Select(x => x.Score).ToList(); //نمرات موجود در دستبه بندی 

            //         float sum = 0;
            //         foreach(var grade in grades)
            //         {
            //             sum += grade; // جمع نمرات
            //         }
            //         float avverage = sum / grades.Count;
        
            //         CategoryDetail categoryDetail = await moodleApi.getCategoryDetail(id.Key);
            //         categoryDetail.Avverage = avverage;
            //         categoryDetail.CourseCount = id.Count();
                    
            //         categoryDetails.Add(categoryDetail);
            //     }

            //     return Ok(categoryDetails.Where(x => x.ParentCategory != 0));
            // }
            // else{
            //     return BadRequest();
            // }

            return Ok(true);
        }

        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(List<CourseDetail>), 200)]
        public IActionResult GetCoursesInCategory(int CategoryId)
        {
            
            // int UserId = await moodleApi.GetUserId(userManager.GetUserId(User));

            // if(UserId != -1)
            // {
            //     List<CourseDetail> userCourses = await moodleApi.getUserCourses(UserId);

            //     userCourses = userCourses.Where(course => course.categoryId == CategoryId).ToList(); //Categories Courses by Categoty Id
            //     userCourses.ForEach(x => x.CourseUrl = AppSettings.moddleCourseUrl + x.id);

            //     return Ok(userCourses);
            // }
            // else
            // {
            //     return BadRequest();
            // }

            return Ok(true);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> VerifyPhoneNumber(string phoneNumber , int type , string verificationCode , int fatherCode)
        {
            try
            {
                //Type  0 => send verificationCode => data = phonenumber
                //Type  1 => check verificationCode => data = verificationCode

                if(UserService.CheckPhoneInterupt(phoneNumber))
                    return BadRequest("شماره همراه وارد شده قبلا در سیستم ثبت شده است");

                string idNumber = userManager.GetUserId(User);
                UserModel user = appDbContext.Users.Where(x => x.MelliCode == idNumber).FirstOrDefault();

                //1 = fatherCode , 0 = User
                bool isFatherCode = (fatherCode == 1);

                if(type == 0)
                {
                    //Every user can get just 3 Verification code in last 30 minutes
                    if(checkUserAttempts(user , true))
                    {

                        bool result = await SendCode(user , phoneNumber , isFatherCode);
                        if(result)
                        {
                            return Ok("پیامک تایید با موفقیت ارسال شد");
                        }
                        else
                        {
                            return BadRequest("مشکلی در ارسال پیامک بوجود آمد");
                        }
                    }
                    
                    return BadRequest("در هر 30 دقیقه 3 بار مجاز به ارسال پیامک هستید");

                }
                else if(type == 1)
                {
                    if(await CheckVerificationCode(verificationCode , user , isFatherCode))
                    {
                        user.PhoneNumber = phoneNumber;
                        user.PhoneNumberConfirmed = true;
                        appDbContext.Users.Update(user);
                        await appDbContext.SaveChangesAsync();
                        return Ok(true);
                    }
                    return Ok(false);
                }

                return BadRequest("مشکلی بوجود آمده");
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> ForgotPWDCode(string idNumber , int type , string verificationCode = "")
        {
            try
            {
                //Type  0 => send verificationCode
                //Type  1 => check verificationCode

                UserModel user = appDbContext.Users.Where(x => x.MelliCode == idNumber).FirstOrDefault();

                if(user == null)
                    return BadRequest("کدملی وارد شده وجود ندارد");

                if(type == 0)
                {
                    //Every user can get just 3 Verification code in last 30 minutes
                    if(user.PhoneNumber != null)
                    {
                        if(checkUserAttempts(user))
                        {
                            bool result = await SendCode(user , user.PhoneNumber);
                            if(result)
                            {
                                return Ok("پیامک تایید با موفقیت ارسال شد");
                            }
                            else
                            {
                                return BadRequest("مشکلی در ارسال پیامک بوجود آمد");
                            }
                        }
                        
                        return BadRequest("در هر 30 دقیقه 3 بار مجاز به ارسال پیامک هستید");
                    }
                     return BadRequest("شماره موبایل خودرا ثبت نکرده اید");

                }
                else if(type == 1)
                {
                    if(await CheckVerificationCode(verificationCode , user , false))
                    {
                        return Ok(true);
                    }
                }

                return Ok(true);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> ChangePassword(string idNumber , string verificationCode , string newPassword)
        {
            try
            {
                if(newPassword.Length < 8)
                    return BadRequest("ظول پسورد باید حداقل 8 عدد باشد");

                UserModel user = appDbContext.Users.Where(x => x.MelliCode == idNumber).FirstOrDefault();
                bool verify = await CheckVerificationCode(verificationCode , user , false);
                if(verify)
                {
                    string token = await userManager.GeneratePasswordResetTokenAsync(user);
                    IdentityResult chngPassword = await userManager.ResetPasswordAsync(user , token , newPassword);
                    if(chngPassword.Succeeded)
                    {
                        ldap.ChangePassword(user.UserName , newPassword);

                        return Ok(true);
                    }
                    else
                    {
                        return BadRequest(chngPassword.Errors);
                    }

                    
                }

                return Ok(false);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
                throw;
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CompleteStudentProfile([FromBody]UserDataModel userDataModel)
        {
            try
            {
                string idNumber = userManager.GetUserId(User);
                UserModel user = appDbContext.Users.Where(x => x.UserName == idNumber).FirstOrDefault();

                if(user.LatinFirstname != null && user.LatinLastname != null)
                    return BadRequest("شما قبلا اطلاعات خودرا تکمیل کرده اید");

                StudentDetail studentDetail = appDbContext.StudentDetails.Where(x => x.UserId == user.Id).FirstOrDefault();

                if(studentDetail == null)
                {
                    var serialized = JsonConvert.SerializeObject(user);
                    UserDataModel userData = JsonConvert.DeserializeObject<UserDataModel>(serialized);

                    studentDetail = new StudentDetail();
                    studentDetail.UserId = user.Id;

                    userData.studentDetail = studentDetail;

                    await UserService.SyncUserDetail(userData);
                }
                studentDetail.BirthDate = userDataModel.studentDetail.BirthDate;
                studentDetail.cityBirth = userDataModel.studentDetail.cityBirth;
                studentDetail.FatherPhoneNumber = userDataModel.studentDetail.FatherPhoneNumber;
                
                appDbContext.StudentDetails.Update(studentDetail);

                user.LatinFirstname = userDataModel.LatinFirstname.Trim();
                user.LatinLastname = userDataModel.LatinLastname.Trim();
                user.PhoneNumber = userDataModel.PhoneNumber;

                appDbContext.Users.Update(user);
                await appDbContext.SaveChangesAsync();

                if(!ldap.CheckUserData(user.UserName))
                {
                    await ldap.AddUserToLDAP(user , false);
                }
                await ldap.AddMail(user);

                return Ok(true);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles="Teacher")]
        public async Task<IActionResult> CompleteTeacherProfile([FromBody]UserDataModel userDataModel)
        {
            try
            {
                string idNumber = userManager.GetUserId(User);
                UserModel user = appDbContext.Users.Where(x => x.UserName == idNumber).FirstOrDefault();

                if(user.LatinFirstname != null && user.LatinLastname != null)
                    return BadRequest("شما قبلا اطلاعات خودرا تکمیل کرده اید");

                // bool duplicatePersonalIdNumber = appDbContext.TeacherDetails.Where(x => x.personalIdNUmber == userDataModel.teacherDetail.personalIdNUmber && x.TeacherId != user.Id).FirstOrDefault() != null;
                                           
                // if(duplicatePersonalIdNumber)
                //     return BadRequest("کد پرسنلی وارد شده تکراریست");
 
                TeacherDetail teacherDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == user.Id).FirstOrDefault();

                if(teacherDetail == null)
                {
                    var serialized = JsonConvert.SerializeObject(user);
                    UserDataModel userData = JsonConvert.DeserializeObject<UserDataModel>(serialized);

                    teacherDetail = new TeacherDetail();
                    teacherDetail.TeacherId = user.Id;

                    userData.teacherDetail = teacherDetail;

                    await UserService.SyncUserDetail(userData);
                }

                teacherDetail.birthDate = userDataModel.teacherDetail.birthDate;
                teacherDetail.cityBirth = userDataModel.teacherDetail.cityBirth;
                //teacherDetail.personalIdNUmber = userDataModel.teacherDetail.personalIdNUmber;
                
                appDbContext.TeacherDetails.Update(teacherDetail);

                user.LatinFirstname = userDataModel.LatinFirstname.Trim();
                user.LatinLastname = userDataModel.LatinLastname.Trim();

                appDbContext.Users.Update(user);
                await appDbContext.SaveChangesAsync();

                await ldap.AddMail(user);

                return Ok(true);

            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
#endregion


#region Login/Register
        
        public class InputModel
        {
            public string Password {get; set;}
            public string Username {get; set;}
        }
        [HttpPost]
        public async Task<IActionResult> LoginUser([FromBody]InputModel inpuLogin)
        {
            try
            {
                // await roleManager.CreateAsync(new IdentityRole<int>(Roles.CoManager));
                // await roleManager.CreateAsync(new IdentityRole<int>(Roles.Student));

                bool authResult = false;

                var Result = signInManager.PasswordSignInAsync(inpuLogin.Username , inpuLogin.Password , false , false).Result;

                authResult = Result.Succeeded;

                if(!authResult)
                {
                    string IdNumber = ldap.Authenticate(inpuLogin.Username , inpuLogin.Password);
                    authResult = (IdNumber != null ? true : false);
                }
                
                if(authResult)
                {
                    UserModel userInformation  = await userManager.FindByNameAsync(inpuLogin.Username);

                    bool userInLdap = false;

                    try
                    {
                        if(ldap.CheckStatus())
                        {
                            userInLdap = ldap.CheckUserData(userInformation.MelliCode);
                        }
                        else
                        {
                            userInLdap = true;
                        }
                    }
                    catch {}


                    if(!userInformation.ConfirmedAcc)
                    {
                        return StatusCode(423 , "حساب کاربری شما تایید نشده است");
                    }

                    if(UserService.HasRole(userInformation , Roles.User , true))
                    {
                        await userManager.AddToRoleAsync(userInformation , Roles.Student);
                    }

                    object userDetail = null;

                    List<string> userRoleNames = userManager.GetRolesAsync(userInformation).Result.ToList();

                    if(UserService.HasRole(userInformation , Roles.Student , userRoleNames))
                    {
                        SchoolModel school = appDbContext.Schools.Where(x => x.Id == userInformation.SchoolId).FirstOrDefault();
                        School_studentClass classs = appDbContext.School_StudentClasses.Where(x => x.UserId == userInformation.Id).FirstOrDefault();
                        School_Class classDetail = new School_Class();
                        classDetail = (classs != null ? appDbContext.School_Classes.Where(x => x.Id == classs.ClassId).FirstOrDefault() : classDetail);

                        GradeModel grade = (classDetail.Grade_Id != 0 ? appDbContext.Grades.Where(x => x.Id == classDetail.Grade_Id).FirstOrDefault() : new GradeModel());

                        userDetail = new {
                            school,
                            classDetail,
                            grade.GradeName
                        };  
                    }

                    if(UserService.HasRole(userInformation , Roles.Teacher , userRoleNames))
                    {
                        userDetail = appDbContext.TeacherDetails.Where(x => x.TeacherId == userInformation.Id).FirstOrDefault();
                    }

                    if(UserService.HasRole(userInformation , Roles.Admin , userRoleNames))
                    {
                        userDetail = appDbContext.AdminDetails.Where(x => x.UserId == userInformation.Id).FirstOrDefault();
                    }

                    if(UserService.HasRole(userInformation , Roles.Manager , userRoleNames))
                    {
                        userDetail = appDbContext.ManagerDetails.Where(x => x.UserId == userInformation.Id).FirstOrDefault();
                    }

                    
                    SchoolModel schoolModel = appDbContext.Schools.Where(x => x.Id == userInformation.SchoolId).FirstOrDefault();

                    int schoolType = (schoolModel != null ? schoolModel.SchoolType : 0);

                    string schooltypeName = "";

                    if(schoolType == 0)
                    {
                        try{
                            schooltypeName = ((AdminDetail)userDetail).TypeName; 
                        }catch{}
                    }
                    else
                    {
                        AdminDetail adminDetail = appDbContext.AdminDetails.Where(x => x.SchoolsType == schoolModel.SchoolType).FirstOrDefault();
                        schooltypeName = adminDetail.TypeName;
                    }

                    

                    userDetail = new {userDetail , schooltypeName }; 

                    List<Claim> authClaims = new List<Claim>()
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, userInformation.UserName),
                        new Claim(JwtRegisteredClaimNames.GivenName, userInformation.UserName),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),          
                    };

                    foreach (var item in userRoleNames)
                    {
                        authClaims.Add(new Claim(ClaimTypes.Role, item)); // Add Users role
                    }

                    var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppSettings.JWTSecret));

                    var token = new JwtSecurityToken(
                        issuer: "https://localhost:5001",
                        audience: "https://localhost:5001",
                        expires: DateTime.UtcNow.AddDays(1),
                        claims: authClaims,  // Add user Roles to token
                        signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                        ) ;

                    bool completedProfile = userInformation.LatinFirstname != null && userInformation.LatinFirstname != null;
                    
                    string UserType = (userRoleNames.Count > 1 ? userRoleNames.Where(x => x != Roles.User).FirstOrDefault() : userRoleNames.FirstOrDefault());

                    if(UserType == Roles.Teacher)
                    {
                        if(!userInLdap)
                        {
                            await ldap.AddUserToLDAP(userInformation , true);
                        }
                    }
                    else
                    {
                        if(!userInLdap)
                        {
                            await ldap.AddUserToLDAP(userInformation , false);
                        }
                    }

                    //Get UserType information from UserType Class
                    return Ok(new
                    {
                        UserType = UserType,
                        completedProfile,
                        userInformation,
                        userDetail,
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        expiration = token.ValidTo
                    });
                }

                return Unauthorized("Username Or Password Not Found");
            }
            catch(Exception ex)
            {
                Console.WriteLine("Login Error : " + ex.Message);
                Console.WriteLine(ex.StackTrace);

                return Unauthorized("Username Or Password Not Found");
            }
        }

        //Sameple Data : Users/RegisterNewUser?Password=Saleh-1379   newUser post as json data
        [HttpPut]
        [ProducesResponseType(typeof(UserDataModel), 200)]
        [ProducesResponseType(typeof(IEnumerable<IdentityError>), 400)]
        public async Task<IActionResult> RegisterNewUser([FromBody]UserDataModel _model)
        {
            //Check for admin Account 
            UserModel adminUser = await userManager.FindByNameAsync("Admin");
            if(adminUser == null)
            {
                //When admin account not available it means this block doesn't call yet
                try
                {
                    adminUser = new UserModel{ConfirmedAcc = true , Email = "Admin@info.com" , FirstName = "Admin" , LastName = "Admin" , UserName = "Admin"};
                    await userManager.CreateAsync(adminUser , "Admin-1379");
                    
                    await roleManager.CreateAsync(new IdentityRole<int>(Roles.Admin));
                    await roleManager.CreateAsync(new IdentityRole<int>(Roles.Teacher));
                    await roleManager.CreateAsync(new IdentityRole<int>(Roles.User));
                    await roleManager.CreateAsync(new IdentityRole<int>(Roles.Manager));
                    await roleManager.CreateAsync(new IdentityRole<int>(Roles.CoManager));
                    await roleManager.CreateAsync(new IdentityRole<int>(Roles.Student));

                    await userManager.AddToRoleAsync(adminUser , "Admin");
                }
                catch
                {}
            }

            var serialized = JsonConvert.SerializeObject(_model);
            UserModel newUser = JsonConvert.DeserializeObject<UserModel>(serialized);

            try
            {
                
                newUser.ConfirmedAcc = false;
                newUser.UserName = _model.MelliCode;
                //newUser.UserType = Roles.Student;
                
                IdentityResult result = userManager.CreateAsync(newUser , newUser.MelliCode).Result;
                
                if(result.Succeeded)
                {
                    await userManager.AddToRoleAsync(newUser , Roles.User);

                    int userId = userManager.FindByNameAsync(newUser.MelliCode).Result.Id;

                     //These file name Are set by default and its extension should be checked between jpg/png
                    StudentDetail userDetail = new StudentDetail{
                        ShDocument = _model.MelliCode,
                        Document2 = _model.MelliCode + "_Doc2",
                        BaseId = _model.studentDetail.BaseId,
                        BirthDate = _model.studentDetail.BirthDate,
                        FatherMelliCode = _model.studentDetail.FatherMelliCode,
                        FatherName = _model.studentDetail.FatherName,
                        FatherPhoneNumber = _model.studentDetail.FatherPhoneNumber,
                        UserId = userId
                    };

                    await appDbContext.StudentDetails.AddAsync(userDetail);
                    await appDbContext.SaveChangesAsync();
                    
                    return Ok(newUser);
                }
                else
                {
                    return BadRequest(result.Errors);
                }
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newUser);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Authorize]
        [ProducesResponseType(typeof(bool), 200)]
        public async Task<IActionResult> UploadDocuments([FromForm]IFormCollection Files , int docType)
        {
            try
            {
                //docType 0 = Shenasname
                //docType 1 = Ax
                string Mellicode = userManager.GetUserId(User);

                var file = Files.Files[0];

                if (file != null)
                {
                    if (file.Length > 0)
                    {
                        UserModel userModel = appDbContext.Users.Where(x => x.MelliCode == Mellicode).FirstOrDefault();
                        if(userModel != null)
                        {
                            if(!Directory.Exists("ClientApp/public/Documents"))
                                Directory.CreateDirectory("ClientApp/public/Documents");

                            string fileName = Mellicode + "-" + file.FileName;

                            var fs = new FileStream(Path.Combine("ClientApp/public/Documents", fileName), FileMode.Create);
                            await file.CopyToAsync(fs);

                            fs.Close();

                            StudentDetail studentDetail = appDbContext.StudentDetails.Where(x => x.UserId == userModel.Id).FirstOrDefault();
                            if(studentDetail != null)
                            {
                                if(docType == 0)
                                {
                                    studentDetail.ShDocument = fileName;
                                }
                                else
                                {
                                    studentDetail.Document2 = fileName;
                                }

                                appDbContext.StudentDetails.Update(studentDetail);
                            }
                            else
                            {
                                studentDetail = new StudentDetail();
                                studentDetail.UserId = userModel.Id;
                                if(docType == 0)
                                {
                                    studentDetail.ShDocument = fileName;
                                }
                                else
                                {
                                    studentDetail.Document2 = fileName;
                                }
                                
                                await appDbContext.StudentDetails.AddAsync(studentDetail);
                            }

                            await appDbContext.SaveChangesAsync();

                            return Ok(true);
                        }
                        else
                        {
                            return BadRequest("حساب شما در سامانه یافت نشد");
                        }
                    }
                }
                return BadRequest(false);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return BadRequest("در آپلود فایل مشکلی بوجود آمد");
            }
        }


        //For security Reason We Use this methode here
        [HttpGet]
        [ProducesResponseType(typeof(List<CategoryDetail>), 200)]
        public IActionResult GetAllCategory()
        {
            // try
            // {
                
            //     List<CategoryDetail_moodle> result = await moodleApi.GetAllCategories(-1);
            //     List<CategoryDetail> Categories = new List<CategoryDetail>();

            //     foreach(var cat in result)
            //     {
            //         if(cat.id != 1)  // Miscellaneous Category
            //         {
            //             CategoryDetail cateDetail = new CategoryDetail();
            //             cateDetail.Id = cat.id;
            //             cateDetail.Name = cat.name;

            //             Categories.Add(cateDetail);
            //         }
            //     }

            //     return Ok(Categories);
            // }
            // catch(Exception ex)
            // {
            //     return BadRequest(ex.Message);
            // }

            return Ok(true);
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<CategoryDetail>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetAllSchools()
        {
            try
            {
                return Ok(appDbContext.Schools.Where(x => x.SelfSign).ToList());
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

#endregion
    

#region SMS
        [ApiExplorerSettings(IgnoreApi = true)]
        public bool checkUserAttempts(UserModel user , bool verify = false)
        {
            if(verify)
            {
                return true;
            }

            List<VerificationCodeModel> lastestCodeInfo = new List<VerificationCodeModel>();
            lastestCodeInfo = appDbContext.VerificationCodes.Where(x => x.UserId == user.Id && x.LastSend.AddMinutes(30) >= MyDateTime.Now()) //Limit count in 30 minutes
                                                            .ToList().OrderByDescending(x => x.LastSend).Take(3).ToList();
            
            if(lastestCodeInfo.Count != 3 && lastestCodeInfo.Count > 0) // Rich limit Send sms
            {
                if(lastestCodeInfo[0].LastSend.AddMinutes(3) < MyDateTime.Now())//Send sms code delay
                {   
                    return true;
                }
                else
                {
                    //return Ok("Limit Reached");
                    return false;
                }
            }
            else if(lastestCodeInfo.Count == 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        async Task<bool> SendCode(UserModel user , string phoneNumber , bool fatherPhone = false)
        {
            try
            {
                SMSService sMSService = new SMSService(appDbContext.SMSServices.Where(x => x.ServiceName == AppSettings.Default_SMSProvider).FirstOrDefault());

                string Code = await userManager.GenerateChangePhoneNumberTokenAsync(user , phoneNumber);// Make new Verification code

                bool SmsResult = sMSService.SendVerifySms(phoneNumber , 
                                                            user.FirstName + " " + user.LastName , 
                                                            Code  , 
                                                            AppSettings.Default_SMSProvider == "Negin" ? AppSettings.GetValueFromDatabase(appDbContext , Settingkey.Negin_VerifySMS) : "");
                //bool SmsResult = true;

                if(SmsResult)
                {
                    VerificationCodeModel verification = new VerificationCodeModel();
                    verification.LastSend = MyDateTime.Now();
                    verification.fatherCode = fatherPhone;
                    verification.UserId = user.Id;
                    verification.VerificationCode = Code;

                    await appDbContext.VerificationCodes.AddAsync(verification);
                    await appDbContext.SaveChangesAsync();

                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return false;
            }
        }
        
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<bool> CheckVerificationCode(string verifyCode , UserModel user , bool isFatherVerification)
        {
            string Code = await userManager.GenerateChangePhoneNumberTokenAsync(user , user.PhoneNumber);

            bool resultVerify = (Code == verifyCode);

            if(resultVerify)
            {
                return true;
            }
            else
            {
                //Check verification if user Reach limit Code by Check last sent Code 

                VerificationCodeModel lastVerifyCode = appDbContext.VerificationCodes.Where(x => x.UserId == user.Id && x.fatherCode == isFatherVerification && x.LastSend.AddMinutes(30) >= MyDateTime.Now()) //Limit count in 30 minutes
                                                            .ToList().OrderByDescending(x => x.LastSend).Take(3).ToList()[0];
                string LastCode = lastVerifyCode.VerificationCode;
                
                if(LastCode == verifyCode)
                {
                    return true;
                }

                return false;
            }
        }

#endregion
    
#region Tutorial
    public IActionResult GetTutorialVideo(string UserType)
    {
        try
        {
            switch (UserType)
            {
                case "Manager" :
                    return Ok(AppSettings.GetValueFromDatabase(appDbContext , "Manager_TutVideo"));

                case "Teacher" :
                    return Ok(AppSettings.GetValueFromDatabase(appDbContext , "Teacher_TutVideo"));

                case "Student" :
                    return Ok(AppSettings.GetValueFromDatabase(appDbContext , "Student_TutVideo"));
            }

            return Ok("کاربر مورد نظر یافت نشد");
        }
        catch (Exception ex)
        {
            return BadRequest("اطلاعات مورد نظر یافت نشد");
        }
    }
#endregion   
    
    }
}



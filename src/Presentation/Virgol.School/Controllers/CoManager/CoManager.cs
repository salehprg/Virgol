
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

using lms_with_moodle.Helper;

using Models;
using Models.User;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Threading.Tasks;
using Models.InputModel;
using Newtonsoft.Json;

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class CoManager : ControllerBase
    {
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;
        private readonly SignInManager<UserModel> signInManager;
        private readonly AppDbContext appDbContext;

        FarazSmsApi SMSApi;
        UserService UserService;
        public CoManager(UserManager<UserModel> _userManager 
                                , SignInManager<UserModel> _signinManager
                                , RoleManager<IdentityRole<int>> _roleManager
                                , AppDbContext _appdbContext)
        {
            userManager = _userManager;
            roleManager = _roleManager;
            signInManager =_signinManager;
            appDbContext = _appdbContext;

            SMSApi = new FarazSmsApi();
            UserService = new UserService(userManager , appDbContext);
        }


        [HttpGet]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [Authorize(Roles = Roles.Admin)]
        public IActionResult GetCoManagers()
        {
            try
            {
                List<UserModel> coManagers = UserService.GetUsersInRole(Roles.CoManager).Result.ToList();

                return Ok(coManagers);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [ProducesResponseType(typeof(UserModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AddNewCoManager([FromBody]UserModel model)
        {
            try
            {
                if(model.SchoolId == 0)
                {
                    Console.WriteLine("SchoolId shouldn't be 0 !");
                    return BadRequest("اطلاعات به درستی داده نشده است");
                }

                UserModel coManager = model;
                coManager.MelliCode = ConvertToPersian.PersianToEnglish(coManager.MelliCode);
                coManager.UserName = coManager.MelliCode;
                coManager.ConfirmedAcc = true;
                //manager.UserType = Roles.Manager;
                coManager.Moodle_Id = 0;
                
                UserDataModel coManagerData = new UserDataModel();
                var seialized = JsonConvert.SerializeObject(coManager);
                coManagerData = JsonConvert.DeserializeObject<UserDataModel>(seialized);

                List<string> userRoles = new List<string>{Roles.CoManager};

                List<UserDataModel> managerDatas = await UserService.CreateUser(new List<UserDataModel>{coManagerData} , userRoles, model.SchoolId);

                SchoolModel school = appDbContext.Schools.Where(x => x.Id == model.SchoolId).FirstOrDefault();

                if(school != null)
                {
                    school.ManagerId = managerDatas[0].Id;
                    appDbContext.Schools.Update(school);
                    appDbContext.SaveChanges();
                }           

                return Ok(model);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }


        //Below Lines UnCompleted
        [HttpPost]
        [ProducesResponseType(typeof(UserModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> EditCoManager([FromBody]ManagerData model)
        {
            try
            {
                SchoolModel schoolModel = appDbContext.Schools.Where(x => x.Id == model.SchoolId).FirstOrDefault();
                schoolModel.sexuality = model.schoolSexuality;
                
                appDbContext.Schools.Update(schoolModel);
                await appDbContext.SaveChangesAsync();

                model.MelliCode = ConvertToPersian.PersianToEnglish(model.MelliCode);

                int currentManagerId = appDbContext.Schools.Where(x => x.Id == model.SchoolId).FirstOrDefault().ManagerId;
                UserModel currentManager = appDbContext.Users.Where(x => x.Id == currentManagerId).FirstOrDefault();
                UserModel newManager = appDbContext.Users.Where(x => x.MelliCode == model.MelliCode).FirstOrDefault();

                if(newManager != null && currentManager == null)
                {
                    return BadRequest("کد ملی وارد شده تکراریست");
                }

                IdentityResult chngPass = new IdentityResult();
                if(currentManager != null && newManager != null && currentManager.Id == newManager.Id)//It means MelliCode not changed and just should Edit manager Info
                {
                    newManager = null;

                    if(!string.IsNullOrEmpty(model.password) && model.password.Length < 8)
                        return BadRequest("حداقل طول رمز عبور باید 8 رقم باشد");

                    if(model.PhoneNumber != null && model.PhoneNumber != currentManager.PhoneNumber)
                    {
                        if(UserService.CheckPhoneInterupt(model.PhoneNumber))
                            return BadRequest("شماره همراه وارد شده قبلا در سیستم ثبت شده است");

                        currentManager.PhoneNumber = ConvertToPersian.PersianToEnglish(model.PhoneNumber);
                    }
                    
                    
                    currentManager.FirstName = model.FirstName;
                    currentManager.LatinFirstname = model.LatinFirstname;
                    currentManager.LastName = model.LastName;
                    currentManager.LatinLastname = model.LatinLastname;

                    UserDataModel userDataModel = new  UserDataModel();
                    var serialized = JsonConvert.SerializeObject(currentManager);
                    userDataModel = JsonConvert.DeserializeObject<UserDataModel>(serialized);

                    userDataModel.managerDetail = new ManagerDetail();
                    userDataModel.managerDetail.personalIdNumber = model.personalIdNumber;

                    await UserService.EditUsers(new List<UserDataModel>{userDataModel} , model.SchoolId , false , model.password);

                    List<IdentityError> errors = chngPass.Errors.ToList();
                    return Ok(new{
                        currentManager,
                        errors
                    });
                }
                
                if(newManager == null ) //melliCode changed and should remove oldManager then add newManager
                {
                    if(model.password == null || model.password.Trim() == null)
                        return BadRequest("لطفا برای ساخت مدیر جدید رمزعبور مدیر را هم وارد نمایید");

                    if(model.password.Length < 8)
                        return BadRequest("حداقل طول رمز عبور باید 8 رقم باشد");

                    if(UserService.CheckPhoneInterupt(ConvertToPersian.PersianToEnglish(model.PhoneNumber)))
                        return BadRequest("شماره همراه وارد شده قبلا در سیستم ثبت شده است");

                    if(currentManager != null)
                    {
                        await UserService.DeleteUser(currentManager);
                    }
                    model.UserName = model.MelliCode;

                    model.ConfirmedAcc = true;
                    UserDataModel userDataModel = new  UserDataModel();
                    var serialized = JsonConvert.SerializeObject(model);
                    userDataModel = JsonConvert.DeserializeObject<UserDataModel>(serialized);

                    userDataModel.managerDetail = new ManagerDetail();
                    userDataModel.managerDetail.personalIdNumber = model.personalIdNumber;

                    List<UserDataModel> datas = await UserService.CreateUser(new List<UserDataModel>{userDataModel} , new List<string>{Roles.Manager} , model.SchoolId , model.password );

                    if(datas.Count > 0)
                    {
                        SchoolModel school = appDbContext.Schools.Where(x => x.Id == model.SchoolId).FirstOrDefault();
                        school.ManagerId = datas[0].Id;

                        appDbContext.Schools.Update(school);
                        await appDbContext.SaveChangesAsync();

                        var serializedNewManager = JsonConvert.SerializeObject(userDataModel);
                        UserModel newUserManager = JsonConvert.DeserializeObject<UserModel>(serialized);

                        newManager = newUserManager;
                    }
                    
                    List<IdentityError> errors = chngPass.Errors.ToList();
                    return Ok(new{
                        newManager,
                        errors
                    });
                }

                if(newManager != null)
                {
                    if(UserService.CheckMelliCodeInterupt(newManager.MelliCode , currentManager.Id))
                        return BadRequest("کد ملی وارد شده تکراریست");
                }
                
                return BadRequest("اطلاعات وارد شده ناقص میباشد");
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return BadRequest("خطای سیستمی رخ داد لطفا بعدا تلاش نمایید");
            }
        }

        [HttpDelete]
        [ProducesResponseType(typeof(UserModel), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult RemoveCoManager(int managerId)
        {
            try
            {
                
                SchoolModel oldSchool = new SchoolModel();
                oldSchool = appDbContext.Schools.Where(x => x.ManagerId == managerId).FirstOrDefault();

                if(oldSchool != null)
                {
                    oldSchool.ManagerId = -1;
                    appDbContext.Schools.Update(oldSchool);
                }

                UserModel manager = appDbContext.Users.Where(x => x.Id == managerId).FirstOrDefault();
                bool removeManager = userManager.DeleteAsync(manager).Result.Succeeded;

                if(removeManager)
                {
                    appDbContext.SaveChanges();
                }
                
                return Ok(managerId);
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }

    }
}
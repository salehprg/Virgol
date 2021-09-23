
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

using Virgol.Helper;

using Models;
using Models.User;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Threading.Tasks;
using Models.InputModel;
using Newtonsoft.Json;
using Models.Users.Roles;

namespace Virgol.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(Roles =  Roles.Admin + "," + Roles.Manager + "," + Roles.CoManager)]
    public class CoManagerController : ControllerBase
    {
        private readonly UserManager<UserModel> userManager;
        private readonly RoleManager<IdentityRole<int>> roleManager;
        private readonly SignInManager<UserModel> signInManager;
        private readonly AppDbContext appDbContext;

        UserService UserService;
        public CoManagerController(UserManager<UserModel> _userManager 
                                , SignInManager<UserModel> _signinManager
                                , RoleManager<IdentityRole<int>> _roleManager
                                , AppDbContext _appdbContext)
        {
            userManager = _userManager;
            roleManager = _roleManager;
            signInManager =_signinManager;
            appDbContext = _appdbContext;

            UserService = new UserService(userManager , appDbContext);
        }


        #region CoManager

        [HttpGet]
        [ProducesResponseType(typeof(List<UserModel>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult GetCoManagers()
        {
            try
            {
                UserModel userModel = UserService.GetUserModel(User);
                SchoolModel school = appDbContext.Schools.Where(x => x.ManagerId == userModel.Id).FirstOrDefault();
                if(school != null)
                {
                    List<UserModel> coManagers = UserService.GetUsersInRole(Roles.CoManager).Result.ToList();
                    coManagers = coManagers.Where(x => x.SchoolId == school.Id).ToList();

                    return Ok(coManagers);
                }

                return BadRequest("شما مجاز به دريافت ليست نميباشيد");
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
                UserModel userModel = UserService.GetUserModel(User);
                SchoolModel schoolModel = appDbContext.Schools.Where(x => x.ManagerId == userModel.Id).FirstOrDefault();
                if(schoolModel == null)
                {
                    Console.WriteLine("SchoolId shouldn't be 0 !");
                    return BadRequest("اطلاعات به درستی داده نشده است");
                }

                model.SchoolId = schoolModel.Id;

                UserModel coManager = model;
                coManager.MelliCode = ConvertToPersian.PersianToEnglish(coManager.MelliCode);
                coManager.UserName = coManager.MelliCode;
                coManager.ConfirmedAcc = true;
                coManager.SchoolId = schoolModel.Id;
                coManager.Moodle_Id = 0;
                
                UserDataModel coManagerData = new UserDataModel();
                var seialized = JsonConvert.SerializeObject(coManager);
                coManagerData = JsonConvert.DeserializeObject<UserDataModel>(seialized);

                List<string> userRoles = new List<string>{Roles.CoManager};

                List<UserDataModel> managerDatas = await UserService.CreateUser(new List<UserDataModel>{coManagerData} , userRoles, model.SchoolId);
                if(managerDatas.Count > 0)
                    return Ok(managerDatas[0]);      

                return BadRequest("درحال حاضر امکان افزودن معاون به مدرسه وجود ندارد");
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
        public async Task<IActionResult> EditCoManager([FromBody]UserModel model)
        {
            try
            {

                UserModel userModel = UserService.GetUserModel(User);
                SchoolModel schoolModel = appDbContext.Schools.Where(x => x.ManagerId == userModel.Id).FirstOrDefault();
                if(schoolModel == null)
                {
                    Console.WriteLine("SchoolId shouldn't be 0 !");
                    return BadRequest("اطلاعات به درستی داده نشده است");
                }

                model.SchoolId = schoolModel.Id;

                model.MelliCode = ConvertToPersian.PersianToEnglish(model.MelliCode);

                UserModel currentCoManager = appDbContext.Users.Where(x => x.Id == model.Id).FirstOrDefault();
                UserModel newCoManager = appDbContext.Users.Where(x => x.MelliCode == model.MelliCode).FirstOrDefault();

                if(newCoManager != null && newCoManager.Id != currentCoManager.Id)
                {
                    return BadRequest("کد ملی وارد شده تکراریست");
                }

                if(currentCoManager != null && newCoManager != null && currentCoManager.Id == newCoManager.Id)//It means MelliCode not changed and just should Edit manager Info
                {
                    newCoManager = null;

                    if(model.PhoneNumber != null && model.PhoneNumber != currentCoManager.PhoneNumber)
                    {
                        if(UserService.CheckPhoneInterupt(model.PhoneNumber))
                            return BadRequest("شماره همراه وارد شده قبلا در سیستم ثبت شده است");

                        currentCoManager.PhoneNumber = ConvertToPersian.PersianToEnglish(model.PhoneNumber);
                    }
                    

                    currentCoManager.FirstName = model.FirstName;
                    currentCoManager.LatinFirstname = model.LatinFirstname;
                    currentCoManager.LastName = model.LastName;
                    currentCoManager.LatinLastname = model.LatinLastname;

                    UserDataModel userDataModel = new  UserDataModel();
                    var serialized = JsonConvert.SerializeObject(currentCoManager);
                    userDataModel = JsonConvert.DeserializeObject<UserDataModel>(serialized);

                    await UserService.EditUsers(new List<UserDataModel>{userDataModel} , model.SchoolId , false);

                    return Ok(currentCoManager);
                }
                
                if(newCoManager == null ) //melliCode changed and should remove oldManager then add newManager
                {

                    if(UserService.CheckPhoneInterupt(ConvertToPersian.PersianToEnglish(model.PhoneNumber)))
                        return BadRequest("شماره همراه وارد شده قبلا در سیستم ثبت شده است");

                    if(currentCoManager != null)
                    {
                        await UserService.DeleteUser(currentCoManager);
                    }

                    model.UserName = model.MelliCode;
                    model.ConfirmedAcc = true;

                    UserDataModel userDataModel = new  UserDataModel();
                    var serialized = JsonConvert.SerializeObject(model);
                    userDataModel = JsonConvert.DeserializeObject<UserDataModel>(serialized);

                    List<UserDataModel> datas = await UserService.CreateUser(new List<UserDataModel>{userDataModel} , new List<string>{Roles.CoManager} , schoolModel.Id , model.MelliCode );

                    if(datas.Count > 0)
                    {
                        return Ok(model);
                    }
                    
                    return BadRequest("مشکلی در ویرایش اطلاعات معاون پیش آمد");
                }

                if(newCoManager != null)
                {
                    if(UserService.CheckMelliCodeInterupt(newCoManager.MelliCode , currentCoManager.Id))
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
        public async Task<IActionResult> RemoveCoManager(int coManagerId)
        {
            try
            {
                UserModel coManager = appDbContext.Users.Where(x => x.Id == coManagerId).FirstOrDefault();
                bool removedCoManager = await UserService.DeleteUser(coManager);

                if(removedCoManager)
                {
                    return Ok(coManagerId);
                }
                
                return BadRequest("حذف با مشکل مواجه شد");
            }
            catch(Exception ex)
            {
                //await userManager.DeleteAsync(newSchool);
                return BadRequest(ex.Message);
            }
        }


#endregion

    }
}
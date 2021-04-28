using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

using Virgol.Helper;

using Models.User;
using Microsoft.AspNetCore.Http;
using Models.Users.Roles;
using Models;
using Virgol.School.Models;
using Virgol.Services;

namespace Virgol.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class LandingController : ControllerBase
    {
        private readonly AppDbContext appDbContext;
        private readonly UserManager<UserModel> userManager;
        private readonly MeetingService meetingService;
        UserService UserService;
        SchoolService schoolService;

        public LandingController(AppDbContext dbContext
                                , RoleManager<IdentityRole<int>> _roleManager
                                , UserManager<UserModel> _userManager)
        {
            appDbContext = dbContext;
            userManager = _userManager;

            UserService = new UserService(userManager , appDbContext);
            meetingService = new MeetingService(appDbContext , UserService);
            schoolService = new SchoolService(appDbContext);

        }

        [HttpPost]
        public async Task<IActionResult> PanelRequest([FromBody]ReqForm reqForm)
        {
            try
            {
                if(string.IsNullOrEmpty(reqForm.PhoneNumber))
                    return BadRequest("شماره تلفن نبايد خالي باشد");
                if(string.IsNullOrEmpty(reqForm.FirstName) || string.IsNullOrEmpty(reqForm.LastName))
                    return BadRequest("اطلاعات به درستي تكميل نشده است");

                SMSService sMSService = new SMSService(appDbContext.SMSServices.Where(x => x.ServiceName == AppSettings.Default_SMSProvider).FirstOrDefault());

                await appDbContext.ReqForms.AddAsync(reqForm);
                await appDbContext.SaveChangesAsync();

                string message = string.Format("درخواست ثبت مدرسه جديد ثبت شد.\nاطلاعات درخواست : \n" + 
                                                "{0} {1}\n كد ملي : {2}  \n شماره تماس : {3}" , reqForm.FirstName , reqForm.LastName , reqForm.Mellicode , reqForm.PhoneNumber);

                message = message.Replace("\n" , Environment.NewLine);
                string adminPhone = AppSettings.GetValueFromDatabase(appDbContext , "Admin_Phone");

                sMSService.SendSms(new string[]{adminPhone} , message);

                if(reqForm.email != null)
                {
                    MailHelper mailHelper = new MailHelper(AppSettings.GetValueFromDatabase(appDbContext , "SupportEmail"));
                    string emailMessage = string.Format(" {0} {1} درخواست شما براي پنل مدرسه با موفقیت ثبت شد  \n کد پیگیری : {2}" , reqForm.FirstName , reqForm.LastName , reqForm.Id);
                    emailMessage = emailMessage.Replace("\n" , Environment.NewLine);
                    mailHelper.Send(reqForm.email , "درخواست پنل مدرسه - سامانه ویرگول -" , emailMessage , MimeKit.Text.TextFormat.Text);
                }


                return Ok("درخواست شما با موفقيت ثبت شد");
            }
            catch (Exception ex)
            {
                if(reqForm.Id != 0)
                {
                    appDbContext.ReqForms.Remove(reqForm);
                    await appDbContext.SaveChangesAsync();
                }
                Console.WriteLine(ex.Message);
                return BadRequest("پردازش درخواست با مشکل روبرو شد لطفا بعدا تلاش نمایید");
                throw;
            }
        }
    }
}
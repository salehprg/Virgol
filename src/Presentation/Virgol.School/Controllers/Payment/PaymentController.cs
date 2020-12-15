


using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

using lms_with_moodle.Helper;

using Models;
using Models.User;
using Models.Users.Roles;

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class PaymentController : ControllerBase
    {
        private readonly UserManager<UserModel> userManager;
        private readonly AppDbContext appDbContext;

        FarazSmsApi SMSApi;
        UserService UserService;
        PaymentService PaymentService;
        public PaymentController(UserManager<UserModel> _userManager
                                , AppDbContext _appdbContext)
        {
            userManager = _userManager;

            appDbContext = _appdbContext;
            SMSApi = new FarazSmsApi();
            UserService = new UserService(userManager , appDbContext);
            PaymentService = new PaymentService(appDbContext , userManager);
        }

        [HttpPost]
        [Authorize(Roles = Roles.Manager + "," + Roles.Admin)]
        public async Task<IActionResult> MakePay(int serviceId)
        {
            try
            {
                if(serviceId == 0)
                    return BadRequest("اطلاعات پرداخت کافی نمیباشد");

                ServicePrice service = appDbContext.ServicePrices.Where(x => x.Id == serviceId).FirstOrDefault();
                if(service == null)
                    return BadRequest("چنین پکیجی وجود ندارد");

                UserModel userModel = UserService.GetUserModel(User);

                PaymentsModel paymentsModel = new PaymentsModel();
                paymentsModel.UserId = userModel.Id;
                paymentsModel.serviceId = serviceId;

                paymentsModel = await PaymentService.MakePay(paymentsModel);

                if(paymentsModel != null)
                    return Ok(PaymentService.getPaymentURL(paymentsModel));

                return BadRequest("در روند پرداخت مشکلی پیش آمد");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest("لطفا بعدا تلاش نمایید");
            }
        }

        public async Task<IActionResult> VerifyPayment([FromForm] ReturnResponseModel response)
        {
            try
            {
                int paymentId = int.Parse(response.clientrefid);
                PaymentsModel payments = appDbContext.Payments.Where(x => x.status == PaymentStatus.pending && x.Id == paymentId).FirstOrDefault();

                VerifyPayResponseModel responseModel = await PaymentService.VerifyPayment(response.refId , paymentId);

                if(responseModel == null)
                    return BadRequest("پرداخت با مشکل روبرو شد");

                if(responseModel.amount == payments.amount)
                {
                    ServicePrice serviceModel = appDbContext.ServicePrices.Where(x => x.Id == payments.serviceId).FirstOrDefault();
                    string servicesType = serviceModel.serviceType.Split("|")[0];
                    string[] services = servicesType.Split(",");

                    UserModel userModel = appDbContext.Users.Where(x => x.Id == payments.UserId).FirstOrDefault();
                    SchoolModel school = appDbContext.Schools.Where(x => x.ManagerId == userModel.Id).FirstOrDefault();

                    foreach (var service in services)
                    {
                        if(service == ServiceType.AdobeConnect)
                        {
                            if(school.adobeExpireDate < MyDateTime.Now())
                            {
                                school.adobeExpireDate = MyDateTime.Now().AddMonths(int.Parse(serviceModel.option));
                            }
                            else if(school.adobeExpireDate > MyDateTime.Now())
                            {
                                school.adobeExpireDate = school.adobeExpireDate.AddMonths(int.Parse(serviceModel.option));
                            }
                        }
                        if(service == ServiceType.BBB)
                        {
                            if(school.bbbExpireDate < MyDateTime.Now())
                            {
                                school.bbbExpireDate = MyDateTime.Now().AddMonths(int.Parse(serviceModel.option));
                            }
                            else if(school.bbbExpireDate > MyDateTime.Now())
                            {
                                school.bbbExpireDate = school.bbbExpireDate.AddMonths(int.Parse(serviceModel.option));
                            }
                        }
                    }

                    return Ok("پرداخت با موفقیت انجام شد");
                }

                return BadRequest(responseModel.errorMessage);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
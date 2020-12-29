


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
using Microsoft.AspNetCore.Http;

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
                                , AppDbContext _appdbContext , IHttpContextAccessor httpContext)
        {
            userManager = _userManager;

            appDbContext = _appdbContext;
            SMSApi = new FarazSmsApi();
            UserService = new UserService(userManager , appDbContext);
            string url = httpContext.HttpContext.Request.Host.Value;

            Console.WriteLine(url);
            Console.WriteLine(httpContext.HttpContext.Request.PathBase);
            Console.WriteLine(httpContext.HttpContext.Request.Path);
            Console.WriteLine(httpContext.HttpContext.Request.Host);

            PaymentService = new PaymentService(appDbContext , userManager , httpContext.HttpContext.Request.Host.Value);
        }

        public IActionResult GetServices()
        {
            try
            {
                return Ok(appDbContext.ServicePrices.ToList());
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
                return BadRequest("خطا در دریافت اطلاعات");
                throw;
            }
        }

        [HttpPost]
        [Authorize(Roles = Roles.Manager + "," + Roles.Admin)]
        public async Task<IActionResult> MakePay(int serviceId , int userCount)
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
                paymentsModel.UserCount = userCount;

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

        [HttpPost]
        public async Task<IActionResult> VerifyPayment([FromForm] ReturnResponseModel response)
        {
            try
            {
                int paymentId = int.Parse(response.clientrefid);
                PaymentsModel payments = appDbContext.Payments.Where(x => x.status == PaymentStatus.pending && x.Id == paymentId).FirstOrDefault();

                VerifyPayResponseModel responseModel = await PaymentService.VerifyPayment(response.refId , paymentId);

                if(responseModel == null)
                {
                    return this.Redirect(AppSettings.ServerRootUrl + "/PaymentDetail/" + paymentId);
                }

                if(payments != null && responseModel.amount == payments.amount)
                {
                    bool result = await PaymentService.UpdateSchoolBalance(payments);
                }

                return this.Redirect(AppSettings.ServerRootUrl + "/PaymentDetail/" + paymentId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        public IActionResult GetPaymentDetail(int paymentId)
        {
            try
            {
                PaymentsModel payments = appDbContext.Payments.Where(x => x.Id == paymentId).FirstOrDefault();
                return  Ok(payments);
            }
            catch (System.Exception)
            {
                return BadRequest("خطا در دریافت اطلاعات");
                throw;
            }
        }
    
        public IActionResult GetAllPayments()
        {
            UserModel manager = UserService.GetUserModel(User);
            
            return Ok(appDbContext.PaymentsView.Where(x => x.UserId == manager.Id).ToList());
        }

        public IActionResult CalculateAmount(int serviceId , int userCount)
        {
            UserModel manager = UserService.GetUserModel(User);
            PaymentsModel paymentsModel = new PaymentsModel();
            paymentsModel.UserCount = userCount;
            paymentsModel.serviceId = serviceId;
            paymentsModel.UserId = manager.Id;

            return Ok(PaymentService.CalculatePrice(paymentsModel , manager.Id ).amount);
        }
    }
}
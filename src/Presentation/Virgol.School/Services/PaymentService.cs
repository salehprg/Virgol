using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using lms_with_moodle.Helper;
using Microsoft.AspNetCore.Identity;
using Models;
using Models.User;

public class PaymentService {

    AppDbContext appDbContext;
    PayPingAPI PayPingAPI;
    UserService userService;
    public PaymentService (AppDbContext context , UserManager<UserModel> userManager)
    {
        appDbContext = context;
        PayPingAPI = new PayPingAPI(appDbContext);
        userService = new UserService(userManager , appDbContext);
    }

    public string getPaymentURL(PaymentsModel paymentsModel)
    {
        return PayPingAPI.gotoIPG(paymentsModel.paymentCode);
    }
    public async Task<PaymentsModel> MakePay(PaymentsModel paymentsModel) 
    {
        try
        {
            if(paymentsModel.UserId == 0 || paymentsModel.serviceId == 0)
                throw new Exception("کاربر مربوطه و یا نوع سرویس مشخص نشده است");

            int amount = CalculatePrice(paymentsModel.serviceId , paymentsModel.UserId);

            paymentsModel.amount = amount;
            paymentsModel.payTime = MyDateTime.Now();
            paymentsModel.status = PaymentStatus.pending;
            
            await appDbContext.Payments.AddAsync(paymentsModel);
            await appDbContext.SaveChangesAsync();

            MakePayModel makePayModel = new MakePayModel();
            makePayModel.amount = amount;
            makePayModel.payerIdentity = paymentsModel.UserId.ToString();
            makePayModel.clientRefId = paymentsModel.Id.ToString();
            makePayModel.returnUrl = AppSettings.ServerRootUrl + "/api/Payment/VerifyPayment?clientrefid=" + makePayModel.clientRefId;

            string code = await PayPingAPI.makePay(makePayModel);

            if(string.IsNullOrEmpty(code))
            {
                return null;
            }

            paymentsModel.paymentCode = code;

            appDbContext.Payments.Update(paymentsModel);
            await appDbContext.SaveChangesAsync();

            return paymentsModel;

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);
            return null;
            throw;
        }
    }

    public async Task<VerifyPayResponseModel> VerifyPayment(string paymentrefId , int paymentId) 
    {
        try
        {
            PaymentsModel paymentsModel = appDbContext.Payments.Where(x => x.status == PaymentStatus.pending && x.Id == paymentId).FirstOrDefault();

            VerifyPayResponseModel responseModel = new VerifyPayResponseModel();

            if(paymentsModel == null)
            {
                responseModel.errorMessage = "این فاکتور قابلیت پرداخت ندارد مبلغ پرداختی توسط شما پس از حداکثر 1 ساعت به حساب شما بازخواهد گشت";

                return responseModel;
            }

            paymentsModel.refId = paymentrefId;
                
            appDbContext.Payments.Update(paymentsModel);
            await appDbContext.SaveChangesAsync();
                
            int amount = paymentsModel.amount;

            VerifyPayModel verifyModel = new VerifyPayModel();
            verifyModel.amount = amount;
            verifyModel.refId = paymentrefId;

            responseModel = await PayPingAPI.verifyPay(verifyModel);

            if(responseModel.amount == amount || responseModel.errorCode == "15")
            {
                paymentsModel.status = PaymentStatus.success;
                paymentsModel.reqId = paymentrefId;

                responseModel.amount = amount;
            }

            if(responseModel.errorCode != "15")
            {
                paymentsModel.status = PaymentStatus.failed;
            }
                
            appDbContext.Payments.Update(paymentsModel);
            await appDbContext.SaveChangesAsync();

            return responseModel;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return null;
        }
    }

    public int CalculatePrice(int serviceId , int userId)
    {
        try
        {
            UserModel userModel = appDbContext.Users.Where(x => x.Id == userId).FirstOrDefault();
            ServicePrice service = appDbContext.ServicePrices.Where(x => x.Id == serviceId).FirstOrDefault();
            int result = 0;

            if(service == null || userModel == null)
                return -1;

            if(userService.HasRole(userModel , Roles.Manager))
            {
                SchoolModel school = appDbContext.Schools.Where(x => x.ManagerId == userId).FirstOrDefault();
                int studentsCount = appDbContext.StudentViews.Where(x => x.schoolid == school.Id).Count();

                result = service.pricePerUser * studentsCount;

                result = (int)(result - (result * service.discount) / 100);
            }

            return result;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return -1;
        }
    }


}
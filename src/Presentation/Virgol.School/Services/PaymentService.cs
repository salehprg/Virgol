using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Virgol.Helper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Models;
using Models.User;
using Models.Users.Roles;

public class PaymentService {

    AppDbContext appDbContext;
    PayPingAPI PayPingAPI;
    UserService userService;
    public PaymentService (AppDbContext context , UserManager<UserModel> userManager , string URL)
    {
        appDbContext = context;
        PayPingAPI = new PayPingAPI(appDbContext , URL);
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
            
            int amount = CalculatePrice(paymentsModel , paymentsModel.UserId).amount;

            paymentsModel.amount = amount;
            paymentsModel.payTime = MyDateTime.Now();
            paymentsModel.status = PaymentStatus.pending;
            
            await appDbContext.Payments.AddAsync(paymentsModel);
            await appDbContext.SaveChangesAsync();

            MakePayModel makePayModel = new MakePayModel();
            makePayModel.amount = amount;
            makePayModel.payerIdentity = paymentsModel.UserId.ToString();
            makePayModel.clientRefId = paymentsModel.Id.ToString();
            makePayModel.returnUrl = AppSettings.ServerRootUrl + "/api/Payment/VerifyPayment";

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
                paymentsModel.statusMessage = responseModel.errorMessage;
                paymentsModel.reqId = paymentrefId;

                responseModel.amount = amount;
            }

            if(responseModel.errorCode != "15")
            {
                paymentsModel.status = PaymentStatus.failed;
                paymentsModel.statusMessage = responseModel.errorMessage;
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

    public async Task<bool> UpdateSchoolBalance(PaymentsModel payments)
    {
        try
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
                }
                if(service == ServiceType.BBB)
                {
                    if(school.bbbExpireDate < MyDateTime.Now())
                    {
                        school.bbbExpireDate = MyDateTime.Now().AddMonths(int.Parse(serviceModel.option));
                    }
                }
            }

            int userCount = payments.UserCount;
            List<UserModel> newUsers = appDbContext.Users.Where(x => !x.ConfirmedAcc && x.SchoolId == school.Id).Take(userCount).ToList();

            foreach (var newUser in newUsers)
            {
                newUser.ConfirmedAcc = true;
            }
            appDbContext.Users.UpdateRange(newUsers);

            school.Balance = payments.amount - (newUsers.Count * serviceModel.pricePerUser);
            school.ActiveContract = payments.serviceId;
            await appDbContext.SaveChangesAsync();
            
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return false;
            throw;
        }
    }
    
    public PaymentsModel CalculatePrice(PaymentsModel paymentModel , int managerId)
    {
        try
        {
            SchoolModel school = appDbContext.Schools.Where(x => x.ManagerId == managerId).FirstOrDefault();
            List<UserModel> newUsers = appDbContext.Users.Where(x => !x.ConfirmedAcc && x.SchoolId == school.Id).Take(paymentModel.UserCount).ToList();


            ServicePrice serviceModel = appDbContext.ServicePrices.Where(x => x.Id == paymentModel.serviceId).FirstOrDefault();
            int result = 0;

            if(serviceModel == null)
                return null;


            result = serviceModel.pricePerUser * paymentModel.UserCount;

            DateTime contractDate = (school.adobeExpireDate > MyDateTime.Now() ? school.adobeExpireDate : school.bbbExpireDate);

            if(contractDate > MyDateTime.Now())
            {
                int remainDays = (contractDate - MyDateTime.Now()).Days;
                int contractDays = int.Parse(serviceModel.option) * 30;
                
                result = (remainDays * result) / contractDays;
            }

            
            result = (int)(result - (result * serviceModel.discount) / 100);

            paymentModel.amount = result;

            return paymentModel;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return null;
        }
    }


}
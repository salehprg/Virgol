using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using lms_with_moodle.Helper;
using Models;
using Quartz;
using Models.User;
using Microsoft.Extensions.Options;
using System.Globalization;

namespace Schedule
{
    [DisallowConcurrentExecution]
    public class ServiceErrorCollector : IJob
    {
        private readonly IServiceProvider _provider;
        public ServiceErrorCollector(IServiceProvider provider)
        {
            _provider = provider;
        }

        public Task Execute(IJobExecutionContext exContext)
        {
            try
            {
                using(var scope = _provider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetService<AppDbContext>();
                    var appSetting = scope.ServiceProvider.GetService<IOptions<AppSettings>>().Value;
                    FarazSmsApi smsApi = new FarazSmsApi();

                    string message = "";

                    LDAP_db ldap = new LDAP_db(dbContext);
                    BBBApi bBBApi = new BBBApi(dbContext);
                    
                    var ldapResponse = ldap.CheckStatus();
                    if(!ldapResponse)
                    {
                        message += "سرویس LDAP قطع میباشد";
                    }

                    List<SchoolModel> schools = dbContext.Schools.ToList();;
                    foreach (var school in schools)
                    {
                        if(!string.IsNullOrEmpty(school.bbbURL) && !string.IsNullOrEmpty(school.bbbSecret))
                        {
                            bBBApi.SetConnectionInfo(school.bbbURL , school.bbbSecret);
                            bool bbbResponse = bBBApi.CheckStatus().Result;

                            if(!bbbResponse)
                            {
                                message += System.Environment.NewLine;
                                message += "سرویس BBB مدرسه " + school.SchoolName + " قطع میباشد ";
                            }
                        }

                        if(!string.IsNullOrEmpty(school.AdobeUrl))
                        {
                            AdobeApi adobeApi = new AdobeApi(school.AdobeUrl);
                            bool adobeResult = adobeApi.CheckStatus();

                            if(!adobeResult)
                            {
                                message += System.Environment.NewLine;
                                message += "سرویس adobe مدرسه " + school.SchoolName + " قطع میباشد ";
                            }
                        }
                    }

                    if(!string.IsNullOrEmpty(message))
                    {
                        string[] numbers = {"09154807673" , "09333545494" , "09158030495"};
                        smsApi.SendSms(numbers , message);
                    }
                    
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);
            }

            return Task.CompletedTask;
        }
    }
}
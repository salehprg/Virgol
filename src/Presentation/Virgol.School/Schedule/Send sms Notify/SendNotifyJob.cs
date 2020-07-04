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
    public class SendNotifyJob : IJob
    {
        private readonly IServiceProvider _provider;
        public SendNotifyJob(IServiceProvider provider)
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
                    List<CourseNotify> courseNotifies = dbContext.CourseNotifies.Where(x => !x.Sent 
                                                                                            && (x.CourseTime - DateTime.Now).TotalMinutes <= 30).ToList(); // Courses in next 30 minutes

                    PersianCalendar pc = new PersianCalendar();
                    DateTime courseDateTime = new DateTime();

                    foreach(var courseNotif in courseNotifies)
                    {
                        courseNotif.Sent = true;
                        courseDateTime = courseNotif.CourseTime;

                        FarazSmsApi smsApi = new FarazSmsApi(appSetting);
                        UserModel student = dbContext.Users.Where(x => x.Id == courseNotif.StudentId).FirstOrDefault();
                        string CourseDate = pc.GetDayOfMonth(courseDateTime) + "/" + pc.GetMonth(courseDateTime);

                        string Message = " سلام دانش آموز گرامی " + student.FirstName + " " + student.LastName + " کلاس " 
                                        + courseNotif.CourseName + " شما در تاریخ " + CourseDate 
                                        + " و ساعت " + courseNotif.CourseTime.ToString("hh:mm:ss") + " شروع میشود ";

                        smsApi.SendSms(new String[] {student.PhoneNumber} , Message);

                        dbContext.CourseNotifies.Update(courseNotif);
                        dbContext.SaveChanges();
                    }
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return Task.CompletedTask;
        }
    }
}

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

                    int currentHour = MyDateTime.Now().Hour;
                    float currnetTime = currentHour + (float)MyDateTime.Now().Minute / 60;

                    int dayOfWeek = (int)MyDateTime.Now().DayOfWeek + 2;
                    dayOfWeek = (dayOfWeek > 7 ? dayOfWeek - 7 : dayOfWeek);

                    List<ClassScheduleView> classes = dbContext.ClassScheduleView.Where(x => (x.StartHour - currnetTime) <= 0.5 && (x.StartHour - currnetTime) >=0 && x.DayType == dayOfWeek ).ToList();
                    FarazSmsApi smsApi = new FarazSmsApi();

                    foreach (var schedule in classes)
                    {
                        List<int> studentIds = dbContext.School_StudentClasses.Where(x => x.ClassId == schedule.ClassId).Select(x => x.UserId).ToList();
                        foreach (var studentId in studentIds)
                        {
                            UserModel student = dbContext.Users.Where(x => x.Id == studentId).FirstOrDefault();
                                                            //Prevent from duplicate Sent
                            if(student.PhoneNumber != null && dbContext.CourseNotifies.Where(x => x.UserId == student.Id && x.ScheduleId == schedule.Id).FirstOrDefault() == null)
                            {
                                CourseNotify courseNotify = new CourseNotify();
                                courseNotify.ScheduleId = schedule.Id;
                                courseNotify.UserId = student.Id;
                                courseNotify.SentTime = MyDateTime.Now();

                                float min = (schedule.StartHour - (float)Math.Floor(schedule.StartHour)) * 60;
                                string dateTime = "ساعت " + (int)Math.Floor(schedule.StartHour) + ":" + (min == 0 ? "00" : min.ToString());
                                
                                smsApi.SendScheduleNotify(student.PhoneNumber , student.FirstName + " " + student.LastName , schedule.OrgLessonName , dateTime);

                                dbContext.CourseNotifies.Add(courseNotify);
                                dbContext.SaveChanges();
                            }
                        }
                        UserModel teacher = dbContext.Users.Where(x => x.Id == schedule.TeacherId).FirstOrDefault();
                        if(teacher.PhoneNumber != null && dbContext.CourseNotifies.Where(x => x.UserId == teacher.Id && x.ScheduleId == schedule.Id).FirstOrDefault() == null)
                        {
                            CourseNotify courseNotify = new CourseNotify();
                            courseNotify.ScheduleId = schedule.Id;
                            courseNotify.UserId = teacher.Id;
                            courseNotify.SentTime = MyDateTime.Now();

                            float min = (schedule.StartHour - (float)Math.Floor(schedule.StartHour)) * 60;
                            string dateTime = "ساعت " + (int)Math.Floor(schedule.StartHour) + ":" + (min == 0 ? "00" : min.ToString());
                            
                            smsApi.SendScheduleNotify(teacher.PhoneNumber , teacher.FirstName + " " + teacher.LastName + " معلم ", schedule.OrgLessonName , dateTime);

                            dbContext.CourseNotifies.Add(courseNotify);
                            dbContext.SaveChanges();
                        }
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

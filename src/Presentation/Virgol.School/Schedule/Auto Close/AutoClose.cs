using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Virgol.Helper;
using Models;
using Quartz;
using Models.User;
using Microsoft.Extensions.Options;
using System.Globalization;

namespace Schedule
{
    [DisallowConcurrentExecution]
    public class AutoClose : IJob
    {
        private readonly IServiceProvider _provider;
        public AutoClose(IServiceProvider provider)
        {
            _provider = provider;
        }

        public Task Execute(IJobExecutionContext exContext)
        {
            SchoolModel errorSchool = new SchoolModel();
            try
            {
                using(var scope = _provider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetService<AppDbContext>();
                    var appSetting = scope.ServiceProvider.GetService<IOptions<AppSettings>>().Value;

                    SchoolService schoolService = new SchoolService(dbContext);

                    BBBApi bbbApi = new BBBApi(dbContext);
                    List<SchoolModel> schools = dbContext.Schools.ToList();

                    foreach (var school in schools)
                    {
                        try
                        {
                            errorSchool = school;
                            ServicesModel serviceModel = schoolService.GetSchoolMeetingServices(school.Id).Where(x => x.ServiceType == ServiceType.BBB).FirstOrDefault();

                            if(serviceModel != null)
                            {
                                UserModel manager = dbContext.Users.Where(x => x.Id == school.ManagerId).FirstOrDefault(); 
                                bbbApi.SetConnectionInfo(serviceModel.Service_URL , serviceModel.Service_Key , manager);

                                MeetingsResponse meetingsResponse = bbbApi.GetMeetings().Result; 
                                List<MeetingInfo> newMeetingList = new List<MeetingInfo>();

                                if(meetingsResponse.meetings != null)
                                    newMeetingList = meetingsResponse.meetings.meeting; 

                                List<MeetingView> oldMeetingList = dbContext.MeetingViews.Where(x => x.School_Id == school.Id).ToList(); //Meeting list in our database
                                
                                oldMeetingList = oldMeetingList.Where(x => !x.Finished).ToList();

                                foreach(var oldMeeting in oldMeetingList)
                                {
                                    var closedMeeting = newMeetingList.Where(x => x.meetingID == oldMeeting.MeetingId).FirstOrDefault();
                                    if(closedMeeting == null) // it means a meeting has closed but its state in our database is Active
                                    {
                                        Meeting oldMeetingInfo = dbContext.Meetings.Where(x => x.Id == oldMeeting.Id).FirstOrDefault();

                                        if(oldMeetingInfo.ServiceType == ServiceType.BBB)
                                        {
                                            oldMeetingInfo.Finished = true;
                                            oldMeetingInfo.EndTime = MyDateTime.Now();
                                            dbContext.Meetings.Update(oldMeetingInfo);
                                            dbContext.SaveChanges();
                                        }
                                    }
                                }

                                foreach (var newMeeting in newMeetingList)
                                {
                                    int meetingId = 0;
                                    int.TryParse(newMeeting.meetingID , out meetingId);

                                    var meeting = dbContext.Meetings.Where(x => (x.MeetingId == newMeeting.meetingID || x.Id == meetingId) && x.Finished).FirstOrDefault();
                                    if(meeting != null)
                                    {
                                        meeting.Finished = false;
                                        meeting.MeetingId = newMeeting.meetingID;
                                        dbContext.Meetings.Update(meeting);
                                    }
                                }
                                dbContext.SaveChanges();
                            }
                        }
                        catch (Exception)
                        {
                            Console.WriteLine("Error on : SchoolId = " + errorSchool.Id);
                            //Console.WriteLine(ex.Message);
                            //Console.WriteLine(ex.StackTrace);
                        }
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

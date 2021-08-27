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
    public class CheckAttendeeJob : IJob
    {
        private readonly IServiceProvider _provider;
        public CheckAttendeeJob(IServiceProvider provider)
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

                                if(meetingsResponse != null)
                                {

                                    if(meetingsResponse.meetings != null)
                                        newMeetingList = meetingsResponse.meetings.meeting; 

                                    List<MeetingView> oldMeetingList = dbContext.MeetingViews.Where(x => x.School_Id == school.Id).ToList(); //Meeting list in our database
                                    
                                    foreach(var newMeeting in newMeetingList)
                                    {
                                        MeetingView oldMeetingVW = oldMeetingList.Where(x => x.MeetingId == newMeeting.meetingID && !x.Finished).FirstOrDefault();
                                        if(oldMeetingVW != null)
                                        {
                                            Meeting oldMeetingInfo = dbContext.Meetings.Where(x => x.Id == oldMeetingVW.Id).FirstOrDefault();
                                            if(!oldMeetingInfo.Private) // it means current Meeting exist and active in our database 
                                            {
                                                if(newMeeting.attendees != null)
                                                {
                                                    foreach(var attendee in newMeeting.attendees.attendee.Where(x => x.role != "MODERATOR")) // Participant present in Online Course
                                                    {
                                                        int bbbUserId = -1;
                                                        int.TryParse(attendee.userID , out bbbUserId);
                                                        if(bbbUserId != -1)
                                                        {
                                                            ParticipantInfo participantInfo = dbContext.ParticipantInfos.Where(x => x.MeetingId == oldMeetingVW.Id && x.UserId == bbbUserId).FirstOrDefault();
                                                            if(participantInfo != null)
                                                            {
                                                                participantInfo.PresentCount++;
                                                                participantInfo.IsPresent = (participantInfo.PresentCount / (oldMeetingVW.CheckCount + 1) * 100 ) > 30 ? true : false;
                                                                dbContext.ParticipantInfos.Update(participantInfo);
                                                            }
                                                            else
                                                            {

                                                                ParticipantInfo newAttendee = new ParticipantInfo();
                                                                newAttendee.MeetingId = oldMeetingVW.Id;
                                                                newAttendee.UserId = bbbUserId;
                                                                newAttendee.PresentCount = 1;

                                                                dbContext.ParticipantInfos.Add(newAttendee);
                                                            }
                                                        }
                                                    }
                                                    oldMeetingInfo.CheckCount++;
                                                    dbContext.Update(oldMeetingInfo);

                                                    dbContext.SaveChanges();
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        catch (Exception ex)
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

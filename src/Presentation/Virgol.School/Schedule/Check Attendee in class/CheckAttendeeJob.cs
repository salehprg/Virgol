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
    public class CheckAttendeeJob : IJob
    {
        private readonly IServiceProvider _provider;
        public CheckAttendeeJob(IServiceProvider provider)
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

                    BBBApi bbbApi = new BBBApi(appSetting);

                    MeetingsResponse meetingsResponse = bbbApi.GetMeetings().Result; 
                    List<MeetingInfo> newMeetingList = new List<MeetingInfo>();

                    if(meetingsResponse.meetings != null)
                        newMeetingList = meetingsResponse.meetings.meeting; 

                    List<Meeting> oldMeetingList = dbContext.Meetings.ToList(); //Meeting list in our database
                    
                    foreach(var newMeeting in newMeetingList)
                    {
                        Meeting oldMeeting = oldMeetingList.Where(x => x.BBB_MeetingId == newMeeting.meetingID && !x.Finished).FirstOrDefault();
                        if(oldMeeting != null) // it means current Meeting exist and active in our database 
                        {
                            foreach(var attendee in newMeeting.attendees.attendee.Where(x => x.role != "MODERATOR")) // Participant present in Online Course
                            {
                                ParticipantInfo participantInfo = dbContext.ParticipantInfos.Where(x => x.MeetingId == oldMeeting.Id && x.Moodle_Id == attendee.userID).FirstOrDefault();
                                if(participantInfo != null)
                                {
                                    participantInfo.PresentCount++;
                                    dbContext.ParticipantInfos.Update(participantInfo);
                                }
                                else
                                {
                                    ParticipantInfo newAttendee = new ParticipantInfo();
                                    newAttendee.MeetingId = oldMeeting.Id;
                                    newAttendee.Moodle_Id = attendee.userID;
                                    newAttendee.PresentCount = 1;

                                    dbContext.ParticipantInfos.Add(newAttendee);
                                }
                            }
                            oldMeeting.CheckCount++;
                            dbContext.Update(oldMeeting);
                        }
                        //use this for sync with moodle
                        // else
                        // {
                        //     Meeting meeting = new Meeting();
                        //     meeting.MeetingName = newMeeting.meetingName;
                        //     meeting.BBB_MeetingId = newMeeting.meetingID;
                        //     meeting.StartTime = DateTime.Now;
                        //     meeting.ModeretorId = newMeeting.attendees.attendee.Where(x => x.role == "MODERATOR").FirstOrDefault().userID;
                        //     meeting.Finished = false;
                            
                        //     dbContext.Meetings.Add(meeting);
                        // }
                    }

                    foreach(var oldMeeting in oldMeetingList.Where(x => !x.Finished))
                    {
                        var closedMeeting = newMeetingList.Where(x => x.meetingID == oldMeeting.BBB_MeetingId).FirstOrDefault();
                        if(closedMeeting == null) // it means a meeting has closed but its state in our database is Active
                        {
                            oldMeeting.Finished = true;
                            oldMeeting.EndTime = DateTime.Now;
                            dbContext.Meetings.Update(oldMeeting);
                            dbContext.SaveChanges();
                        }
                    }
                    dbContext.SaveChanges();
                    
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

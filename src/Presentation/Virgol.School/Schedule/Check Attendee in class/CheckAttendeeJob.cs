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

                    BBBApi bbbApi = new BBBApi(dbContext);
                    List<SchoolModel> schools = dbContext.Schools.ToList();

                    foreach (var school in schools)
                    {
                        bbbApi.SetConnectionInfo(school.bbbURL , school.bbbSecret);
                        MeetingsResponse meetingsResponse = bbbApi.GetMeetings().Result; 
                        List<MeetingInfo> newMeetingList = new List<MeetingInfo>();

                        if(meetingsResponse.meetings != null)
                            newMeetingList = meetingsResponse.meetings.meeting; 

                        List<MeetingView> oldMeetingList = dbContext.MeetingViews.Where(x => x.School_Id == school.Id).ToList(); //Meeting list in our database
                        
                        foreach(var newMeeting in newMeetingList)
                        {
                            MeetingView oldMeetingVW = oldMeetingList.Where(x => x.BBB_MeetingId == newMeeting.meetingID && !x.Finished).FirstOrDefault();
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
                                                    participantInfo.IsPresent = (participantInfo.PresentCount / (oldMeetingVW.CheckCount + 1) * 100 ) > 70 ? true : false;
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
                                    }
                                }
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

                        oldMeetingList = oldMeetingList.Where(x => !x.Finished).ToList();

                        foreach(var oldMeeting in oldMeetingList)
                        {
                            var closedMeeting = newMeetingList.Where(x => x.meetingID == oldMeeting.BBB_MeetingId).FirstOrDefault();
                            if(closedMeeting == null) // it means a meeting has closed but its state in our database is Active
                            {
                                Meeting oldMeetingInfo = dbContext.Meetings.Where(x => x.Id == oldMeeting.Id).FirstOrDefault();

                                oldMeetingInfo.Finished = true;
                                oldMeetingInfo.EndTime = MyDateTime.Now();
                                dbContext.Meetings.Update(oldMeetingInfo);
                                dbContext.SaveChanges();
                            }
                        }

                        foreach (var newMeeting in newMeetingList)
                        {
                            int meetingId = 0;
                            int.TryParse(newMeeting.meetingID , out meetingId);

                            var meeting = dbContext.Meetings.Where(x => (x.BBB_MeetingId == newMeeting.meetingID || x.Id == meetingId) && x.Finished).FirstOrDefault();
                            if(meeting != null)
                            {
                                meeting.Finished = false;
                                meeting.BBB_MeetingId = newMeeting.meetingID;
                                dbContext.Meetings.Update(meeting);
                            }
                        }
                        dbContext.SaveChanges();
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

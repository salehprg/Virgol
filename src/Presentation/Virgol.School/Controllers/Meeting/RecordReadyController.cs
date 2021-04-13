using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

using Virgol.Helper;

using Models.User;
using Microsoft.AspNetCore.Http;
using Models.Users.Roles;
using Models;

[ApiController]
[Route("api/[controller]/[action]")]
public class RecordReadyController : ControllerBase
{
    private readonly AppDbContext appDbContext;
    private readonly UserManager<UserModel> userManager;
    private readonly MeetingService meetingService;
    UserService UserService;
    SchoolService schoolService;

    public RecordReadyController(AppDbContext dbContext
                            , RoleManager<IdentityRole<int>> _roleManager
                            , UserManager<UserModel> _userManager)
    {
        appDbContext = dbContext;
        userManager = _userManager;

        UserService = new UserService(userManager , appDbContext);
        meetingService = new MeetingService(appDbContext , UserService);
        schoolService = new SchoolService(appDbContext);

    }

    public async Task<IActionResult> PublishMeeting(int meetingId)
    {
        try
        {
            Meeting meeting = appDbContext.Meetings.Where(x => x.Id == meetingId).FirstOrDefault();
            if(meeting != null)
            {
                ServicesModel servicesModel = appDbContext.Services.Where(x => x.Id == meeting.ServiceId).FirstOrDefault();
                BBBApi bbbApi = new BBBApi(appDbContext);
                bbbApi.SetConnectionInfo(servicesModel.Service_URL , servicesModel.Service_Key);

                RecordsResponse response = await bbbApi.GetMeetingRecords(meetingId.ToString());

                Console.WriteLine(response.recordings);
                if(response != null)
                {
                    Recordings recordings = (response).recordings;

                    if(recordings != null)
                    {
                        List<RecordInfo> records = recordings.recording;
                        if(records.Count > 0)
                        {
                            Console.WriteLine("going to save Data in DB !");

                            meeting.RecordURL = records[0].playback.format[0].url;
                            meeting.RecordId = records[0].recordID;

                            appDbContext.Meetings.Update(meeting);
                            await appDbContext.SaveChangesAsync();
                        }
                    }
                }
            }

            return Ok(true);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return BadRequest(false);
            throw;
        }
    }
}

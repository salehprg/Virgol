using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Virgol.Helper;
using Microsoft.AspNetCore.Identity;
using Models;
using Models.StreamApi;
using Models.User;

public class StreamService {

    UserManager<UserModel> userManager;
    UserService userService;
    AppDbContext appDbContext;
    StreamApi streamApi;
    
    string APIURL = "";
    const string APIUserName = "streamAPI";
    const string APIPassword = "Saleh-1379";

    public StreamService (UserManager<UserModel> _userManager , AppDbContext _appDbContext)
    {
        userManager = _userManager;
        appDbContext = _appDbContext;

        userService = new UserService(userManager , appDbContext);
        APIURL = AppSettings.GetValueFromDatabase(appDbContext , "StreamApiURL");
    }

    public ServicesModel GetServicesInfo(int serviceId)
    {
        try
        {
            if(serviceId == 0)
                return null;

            ServicesModel result = appDbContext.Services.Where(x => x.Id == serviceId && x.ServiceType == ServiceType.Stream).FirstOrDefault();
            if(result != null)
            {
                return result;
            }

            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            return null;
        }
    }

    public bool CheckInterupt(DateTime startTime , DateTime endTime , int id = 0) 
    {
        List<StreamModel> streamInterupts = appDbContext.Streams.Where(x => (x.StartTime >= startTime && x.StartTime < endTime) || // Check oldClass Start time between new class Time
                                                                        (x.StartTime <= startTime && x.EndTime > endTime)).ToList(); // Check newClass Start Time between oldClass Time
        
        streamInterupts = streamInterupts.Where(x => x.Id != id).ToList();
        if(streamInterupts.Count > 0)
        {
            return false;
        }

        return true;
    }

    //for Join User into stream
    public StreamModel GetActiveStream(UserModel user)
    {
        try
        {
            List<StreamModel> streams = appDbContext.Streams.Where(x => x.StartTime <= MyDateTime.Now().AddMinutes(15) && x.EndTime > MyDateTime.Now() && x.isActive).ToList();
            foreach (var stream in streams)
            {
                List<int> allowedRoles = stream.getAllowedRolesList();
                foreach (var allowedRole in allowedRoles)
                {
                    string roleName = appDbContext.Roles.Where(x => x.Id == allowedRole).FirstOrDefault().Name;
                    if(userService.HasRole(user , roleName))        
                    {
                        return stream;
                    }
                }
            }

            return null;
        }
        catch (System.Exception)
        {
            return null;
        }
    }
    
    //show Current active stream to streamer
    public StreamModel GetCurrentStream(int streamerId)
    {
        StreamModel streamModel = appDbContext.Streams.Where(x => x.StreamerId == streamerId && 
                                                            (x.StartTime <= MyDateTime.Now().AddMinutes(15) && x.EndTime >= MyDateTime.Now())).FirstOrDefault();
        return streamModel;
    }

    public List<StreamModel> GetFutureStreams(int streamerId = 0)
    {
        List<StreamModel> streamModels = new List<StreamModel>();

        if(streamerId != 0)
        {
            streamModels = appDbContext.Streams.Where(x => x.StreamerId == streamerId && x.StartTime >= MyDateTime.Now() && !x.isActive).ToList();
        }
        else
        {
            streamModels = appDbContext.Streams.Where(x => x.StartTime >= MyDateTime.Now() && !x.isActive).ToList();
        }

        return streamModels;
    }
    
    public async Task<List<StreamModel>> GetEndedStreams(int userId)
    {
        List<StreamModel> streamModels = appDbContext.Streams.Where(x => x.StreamerId == userId && x.EndTime <= MyDateTime.Now()).ToList();

        List<StreamModel> changedStatus = new List<StreamModel>();

        foreach (var stream in streamModels)
        {
            if(stream.isActive)
            {
                stream.isActive = false;

                changedStatus.Add(stream);
            }
        }

        appDbContext.Streams.UpdateRange(changedStatus);
        await appDbContext.SaveChangesAsync();

        return streamModels;
    }
    
    public async Task<bool> ReserveStream(UserModel streamerUser , ServicesModel meetingServiceModel , StreamModel stream)
    {
        try
        {
            StreamApi loginStream = new StreamApi(APIURL , "");
            string token = await loginStream.Login(APIUserName , APIPassword);
            
            StreamApi streamApi = new StreamApi(APIURL , token);

            int serviceId = 0;

            List<StreamServicesModel> services = await streamApi.GetServicesList();

            StreamServicesModel servicesModel = services.Where(x => x.Service_URL == meetingServiceModel.Service_URL).FirstOrDefault();
            if(servicesModel == null)
            {
                servicesModel = new StreamServicesModel();
                servicesModel.Service_URL = meetingServiceModel.Service_URL;
                servicesModel.Service_Key = meetingServiceModel.Service_Key;

                serviceId = await streamApi.AddServiceInfo(servicesModel);
            }
            else
            {
                serviceId = servicesModel.Id;
            }

            CreateMeeting createMeeting = new CreateMeeting();
            createMeeting.Meetingname = stream.StreamName;
            createMeeting.ServiceId = serviceId;

            CreateResponse response = await streamApi.CreateStreamRoom(createMeeting);
            
            if(response != null)
            {
                stream.OBS_Link = response.rtmpLink;
                stream.MeetingId = response.MeetingId;
                stream.JoinLink = response.attendeeLink;
                stream.StreamerId = streamerUser.Id;
                stream.isActive = false;
                stream.setAllowedRolesList();
                
                await appDbContext.Streams.AddAsync(stream);
                await appDbContext.SaveChangesAsync();

                return true;
            }

            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return false;
        }
    }

    public async Task<bool> EditStream(StreamModel stream )
    {
        try
        {
            stream.setAllowedRolesList();

            appDbContext.Streams.Update(stream);
            await appDbContext.SaveChangesAsync();

            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return false;
        }
    }

    public async Task<bool> RemoveStream(int streamId)
    {
        try
        {
            StreamModel streamModel = appDbContext.Streams.Where(x => x.Id == streamId).FirstOrDefault();
            UserModel userModel = appDbContext.Users.Where(x => x.Id == streamModel.StreamerId).FirstOrDefault();
            SchoolModel school = appDbContext.Schools.Where(x => x.ManagerId == userModel.Id).FirstOrDefault();


            StreamApi loginStream = new StreamApi(APIURL , "");
            string token = await loginStream.Login(APIUserName , APIPassword);
            
            StreamModel stream = appDbContext.Streams.Where(x => x.Id == streamId).FirstOrDefault();

            StreamApi streamApi = new StreamApi(APIURL , token);
            bool result = await streamApi.EndRoom(stream.MeetingId);

            if(result)
            {
                appDbContext.Streams.Remove(stream);
                await appDbContext.SaveChangesAsync();
            }

            return result;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return false;
        }
    }

    public async Task<bool> StartStream(int streamId , int streamerId)
    {
        try
        {
            StreamModel stream = appDbContext.Streams.Where(x => x.Id == streamId && x.isActive == true && 
                                                            x.StartTime <= MyDateTime.Now() &&
                                                            x.EndTime > MyDateTime.Now()).FirstOrDefault();
            if(stream != null)
            {
                stream.isActive = true;
                appDbContext.Streams.Update(stream);
                await appDbContext.SaveChangesAsync();

                return true;
            }

            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return false;
        }
    }

    public string JoinStream(int streamId , UserModel user)
    {
        try
        {
            UserService userService = new UserService(userManager , appDbContext);

            StreamModel stream = appDbContext.Streams.Where(x => x.Id == streamId && x.isActive == true &&
                                                            x.StartTime <= MyDateTime.Now() &&
                                                            x.EndTime > MyDateTime.Now()).FirstOrDefault();

            if(stream != null)
            {
                List<int> allowedRoles = stream.getAllowedRolesList();
                foreach (var allowedRole in allowedRoles)
                {
                    string roleName = appDbContext.Roles.Where(x => x.Id == allowedRole).FirstOrDefault().Name;
                    if(userService.HasRole(user , roleName))        
                    {
                        return stream.JoinLink;
                    }
                }
            }

            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Console.WriteLine(ex.StackTrace);

            return null;
        }
    }


    private void RefreshStreamStatus()
    {
        List<StreamModel> streamModels = appDbContext.Streams.Where(x => x.EndTime <= MyDateTime.Now() && x.isActive).ToList();
        foreach (var stream in streamModels)
        {
            stream.isActive = false;
        }

        appDbContext.Streams.UpdateRange(streamModels);
        appDbContext.SaveChangesAsync();
        
    }
}
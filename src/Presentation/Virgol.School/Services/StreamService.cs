using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Models;
using Models.User;

public class StreamService {

    UserManager<UserModel> userManager;
    UserService userService;
    AppDbContext appDbContext;
    public StreamService (UserManager<UserModel> _userManager , AppDbContext _appDbContext)
    {
        userManager = _userManager;
        appDbContext = _appDbContext;

        userService = new UserService(userManager , appDbContext);
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
    public async Task<bool> ReserveStream(StreamModel stream , UserModel streamerUser , string streamBaseUrl)
    {
        try
        {

            string key = RandomPassword.GeneratePassword(true , true , true , 8);
            string joinLink = streamBaseUrl.Replace("{key}" , key);

            int attempts = 0;

            //prevent duplicate key
            while(appDbContext.Streams.Where(x => x.JoinLink == joinLink).FirstOrDefault() != null || attempts == 5)
            {
                key = RandomPassword.GeneratePassword(true , true , true , 8);
                joinLink = streamBaseUrl.Replace("{key}" , key);

                attempts++;
            }
            

            stream.OBS_Link = "rtmp://conf.legace.ir/stream";
            stream.OBS_Key = key;
            stream.JoinLink = joinLink;
            stream.StreamerId = streamerUser.Id;
            stream.isActive = false;
            stream.setAllowedRolesList();
            
            await appDbContext.Streams.AddAsync(stream);
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

    public async Task<bool> RemoveStream(int streamId )
    {
        try
        {
            StreamModel stream = appDbContext.Streams.Where(x => x.Id == streamId).FirstOrDefault();

            appDbContext.Streams.Remove(stream);
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
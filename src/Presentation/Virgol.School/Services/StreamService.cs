using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Models;
using Models.User;

public class StreamService {

    UserManager<UserModel> userManager;
    AppDbContext appDbContext;
    public StreamService (UserManager<UserModel> _userManager , AppDbContext _appDbContext)
    {
        userManager = _userManager;
        appDbContext = _appDbContext;
    }

    public bool CheckInterupt(DateTime startTime , DateTime endTime) 
    {
        List<StreamModel> streamInterupts = appDbContext.Streams.Where(x => (x.StartTime >= startTime && x.StartTime < endTime) || // Check oldClass Start time between new class Time
                                                                        (x.StartTime <= startTime && x.EndTime > endTime)).ToList(); // Check newClass Start Time between oldClass Time

        if(streamInterupts.Count > 0)
        {
            return false;
        }

        return true;
    }

    public StreamModel GetCurrentStream(int userId)
    {
        StreamModel streamModel = appDbContext.Streams.Where(x => x.StreamerId == userId && 
                                                            (x.StartTime <= MyDateTime.Now().AddMinutes(15) && x.EndTime >= MyDateTime.Now())).FirstOrDefault();
        return streamModel;
    }

    public List<StreamModel> GetFutureStreams(int userId)
    {
        List<StreamModel> streamModels = appDbContext.Streams.Where(x => x.StreamerId == userId && x.StartTime >= MyDateTime.Now() && !x.started).ToList();
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
                stream.started = true;
                stream.isActive = false;

                changedStatus.Add(stream);
            }
        }

        appDbContext.Streams.UpdateRange(changedStatus);
        await appDbContext.SaveChangesAsync();

        return streamModels;
    }
    public async Task<bool> ReserveStream(StreamModel stream , UserModel streamerUser)
    {
        try
        {
            stream.OBS_Link = "rtmp://conf.legace.ir/stream";
            stream.OBS_Key = "livestream";
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

    public async Task<bool> StartStream(int streamId , int streamerId)
    {
        try
        {
            //Just for close Active stream
            List<StreamModel> activeStreams = appDbContext.Streams.Where(x => x.isActive == true).ToList();
            foreach (var activeStream in activeStreams)
            {
                if(activeStream.EndTime <= MyDateTime.Now())
                {
                    activeStream.isActive = false;
                    activeStream.started = true;
                    appDbContext.Streams.Update(activeStream);
                    await appDbContext.SaveChangesAsync();
                }
            }

            activeStreams = appDbContext.Streams.Where(x => x.isActive == true).ToList();
            if(activeStreams.Count > 0)
            {
                return false;
            }

            StreamModel stream = appDbContext.Streams.Where(x => x.Id == streamId && x.isActive == true && 
                                                            x.StartTime <= MyDateTime.Now() &&
                                                            x.EndTime > MyDateTime.Now()).FirstOrDefault();
            if(stream != null)
            {
                stream.isActive = true;
                stream.started = true;
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

    public string JoinStream(int streamId)
    {
        try
        {
            StreamModel stream = appDbContext.Streams.Where(x => x.Id == streamId && x.isActive == true && 
                                                            x.StartTime <= MyDateTime.Now() &&
                                                            x.EndTime > MyDateTime.Now()).FirstOrDefault();

            if(stream != null)
            {
                return stream.JoinLink;
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

}
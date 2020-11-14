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
        List<Stream> streamInterupts = appDbContext.Streams.Where(x => (x.StartTime >= startTime && x.StartTime < endTime) || // Check oldClass Start time between new class Time
                                                                        (x.StartTime <= startTime && x.EndTime > endTime)).ToList(); // Check newClass Start Time between oldClass Time

        if(streamInterupts.Count > 0)
        {
            return false;
        }

        return true;
    }
    public async Task<bool> ReserveStream(DateTime startTime , DateTime endTime , string streamName , UserModel streamerUser)
    {
        try
        {
            Stream stream = new Stream();
            stream.StartTime = startTime;
            stream.EndTime = endTime;
            stream.StreamName = streamName;
            stream.OBS_Link = "rtmp://conf.legace.ir/stream";
            stream.OBS_Key = "livestream";
            stream.StreamerId = streamerUser.Id;
            stream.isActive = false;
            
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
            List<Stream> activeStreams = appDbContext.Streams.Where(x => x.isActive == true).ToList();
            foreach (var activeStream in activeStreams)
            {
                if(activeStream.EndTime <= MyDateTime.Now())
                {
                    activeStream.isActive = false;
                    appDbContext.Streams.Update(activeStream);
                    await appDbContext.SaveChangesAsync();
                }
            }

            activeStreams = appDbContext.Streams.Where(x => x.isActive == true).ToList();
            if(activeStreams.Count > 0)
            {
                return false;
            }

            Stream stream = appDbContext.Streams.Where(x => x.Id == streamId && x.isActive == false && 
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

    public string JoinStream(int streamId)
    {
        try
        {
            Stream stream = appDbContext.Streams.Where(x => x.Id == streamId && x.isActive == true && 
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
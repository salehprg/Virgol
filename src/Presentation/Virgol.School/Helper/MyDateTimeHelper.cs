using System;
using System.Net;
using GuerrillaNtp;

public class MyDateTime {

    static int Hour = 3;
    static int Minute = 30;

    //For local test
    //static int Hour = 0;
    //static int Minute = 30;
    public static DateTime Now(){
        DateTime result = DateTime.UtcNow;
        DateTime ntpTime = GetNtpTime();

        result = result.AddHours(Hour);
        result = result.AddMinutes(Minute);

        string devStatus = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

        if(devStatus == "Development")
        {
            result = DateTime.Now;
        }
        
        return result;
    }

    public static int convertDayOfWeek(DateTime time)
    {
        //Console.WriteLine("Convert day Time = " + time);

        //Console.WriteLine("Day week = " + (int)time.DayOfWeek);

        int dayOfWeek = (int)time.DayOfWeek + 2;
        dayOfWeek = (dayOfWeek > 7 ? dayOfWeek - 7 : dayOfWeek);

        //Console.WriteLine("Converted Day week = " + dayOfWeek);

        return dayOfWeek;
    }

    private static DateTime GetNtpTime()
    {
        TimeSpan offset;
        try
        {
            using (var ntp = new NtpClient(Dns.GetHostAddresses("ir.pool.ntp.org")[0]))
                offset = ntp.GetCorrectionOffset();
        }
        catch (Exception ex)
        {
            // timeout or bad SNTP reply
            offset = TimeSpan.Zero;
        }

        // use the offset throughout your app
        DateTime accurateTime = DateTime.UtcNow + offset;

        return accurateTime;
    }
}

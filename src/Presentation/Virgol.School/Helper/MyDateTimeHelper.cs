using System;
using System.Globalization;
using System.Net;
using Yort.Ntp;

public class MyDateTime {
    static int OffsetHour = 4 ;
    static int OfssetMinute = 30;

    public static DateTime Now(){
        DateTime result = DateTime.UtcNow;


        result = result.AddHours(OffsetHour);
        result = result.AddMinutes(OfssetMinute);

        string devStatus = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

        if(devStatus == "Development")
        {
            result = DateTime.Now;
        }
        
        Console.WriteLine(result);
        return result;
    }

    public static DateTime ConvertToServerTime(DateTime dateTime){
        DateTime result = dateTime;

        result = result.AddHours(OffsetHour);
        result = result.AddMinutes(OfssetMinute);
        
        return result;
    }

    ///<summary>
    ///2 = Fard , 1 = Zoj
    ///</summary>
    public static int OddEven_Week(DateTime time)
    {
        CultureInfo culture = new CultureInfo("fa-Ir");
        Calendar calendar = culture.Calendar;

        int weekCount = calendar.GetWeekOfYear(time , CalendarWeekRule.FirstDay , DayOfWeek.Saturday);
        return (weekCount % 2 == 0 ? 1 : 2);
    }

    public static int convertDayOfWeek(DateTime time)
    {
        int dayOfWeek = (int)time.DayOfWeek + 2;
        dayOfWeek = (dayOfWeek > 7 ? dayOfWeek - 7 : dayOfWeek);

        return dayOfWeek;
    }
}

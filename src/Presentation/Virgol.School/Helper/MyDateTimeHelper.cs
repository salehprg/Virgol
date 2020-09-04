using System;

public class MyDateTime {

    static int Hour = 4;
    static int Minute = 30;

    //For local test
    //static int Hour = 0;
    //static int Minute = 30;
    public static DateTime Now(){
        DateTime result = DateTime.UtcNow;

        result = result.AddHours(Hour);
        result = result.AddMinutes(Minute);

        Console.WriteLine("UTC Now = " + DateTime.UtcNow);
        Console.WriteLine("Date Now = " + DateTime.Now.Date);
        
        return result;
    }

    public static int convertDayOfWeek(DateTime time)
    {
        Console.WriteLine("Convert day Time = " + time);

        Console.WriteLine("Day week = " + (int)time.DayOfWeek);

        int dayOfWeek = (int)time.DayOfWeek + 2;
        dayOfWeek = (dayOfWeek > 7 ? dayOfWeek - 7 : dayOfWeek);

        Console.WriteLine("Converted Day week = " + dayOfWeek);

        return dayOfWeek;
    }
}
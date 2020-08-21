using System;

public class MyDateTime {

    static int Hour = 4;
    static int Minute = 30;
    public static DateTime Now(){
        DateTime result = DateTime.UtcNow;

        result = result.AddHours(Hour);
        result = result.AddMinutes(Minute);
        
        return result;
    }
}
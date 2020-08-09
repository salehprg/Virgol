using System.Collections.Generic;

public static class ConvertToPersian {
    public static string PersianToEnglish(string persianStr)
    {
        Dictionary<char, char> LettersDictionary = new Dictionary<char, char>
        {
            ['۰'] = '0',['۱'] = '1',['۲'] = '2',['۳'] = '3',['۴'] = '4',['۵'] = '5',['۶'] = '6',['۷'] = '7',['۸'] = '8',['۹'] = '9'
        };

        foreach (var item in persianStr)
        {
            try
            {
                persianStr = persianStr.Replace(item, LettersDictionary[item]);
            }
            catch{}
        }
        
        return persianStr;
    }

}
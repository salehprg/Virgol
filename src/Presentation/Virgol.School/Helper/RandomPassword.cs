using System;

class RandomPassword
{

   const string LOWER_CASE = "abcdefghijklmnopqursuvwxyz";
   const string UPPER_CAES = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   const string NUMBERS = "1234567890";

    public static string GeneratePassword(bool useLowercase, bool useUppercase, bool useNumbers,int passwordSize)
    {
        char[] _password = new char[passwordSize];
        string charSet = ""; // Initialise to blank
        System.Random _random = new Random();

        // Build up the character set to choose from
        if (useLowercase) charSet += LOWER_CASE;

        if (useUppercase) charSet += UPPER_CAES;

        if (useNumbers) charSet += NUMBERS;

        for (int counter = 0; counter < passwordSize; counter++)
        {
            _password[counter] = charSet[_random.Next(charSet.Length - 1)];
        }

        return String.Join(null, _password);
    }
}

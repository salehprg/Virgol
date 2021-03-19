using Virgol.FarazSms;
using Virgol.Helper;

namespace Virgol.Services
{
    public enum SMSProvider
    {
        Negin ,
        Faraz
    };
    
    public class SMSService
    {
        string Username;
        string Password;
        string URL;
        string SenderNumber;
        SMSProvider provider;

        SMSService(string _username , string _password , string _URL , string _SenderNumber , SMSProvider _provider)
        {
            Username = _username;
            Password = _password;
            URL = _URL;
            SenderNumber = _SenderNumber;
            provider = _provider;
        }
        public bool SendVerifySms(string Number , string personName , string code)
        {
            switch(provider)   
            {
                case SMSProvider.Faraz :
                    FarazSmsApi faraz = new FarazSmsApi();
                    return faraz.SendVerifySms(Number , personName , code);

                case SMSProvider.Negin :
                    NeginAPI neginAPI = new NeginAPI(URL , Username , Password , SenderNumber);
                    return neginAPI.SendVerifySms(Number , personName , code);
            }

            return false;
        }

        public bool SendSchoolData(string Number , string schoolName , string personName , string password)
        {
            switch(provider)   
            {
                case SMSProvider.Faraz :
                    FarazSmsApi faraz = new FarazSmsApi();
                    return faraz.SendSchoolData(Number , schoolName , personName , password);

                case SMSProvider.Negin :
                    NeginAPI neginAPI = new NeginAPI(URL , Username , Password , SenderNumber);
                    return neginAPI.SendSchoolData(Number , schoolName , personName , password);
            }

            return false;
        }

        public bool SendScheduleNotify(string Number , string personName , string className , string dateTime)
        {
            switch(provider)   
            {
                case SMSProvider.Faraz :
                    FarazSmsApi faraz = new FarazSmsApi();
                    return faraz.SendScheduleNotify(Number , personName , className , dateTime);

                case SMSProvider.Negin :
                    NeginAPI neginAPI = new NeginAPI(URL , Username , Password , SenderNumber);
                    return neginAPI.SendScheduleNotify(Number , personName , className , dateTime);
            }

            return false;
        }

        public bool SendErrorCollecotr(string Numbers , string serviceError , string singularPlural)
        {
            switch(provider)   
            {
                case SMSProvider.Faraz :
                    FarazSmsApi faraz = new FarazSmsApi();
                    return faraz.SendErrorCollecotr(Numbers , serviceError , singularPlural);

                case SMSProvider.Negin :
                    NeginAPI neginAPI = new NeginAPI(URL , Username , Password , SenderNumber);
                    return neginAPI.SendErrorCollecotr(Numbers , serviceError , singularPlural);
            }

            return false;
        }

        public bool SendSms(string[] Numbers , string Message)
        {
            switch(provider)   
            {
                case SMSProvider.Faraz :
                    FarazSmsApi faraz = new FarazSmsApi();
                    return faraz.SendSms(Numbers , Message);

                case SMSProvider.Negin :
                    NeginAPI neginAPI = new NeginAPI(URL , Username , Password , SenderNumber);
                    return neginAPI.SendSms(Numbers , Message);
            }

            return false;
        }
    }
}
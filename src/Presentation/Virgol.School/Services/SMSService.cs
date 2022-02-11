using Virgol.FarazSms;
using Virgol.Helper;
using Virgol.School.Models;

namespace Virgol.Services
{
    public enum SMSProvider
    {
        Negin ,
        Faraz
    };
    
    public class SMSService
    {
        SMSProvider provider;
        SMSServiceModel serviceModel;

        public SMSService(SMSServiceModel _serviceModel)
        {
            serviceModel = _serviceModel;

            if(_serviceModel.ServiceName == "Faraz")
                provider = SMSProvider.Faraz;

            if(_serviceModel.ServiceName == "Negin")
                provider = SMSProvider.Negin;
        }
        public SMSService(SMSServiceModel _serviceModel , SMSProvider _provider)
        {
            serviceModel = _serviceModel;
            provider = _provider;
        }
        public bool SendVerifySms(string Number , string personName , string code , string pattern = "")
        {
            switch(provider)   
            {
                case SMSProvider.Faraz :
                    FarazSmsApi faraz = new FarazSmsApi(serviceModel);
                    return faraz.SendVerifySms(Number , personName , code);

                case SMSProvider.Negin :
                    NeginAPI neginAPI = new NeginAPI(serviceModel);
                    return neginAPI.SendVerifySms(Number , personName , code , pattern);
            }

            return false;
        }

        public bool SendSchoolData(string Number , string schoolName , string personName , string password, string pattern = "")
        {
            switch(provider)   
            {
                case SMSProvider.Faraz :
                    FarazSmsApi faraz = new FarazSmsApi(serviceModel);
                    return faraz.SendSchoolData(Number , schoolName , personName , password);

                case SMSProvider.Negin :
                    NeginAPI neginAPI = new NeginAPI(serviceModel);
                    return neginAPI.SendSchoolData(Number , schoolName , personName , password , pattern);
            }

            return false;
        }

        public bool SendScheduleNotify(string Number , string personName , string className , string dateTime , string pattern = "")
        {
            switch(provider)   
            {
                case SMSProvider.Faraz :
                    FarazSmsApi faraz = new FarazSmsApi(serviceModel);
                    return faraz.SendScheduleNotify(Number , personName , className , dateTime);

                case SMSProvider.Negin :
                    NeginAPI neginAPI = new NeginAPI(serviceModel);
                    return neginAPI.SendScheduleNotify(Number , personName , className , dateTime , pattern);
            }

            return false;
        }

        public bool SendErrorCollecotr(string Numbers , string serviceError , string singularPlural)
        {
            switch(provider)   
            {
                case SMSProvider.Faraz :
                    FarazSmsApi faraz = new FarazSmsApi(serviceModel);
                    return faraz.SendErrorCollecotr(Numbers , serviceError , singularPlural);

                case SMSProvider.Negin :
                    NeginAPI neginAPI = new NeginAPI(serviceModel);
                    return neginAPI.SendErrorCollecotr(Numbers , serviceError , singularPlural);
            }

            return false;
        }

        public bool SendSms(string[] Numbers , string Message)
        {
            switch(provider)   
            {
                case SMSProvider.Faraz :
                    FarazSmsApi faraz = new FarazSmsApi(serviceModel);
                    return faraz.SendSms(Numbers , Message);

                case SMSProvider.Negin :
                    NeginAPI neginAPI = new NeginAPI(serviceModel);
                    return neginAPI.SendSms(Numbers , Message);
            }

            return false;
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

using System.Text.Json;
using System.Text.Json.Serialization;

using System.Net;
using System.IO;
using System.Text;
using Newtonsoft.Json;
using Virgol.Helper;
using System.Net.Http;
using System.Net.Http.Headers;
using Virgol.FarazSms;
using Virgol.School.Models;

namespace Virgol.Helper
{
    public class NeginAPI {
        
        private string Username;
        private string Password;
        private string BaseUrl;
        private string FromNumber;

        public NeginAPI(string APIUrl , string _Username , string _Password , string _FromNumber)
        {
            BaseUrl = APIUrl;
            Username = _Username;
            Password = _Password;
            FromNumber = _FromNumber;
        }   

        bool SendData(string JsonData , string Method)
        {
            bool result = false;

            using (var client = new HttpClient())
            {
                HttpResponseMessage responseMessage = client.PostAsync(BaseUrl + Method, 
                    new StringContent(JsonData, Encoding.UTF8, "application/json")).Result;
                    
                NeginSMS neginSMS = JsonConvert.DeserializeObject<NeginSMS>(responseMessage.Content.ReadAsStringAsync().Result);

                result = neginSMS.status == "-1";
            }

            return result;
		
        }
        public bool SendVerifySms(string Number , string userName , string code)
        {
            ForgotPassword forgotPassword = new ForgotPassword();
            forgotPassword.verificationCode = code;
            forgotPassword.userName = userName;

            SendPatternModel<ForgotPassword> patternModel = new SendPatternModel<ForgotPassword>();

            patternModel.pattern_code = "5qhnalxjc0";
            patternModel.originator = FromNumber;
            patternModel.recipient = Number;
            patternModel.values = forgotPassword;

            string json = JsonConvert.SerializeObject(patternModel);

            // string postData = "op=send&uname=" + Username + "&pass=" + Password + "&message=" + Message +"&to="+json+"&from=+98" + FromNumber;

            return SendData(json , "/v1/messages/patterns/send");
            
        }

        public bool SendSchoolData(string Number , string schoolName , string userName , string password)
        {
            SchoolDataSMS schoolDataSMS = new SchoolDataSMS();
            schoolDataSMS.schoolName = schoolName;
            schoolDataSMS.userName = userName;
            schoolDataSMS.password = password;

            SendPatternModel<SchoolDataSMS> patternModel = new SendPatternModel<SchoolDataSMS>();

            patternModel.pattern_code = "9zgw29uffx";
            patternModel.originator = FromNumber;
            patternModel.recipient = Number;
            patternModel.values = schoolDataSMS;

            string json = JsonConvert.SerializeObject(patternModel);

            return SendData(json , "/v1/messages/patterns/send");

            //return true;
        }

        public bool SendScheduleNotify(string Number , string userName , string className , string dateTime)
        {
            NotifySMSModel notifySMSModel = new NotifySMSModel();
            notifySMSModel.userName = userName;
            notifySMSModel.className = className;
            notifySMSModel.dateTime = dateTime;

            SendPatternModel<NotifySMSModel> patternModel = new SendPatternModel<NotifySMSModel>();

            patternModel.pattern_code = "cwf9r8lirp";
            patternModel.originator = FromNumber;
            patternModel.recipient = Number;
            patternModel.values = notifySMSModel;

            string json = JsonConvert.SerializeObject(patternModel);

            //return SendData(json , "/v1/messages/patterns/send");
            return true;
        }

        public bool SendErrorCollecotr(string Numbers , string serviceError , string singularPlural)
        {
            ErrorCollectorModel errorCollector = new ErrorCollectorModel();
            errorCollector.serviceName = serviceError;
            errorCollector.singularPlural = singularPlural;

            SendPatternModel<ErrorCollectorModel> patternModel = new SendPatternModel<ErrorCollectorModel>();

            patternModel.pattern_code = "8sa6tt73ni";
            patternModel.originator = FromNumber;
            patternModel.recipient = Numbers;
            patternModel.values = errorCollector;

            string json = JsonConvert.SerializeObject(patternModel);

            // string postData = "op=send&uname=" + Username + "&pass=" + Password + "&message=" + Message +"&to="+json+"&from=+98" + FromNumber;

            return SendData(json , "/v1/messages/patterns/send");
        }

        public bool SendSms(string[] Numbers , string Message)
        {
            SendSmsModel smsModel = new SendSmsModel();

            smsModel.originator = FromNumber;
            smsModel.recipients = Numbers;
            smsModel.message = Message;

            string json = JsonConvert.SerializeObject(smsModel);

            // string postData = "op=send&uname=" + Username + "&pass=" + Password + "&message=" + Message +"&to="+json+"&from=+98" + FromNumber;

            return SendData(json , "/v1/messages");
        }


        // public string SendSocial(string[] Numbers , string Message , SocialType _social)
        // {
        //     string json = JsonConvert.SerializeObject(Numbers);

        //     string SocialName = "";

        //     switch(_social)
        //     {
        //         case SocialType.Telegram:
        //             SocialName = "telegram";
        //             break;

        //         case SocialType.Viber :
        //             SocialName = "Viber";
        //             break;
        //     }

        //     string postData = "op=sendsocial&uname" + Username + "&pass=" + Password + "&message=" + Message +"&to="+json+"&from=+98" + FromNumber + "&type=" + SocialName;

        //     return SendData(postData);
        // }
        
        // public string GetCredit(string[] Numbers , string Message)
        // {
        //     string json = JsonConvert.SerializeObject(Numbers);

        //     string postData = "op=credit&uname" + Username + "&pass=" + Password;

        //     return SendData(postData , true);
        // }
        
    }
}
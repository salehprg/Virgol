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
using Virgol.School.Models;
using Virgol.School.Models.SMS.NeginAPI;

namespace Virgol.Helper
{
    public class NeginAPI {
        
        private string Username;
        private string Password;
        private string BaseUrl;
        private string FromNumber;

        public NeginAPI(SMSServiceModel serviceModel)
        {
            Username = serviceModel.Username;
            Password = serviceModel.Password;
            BaseUrl = serviceModel.URL;
            FromNumber = serviceModel.SendNumber;
        }   

        bool SendData(SimpleSend data)
        {
            data.username = Username;
            data.password = Password;
            data.line = FromNumber;

            string JsonData = JsonConvert.SerializeObject(data);

            bool result = false;

            using (var client = new HttpClient())
            {
                HttpResponseMessage responseMessage = client.PostAsync(BaseUrl, 
                    new StringContent(JsonData, Encoding.UTF8, "application/json")).Result;
                    
                NeginSMS neginSMS = JsonConvert.DeserializeObject<NeginSMS>(responseMessage.Content.ReadAsStringAsync().Result);

                result = neginSMS.status == "-1";
            }

            return result;
		
        }
        public bool SendVerifySms(string Number , string userName , string code , string pattern)
        {
            if(string.IsNullOrEmpty(pattern))
                return false;
                
            SimpleSend simple = new SimpleSend();
            simple.mobile = Number;
            simple.message = string.Format(pattern , userName , code);
        
            return SendData(simple);    
        }

        public bool SendSchoolData(string Number , string schoolName , string userName , string password  , string pattern)
        {
            if(string.IsNullOrEmpty(pattern))
                return false;

            SimpleSend simple = new SimpleSend();
            simple.mobile = Number;
            simple.message = string.Format(pattern , schoolName , userName , password);
        
            return SendData(simple);

        }

        public bool SendScheduleNotify(string Number , string userName , string className , string dateTime  , string pattern)
        {
            if(string.IsNullOrEmpty(pattern))
                return false;

            SimpleSend simple = new SimpleSend();
            simple.mobile = Number;
            simple.message = string.Format(pattern , userName , className , dateTime);
        
            return SendData(simple);
        }

        public bool SendErrorCollecotr(string Numbers , string serviceError , string singularPlural)
        {
            // ErrorCollectorModel errorCollector = new ErrorCollectorModel();
            // errorCollector.serviceName = serviceError;
            // errorCollector.singularPlural = singularPlural;

            // SendPatternModel<ErrorCollectorModel> patternModel = new SendPatternModel<ErrorCollectorModel>();

            // patternModel.pattern_code = "8sa6tt73ni";
            // patternModel.originator = FromNumber;
            // patternModel.recipient = Numbers;
            // patternModel.values = errorCollector;

            // string json = JsonConvert.SerializeObject(patternModel);

            // // string postData = "op=send&uname=" + Username + "&pass=" + Password + "&message=" + Message +"&to="+json+"&from=+98" + FromNumber;

            // return SendData(json , "/v1/messages/patterns/send");

            return true;
        }

        public bool SendSms(string[] Numbers , string Message)
        {
            foreach(var number in Numbers)
            {
                SimpleSend simple = new SimpleSend();
                simple.mobile = number;
                simple.message = Message;
                SendData(simple);
            }
            return true;
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
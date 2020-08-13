using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Xml;
using Newtonsoft.Json;

namespace lms_with_moodle.Helper
{
    public class BBBApi {
        private readonly AppSettings appSettings;
        static HttpClient client;
        string BaseUrl;
        string token;
        public BBBApi(AppSettings _appsetting)
        {
            appSettings = _appsetting;
            client = new HttpClient();   

            BaseUrl = _appsetting.BBBBaseUrl;
            token = _appsetting.Token_moodle;
        }       

        async Task<string> sendData (string data)
        {
            //data should like this
            //getMeetings
            //Or
            //getMeetingInfo?meetingID=123
            //then add checksum=???? to the end
            string modifiedData = "";
            if(data.IndexOf("?") != -1) // if has any query in data
            {
                modifiedData = data + "&";
            }
            else
            {
                modifiedData = data + "?";
            }

            string checkSum = "";
            checkSum = SHA1Creator.sha1Creator(data + appSettings.BBBSecret);

            Uri uri = new Uri (BaseUrl + modifiedData + "checksum=" + checkSum.ToLower() );
            HttpResponseMessage response = client.GetAsync(uri).Result;  // Send data then get response
            
            if (response.IsSuccessStatusCode)  
            {  
                XmlDocument xmlResponse = new XmlDocument();
                xmlResponse.Load(await response.Content.ReadAsStreamAsync());
                var jsonObj = JsonConvert.SerializeXmlNode(xmlResponse , Newtonsoft.Json.Formatting.None , true);

                return jsonObj;
            }  
            else  
            {  
                Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);  
                return "";
            }  
        }

#region ApiFunctions

        public async Task<MeetingsResponse> GetMeetings()
        {
            try
            {
                string FunctionName = "getMeetings";
                string data = FunctionName;

                string _response = await sendData(data);

                var meetingsInfo = JsonConvert.DeserializeObject<MeetingsResponse>(_response);

                return meetingsInfo;
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);

                return null;
            }

        }
        
        public async Task<MeetingsResponse> CreateRoom(string name , string meetingId)
        {
            try
            {
                string FunctionName = string.Format("create?name={0}&meetingID={1}&moderatorPW={2}&attendeePW={3}" , name , meetingId , "mp" , "ap");
                string data = FunctionName;

                string _response = await sendData(data);

                var meetingsInfo = JsonConvert.DeserializeObject<MeetingsResponse>(_response);

                return meetingsInfo;
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);

                return null;
            }

        }
        
         public async Task<MeetingsResponse> JoinRoom(bool teacher , string meetingId , string fullname)
        {
            try
            {
                string password = (teacher ? "password=mp" : "password=ap");

                string FunctionName = string.Format("join?meetingID={0}&{1}&fullName={2}" , meetingId , password , fullname);
                string data = FunctionName;

                string _response = await sendData(data);

                var meetingsInfo = JsonConvert.DeserializeObject<MeetingsResponse>(_response);

                return meetingsInfo;
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);

                return null;
            }

        }
        
#endregion
    }
}
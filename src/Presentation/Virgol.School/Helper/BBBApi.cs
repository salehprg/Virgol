using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Xml;
using Newtonsoft.Json;
using System.Web;
using System.Net;

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

        async Task<string> sendData (string data , bool joinRoom = false)
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
            data = data.Replace("?" , "");
            
            checkSum = SHA1Creator.sha1Creator(data + appSettings.BBBSecret);

            Uri uri = new Uri (BaseUrl + modifiedData + "checksum=" + checkSum.ToLower() );
            if(joinRoom)
                return uri.AbsoluteUri;

            HttpResponseMessage response = client.GetAsync(uri).Result;  // Send data then get response
            

            try
            {
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
            catch (System.Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
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
        
        public async Task<RecordsResponse> GetMeetingRecords(string meetingID)
        {
            try
            {
                string FunctionName = string.Format("getRecordings?meetingID={0}" , meetingID);
                string data = FunctionName;

                string _response = await sendData(data);

                var recordings = JsonConvert.DeserializeObject<RecordsResponse>(_response);

                return recordings;
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);

                return null;
            }

        }
        
        public async Task<MeetingsResponse> CreateRoom(string name , string meetingId , int duration , string callbackUrl)
        {
            try
            {
                name = HttpUtility.UrlEncode(name).ToUpper();
                //https://myapp.example.com/callback?meetingID=test01
                
                string urlEncoded = WebUtility.UrlEncode(callbackUrl);

                string FunctionName = string.Format("create?attendeePW=ap&meetingID={1}&moderatorPW=mp&name={0}&duration={2}&logoutURL={3}" , name , meetingId , duration.ToString(), urlEncoded );
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

        public async Task<string> JoinRoom(bool teacher , string meetingId , string fullname ,string userId)
        {
            try
            {
                string password = (teacher ? "password=mp" : "password=ap");
                fullname = HttpUtility.UrlEncode(fullname).ToUpper();

                string FunctionName = string.Format("join?meetingID={0}&{1}&fullName={2}&redirect=true&userID={3}" , meetingId , password , fullname , userId);
                string data = FunctionName;

                string url = await sendData(data , true);

                return url;
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);

                return null;
            }

        }
        
        public async Task<bool> EndRoom(string meetingId)
        {
            try
            {
                string FunctionName = string.Format("end?meetingID={0}&password=mp" , meetingId);
                string data = FunctionName;

                string response = await sendData(data);

                MeetingsResponse meeting = JsonConvert.DeserializeObject<MeetingsResponse>(response);
                
                return (meeting.returncode != "FAILED");
            }
            catch(Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);

                return false;
            }

        }
        
#endregion
    }
}
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

            Uri uri = new Uri (BaseUrl + modifiedData + "checksum=" + checkSum );
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

        public async Task<Meetings> GetMeetings()
        {
            try
            {
                string FunctionName = "getMeetings";
                string data = FunctionName;

                string _response = await sendData(data);

                var meetingsInfo = JsonConvert.DeserializeObject<MeetingsResponse>(_response);

                return meetingsInfo.meetings;
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
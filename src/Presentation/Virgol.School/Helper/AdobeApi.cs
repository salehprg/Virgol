using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Xml;
using Newtonsoft.Json;
using System.Web;
using System.Net;
using Models;
using System.Linq;
using System.Xml.Serialization;

namespace Virgol.Helper
{
    public class AdobeApi {
        HttpClient client;

        string URL = "";
        string UserAdmin = "";
        string AdminPassword = "";
        public AdobeApi(string _url , string _UserAdmin , string _UserPassword)
        {
            client = new HttpClient();
            //client.Timeout = new TimeSpan(0 , 0 , 20);
            URL = _url;
            UserAdmin = _UserAdmin;
            AdminPassword = _UserPassword;

            Login(_UserAdmin , _UserPassword);
        }


        public bool CheckStatus()
        {
            if(Login(UserAdmin , AdminPassword))
            {
                return true;
            }

            return false;
        }
        
        public bool Login(string Username , string Password , HttpClient _client = null)
        {
            try
            {     
                HttpClient connection = null;

                if(_client == null)
                {
                    client = new HttpClient();
                    connection = client;
                }
                else
                {
                    connection = _client;
                }
                    
                //client.Timeout = new TimeSpan(0 , 0 , 20);
                
                Uri uriLogin = new Uri (string.Format(URL + "/api/xml?action=login&login={0}&password={1}" , Username , Password));
                HttpResponseMessage response = client.GetAsync(uriLogin).Result;
                XmlSerializer serializer = new XmlSerializer(typeof(LoginModel));
                LoginModel model = (LoginModel)serializer.Deserialize(response.Content.ReadAsStreamAsync().Result);

                return model.status.code == "ok";
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                return false;
            }
        }

        PrincipalList GetPrincipalList(string LoginFilter)
        {
            Uri uri = new Uri (URL + "/api/xml?action=principal-list&filter-Login=" + LoginFilter);
            HttpResponseMessage response = client.GetAsync(uri).Result;
                
            XmlSerializer serializer = new XmlSerializer(typeof(PrincipalList));
            PrincipalList principals = (PrincipalList)serializer.Deserialize(response.Content.ReadAsStreamAsync().Result);

            return principals;
        }

        MeetingInfoResponse CreateRoom(string roomName)
        {
            Uri uri = new Uri (string.Format(URL + "/api/xml?action=sco-update&type=meeting&name={0}&folder-id=11003", roomName));
            HttpResponseMessage response = client.GetAsync(uri).Result;

            XmlSerializer serializer = new XmlSerializer(typeof(MeetingInfoResponse));
            MeetingInfoResponse meeting = (MeetingInfoResponse)serializer.Deserialize(response.Content.ReadAsStreamAsync().Result);

            return meeting;
        }

        StatusResponse UpdatePermission(string scoId , bool isPrivate)
        {
            string permission = (isPrivate ? "remove" : "view-hidden");

            Uri uri = new Uri (string.Format(URL + "/api/xml?action=permissions-update&principal-id=public-access&permission-id={0}&acl-id={1}", permission , scoId));
            HttpResponseMessage response = client.GetAsync(uri).Result;

            XmlSerializer serializer = new XmlSerializer(typeof(StatusResponse));
            StatusResponse result = (StatusResponse)serializer.Deserialize(response.Content.ReadAsStreamAsync().Result);

            return result;
        }

        StatusResponse AddPrincipalToMeeting(string scoId , string hostUserId , bool IsHost)
        {
            Uri uri = new Uri (string.Format(URL + "/api/xml?action=permissions-update&principal-id={0}&acl-id={1}&permission-id={2}", hostUserId , scoId , (IsHost ? "host" : "view")));
            HttpResponseMessage response = client.GetAsync(uri).Result;

            XmlSerializer serializer = new XmlSerializer(typeof(StatusResponse));
            StatusResponse result = (StatusResponse)serializer.Deserialize(response.Content.ReadAsStreamAsync().Result);

            return result;
        }

        CommonInfo GetCommonInfo(HttpClient _client)
        {
            Uri uri = new Uri (URL + "/api/xml?action=common-info");
            HttpResponseMessage response = _client.GetAsync(uri).Result;

            XmlSerializer serializer = new XmlSerializer(typeof(CommonInfo));
            CommonInfo result = (CommonInfo)serializer.Deserialize(response.Content.ReadAsStreamAsync().Result);

            string responseStr = response.Content.ReadAsStringAsync().Result;

            return result;
        }

        public MeetingInfoResponse FindScoInfo(string scoId)
        {
            Uri uri = new Uri (URL + "/api/xml?action=sco-info&sco-id=" + scoId);
            HttpResponseMessage response = client.GetAsync(uri).Result;

            XmlSerializer serializer = new XmlSerializer(typeof(MeetingInfoResponse));
            MeetingInfoResponse result = (MeetingInfoResponse)serializer.Deserialize(response.Content.ReadAsStreamAsync().Result);

            return result;
        }
        
        public RecordList GetRecordings(string scoid)
        {
            try
            {
                MeetingInfoResponse meetingInfo = FindScoInfo(scoid);
                if(meetingInfo != null)
                {
                    Uri uri = new Uri (URL + "/api/xml?action=list-recordings&folder-id=" + meetingInfo.scoInfo.folderId);
                    HttpResponseMessage response = client.GetAsync(uri).Result;

                    XmlSerializer serializer = new XmlSerializer(typeof(RecordList));
                    RecordList result = (RecordList)serializer.Deserialize(response.Content.ReadAsStreamAsync().Result);

                    return result;
                }

                return null;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }
        public MeetingInfoResponse StartMeeting(string RoomName)
        {
            try
            {
                if(Login(UserAdmin , AdminPassword))
                {
                    MeetingInfoResponse meetingResponse = CreateRoom(RoomName);
                    if(meetingResponse.status.code == "ok")
                    {
                        StatusResponse status = UpdatePermission(meetingResponse.scoInfo.scoId , true);
                        if(status.status.code == "ok")
                        {
                            return meetingResponse;
                        }
                        Console.WriteLine(status.status.invalid);

                    }
                    Console.WriteLine(meetingResponse.status.invalid.subcode);
                }

                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);

                return null;
            }
        }

        public string JoinMeeting(string SCOId , string Username , string Password , bool Presenter)
        {
            try
            {
                Login(Username , Password);
                CommonInfo common = GetCommonInfo(client);

                if(Login(UserAdmin , AdminPassword))
                {
                    if(common.status.code == "ok")
                    {
                        StatusResponse statusViewer = AddPrincipalToMeeting(SCOId , common.common.user.userId , Presenter);
                        MeetingInfoResponse roomInfo = FindScoInfo(SCOId);

                        if(statusViewer.status.code == "ok")
                        {
                            return URL + roomInfo.scoInfo.urlPath + "?session=" + common.common.cookie;
                        }
                    }
                }

                return "";
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);

                return null;
            }
        }
    }
}
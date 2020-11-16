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

namespace lms_with_moodle.Helper
{
    public class AdobeApi {
        HttpClient client;

        string URL = "";
        public AdobeApi(string _url)
        {
            client = new HttpClient();
            URL = _url;
        }


        public bool CheckStatus()
        {
            if(Login("admin@legace.ir" , "Connectpass.24"))
            {
                return true;
            }

            return false;
        }
        
        public bool Login(string Username , string Password)
        {
            try
            {
                client = new HttpClient();
                Uri uriLogin = new Uri (string.Format(URL + "/api/xml?action=login&login={0}&password={1}" , Username , Password));
                HttpResponseMessage response = client.GetAsync(uriLogin).Result;
                XmlSerializer serializer = new XmlSerializer(typeof(LoginModel));
                LoginModel model = (LoginModel)serializer.Deserialize(response.Content.ReadAsStreamAsync().Result);

                return model.status.code == "ok";
            }
            catch
            {
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

        CommonInfo GetCommonInfo()
        {
            Uri uri = new Uri (URL + "/api/xml?action=common-info");
            HttpResponseMessage response = client.GetAsync(uri).Result;

            XmlSerializer serializer = new XmlSerializer(typeof(CommonInfo));
            CommonInfo result = (CommonInfo)serializer.Deserialize(response.Content.ReadAsStreamAsync().Result);

            return result;
        }

        MeetingInfoResponse FindScoInfo(string scoId)
        {
            Uri uri = new Uri (URL + "/api/xml?action=sco-info&sco-id=" + scoId);
            HttpResponseMessage response = client.GetAsync(uri).Result;

            XmlSerializer serializer = new XmlSerializer(typeof(MeetingInfoResponse));
            MeetingInfoResponse result = (MeetingInfoResponse)serializer.Deserialize(response.Content.ReadAsStreamAsync().Result);

            return result;
        }

        public MeetingInfoResponse StartMeeting(string RoomName)
        {
            try
            {
                if(Login("admin@legace.ir" , "Connectpass.24"))
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
                CommonInfo common = GetCommonInfo();

                if(Login("admin@legace.ir" , "Connectpass.24"))
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
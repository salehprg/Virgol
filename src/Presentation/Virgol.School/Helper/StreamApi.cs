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
using System.Net.Http.Headers;
using System.Text;
using Models.StreamApi;
using System.Collections.Generic;

namespace Virgol.Helper
{
    public class StreamApi 
    {
        HttpClient client;

        string URL = "";
        string token = "";
        public StreamApi(string _URL , string token)
        {
            client = new HttpClient();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer" , token);
            URL = _URL;
        }

        public async Task<HttpResponseModel> postData (object data , string requestURL)
        {
            try
            {
                string json =JsonConvert.SerializeObject(data);

                Uri uri = new Uri (URL + requestURL);

                HttpContent content = new StringContent(json, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(uri , content);  // Send data then get response

                HttpResponseModel model = new HttpResponseModel();

                string message = await response.Content.ReadAsStringAsync ();
                    
                model.Message = message;
                model.Code = response.StatusCode;

                return model; 
                
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);

                return null;
            }
        }

        public async Task<HttpResponseModel> getData (string requestURL)
        {
            try
            {
                Uri uri = new Uri (URL + requestURL);

                HttpResponseMessage response = await client.GetAsync(uri);  // Send data then get response

                HttpResponseModel model = new HttpResponseModel();

                string message = await response.Content.ReadAsStringAsync ();
                    
                model.Message = message;
                model.Code = response.StatusCode;

                return model; 
                
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.StackTrace);

                return null;
            }
        }


        public async Task<string> Login(string username , string password)
        {
            try
            {
                HttpResponseModel responseModel = await postData(null , "/User/Login?UserName="+username+"&Password="+password);

                Response response = JsonConvert.DeserializeObject<Response>(responseModel.Message);
                if(response.Status == Status.Success)
                {
                    string data = JsonConvert.SerializeObject(response.Data);
                    TokenModel token = JsonConvert.DeserializeObject<TokenModel>(data);

                    return token.userModel.Token;
                }

                return null;
            }
            catch (Exception ex)
            {
                return null;
                throw;
            }
        }

        #region Services
            public async Task<int> AddServiceInfo(StreamServicesModel servicesModel)
            {
                try
                {
                    HttpResponseModel responseModel = await postData(servicesModel, "/Service/AddServiceInfo");
                    
                    Response response = JsonConvert.DeserializeObject<Response>(responseModel.Message);

                    if(response.Status == Status.Success)
                    {
                        return int.Parse(response.Data.ToString());
                    }

                    return -1;
                }
                catch (Exception ex)
                {
                    return -1;
                    throw;
                }
            }

            public async Task<List<StreamServicesModel>> GetServicesList()
            {
                try
                {
                    HttpResponseModel responseModel = await getData("/Service/GetServicesList");
                    
                    Response response = JsonConvert.DeserializeObject<Response>(responseModel.Message);

                    if(response.Status == Status.Success)
                    {
                        string data = JsonConvert.SerializeObject(response.Data);
                        List<StreamServicesModel> services = JsonConvert.DeserializeObject<List<StreamServicesModel>>(data);

                        return services;
                    }

                    return null;
                }
                catch (Exception ex)
                {
                    return null;
                    throw;
                }
            }
    
        #endregion

        #region Stream Room
            public async Task<CreateResponse> CreateStreamRoom(CreateMeeting createRoom)
            {
                try
                {
                    HttpResponseModel responseModel = await postData(createRoom, "/Stream/CreateStreamRoom");
                    
                    Response response = JsonConvert.DeserializeObject<Response>(responseModel.Message);

                    if(response.Status == Status.Success)
                    {
                        string data = JsonConvert.SerializeObject(response.Data);
                        CreateResponse createResponse = JsonConvert.DeserializeObject<CreateResponse>(data);

                        return createResponse;
                    }

                    return null;
                }
                catch (Exception ex)
                {
                    return null;
                    throw;
                }
            }

            public async Task<bool> EndRoom(string roomId)
            {
                try
                {
                    HttpResponseModel responseModel = await postData(null, "/Stream/EndStream?roomId="+roomId);
                    
                    Response response = JsonConvert.DeserializeObject<Response>(responseModel.Message);

                    if(response.Status == Status.Success)
                    {
                        return true;
                    }

                    return false;
                }
                catch (Exception ex)
                {
                    return false;
                    throw;
                }
            }
    
        #endregion

    }   
}
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using lms_with_moodle.Helper;
using Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class PayPingAPI {
    static HttpClient client;
    string BaseUrl;
    string token;
    public PayPingAPI(AppDbContext appDbContext)
    {
        client = new HttpClient();   

        BaseUrl = AppSettings.GetValueFromDatabase(appDbContext , Settingkey.PayPingURL);
        token = AppSettings.GetValueFromDatabase(appDbContext , Settingkey.PayPingToken);

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer" , token);
    }
    
    public async Task<HttpResponseModel> postData (string data , string requestURL)
    {
        try
        {
            Uri uri = new Uri (BaseUrl + requestURL);

            HttpContent content = new StringContent(data, Encoding.UTF8, "application/json");
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

    public async Task<string> makePay (MakePayModel payModel)
    {
        try
        {
            string json = JsonConvert.SerializeObject(payModel);
            HttpResponseModel response = await postData(json , "/v2/pay");

            MakePayResponseModel responseModel = JsonConvert.DeserializeObject<MakePayResponseModel>(response.Message);
            return responseModel.code;
        }
        catch (System.Exception)
        {
            return null;
            throw;
        }
    }

    public async Task<VerifyPayResponseModel> verifyPay (VerifyPayModel payModel)
    {
        try
        {
            string json = JsonConvert.SerializeObject(payModel);
            HttpResponseModel response = await postData(json , "/v2/pay/verify");

            var errorMsg = JObject.Parse(response.Message);
            string error = "";
            string errorCode = "15";

            try { 
                error = errorMsg.GetValue(payModel.refId).ToString(); 
                errorCode = payModel.refId;
            } catch (Exception){}

            VerifyPayResponseModel responseModel = JsonConvert.DeserializeObject<VerifyPayResponseModel>(response.Message);
            
            responseModel.errorMessage = error;
            responseModel.errorCode = errorCode;
            return responseModel;
        }
        catch (System.Exception)
        {
            return null;
            throw;
        }
    }

    public string gotoIPG (string code)
    {
        try
        {
            return BaseUrl + "/v2/pay/gotoipg/" + code;
        }
        catch (System.Exception)
        {
            return null;
            throw;
        }
    }
}
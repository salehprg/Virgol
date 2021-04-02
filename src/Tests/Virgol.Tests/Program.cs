using System;
using System.Net.Http;
using System.Text;
using Models;
using Newtonsoft.Json;

namespace Virgol.Tests
{
    class Program
    {
        static string ModelToJSON(object model)
        {
            string json = JsonConvert.SerializeObject(model);
            return json;
        }

        static T JSONToModel<T>(string json)
        {
            T model = JsonConvert.DeserializeObject<T>(json);
            return model;
        }
        static void Main(string[] args)
        {
            string address = "http://localhost:5000/api/";

            HttpClient client = new HttpClient();

            Login login = new Login();
            string loginStr = ModelToJSON(login);

            HttpContent content = new StringContent(loginStr, Encoding.UTF8, "application/json");
            HttpResponseMessage response = client.PostAsync(address + "Users/LoginUser" , content).Result;
            
            Console.WriteLine("Login : " + response.Content.ReadAsStringAsync() != null);
            
        }
    }
}

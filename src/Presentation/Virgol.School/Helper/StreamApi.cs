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
    public class StreamApi {
        HttpClient client;

        string URL = "";
        public StreamApi(string _url)
        {
            client = new HttpClient();
            //client.Timeout = new TimeSpan(0 , 0 , 20);
            URL = _url;
        }

        public string Login(string username , string password)
        {
            string token = "";

            return token;
        }

        
   
    }
}
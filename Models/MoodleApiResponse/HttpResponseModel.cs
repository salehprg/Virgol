using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;


public class HttpResponseModel 
{
    public HttpStatusCode Code {get; set;}
    public string Message {get; set;}
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Models;

namespace Virgol.Helper
{
    public class AppSettings
    {
        //Moodle Configuration
        public static string moddleCourseUrl { get; set; }
        public static string BaseUrl_moodle { get; set; }

        //--------------------
        public static string JWTSecret { get; set; }

        //LDAP Configuration
        public static string LDAPServer { get; set; }
        public static int LDAPPort { get; set; }
        public static string LDAPUserAdmin { get; set; }
        public static string LDAPPassword { get; set; }

        //--------------------


        //SMS API (Faraz sms) Configuration
        public static string FarazAPI_Username { get; set; }
        public static string FarazAPI_URL { get; set; }
        public static string FarazAPI_SendNumber { get; set; }
        public static string FarazAPI_Password { get; set; }
        public static string FarazAPI_ApiKey { get; set; }

        //------------------------------
        //React Env Variables
        public static string REACT_APP_MOODLE_URL { get; set; }


        public static string ServerRootUrl { get; set; }
        public static string TimeZone { get; set; }

        public static string GetValueFromDatabase (AppDbContext appDbContext , string key)
        {
            try
            {
                SiteSettings settings = appDbContext.SiteSettings.Where(x => x.key == key).FirstOrDefault();
                if(settings != null)
                {
                    return settings.value;
                }

                throw new Exception("Key Not Found !");
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public override string ToString()
        {
            return string.Format("{0}\n{1}\n{2}\n{3}\n{4}\n{5}\n{6}\n{7}\n{8}\n{9}\n{10}\n{11}\n{12}" ,
                                    moddleCourseUrl , BaseUrl_moodle ,
                                    FarazAPI_URL , FarazAPI_SendNumber , FarazAPI_Username , FarazAPI_Password , FarazAPI_ApiKey
                                    , JWTSecret , LDAPServer , LDAPPort , LDAPUserAdmin , LDAPPassword , ServerRootUrl);
        }

    }
}

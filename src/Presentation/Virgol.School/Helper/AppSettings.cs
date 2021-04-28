using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Models;

namespace Virgol.Helper
{
    public class AppSettings
    {
        //EmailServer Configuration
        public static string smtpHost { get; set; }
        public static string smtpPort { get; set; }
        public static string smtpUsername { get; set; }
        public static string smtpPassword { get; set; }

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


        //SMS API Configuration
        public static string Default_SMSProvider { get; set; }

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
            return string.Format("{0}\n{1}\n{2}\n{3}\n{4}\n{5}\n{6}\n{7}\n{8}\n{9}" ,
                                    moddleCourseUrl , BaseUrl_moodle , JWTSecret , Default_SMSProvider ,
                                    LDAPServer , LDAPPort , LDAPUserAdmin , LDAPPassword , 
                                    ServerRootUrl , MyDateTime.Now());
        }

    }
}

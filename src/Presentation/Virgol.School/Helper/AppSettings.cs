using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace lms_with_moodle.Helper
{
    public class AppSettings
    {
        //Moodle Configuration
        public static string moddleCourseUrl { get; set; }
        public static string BaseUrl_moodle { get; set; }
        public static string Token_moodle { get; set; }

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

        //-----------------------


        //BBB Configuration Setting
        public static string BBBBaseUrl { get; set; }
        public static string BBBCallBackUrl { get; set; }
        public static string BBBSecret { get; set; }
        //------------------------


        public override string ToString()
        {
            return string.Format("{0}\n{1}\n{2}\n{3}\n{4}\n{5}\n{6}\n{7}\n{8}\n{9}\n{10}\n{11}\n{12}\n{13}\n{14}" ,
                                    moddleCourseUrl , BaseUrl_moodle , Token_moodle ,
                                    FarazAPI_URL , FarazAPI_SendNumber , FarazAPI_Username , FarazAPI_Password , FarazAPI_ApiKey ,
                                    BBBBaseUrl , BBBSecret , JWTSecret , LDAPServer , LDAPPort , LDAPUserAdmin , LDAPPassword);
        }

    }
}

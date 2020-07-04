using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace lms_with_moodle.Helper
{
    public class AppSettings
    {
        //Moodle Configuration
        public string moddleCourseUrl { get; set; }
        public string BaseUrl_moodle { get; set; }
        public string Token_moodle { get; set; }

        //--------------------
        public string JWTSecret { get; set; }

        //LDAP Configuration
        public string LDAPServer { get; set; }
        public int LDAPPort { get; set; }
        public string LDAPUserAdmin { get; set; }
        public string LDAPPassword { get; set; }

        //--------------------


        //SMS API (Faraz sms) Configuration
        public string FarazAPI_Username { get; set; }
        public string FarazAPI_URL { get; set; }
        public string FarazAPI_SendNumber { get; set; }
        public string FarazAPI_Password { get; set; }

        //-----------------------


        //BBB Configuration Setting
        public string BBBBaseUrl { get; set; }
        public string BBBSecret { get; set; }
        //------------------------

    }
}

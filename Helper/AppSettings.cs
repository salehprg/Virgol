using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace lms_with_moodle.Helper
{
    public class AppSettings
    {
        public string moddleCourseUrl { get; set; }
        public string JWTSecret { get; set; }
        public string LDAPServer { get; set; }
        public int LDAPPort { get; set; }
        public string LDAPUserAdmin { get; set; }
        public string LDAPPassword { get; set; }

    }
}

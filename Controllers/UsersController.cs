using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Novell.Directory.Ldap;

namespace lms_with_moodle.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {

        [HttpGet]
        public IActionResult Get()
        {
           LdapConnection connection = new LdapConnection();
           connection.Connect("localhost" , 10389);
           
           return Ok();
        }
    }
}

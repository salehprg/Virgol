using lms_with_moodle.Helper;
using Microsoft.Extensions.Options;
using Models.User;
using Novell.Directory.Ldap;

namespace lms_with_moodle.Helper
{
    public class LDAP_db {
        LdapConnection ldapConn;
        private readonly AppSettings appSettings;
        public LDAP_db (AppSettings _appsetting)
        {
            
            appSettings = _appsetting;

            // Creating an LdapConnection instance 
            ldapConn= new LdapConnection();

            
        }

        public bool AddUserToLDAP(UserModel user)
            {
                try
                {
                   ldapConn.Connect(appSettings.LDAPServer, appSettings.LDAPPort);
                    //Bind function will Bind the user object Credentials to the Server
                    ldapConn.Bind(appSettings.LDAPUserAdmin , appSettings.LDAPPassword);
                    
                    //Creates the List attributes of the entry and add them to attribute set 
                    LdapAttributeSet attributeSet = new LdapAttributeSet();
                    attributeSet.Add( new LdapAttribute("objectclass", "inetOrgPerson"));
                    attributeSet.Add( new LdapAttribute("cn", user.FirstName));
                    attributeSet.Add( new LdapAttribute("sn", user.LastName));
                    attributeSet.Add( new LdapAttribute("employeenumber", user.MelliCode));
                    attributeSet.Add( new LdapAttribute("mail", user.Email));
                    attributeSet.Add( new LdapAttribute("userPassword", user.MelliCode));

                    // DN of the entry to be added
                    string containerName = "ou=users,o=LMS";
                    string dn = "uid=" + user.MelliCode + "," + containerName;      
                    LdapEntry newEntry = new LdapEntry( dn, attributeSet );

                    //Add the entry to the directory
                    ldapConn.Add( newEntry );

                    ldapConn.Disconnect();
                    return true;
                }
                catch
                {
                    ldapConn.Disconnect();
                    return false;
                }
            }
    }
}